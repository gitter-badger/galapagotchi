import {IGenomeData} from "../genetics/genome"
import {Hexalot} from "../island/hexalot"
import {Island, IslandData} from "../island/island"
import {IJourneyData} from "../island/journey"

export interface IStorage {

    getIslandData(islandName: string): Promise<IslandData>

    claimHexalot(island: Island, hexalot: Hexalot, genomeData: IGenomeData): Promise<IslandData | undefined>

    getGenomeData(hexalot: Hexalot): Promise<IGenomeData | undefined>

    setGenomeData(hexalot: Hexalot, genomeData: IGenomeData): Promise<void>

    setJourneyData(hexalot: Hexalot, journey: IJourneyData): Promise<void>

    getJourneyData(hexalot: Hexalot): Promise<IJourneyData | undefined>

    setRotation(hexalot: Hexalot, rotation: number): Promise<void>

    getRotation(hexalot: Hexalot): Promise<number>

}
