import { CornerTile, CubeMove, EdgeTile, XYZ } from "./dataTypes";
import { MoveDataType } from "./dataTypes";
import * as MoveNotation from "./cubeMoveData";

// create data type for move data, contains the tile movement data and the axis of rotation
export type MoveType = {move: MoveDataType, axis: XYZ};

// create constants for every type of move
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

// create constant for move that acts as a delay
const wait: MoveType = {move: MoveNotation.wait, axis: new XYZ(0, 0, 0)};


// create variables for some moves to shorten the code for the setup moves
let Lmove: CubeMove = {moveType: L, count: 1, prime: false, speed: 0.1};
let Dmove: CubeMove = {moveType: D, count: 1, prime: false, speed: 0.1};

let lmove: CubeMove = {moveType: l, count: 1, prime: false, speed: 0.1};
let dmove: CubeMove = {moveType: d, count: 1, prime: false, speed: 0.1};

let LPmove: CubeMove = {moveType: L, count: 1, prime: true, speed: 0.1};
let DPmove: CubeMove = {moveType: D, count: 1, prime: true, speed: 0.1};

let lPmove: CubeMove = {moveType: l, count: 1, prime: true, speed: 0.1};
let dPmove: CubeMove = {moveType: d, count: 1, prime: true, speed: 0.1};


let Fmove: CubeMove = {moveType: F, count: 1, prime: false, speed: 0.1};
let Rmove: CubeMove = {moveType: R, count: 1, prime: false, speed: 0.1};

let FPmove: CubeMove = {moveType: F, count: 1, prime: true, speed: 0.1};
let RPmove: CubeMove = {moveType: R, count: 1, prime: true, speed: 0.1};

const setupMoves: Record<EdgeTile | CornerTile, CubeMove[]> = {

    "A": [lmove, lmove, DPmove, LPmove, LPmove],
    "B": [], // any blanks like this are buffer pieces that don't have possible setup moves
    "C": [lmove, lmove, Dmove, LPmove, LPmove],
    "D": [], // this is the only piece that has no setup moves that isn't a buffer piece

    "E": [Lmove, dPmove, Lmove],
    "F": [dPmove, Lmove],
    "G": [LPmove, dPmove, Lmove],
    "H": [dmove, LPmove],

    "I": [lmove, DPmove, LPmove, LPmove],
    "J": [dPmove, dPmove, Lmove],
    "K": [lmove, Dmove, LPmove, LPmove],
    "L": [LPmove],

    "M": [],
    "N": [dmove, Lmove],
    "O": [DPmove, lmove, Dmove, LPmove, LPmove],
    "P": [dPmove, LPmove],

    "Q": [lPmove, Dmove, LPmove, LPmove],
    "R": [Lmove],
    "S": [lPmove, DPmove, LPmove, LPmove],
    "T": [dPmove, dPmove, LPmove],

    "U": [DPmove, LPmove, LPmove],
    "V": [DPmove, DPmove, LPmove, LPmove],
    "W": [Dmove, LPmove, LPmove],
    "SH": [LPmove, LPmove],


    "a": [],
    "b": [RPmove, RPmove],
    "c": [Fmove, Fmove, Dmove],
    "d": [Fmove, Fmove],

    "e": [],
    "f": [FPmove, Dmove],
    "g": [FPmove],
    "h": [DPmove, Rmove],

    "i": [Fmove, RPmove],
    "j": [RPmove],
    "k": [RPmove, DPmove],
    "l": [DPmove, DPmove, Rmove],

    "m": [Fmove],
    "n": [RPmove, Fmove],
    "o": [DPmove, DPmove, FPmove],
    "p": [Fmove, Dmove],

    "q": [Rmove, DPmove],
    "r": [],
    "s": [Dmove, FPmove],
    "t": [Rmove],
    
    "u": [Dmove],
    "v": [],
    "w": [DPmove],
    "sh": [DPmove, DPmove]
};

export { U, L, F, R, B, D, u, l, f, r, b, d, x, y, z, M, E, S, wait, setupMoves };