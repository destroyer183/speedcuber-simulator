import * as Move from "./cubeMoveType";
const Ra = [
    { moveType: Move.R, count: 1, prime: false, speed: 0.2 },
    { moveType: Move.U, count: 1, prime: true, speed: 0.2 },
    { moveType: Move.R, count: 1, prime: true, speed: 0.2 },
    { moveType: Move.U, count: 1, prime: true, speed: 0.2 },
    { moveType: Move.R, count: 1, prime: false, speed: 0.2 },
    { moveType: Move.U, count: 1, prime: false, speed: 0.2 },
    { moveType: Move.R, count: 1, prime: false, speed: 0.2 },
    { moveType: Move.D, count: 1, prime: false, speed: 0.2 },
    { moveType: Move.R, count: 1, prime: true, speed: 0.2 },
    { moveType: Move.U, count: 1, prime: true, speed: 0.2 },
    { moveType: Move.R, count: 1, prime: false, speed: 0.2 },
    { moveType: Move.D, count: 1, prime: true, speed: 0.2 },
    { moveType: Move.R, count: 1, prime: true, speed: 0.2 },
    { moveType: Move.U, count: 2, prime: false, speed: 0.2 },
    { moveType: Move.R, count: 1, prime: true, speed: 0.2 },
    { moveType: Move.U, count: 1, prime: true, speed: 0.2 }
];
const T = [
    { moveType: Move.R, count: 1, prime: false, speed: 0.2 },
    { moveType: Move.U, count: 1, prime: false, speed: 0.2 },
    { moveType: Move.R, count: 1, prime: true, speed: 0.2 },
    { moveType: Move.U, count: 1, prime: true, speed: 0.2 },
    { moveType: Move.R, count: 1, prime: true, speed: 0.2 },
    { moveType: Move.F, count: 1, prime: false, speed: 0.2 },
    { moveType: Move.R, count: 2, prime: false, speed: 0.2 },
    { moveType: Move.U, count: 1, prime: true, speed: 0.2 },
    { moveType: Move.R, count: 1, prime: true, speed: 0.2 },
    { moveType: Move.U, count: 1, prime: true, speed: 0.2 },
    { moveType: Move.R, count: 1, prime: false, speed: 0.2 },
    { moveType: Move.U, count: 1, prime: false, speed: 0.2 },
    { moveType: Move.R, count: 1, prime: true, speed: 0.2 },
    { moveType: Move.F, count: 1, prime: true, speed: 0.2 }
];
const Y = [
    { moveType: Move.F, count: 1, prime: false, speed: 0.2 },
    { moveType: Move.R, count: 1, prime: false, speed: 0.2 },
    { moveType: Move.U, count: 1, prime: true, speed: 0.2 },
    { moveType: Move.R, count: 1, prime: true, speed: 0.2 },
    { moveType: Move.U, count: 1, prime: true, speed: 0.2 },
    { moveType: Move.R, count: 1, prime: false, speed: 0.2 },
    { moveType: Move.U, count: 1, prime: false, speed: 0.2 },
    { moveType: Move.R, count: 1, prime: true, speed: 0.2 },
    { moveType: Move.F, count: 1, prime: true, speed: 0.2 },
    { moveType: Move.R, count: 1, prime: false, speed: 0.2 },
    { moveType: Move.U, count: 1, prime: false, speed: 0.2 },
    { moveType: Move.R, count: 1, prime: true, speed: 0.2 },
    { moveType: Move.U, count: 1, prime: true, speed: 0.2 },
    { moveType: Move.R, count: 1, prime: true, speed: 0.2 },
    { moveType: Move.F, count: 1, prime: false, speed: 0.2 },
    { moveType: Move.R, count: 1, prime: false, speed: 0.2 },
    { moveType: Move.F, count: 1, prime: true, speed: 0.2 }
];
const modifiedY = [
    ...(Y.slice(1, Y.length - 1))
];
export { T, Y, modifiedY, Ra };
//# sourceMappingURL=PLLAlgs.js.map