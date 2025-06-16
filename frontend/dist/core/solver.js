import { PieceType } from "./dataTypes";
export class Solver {
    constructor(cube) {
        this._setupMoves = [];
        if (Solver.instance !== undefined)
            throw new Error("Error! can't create more than one instance of a singleton class!");
        this.cube = cube;
    }
    static get instance() {
        return Solver._instance;
    }
    get cube() {
        return this._cube;
    }
    get setupMoves() {
        return this._setupMoves;
    }
    static set instance(val) {
        Solver._instance = val;
    }
    set cube(val) {
        this._cube = val;
    }
    set setupMoves(val) {
        this._setupMoves = val;
    }
    solveBeginner() {
        while (!this.edgesSolved()) {
            this.setupEdge();
            // wait
            // apply alg
            // wait
            this.undoSetup();
        }
        while (!this.cornersSolved()) {
            this.setupCorner();
            // wait
            // apply alg
            // wait
            this.undoSetup();
        }
    }
    /**
     * function to check if all the edges on the cube are solved
     * @returns boolean value to show if the edges are solved or not
     */
    edgesSolved() {
        // get the keys and values in the cube position record and store them in variables
        let keys = [...Object.keys(this.cube.position)];
        let values = [...Object.values(this.cube.position)];
        // loop over the keys and values by index
        for (let i = 0; i < values.length; i++) {
            // check if the current key does not match the current value's origin, and if the current value is an edge
            if (keys[i] !== values[i].origin && values[i].pieceType === PieceType.Edge) {
                // return false to show that the edges are not solved
                return false;
            }
        }
        // return true to show that the edges are solved
        return true;
    }
    /**
     * function to check if all the corners on the cube are solved
     * @returns boolean value to show if the corners are solved or not
     */
    cornersSolved() {
        // get the keys and values in the cube position record and store them in variables
        let keys = [...Object.keys(this.cube.position)];
        let values = [...Object.values(this.cube.position)];
        // loop over the keys and values by index
        for (let i = 0; i < values.length; i++) {
            // check if the current key does not match the current value's origin, and if the current value is a corner
            if (keys[i] !== values[i].origin && values[i].pieceType === PieceType.Edge) {
                // return false to show that the corners are not solved
                return false;
            }
        }
        // return true to show that the corners are solved
        return true;
    }
    setupEdge() { }
    setupCorner() { }
    undoSetup() { }
}
//# sourceMappingURL=solver.js.map