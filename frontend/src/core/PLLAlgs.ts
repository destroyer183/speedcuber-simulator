import * as Move from "./cubeMoveType";
import { CubeMove } from "./dataTypes";

// create cube move arrays to condense different cubing algorithms that are needed for solving
const Ra: CubeMove[] = [

    {moveType: Move.R, count: 1, prime: false, speed: 0.2},
    {moveType: Move.U, count: 1, prime: true, speed: 0.2},
    {moveType: Move.R, count: 1, prime: true, speed: 0.2},
    {moveType: Move.U, count: 1, prime: true, speed: 0.2},

    {moveType: Move.R, count: 1, prime: false, speed: 0.2},
    {moveType: Move.U, count: 1, prime: false, speed: 0.2},
    {moveType: Move.R, count: 1, prime: false, speed: 0.2},
    {moveType: Move.D, count: 1, prime: false, speed: 0.2},

    {moveType: Move.R, count: 1, prime: true, speed: 0.2},
    {moveType: Move.U, count: 1, prime: true, speed: 0.2},
    {moveType: Move.R, count: 1, prime: false, speed: 0.2},
    {moveType: Move.D, count: 1, prime: true, speed: 0.2},

    {moveType: Move.R, count: 1, prime: true, speed: 0.2},
    {moveType: Move.U, count: 2, prime: false, speed: 0.2},
    {moveType: Move.R, count: 1, prime: true, speed: 0.2},
    {moveType: Move.U, count: 1, prime: true, speed: 0.2}
];

const T: CubeMove[] = [

    {moveType: Move.R, count: 1, prime: false, speed: 0.2},
    {moveType: Move.U, count: 1, prime: false, speed: 0.2},
    {moveType: Move.R, count: 1, prime: true, speed: 0.2},
    {moveType: Move.U, count: 1, prime: true, speed: 0.2},

    {moveType: Move.R, count: 1, prime: true, speed: 0.2},
    {moveType: Move.F, count: 1, prime: false, speed: 0.2},
    {moveType: Move.R, count: 2, prime: false, speed: 0.2},
    {moveType: Move.U, count: 1, prime: true, speed: 0.2},
    {moveType: Move.R, count: 1, prime: true, speed: 0.2},

    {moveType: Move.U, count: 1, prime: true, speed: 0.2},
    {moveType: Move.R, count: 1, prime: false, speed: 0.2},
    {moveType: Move.U, count: 1, prime: false, speed: 0.2},
    {moveType: Move.R, count: 1, prime: true, speed: 0.2},
    {moveType: Move.F, count: 1, prime: true, speed: 0.2}
];

const Y: CubeMove[] = [

    {moveType: Move.F, count: 1, prime: false, speed: 0.2},
    {moveType: Move.R, count: 1, prime: false, speed: 0.2},
    {moveType: Move.U, count: 1, prime: true, speed: 0.2},
    {moveType: Move.R, count: 1, prime: true, speed: 0.2},
    {moveType: Move.U, count: 1, prime: true, speed: 0.2},

    {moveType: Move.R, count: 1, prime: false, speed: 0.2},
    {moveType: Move.U, count: 1, prime: false, speed: 0.2},
    {moveType: Move.R, count: 1, prime: true, speed: 0.2},
    {moveType: Move.F, count: 1, prime: true, speed: 0.2},

    {moveType: Move.R, count: 1, prime: false, speed: 0.2},
    {moveType: Move.U, count: 1, prime: false, speed: 0.2},
    {moveType: Move.R, count: 1, prime: true, speed: 0.2},
    {moveType: Move.U, count: 1, prime: true, speed: 0.2},

    {moveType: Move.R, count: 1, prime: true, speed: 0.2},
    {moveType: Move.F, count: 1, prime: false, speed: 0.2},
    {moveType: Move.R, count: 1, prime: false, speed: 0.2},
    {moveType: Move.F, count: 1, prime: true, speed: 0.2}
];

const modifiedY: CubeMove[] = [

    {moveType: Move.R, count: 1, prime: false, speed: 0.2},
    {moveType: Move.U, count: 1, prime: true, speed: 0.2},
    {moveType: Move.R, count: 1, prime: true, speed: 0.2},
    {moveType: Move.U, count: 1, prime: true, speed: 0.2},

    {moveType: Move.R, count: 1, prime: false, speed: 0.2},
    {moveType: Move.U, count: 1, prime: false, speed: 0.2},
    {moveType: Move.R, count: 1, prime: true, speed: 0.2},
    {moveType: Move.F, count: 1, prime: true, speed: 0.2},

    {moveType: Move.R, count: 1, prime: false, speed: 0.2},
    {moveType: Move.U, count: 1, prime: false, speed: 0.2},
    {moveType: Move.R, count: 1, prime: true, speed: 0.2},
    {moveType: Move.U, count: 1, prime: true, speed: 0.2},

    {moveType: Move.R, count: 1, prime: true, speed: 0.2},
    {moveType: Move.F, count: 1, prime: false, speed: 0.2},
    {moveType: Move.R, count: 1, prime: false, speed: 0.2},
];

// export algorithms
export { T, Y, modifiedY, Ra };