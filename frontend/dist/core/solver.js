import { EdgeTile, CornerTile, PieceType } from "./dataTypes";
import * as Move from "./cubeMoveType";
import { Queue } from "./queue";
import { Cube } from "./cube";
import { allowedEdgeMoves, allowedCornerMoves } from "./allowedSetupMoves";
import * as PLL from "./PLLAlgs";
export class Solver {
    constructor(cube) {
        this._dummyCube = new Cube();
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
    /** function to generate the necessary moves to simulate a beginner solve. */
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
            console.log(this.dummyCube.data);
            console.log(this.setupMoves);
            return;
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
            return;
        }
        return;
        // check if an odd number of edge swaps were performed, and perform the parity algorithm if so
        if (edgeSwapCount % 2 !== 0)
            this.cube.moveQueue.enqueue(...PLL.Ra);
        // keep solving corners until all corners are solved
        while (!this.cornersSolved()) {
            // set up corner to be swapped with buffer piece
            this.setupCorner();
            // send a placeholder move to the main move queue to simulate a person thinking
            this.cube.moveQueue.enqueue({ moveType: Move.wait, count: 50, prime: false, speed: 1 });
            // apply alg to swap buffer corner with set up corner
            this.cube.moveQueue.enqueue(...PLL.modifiedY);
            // send a placeholder move to the main move queue to simulate a person thinking
            this.cube.moveQueue.enqueue({ moveType: Move.wait, count: 50, prime: false, speed: 1 });
            // undo setup moves to solve corner and add those moves to the main move queue
            this.cube.moveQueue.enqueue(...this.undoMoves(...this.setupMoves));
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
                // return false to show that the edges are not solved
                return false;
            }
        }
        // return true to show that the edges are solved
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
            if (keys[i] !== values[i].origin && values[i].pieceType === PieceType.Edge) {
                // return a reference to the unsolved piece
                return keys[i];
            }
        }
    }
    /**
     * function to check if all the corners on the cube are solved
     * @returns boolean value to show if the corners are solved or not
     */
    cornersSolved() {
        // get the keys and values in the cube position record and store them in variables
        let keys = [...Object.keys(this.cube.data)];
        let values = [...Object.values(this.cube.data)];
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
    /**
     * function to find an unsolved edge
     * @returns a reference to the unsolved corner in memory
     */
    findUnsolvedCorner() {
        // get the keys and values in the cube position record and store them in variables
        let keys = [...Object.keys(this.cube.data)];
        let values = [...Object.values(this.cube.data)];
        // loop over the keys and values by index
        for (let i = 0; i < values.length; i++) {
            // check if the current key does not match the current value's origin, and if the current value is a corner
            if (keys[i] !== values[i].origin && values[i].pieceType === PieceType.Edge) {
                // return a reference to the unsolved corner
                return keys[i];
            }
        }
    }
    /** function that will use BFS to determine the moves needed to set up the next edge to be solved. */
    setupEdge() {
        // create queue of move sets for BFS
        let q = new Queue();
        // add empty move to the queue
        q.enqueue([]);
        // find the target piece based on the origin of the buffer piece
        let target = this.dummyCube.data[this.dummyCube.data[EdgeTile.B].origin].origin;
        console.log("target: " + target);
        // check if buffer piece is in the buffer slot
        if (this.dummyCube.data[EdgeTile.B].origin == EdgeTile.B || this.dummyCube.data[EdgeTile.B].origin == EdgeTile.M) {
            // find a different unsolved edge to place in the buffer slot
            target = this.findUnsolvedEdge();
        }
        // keep performing BFS while the queue has content
        while (q.size()) {
            // remove next item from queue and save it in a variable
            let curr = q.dequeue();
            // loop over all possible moves that could be performed next
            for (let allowedMove of allowedEdgeMoves) {
                // apply new moves to dummy cube
                console.log(structuredClone(this.dummyCube.data[EdgeTile.D].origin));
                this.dummyCube.permuteTiles(false, ...curr, allowedMove);
                console.log(structuredClone(this.dummyCube.data[EdgeTile.D].origin));
                // check if the target piece is in the correct position to be swapped
                if (this.dummyCube.data[EdgeTile.D].origin === target) {
                    console.log("yes");
                    // console.log(this.dummyCube.data[EdgeTile.D]);
                    // console.log(this.dummyCube.data);
                    // save setup moves into the setup move variable
                    this.setupMoves = [...curr, allowedMove];
                    // add setup moves to the main cube's move queue
                    this.cube.moveQueue.enqueue(...this.setupMoves);
                    // exit function
                    return;
                }
                // undo moves that didn't work
                this.undoMoves(...curr, allowedMove);
                // add new move chain to the BFS queue
                q.enqueue([...curr, allowedMove]);
            }
        }
    }
    /** function that will use BFS to determine the moves needed to set up the next corner to be solved. */
    setupCorner() {
        // create queue of move sets for BFS
        let q = new Queue();
        // add empty move to the queue
        q.enqueue([]);
        // find the target piece based on the origin of the buffer piece
        let target = this.dummyCube.data[this.dummyCube.data[CornerTile.E].origin].origin;
        // check if buffer piece is in the buffer slot
        if (this.dummyCube.data[CornerTile.E].origin == CornerTile.A ||
            this.dummyCube.data[CornerTile.E].origin == CornerTile.E ||
            this.dummyCube.data[CornerTile.E].origin == CornerTile.R) {
            // find a different unsolved edge to place in the buffer slot
            target = this.findUnsolvedCorner();
        }
        // keep performing BFS while the queue has content
        while (q.size()) {
            // remove next item from queue and save it in a variable
            let curr = q.dequeue();
            // loop over all possible moves that could be performed next
            for (let allowedMove of allowedCornerMoves) {
                // apply new moves to dummy cube
                this.dummyCube.permuteTiles(false, ...curr, allowedMove);
                // check if the target piece is in the correct position to be swapped
                if (this.dummyCube.data[CornerTile.V].origin === target) {
                    // save setup moves into the setup move variable
                    this.setupMoves = [...curr, allowedMove];
                    return;
                    // add setup moves to the main cube's move queue
                    this.cube.moveQueue.enqueue(...this.setupMoves);
                    // exit function
                    return;
                }
                // undo moves that didn't work
                this.undoMoves(...curr, allowedMove);
                // add new move chain to the BFS queue
                q.enqueue([...curr, allowedMove]);
            }
        }
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