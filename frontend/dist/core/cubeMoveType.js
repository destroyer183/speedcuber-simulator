import { XYZ } from "./dataTypes";
import * as MoveNotation from "./cubeMoveData";
// create constants for every type of move
const U = { move: MoveNotation.U, axis: new XYZ(0, -Math.PI / 2, 0) };
const L = { move: MoveNotation.L, axis: new XYZ(Math.PI / 2, 0, 0) };
const F = { move: MoveNotation.F, axis: new XYZ(0, 0, -Math.PI / 2) };
const R = { move: MoveNotation.R, axis: new XYZ(-Math.PI / 2, 0, 0) };
const B = { move: MoveNotation.B, axis: new XYZ(0, 0, Math.PI / 2) };
const D = { move: MoveNotation.D, axis: new XYZ(0, Math.PI / 2, 0) };
const u = { move: MoveNotation.u, axis: new XYZ(0, -Math.PI / 2, 0) };
const l = { move: MoveNotation.l, axis: new XYZ(Math.PI / 2, 0, 0) };
const f = { move: MoveNotation.f, axis: new XYZ(0, 0, -Math.PI / 2) };
const r = { move: MoveNotation.r, axis: new XYZ(-Math.PI / 2, 0, 0) };
const b = { move: MoveNotation.b, axis: new XYZ(0, 0, Math.PI / 2) };
const d = { move: MoveNotation.d, axis: new XYZ(0, Math.PI / 2, 0) };
const x = { move: MoveNotation.x, axis: new XYZ(-Math.PI / 2, 0, 0) };
const y = { move: MoveNotation.y, axis: new XYZ(0, -Math.PI / 2, 0) };
const z = { move: MoveNotation.z, axis: new XYZ(0, 0, -Math.PI / 2) };
const M = { move: MoveNotation.M, axis: new XYZ(Math.PI / 2, 0, 0) };
const E = { move: MoveNotation.E, axis: new XYZ(0, Math.PI / 2, 0) };
const S = { move: MoveNotation.S, axis: new XYZ(0, 0, -Math.PI / 2) };
// create constant for move that acts as a delay
const wait = { move: MoveNotation.wait, axis: new XYZ(0, 0, 0) };
// create variables for some moves to shorten the code for the setup moves
let Lmove = { moveType: L, count: 1, prime: false, speed: 0.1 };
let Dmove = { moveType: D, count: 1, prime: false, speed: 0.1 };
let lmove = { moveType: l, count: 1, prime: false, speed: 0.1 };
let dmove = { moveType: d, count: 1, prime: false, speed: 0.1 };
let LPmove = { moveType: L, count: 1, prime: true, speed: 0.1 };
let DPmove = { moveType: D, count: 1, prime: true, speed: 0.1 };
let lPmove = { moveType: l, count: 1, prime: true, speed: 0.1 };
let dPmove = { moveType: d, count: 1, prime: true, speed: 0.1 };
let Fmove = { moveType: F, count: 1, prime: false, speed: 0.1 };
let Rmove = { moveType: R, count: 1, prime: false, speed: 0.1 };
let FPmove = { moveType: F, count: 1, prime: true, speed: 0.1 };
let RPmove = { moveType: R, count: 1, prime: true, speed: 0.1 };
const setupMoves = {
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
//# sourceMappingURL=cubeMoveType.js.map