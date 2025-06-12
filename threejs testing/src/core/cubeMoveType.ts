import { XYZ } from "./dataTypes";


export type MoveType = {move: MoveNotation, axis: XYZ};

export enum MoveNotation {
    U = "UMove",
    L = "LMove",
    F = "FMove",
    R = "RMove",
    B = "BMove",
    D = "DMove",

    u = "uMove",
    l = "lMove",
    f = "fMove",
    r = "rMove",
    b = "bMove",
    d = "dMove",

    x = "xMove",
    y = "yMove",
    z = "zMove",

    M = "MMove",
    E = "EMove",
    S = "SMove"
};

const U: MoveType = {move: MoveNotation.U, axis: new XYZ(0, -Math.PI/2, 0)};
const L: MoveType = {move: MoveNotation.L, axis: new XYZ(Math.PI/2, 0,  0)};
const F: MoveType = {move: MoveNotation.F, axis: new XYZ(0, 0, -Math.PI/2)};
const R: MoveType = {move: MoveNotation.R, axis: new XYZ(-Math.PI/2, 0, 0)};
const B: MoveType = {move: MoveNotation.B, axis: new XYZ(0, 0,  Math.PI/2)};
const D: MoveType = {move: MoveNotation.D, axis: new XYZ(0, Math.PI/2,  0)};

const u: MoveType = {move: MoveNotation.u, axis: new XYZ(0, -Math.PI/2, 0)};
const l: MoveType = {move: MoveNotation.l, axis: new XYZ(Math.PI/2, 0,  0)};
const f: MoveType = {move: MoveNotation.f, axis: new XYZ(0, 0, -Math.PI/2)};
const r: MoveType = {move: MoveNotation.r, axis: new XYZ(-Math.PI/2, 0, 0)};
const b: MoveType = {move: MoveNotation.b, axis: new XYZ(0, 0,  Math.PI/2)};
const d: MoveType = {move: MoveNotation.d, axis: new XYZ(0, Math.PI/2,  0)};

const x: MoveType = {move: MoveNotation.x, axis: new XYZ(-Math.PI/2, 0, 0)};
const y: MoveType = {move: MoveNotation.y, axis: new XYZ(0, -Math.PI/2, 0)};
const z: MoveType = {move: MoveNotation.z, axis: new XYZ(0, 0, -Math.PI/2)};

const M: MoveType = {move: MoveNotation.M, axis: new XYZ(Math.PI/2, 0,  0)};
const E: MoveType = {move: MoveNotation.E, axis: new XYZ(0, Math.PI/2,  0)};
const S: MoveType = {move: MoveNotation.S, axis: new XYZ(0, 0, -Math.PI/2)};

export { U, L, F, R, B, D, u, l, f, r, b, d, x, y, z, M, E, S };