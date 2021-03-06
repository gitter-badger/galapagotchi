/*
 * Copyright (c) 2019. Beautiful Code BV, Rotterdam, Netherlands
 * Licensed under GNU GENERAL PUBLIC LICENSE Version 3.
 */

import { Vector3 } from "three"

export const STOP_STEP = 0
export const BRANCH_STEP = 7
export const ERROR_STEP = 8

const SURFACE_SCALE = 20
const KINDA = 0.866

export const HEXAGON_POINTS = [
    new Vector3(0, 0, -SURFACE_SCALE),
    new Vector3(-KINDA * SURFACE_SCALE, 0, -SURFACE_SCALE/2),
    new Vector3(-KINDA * SURFACE_SCALE, 0, SURFACE_SCALE/2),
    new Vector3(0, 0, SURFACE_SCALE),
    new Vector3(KINDA * SURFACE_SCALE, 0, SURFACE_SCALE/2),
    new Vector3(KINDA * SURFACE_SCALE, 0, -SURFACE_SCALE/2),
]

export const HEXALOT_OUTLINE_HEIGHT = 0.3
export const HEXAPOD_PROJECTION = 0.2
export const HEXAPOD_RADIUS = HEXAPOD_PROJECTION * SURFACE_SCALE
export const SCALE_X = SURFACE_SCALE * KINDA
export const SCALE_Y = SURFACE_SCALE * 1.5
export const INNER_HEXALOT_SPOTS = 91
export const OUTER_HEXALOT_SIDE = 6

export const HEXALOT_SHAPE = [
    // center
    {x: 0, y: 0},
    // layer 1
    {x: 2, y: 0}, // 1
    {x: 1, y: -1},
    {x: -1, y: -1},
    {x: -2, y: 0},
    {x: -1, y: 1},
    {x: 1, y: 1}, // 6
    // layer 2
    {x: 4, y: 0}, // 7
    {x: 3, y: -1},
    {x: 2, y: -2},
    {x: 0, y: -2},
    {x: -2, y: -2},
    {x: -3, y: -1},
    {x: -4, y: 0},
    {x: -3, y: 1},
    {x: -2, y: 2},
    {x: 0, y: 2},
    {x: 2, y: 2},
    {x: 3, y: 1}, // 18
    // layer 3
    {x: 6, y: 0}, // 19
    {x: 5, y: -1},
    {x: 4, y: -2},
    {x: 3, y: -3},
    {x: 1, y: -3},
    {x: -1, y: -3},
    {x: -3, y: -3},
    {x: -4, y: -2},
    {x: -5, y: -1},
    {x: -6, y: 0},
    {x: -5, y: 1},
    {x: -4, y: 2},
    {x: -3, y: 3},
    {x: -1, y: 3},
    {x: 1, y: 3},
    {x: 3, y: 3},
    {x: 4, y: 2},
    {x: 5, y: 1}, // 36
    // layer 4
    {x: 8, y: 0}, // 37
    {x: 7, y: -1},
    {x: 6, y: -2},
    {x: 5, y: -3},
    {x: 4, y: -4},
    {x: 2, y: -4},
    {x: 0, y: -4},
    {x: -2, y: -4},
    {x: -4, y: -4},
    {x: -5, y: -3},
    {x: -6, y: -2},
    {x: -7, y: -1},
    {x: -8, y: 0},
    {x: -7, y: 1},
    {x: -6, y: 2},
    {x: -5, y: 3},
    {x: -4, y: 4},
    {x: -2, y: 4},
    {x: -0, y: 4},
    {x: 2, y: 4},
    {x: 4, y: 4},
    {x: 5, y: 3},
    {x: 6, y: 2},
    {x: 7, y: 1}, // 60
    // layer 5
    {x: 10, y: 0}, // 61
    {x: 9, y: -1},
    {x: 8, y: -2},
    {x: 7, y: -3},
    {x: 6, y: -4},
    {x: 5, y: -5},
    {x: 3, y: -5},
    {x: 1, y: -5},
    {x: -1, y: -5},
    {x: -3, y: -5},
    {x: -5, y: -5},
    {x: -6, y: -4},
    {x: -7, y: -3},
    {x: -8, y: -2},
    {x: -9, y: -1},
    {x: -10, y: 0},
    {x: -9, y: 1},
    {x: -8, y: 2},
    {x: -7, y: 3},
    {x: -6, y: 4},
    {x: -5, y: 5},
    {x: -3, y: 5},
    {x: -1, y: 5},
    {x: 1, y: 5},
    {x: 3, y: 5},
    {x: 5, y: 5},
    {x: 6, y: 4},
    {x: 7, y: 3},
    {x: 8, y: 2},
    {x: 9, y: 1}, // 90
    // layer 6
    {x: 12, y: 0}, // 91
    {x: 11, y: -1},
    {x: 10, y: -2},
    {x: 9, y: -3},
    {x: 8, y: -4},
    {x: 7, y: -5},
    {x: 6, y: -6},
    {x: 4, y: -6},
    {x: 2, y: -6},
    {x: 0, y: -6},
    {x: -2, y: -6},
    {x: -4, y: -6},
    {x: -6, y: -6},
    {x: -7, y: -5},
    {x: -8, y: -4},
    {x: -9, y: -3},
    {x: -10, y: -2},
    {x: -11, y: -1},
    {x: -12, y: 0},
    {x: -11, y: 1},
    {x: -10, y: 2},
    {x: -9, y: 3},
    {x: -8, y: 4},
    {x: -7, y: 5},
    {x: -6, y: 6},
    {x: -4, y: 6},
    {x: -2, y: 6},
    {x: 0, y: 6},
    {x: 2, y: 6},
    {x: 4, y: 6},
    {x: 6, y: 6},
    {x: 7, y: 5},
    {x: 8, y: 4},
    {x: 9, y: 3},
    {x: 10, y: 2},
    {x: 11, y: 1}, // 126
]

export const ADJACENT = [
    {x: 2, y: 0}, // 1
    {x: 1, y: -1},
    {x: -1, y: -1},
    {x: -2, y: 0},
    {x: -1, y: 1},
    {x: 1, y: 1}, // 6
]

export const ROTATE = [
    0,
    2, 3, 4, 5, 6, 1,

    9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 7, 8,

    22, 23, 24, 25, 26, 27,
    28, 29, 30, 31, 32, 33,
    34, 35, 36, 19, 20, 21,

    41, 42, 43, 44, 45, 46,
    47, 48, 49, 50, 51, 52,
    53, 54, 55, 56, 57, 58,
    59, 60, 37, 38, 39, 40,

    66, 67, 68, 69, 70, 71,
    72, 73, 74, 75, 76, 77,
    78, 79, 80, 81, 82, 83,
    84, 85, 86, 87, 88, 89,
    90, 61, 62, 63, 64, 65,

    97, 98, 99, 100, 101, 102,
    103, 104, 105, 106, 107, 108,
    109, 110, 111, 112, 113, 114,
    115, 116, 117, 118, 119, 120,
    121, 122, 123, 124, 125, 126,
    91, 92, 93, 94, 95, 96,
]

export const ARROW_LENGTH = 9
export const ARROW_WIDTH = 0.6
export const ARROW_TIP_LENGTH_FACTOR = 1.3
export const ARROW_TIP_WIDTH_FACTOR = 1.5
