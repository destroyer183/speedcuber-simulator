import { EdgeTile, CornerTile, PieceType, } from "./dataTypes";
import * as Move from "./cubeMoveType";
import { Cube } from "./cube";
import * as PLL from "./PLLAlgs";
/** singleton class to perform different types of cube solves */
export class Solver {
    /**
     * @constructor the main constructor for the 'Solver' class
     * @param cube a reference to the main cube
     */
    constructor(cube) {
        /** protected variable to store a reference to the dummy cube */
        this._dummyCube = new Cube();
        /** protected variable to store an array of the setup moves used for different piece swaps */
        this._setupMoves = [];
        // check if the singleton instance already exists, and if it does, throw an error since there is only supposed to be one instance of this class
        if (Solver.instance !== undefined)
            throw new Error("Error! can't create more than one instance of a singleton class!");
        // set singleton instance
        Solver._instance = this;
        // assign cube reference to the argument passed in
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
    get dummyCube() {
        return this._dummyCube;
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
    set dummyCube(val) {
        this._dummyCube = val;
    }
    /**
     * function to generate the necessary moves to simulate a beginner solve.
     * @param scramble an array of cube moves that generates the current scramble
     * */
    solveBeginner(scramble) {
        // create new dummy cube
        this.dummyCube = new Cube();
        this.dummyCube.generateCube();
        // apply scramble to dummy cube
        this.dummyCube.permuteTiles(false, ...scramble);
        // keep track of how many edge swaps are done so that parity can be fixed if necessary
        let edgeSwapCount = 0;
        // keep solving edges until all edges are solved
        while (!this.edgesSolved()) {
            // set up edge to be swapped with buffer piece
            this.setupEdge();
            // send a placeholder move to the main move queue to simulate a person thinking
            this.cube.moveQueue.enqueue({ moveType: Move.wait, count: 50, prime: false, speed: 1 });
            // apply alg to swap buffer edge with set up edge to both the dummy cube and the main cube
            this.cube.moveQueue.enqueue(...PLL.T);
            this.dummyCube.permuteTiles(false, ...PLL.T);
            // send a placeholder move to the main move queue to simulate a person thinking
            this.cube.moveQueue.enqueue({ moveType: Move.wait, count: 50, prime: false, speed: 1 });
            // undo setup moves to solve edge and add those moves to the main move queue
            this.cube.moveQueue.enqueue(...this.undoMoves(...this.setupMoves));
            this.dummyCube.permuteTiles(false, ...this.undoMoves(...this.setupMoves));
            // send a placeholder move to the main move queue to simulate a person thinking
            this.cube.moveQueue.enqueue({ moveType: Move.wait, count: 50, prime: false, speed: 1 });
            // incrament edge swap counter
            edgeSwapCount++;
        }
        // check if an odd number of edge swaps were performed, and perform the parity algorithm if so
        if (edgeSwapCount % 2 !== 0) {
            this.cube.moveQueue.enqueue(...PLL.Ra);
            this.dummyCube.permuteTiles(false, ...PLL.Ra);
        }
        // keep solving corners until all corners are solved
        while (!this.cornersSolved()) {
            // set up corner to be swapped with buffer piece
            this.setupCorner();
            // send a placeholder move to the main move queue to simulate a person thinking
            this.cube.moveQueue.enqueue({ moveType: Move.wait, count: 50, prime: false, speed: 1 });
            // apply alg to swap buffer edge with set up corner to both the dummy cube and the main cube
            this.cube.moveQueue.enqueue(...PLL.modifiedY);
            this.dummyCube.permuteTiles(false, ...PLL.modifiedY);
            // send a placeholder move to the main move queue to simulate a person thinking
            this.cube.moveQueue.enqueue({ moveType: Move.wait, count: 50, prime: false, speed: 1 });
            // undo setup moves to solve corner and add those moves to the main move queue
            this.cube.moveQueue.enqueue(...this.undoMoves(...this.setupMoves));
            this.dummyCube.permuteTiles(false, ...this.undoMoves(...this.setupMoves));
            // only send a placeholder move to the main move queue to simulate a person thinking if there are more pieces to solve
            if (!this.cornersSolved())
                this.cube.moveQueue.enqueue({ moveType: Move.wait, count: 50, prime: false, speed: 1 });
        }
    }
    /**
     * function to check if all the edges on the cube are solved
     * @returns boolean value to show if the edges are solved or not
     */
    edgesSolved() {
        // get the keys and values in the cube position record and store them in variables
        let keys = [...Object.keys(this.dummyCube.data)];
        let values = [...Object.values(this.dummyCube.data)];
        // loop over the keys and values by index
        for (let i = 0; i < values.length; i++) {
            // check if the current key does not match the current value's origin, and if the current value is an edge
            if (keys[i] !== values[i].origin && values[i].pieceType === PieceType.Edge) {
                console.log("false");
                // return false to show that the edges are not solved
                return false;
            }
        }
        console.log("true");
        // return true to show that the edges are solved
        return true;
    }
    /**
     * function to check if all the corners on the cube are solved
     * @returns boolean value to show if the corners are solved or not
     */
    cornersSolved() {
        // get the keys and values in the cube position record and store them in variables
        let keys = [...Object.keys(this.dummyCube.data)];
        let values = [...Object.values(this.dummyCube.data)];
        // loop over the keys and values by index
        for (let i = 0; i < values.length; i++) {
            // check if the current key does not match the current value's origin, and if the current value is a corner
            if (keys[i] !== this.dummyCube.data[keys[i]].origin && values[i].pieceType === PieceType.Corner) {
                console.log("false2");
                // return false to show that the corners are not solved
                return false;
            }
        }
        console.log("true2");
        // return true to show that the corners are solved
        return true;
    }
    /**
     * function to find an unsolved edge
     * @returns a reference to the unsolved edge in memory
     */
    findUnsolvedEdge() {
        // get the keys and values in the cube position record and store them in variables
        let keys = [...Object.keys(this.dummyCube.data)];
        let values = [...Object.values(this.dummyCube.data)];
        // loop over the keys and values by index
        for (let i = 0; i < values.length; i++) {
            // check if the current key does not match the current value's origin, and if the current value is an edge
            if (keys[i] !== values[i].origin && values[i].pieceType === PieceType.Edge &&
                values[i].origin !== EdgeTile.B && values[i].origin !== EdgeTile.M) {
                // return a reference to the unsolved piece
                return keys[i];
            }
        }
    }
    /**
     * function to find an unsolved edge
     * @returns a reference to the unsolved corner in memory
     */
    findUnsolvedCorner() {
        // get the keys and values in the cube position record and store them in variables
        let keys = [...Object.keys(this.dummyCube.data)];
        let values = [...Object.values(this.dummyCube.data)];
        // loop over the keys and values by index
        for (let i = 0; i < values.length; i++) {
            // check if the current key does not match the current value's origin, and if the current value is a corner
            if (keys[i] !== values[i].origin && values[i].pieceType === PieceType.Corner &&
                values[i].origin !== CornerTile.A && values[i].origin !== CornerTile.E && values[i].origin !== CornerTile.R) {
                // return a reference to the unsolved corner
                return keys[i];
            }
        }
    }
    /** function that will use BFS to determine the moves needed to set up the next edge to be solved. */
    setupEdge() {
        // find the target piece based on the origin of the buffer piece
        let target = this.dummyCube.data[EdgeTile.B].origin;
        // check if buffer piece is in the buffer slot
        if (target == EdgeTile.B || target == EdgeTile.M) {
            // find a different unsolved edge to place in the buffer slot
            target = this.dummyCube.data[this.findUnsolvedEdge()].origin;
        }
        console.log("target: " + target);
        // get setup moves from setup move record
        this.setupMoves = Move.setupMoves[target];
        // pass setup moves to the main cube and the dummy cube
        this.cube.moveQueue.enqueue(...this.setupMoves);
        this.dummyCube.permuteTiles(false, ...this.setupMoves);
    }
    /** function that will use BFS to determine the moves needed to set up the next corner to be solved. */
    setupCorner() {
        // find the target piece based on the origin of the buffer piece
        let target = this.dummyCube.data[CornerTile.E].origin;
        // check if buffer piece is in the buffer slot
        if (target == CornerTile.A || target == CornerTile.E || target == CornerTile.R) {
            // find a different unsolved edge to place in the buffer slot
            target = this.dummyCube.data[this.findUnsolvedCorner()].origin;
        }
        console.log("target: " + target);
        // get setup moves from setup move record
        this.setupMoves = Move.setupMoves[target];
        // pass setup moves to the main cube and the dummy cube
        this.cube.moveQueue.enqueue(...this.setupMoves);
        this.dummyCube.permuteTiles(false, ...this.setupMoves);
    }
    /**
     * function to undo moves that have been performed specifically on the dummy cube.
     * @param moves a variable amount of moves to be reversed
     * @returns the reversed moves
    */
    undoMoves(...moves) {
        // reverse the move order
        let reversed = structuredClone(moves).reverse();
        // reverse move direction
        for (let move of reversed)
            move.prime = !move.prime;
        // return reversed moves
        return reversed;
    }
}
//# sourceMappingURL=solver.js.map