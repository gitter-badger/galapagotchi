/*
 * Copyright (c) 2019. Beautiful Code BV, Rotterdam, Netherlands
 * Licensed under GNU GENERAL PUBLIC LICENSE Version 3.
 */

import { BehaviorSubject } from "rxjs/BehaviorSubject"
import { Vector3 } from "three"

import { NORMAL_TICKS } from "../body/fabric"
import { fromGenomeData, Genome, IGenomeData } from "../genetics/genome"
import { Hexalot } from "../island/hexalot"
import { Leg } from "../island/journey"

import { Evolver, IEvolver } from "./evolver"

export const INITIAL_JOINT_COUNT = 47
export const MAX_POPULATION = 24
const MUTATION_COUNT = 5
const SURVIVAL_RATE = 0.66
const MIN_LIFESPAN = 15000
const LIFESPAN_INCREASE = 1000
const MAX_LIFESPAN_INCREASE = 10 * LIFESPAN_INCREASE

export class Evolution {
    public evolversNow: BehaviorSubject<Evolver[]> = new BehaviorSubject<Evolver[]>([])
    private midpointVector = new Vector3()
    private rebooting = false
    private frozenHero?: Evolver
    private leg: Leg
    private direction: number
    private minAge = 0
    private maxAge = MIN_LIFESPAN

    constructor(readonly home: Hexalot, firstLeg: Leg, private saveGenome: (genome: IGenomeData) => void) {
        this.leg = firstLeg
        home.centerSpot.adjacentSpots.forEach((spot, index) => {
            const hexalot = spot.centerOfHexalot
            if (hexalot && firstLeg.goTo.id === hexalot.id) {
                this.direction = index
            }
        })
        this.evolversNow.next(this.createPopulation())
    }

    public get midpoint(): Vector3 {
        const evolvers = this.evolversNow.getValue()
        if (evolvers.length === 0) {
            return this.midpointVector
        }
        const vectors = evolvers.map(evolver => evolver.vectors)
        const sumFromArray = (prev: Vector3, [x, y, z]: Float32Array) => {
            prev.x += x
            prev.y += y
            prev.z += z
            return prev
        }
        this.midpointVector.set(0, 0, 0)
        return vectors.reduce(sumFromArray, this.midpointVector).multiplyScalar(1 / evolvers.length)
    }

    public iterate(): void {
        const evolvers = this.evolversNow.getValue()
        if (evolvers.length === 0 || this.rebooting) {
            return
        }
        const heroEvolver = evolvers.find(e => e.touchedDestination)
        if (heroEvolver) {
            console.log("next generation from hero", heroEvolver)
            this.nextGenerationFromHero(heroEvolver)
            return
        }
        const moving = evolvers.filter(evolver => evolver.age < this.maxAge)
        if (moving.length === 0) {
            this.saveStrongest()
            this.adjustAgeLimit()
            this.nextGenerationFromSurvival()
            return
        }
        moving.forEach(evolver => {
            const behind = this.maxAge - evolver.age
            const timeSweepTick = evolver.iterate(behind > NORMAL_TICKS ? NORMAL_TICKS : behind)
            if (timeSweepTick && !evolver.gestating) {
                evolver.mutateGenome(1)
                evolver.adjustDirection()
            }
        })
    }

    public recycle(): void {
        this.evolversNow.getValue().forEach(evolver => evolver.recycle())
    }

    // Privates =============================================================

    private saveStrongest(): void {
        const toSave = this.strongest
        if (toSave) {
            console.log("saved genome")
            this.saveGenome(toSave.evolver.genomeData)
        } else {
            console.log("no strongest?")
        }
    }

    private adjustAgeLimit(): void {
        this.maxAge += LIFESPAN_INCREASE
        const lifespan = this.maxAge - this.minAge
        if (lifespan > MIN_LIFESPAN + MAX_LIFESPAN_INCREASE) {
            this.maxAge = this.minAge + MIN_LIFESPAN
        }
        console.log(`MaxAge=${this.maxAge}`)
    }

    private get rankedEvolvers(): IEvolver[] {
        let evolvers = this.evolversNow.getValue()
        const frozenHero = this.frozenHero
        if (frozenHero) {
            evolvers = evolvers.filter(e => e.index !== frozenHero.index)
        }
        const evaluated = evolvers.map(evolver => evolver.evaluated)
        return evaluated.sort((a: IEvolver, b: IEvolver) => a.distanceFromTarget - b.distanceFromTarget)
    }

    private get strongest(): IEvolver | undefined {
        return this.rankedEvolvers[0]
    }

    private nextGenerationFromHero(heroEvolver: Evolver): void {
        this.rebooting = true
        this.frozenHero = heroEvolver
        const nextLeg = this.leg.nextLeg
        if (!nextLeg) {
            console.warn("Evolution is over")
            return // todo: evolution is over
        }
        this.leg = heroEvolver.leg = nextLeg
        this.minAge = heroEvolver.age
        this.maxAge = this.minAge + MIN_LIFESPAN
        const evolvers = this.evolversNow.getValue()
        this.evolversNow.next([heroEvolver])
        setTimeout(() => {
            const otherEvolvers = evolvers.filter(evolver => evolver.index !== heroEvolver.index)
            otherEvolvers.forEach(evolver => evolver.recycle())
            this.evolversNow.next(this.createPopulation())
            this.rebooting = false
        }, 500)
    }

    private nextGenerationFromSurvival(): void {
        this.rebooting = true
        const ranked: IEvolver[] = this.rankedEvolvers
        const dead = ranked.splice(Math.ceil(ranked.length * SURVIVAL_RATE))
        dead.forEach(e => console.log(`Dead ${e.evolver.index}:  ${e.distanceFromTarget}`))
        ranked.forEach(e => console.log(`Ranked ${e.evolver.index}:  ${e.distanceFromTarget}`))
        this.evolversNow.next(ranked.map(e => e.evolver))
        dead.forEach(e => e.evolver.recycle())
        setTimeout(() => {
            const nextGeneration: Evolver[] = []
            dead.map(e => e.evolver).forEach(() => {
                const luckyParent = ranked[Math.floor(ranked.length * Math.random())].evolver
                const offspring = this.createOffspring(luckyParent)
                if (offspring) {
                    nextGeneration.push(offspring)
                }
            })
            this.evolversNow.next([])
            setTimeout(() => {
                ranked.forEach(e => e.evolver.recycle())
                ranked.map(e => e.evolver).forEach(evolver => {
                    const reborn = this.createEvolver(fromGenomeData(evolver.genomeData))
                    if (reborn) {
                        nextGeneration.push(reborn)
                    }
                })
                this.evolversNow.next(nextGeneration)
                this.rebooting = false
            }, 500)
        }, 500)
    }

    private createPopulation(): Evolver[] {
        const genome = this.home.genome
        if (!genome) {
            throw new Error("No genome!")
        }
        let mutatingGenome: Genome | undefined = fromGenomeData(genome.genomeData)
        const evolvers: Evolver[] = []
        while (true) {
            const evolver = this.createEvolver(mutatingGenome)
            if (!evolver) {
                break
            }
            evolvers.push(evolver)
            mutatingGenome = mutatingGenome.withMutatedBehavior(evolver.direction, MUTATION_COUNT)
        }
        return evolvers
    }

    private createOffspring(parent: Evolver): Evolver | undefined {
        const offspringGenome = fromGenomeData(parent.offspringGenome)
        return this.createEvolver(offspringGenome)
    }

    private createEvolver(genome: Genome): Evolver | undefined {
        const frozenHero = this.frozenHero
        const gotchi = frozenHero ? frozenHero.gotchiWithGenome(genome) : this.home.createGotchiWithGenome(genome, this.direction)
        if (!gotchi) {
            return undefined
        }
        return new Evolver(gotchi, this.leg)
    }
}
