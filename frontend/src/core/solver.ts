import * as THREE from "three";
import { EdgeTile, CornerTile, CenterTile, TileColor, CubeTile, PieceType, CubeMove, XYZ } from "./dataTypes";
import { white, orange, green, red, blue, yellow} from "./dataTypes";
import { constructCorner, constructEdge, constructCenter } from "./pieceConstructor";
import { prime } from "./cubeMoveData";
import * as Move from "./cubeMoveType";
import { Queue } from "./queue";
import { Cube } from "./cube";


export class Solver {

    protected static _instance: Solver;

    protected _cube: Cube;

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

    protected static set instance(val: Solver) {
        Solver._instance = val;
    }
    protected set cube(val: Cube) {
        this._cube = val;
    }
    protected set setupMoves(val: CubeMove[]) {
        this._setupMoves = val;
    }

    protected solveBeginner() {

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
    protected edgesSolved(): boolean {
        
        // get the keys and values in the cube position record and store them in variables
        let keys: string[] = [...Object.keys(this.cube.position)];
        let values: CubeTile[] = [...Object.values(this.cube.position)];

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
    protected cornersSolved(): boolean {
        
        // get the keys and values in the cube position record and store them in variables
        let keys: string[] = [...Object.keys(this.cube.position)];
        let values: CubeTile[] = [...Object.values(this.cube.position)];

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



    protected setupEdge() {}



    protected setupCorner() {}


    
    protected undoSetup() {}
}
