import * as THREE from "three";
import { EdgeTile, CornerTile, CenterTile, TileColor, CubeTile, PieceType, CubeMove, XYZ } from "./dataTypes";
import { white, orange, green, red, blue, yellow} from "./dataTypes";
import { constructCorner, constructEdge, constructCenter } from "./pieceConstructor";
import { prime } from "./cubeMoveData";
import * as Move from "./cubeMoveType";
import { Queue } from "./queue";
import { Cube } from "./cube";
import { allowedEdgeMoves, allowedCornerMoves } from "./allowedSetupMoves";
import * as PLL from "./PLLAlgs";


export class Solver {

    protected static _instance: Solver;

    protected _cube: Cube;

    protected _dummyCube: Cube = new Cube();

    protected _setupMoves: CubeMove[] = [];

    constructor(cube: Cube) {
        if (Solver.instance !== undefined) throw new Error("Error! can't create more than one instance of a singleton class!");
        this.cube = cube;
    }

    public static get instance(): Solver {
        return Solver._instance;
    }
    protected get cube(): Cube {
        return this._cube;
    }
    protected get setupMoves(): CubeMove[] {
        return this._setupMoves;
    }
    protected get dummyCube(): Cube {
        return this._dummyCube;
    }

    protected static set instance(val: Solver) {
        Solver._instance = val;
    }
    protected set cube(val: Cube) {
        this._cube = val;
    }
    protected set setupMoves(val: CubeMove[]) {
        this._setupMoves = val;
    }
    protected set dummyCube(val: Cube) {
        this._dummyCube = val;
    }



    /** function to generate the necessary moves to simulate a beginner solve. */
    public solveBeginner(scramble: CubeMove[]) {

        // create new dummy cube
        this.dummyCube = new Cube();
        this.dummyCube.generateCube();

        // apply scramble to dummy cube
        this.dummyCube.permuteTiles(false, ...scramble);

        // keep track of how many edge swaps are done so that parity can be fixed if necessary
        let edgeSwapCount: number = 0;

        // keep solving edges until all edges are solved
        while (!this.edgesSolved()) {

            // set up edge to be swapped with buffer piece
            this.setupEdge();
            console.log(this.dummyCube.data);
            console.log(this.setupMoves);
            return;

            // send a placeholder move to the main move queue to simulate a person thinking
            this.cube.moveQueue.enqueue({moveType: Move.wait, count: 50, prime: false, speed: 1});

            // apply alg to swap buffer edge with set up edge to both the dummy cube and the main cube
            this.cube.moveQueue.enqueue(...PLL.T);
            this.dummyCube.permuteTiles(false, ...PLL.T);

            // send a placeholder move to the main move queue to simulate a person thinking
            this.cube.moveQueue.enqueue({moveType: Move.wait, count: 50, prime: false, speed: 1});

            // undo setup moves to solve edge and add those moves to the main move queue
            this.cube.moveQueue.enqueue(...this.undoMoves(...this.setupMoves));
            this.dummyCube.permuteTiles(false, ...this.undoMoves(...this.setupMoves));
            return;
        }


        return;
        // check if an odd number of edge swaps were performed, and perform the parity algorithm if so
        if (edgeSwapCount % 2 !== 0) this.cube.moveQueue.enqueue(...PLL.Ra);



        // keep solving corners until all corners are solved
        while (!this.cornersSolved()) {

            // set up corner to be swapped with buffer piece
            this.setupCorner();

            // send a placeholder move to the main move queue to simulate a person thinking
            this.cube.moveQueue.enqueue({moveType: Move.wait, count: 50, prime: false, speed: 1});

            // apply alg to swap buffer corner with set up corner
            this.cube.moveQueue.enqueue(...PLL.modifiedY);

            // send a placeholder move to the main move queue to simulate a person thinking
            this.cube.moveQueue.enqueue({moveType: Move.wait, count: 50, prime: false, speed: 1});

            // undo setup moves to solve corner and add those moves to the main move queue
            this.cube.moveQueue.enqueue(...this.undoMoves(...this.setupMoves));
        }
    }



    /** 
     * function to check if all the edges on the cube are solved
     * @returns boolean value to show if the edges are solved or not
     */
    protected edgesSolved(): boolean {
        
        // get the keys and values in the cube position record and store them in variables
        let keys: string[] = [...Object.keys(this.dummyCube.data)];
        let values: CubeTile[] = [...Object.values(this.dummyCube.data)];

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
    protected findUnsolvedEdge(): EdgeTile | undefined {
        
        // get the keys and values in the cube position record and store them in variables
        let keys: string[] = [...Object.keys(this.dummyCube.data)];
        let values: CubeTile[] = [...Object.values(this.dummyCube.data)];

        // loop over the keys and values by index
        for (let i = 0; i < values.length; i++) {

            // check if the current key does not match the current value's origin, and if the current value is an edge
            if (keys[i] !== values[i].origin && values[i].pieceType === PieceType.Edge) {

                // return a reference to the unsolved piece
                return <EdgeTile>keys[i];
            }
        }
    }



    /** 
     * function to check if all the corners on the cube are solved
     * @returns boolean value to show if the corners are solved or not
     */
    protected cornersSolved(): boolean {
        
        // get the keys and values in the cube position record and store them in variables
        let keys: string[] = [...Object.keys(this.cube.data)];
        let values: CubeTile[] = [...Object.values(this.cube.data)];

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
    protected findUnsolvedCorner(): CornerTile | undefined {
        
        // get the keys and values in the cube position record and store them in variables
        let keys: string[] = [...Object.keys(this.cube.data)];
        let values: CubeTile[] = [...Object.values(this.cube.data)];

        // loop over the keys and values by index
        for (let i = 0; i < values.length; i++) {

            // check if the current key does not match the current value's origin, and if the current value is a corner
            if (keys[i] !== values[i].origin && values[i].pieceType === PieceType.Edge) {

                // return a reference to the unsolved corner
                return <CornerTile>keys[i];
            }
        }
    }



    /** function that will use BFS to determine the moves needed to set up the next edge to be solved. */
    protected setupEdge() {

        // create queue of move sets for BFS
        let q: Queue<CubeMove[]> = new Queue<CubeMove[]>();

        // add empty move to the queue
        q.enqueue([]);

        // find the target piece based on the origin of the buffer piece
        let target: EdgeTile = <EdgeTile>this.dummyCube.data[this.dummyCube.data[EdgeTile.B].origin].origin;

        console.log("target: " + target);
        
        // check if buffer piece is in the buffer slot
        if (this.dummyCube.data[EdgeTile.B].origin == EdgeTile.B || this.dummyCube.data[EdgeTile.B].origin == EdgeTile.M) {

            // find a different unsolved edge to place in the buffer slot
            target = <EdgeTile>this.findUnsolvedEdge();
        }

        // keep performing BFS while the queue has content
        while (q.size()) {

            // remove next item from queue and save it in a variable
            let curr: CubeMove[] = <CubeMove[]>q.dequeue();

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
    protected setupCorner() {

        // create queue of move sets for BFS
        let q: Queue<CubeMove[]> = new Queue<CubeMove[]>();

        // add empty move to the queue
        q.enqueue([]);

        // find the target piece based on the origin of the buffer piece
        let target: CornerTile = <CornerTile>this.dummyCube.data[this.dummyCube.data[CornerTile.E].origin].origin;

        // check if buffer piece is in the buffer slot
        if (
            this.dummyCube.data[CornerTile.E].origin == CornerTile.A || 
            this.dummyCube.data[CornerTile.E].origin == CornerTile.E || 
            this.dummyCube.data[CornerTile.E].origin == CornerTile.R
        ) {

            // find a different unsolved edge to place in the buffer slot
            target = <CornerTile>this.findUnsolvedCorner();
        }

        // keep performing BFS while the queue has content
        while (q.size()) {

            // remove next item from queue and save it in a variable
            let curr: CubeMove[] = <CubeMove[]>q.dequeue();

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
    protected undoMoves(...moves: CubeMove[]): CubeMove[] {

        // reverse the move order
        let reversed: CubeMove[] = structuredClone(moves).reverse();

        // reverse move direction
        for (let move of reversed) move.prime = !move.prime;

        // return reversed moves
        return reversed;
    }
}
