import * as Move from "./cubeMoveType";
import { CubeMove } from "./dataTypes";

// define array for all moves that can be performed to set up an edge piece
const allowedEdgeMoves: CubeMove[] = [
    {moveType: Move.L, count: 1, prime: false, speed: 0.1},
    {moveType: Move.D, count: 1, prime: false, speed: 0.1},

    {moveType: Move.l, count: 1, prime: false, speed: 0.1},
    {moveType: Move.d, count: 1, prime: false, speed: 0.1},

    {moveType: Move.L, count: 1, prime: true, speed: 0.1},
    {moveType: Move.D, count: 1, prime: true, speed: 0.1},

    {moveType: Move.l, count: 1, prime: true, speed: 0.1},
    {moveType: Move.d, count: 1, prime: true, speed: 0.1}
];

// define array for all moves that can be performed to set up a corner piece
const allowedCornerMoves: CubeMove[] = [
    {moveType: Move.F, count: 1, prime: false, speed: 0.1},
    {moveType: Move.R, count: 1, prime: false, speed: 0.1},
    {moveType: Move.D, count: 1, prime: false, speed: 0.1},

    {moveType: Move.F, count: 1, prime: true, speed: 0.1},
    {moveType: Move.R, count: 1, prime: true, speed: 0.1},
    {moveType: Move.D, count: 1, prime: true, speed: 0.1}
];

export { allowedEdgeMoves, allowedCornerMoves};