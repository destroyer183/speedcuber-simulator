import * as Move from "./cubeMoveType";
// define array for all moves that can be performed to set up an edge piece
const edge = [
    { moveType: Move.L, count: 1, prime: false, speed: 0.02 },
    { moveType: Move.D, count: 1, prime: false, speed: 0.02 },
    { moveType: Move.l, count: 1, prime: false, speed: 0.02 },
    { moveType: Move.d, count: 1, prime: false, speed: 0.02 },
    { moveType: Move.L, count: 1, prime: true, speed: 0.02 },
    { moveType: Move.D, count: 1, prime: true, speed: 0.02 },
    { moveType: Move.l, count: 1, prime: true, speed: 0.02 },
    { moveType: Move.d, count: 1, prime: true, speed: 0.02 }
];
// define array for all moves that can be performed to set up a corner piece
const corner = [
    { moveType: Move.F, count: 1, prime: false, speed: 0.02 },
    { moveType: Move.R, count: 1, prime: false, speed: 0.02 },
    { moveType: Move.D, count: 1, prime: false, speed: 0.02 },
    { moveType: Move.F, count: 1, prime: true, speed: 0.02 },
    { moveType: Move.R, count: 1, prime: true, speed: 0.02 },
    { moveType: Move.D, count: 1, prime: true, speed: 0.02 }
];
export { edge, corner };
//# sourceMappingURL=allowdSetupMoves.js.map