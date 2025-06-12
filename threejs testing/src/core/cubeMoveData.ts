import { CornerTile, EdgeTile, CenterTile, MoveDataType } from "./dataTypes";

export function prime(move: MoveDataType): MoveDataType {
    let temp: MoveDataType = [];
    for (let group of [...move]) temp.push(group.reverse());
    return temp;
}

const U: MoveDataType = [

    [CornerTile.D, CornerTile.C, CornerTile.B, CornerTile.A],
    [CornerTile.F, CornerTile.J, CornerTile.N, CornerTile.R],
    [CornerTile.I, CornerTile.M, CornerTile.Q, CornerTile.E],

    [EdgeTile.D, EdgeTile.C, EdgeTile.B, EdgeTile.A],
    [EdgeTile.E, EdgeTile.I, EdgeTile.M, EdgeTile.Q],

    [CenterTile.U, CenterTile.U]
];

const L: MoveDataType = [

    [CornerTile.H,  CornerTile.G, CornerTile.F, CornerTile.E],
    [CornerTile.S,  CornerTile.U, CornerTile.I, CornerTile.A],
    [CornerTile.Sh, CornerTile.L, CornerTile.D, CornerTile.R],

    [EdgeTile.H, EdgeTile.G,  EdgeTile.F, EdgeTile.E],
    [EdgeTile.R, EdgeTile.Sh, EdgeTile.L, EdgeTile.D],

    [CenterTile.L, CenterTile.L]
];

const F: MoveDataType = [

    [CornerTile.L, CornerTile.K, CornerTile.J, CornerTile.I],
    [CornerTile.G, CornerTile.V, CornerTile.M, CornerTile.D],
    [CornerTile.U, CornerTile.P, CornerTile.C, CornerTile.F],

    [EdgeTile.L, EdgeTile.K, EdgeTile.J, EdgeTile.I],
    [EdgeTile.F, EdgeTile.U, EdgeTile.P, EdgeTile.C],

    [CenterTile.F, CenterTile.F]
];

const R: MoveDataType = [

    [CornerTile.P, CornerTile.O, CornerTile.N, CornerTile.M],
    [CornerTile.K, CornerTile.W, CornerTile.Q, CornerTile.C],
    [CornerTile.V, CornerTile.T, CornerTile.B, CornerTile.J],

    [EdgeTile.P, EdgeTile.O, EdgeTile.N, EdgeTile.M],
    [EdgeTile.J, EdgeTile.V, EdgeTile.T, EdgeTile.B],

    [CenterTile.R, CenterTile.R]
];

const B: MoveDataType = [

    [CornerTile.T, CornerTile.S,  CornerTile.R, CornerTile.Q],
    [CornerTile.O, CornerTile.Sh, CornerTile.E, CornerTile.B],
    [CornerTile.W, CornerTile.H,  CornerTile.A, CornerTile.N],

    [EdgeTile.T, EdgeTile.S, EdgeTile.R, EdgeTile.Q],
    [EdgeTile.N, EdgeTile.W, EdgeTile.H, EdgeTile.A],

    [CenterTile.B, CenterTile.B]
];

const D: MoveDataType = [

    [CornerTile.Sh, CornerTile.W, CornerTile.V, CornerTile.U],
    [CornerTile.H,  CornerTile.T, CornerTile.P, CornerTile.L],
    [CornerTile.S,  CornerTile.O, CornerTile.K, CornerTile.G],

    [EdgeTile.Sh, EdgeTile.W, EdgeTile.V, EdgeTile.U],
    [EdgeTile.G,  EdgeTile.S, EdgeTile.O, EdgeTile.K],

    [CenterTile.D, CenterTile.D]
];

const M: MoveDataType = [

    [CenterTile.U, CenterTile.B, CenterTile.D, CenterTile.F],
    
    [EdgeTile.A, EdgeTile.S, EdgeTile.U, EdgeTile.I],
    [EdgeTile.Q, EdgeTile.W, EdgeTile.K, EdgeTile.C]
];

const E: MoveDataType = [

    [CenterTile.L, CenterTile.B, CenterTile.R, CenterTile.F],

    [EdgeTile.F, EdgeTile.J, EdgeTile.N, EdgeTile.R],
    [EdgeTile.L, EdgeTile.P, EdgeTile.T, EdgeTile.H]
];

const S: MoveDataType = [

    [CenterTile.U, CenterTile.L, CenterTile.D, CenterTile.R],

    [EdgeTile.B, EdgeTile.O, EdgeTile.Sh, EdgeTile.E],
    [EdgeTile.M, EdgeTile.V, EdgeTile.G,  EdgeTile.D]
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

export { U, L, F, R, B, D, M, E, S, x, y, z, u, l, f, r, b, d };