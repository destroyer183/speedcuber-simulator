import { CornerTile, EdgeTile, CenterTile, MoveDataType } from "./dataTypes";

/**
 * function to convert clockwise cuve turn data to counter-clockwise cube turn data
 * @param move the tile move data to be reversed
 * @returns the reversed tile move data
 */
export function prime(move: MoveDataType): MoveDataType {

    // create temporary array to store the reversed data
    let temp: MoveDataType = []

    // create a deep copy of the inputted data to avoid changing constants
    let moveData: MoveDataType = structuredClone(move);

    // loop over the inputted data and reverse each subarray
    for (let group of [...moveData]) temp.push(group.reverse());

    // return the reversed data
    return temp;
}

// create constants that represent how all of the tiles on the cube move around when a given turn is performed
const U: MoveDataType = [
    [
        [CornerTile.D, CornerTile.F, CornerTile.I],
        [CornerTile.C, CornerTile.J, CornerTile.M],
        [CornerTile.B, CornerTile.N, CornerTile.Q],
        [CornerTile.A, CornerTile.R, CornerTile.E]
    ],
    [
        [EdgeTile.D, EdgeTile.E],
        [EdgeTile.C, EdgeTile.I],
        [EdgeTile.B, EdgeTile.M],
        [EdgeTile.A, EdgeTile.Q]
    ],
    [[CenterTile.U]]
];

const L: MoveDataType = [
    [
        [CornerTile.H, CornerTile.S, CornerTile.Sh],
        [CornerTile.G, CornerTile.U, CornerTile.L],
        [CornerTile.F, CornerTile.I, CornerTile.D],
        [CornerTile.E, CornerTile.A, CornerTile.R]
    ],
    [
        [EdgeTile.H, EdgeTile.R],
        [EdgeTile.G, EdgeTile.Sh],
        [EdgeTile.F, EdgeTile.L],
        [EdgeTile.E, EdgeTile.D]
    ],
    [[CenterTile.L]]
];

const F: MoveDataType = [
    [
        [CornerTile.L, CornerTile.G, CornerTile.U],
        [CornerTile.K, CornerTile.V, CornerTile.P],
        [CornerTile.J, CornerTile.M, CornerTile.C],
        [CornerTile.I, CornerTile.D, CornerTile.F]
    ],
    [
        [EdgeTile.L, EdgeTile.F],
        [EdgeTile.K, EdgeTile.U],
        [EdgeTile.J, EdgeTile.P],
        [EdgeTile.I, EdgeTile.C]
    ],
    [[CenterTile.F]]
];

const R: MoveDataType = [
    [
        [CornerTile.P, CornerTile.K, CornerTile.V],
        [CornerTile.O, CornerTile.W, CornerTile.T],
        [CornerTile.N, CornerTile.Q, CornerTile.B],
        [CornerTile.M, CornerTile.C, CornerTile.J]
    ],
    [
        [EdgeTile.P, EdgeTile.J],
        [EdgeTile.O, EdgeTile.V],
        [EdgeTile.N, EdgeTile.T],
        [EdgeTile.M, EdgeTile.B]
    ],
    [[CenterTile.R]]
];

const B: MoveDataType = [
    [
        [CornerTile.T, CornerTile.O,  CornerTile.W],
        [CornerTile.S, CornerTile.Sh, CornerTile.H],
        [CornerTile.R, CornerTile.E,  CornerTile.A],
        [CornerTile.Q, CornerTile.B,  CornerTile.N]
    ],
    [
        [EdgeTile.T, EdgeTile.N],
        [EdgeTile.S, EdgeTile.W],
        [EdgeTile.R, EdgeTile.H],
        [EdgeTile.Q, EdgeTile.A]
    ],
    [[CenterTile.B]]
];

const D: MoveDataType = [
    [
        [CornerTile.Sh, CornerTile.H, CornerTile.S],
        [CornerTile.W,  CornerTile.T, CornerTile.O],
        [CornerTile.V,  CornerTile.P, CornerTile.K],
        [CornerTile.U,  CornerTile.L, CornerTile.G]
    ],
    [
        [EdgeTile.Sh, EdgeTile.G],
        [EdgeTile.W,  EdgeTile.S],
        [EdgeTile.V,  EdgeTile.O],
        [EdgeTile.U,  EdgeTile.K]
    ],
    [[CenterTile.D]]
];

const M: MoveDataType = [
    [
        [EdgeTile.A, EdgeTile.Q],
        [EdgeTile.S, EdgeTile.W],
        [EdgeTile.U, EdgeTile.K],
        [EdgeTile.I, EdgeTile.C],
    ],
    [
        [CenterTile.U],
        [CenterTile.B],
        [CenterTile.D],
        [CenterTile.F]
    ],
];

const E: MoveDataType = [
    [
        [EdgeTile.R, EdgeTile.H],
        [EdgeTile.N, EdgeTile.T],
        [EdgeTile.J, EdgeTile.P],
        [EdgeTile.F, EdgeTile.L]
    ],
    [
        [CenterTile.L],
        [CenterTile.B],
        [CenterTile.R],
        [CenterTile.F]
    ]
];

const S: MoveDataType = [
    [
        [EdgeTile.E,  EdgeTile.D],
        [EdgeTile.Sh, EdgeTile.G],
        [EdgeTile.O,  EdgeTile.V],
        [EdgeTile.B,  EdgeTile.M]
    ],
    [
        [CenterTile.U],
        [CenterTile.L],
        [CenterTile.D],
        [CenterTile.R]
    ]
];

const x: MoveDataType = [
    ...R,
    ...prime(M),
    ...prime(L)
];

const y: MoveDataType = [
    ...U,
    ...prime(E),
    ...prime(D)
];

const z: MoveDataType = [
    ...F,
    ...S,
    ...prime(B)
];

const u: MoveDataType = [
    ...U,
    ...prime(E)
];

const l: MoveDataType = [
    ...L,
    ...M
];

const f: MoveDataType = [
    ...F,
    ...S
];

const r: MoveDataType = [
    ...R,
    ...prime(M)
];

const b: MoveDataType = [
    ...B,
    ...prime(S)
];

const d: MoveDataType = [
    ...D,
    ...E
];

const wait: MoveDataType = [];

// export all of the constants
export { U, L, F, R, B, D, M, E, S, x, y, z, u, l, f, r, b, d, wait };