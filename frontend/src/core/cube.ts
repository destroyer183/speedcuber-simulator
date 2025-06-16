import * as THREE from "three";
import { EdgeTile, CornerTile, CenterTile, TileColor, CubeTile, PieceType, CubeMove, XYZ } from "./dataTypes";
import { white, orange, green, red, blue, yellow} from "./dataTypes";
import { constructCorner, constructEdge, constructCenter } from "./pieceConstructor";
import { prime } from "./cubeMoveData";
import * as Move from "./cubeMoveType";
import { Queue } from "./queue";



/** Singleton class to represent a 3x3 rubiks cube and all related functionality. */
export class Cube {
    
    /** static attribute to act as a reference to the singleton object. */
    protected static _instance: Cube;

    /** protected record attribute to keep track of the color and parent piece of each tile on the cube. */
    protected _position: Record<EdgeTile | CornerTile | CenterTile, CubeTile>;

    /** protected 'Group' to act as different layers of the cube to allow for multiple pieces to rotate around an origin. */
    protected _rotationGroup: THREE.Group;

    /** protected queue to store every move that needs to be performed on the cube */
    public _moveQueue: Queue<CubeMove> = new Queue<CubeMove>();

    /** protected 'CubeMove' to represent the current turn being performed on the cube. */
    protected _currTurn: CubeMove;

    /** protected 'XYZ' variable to represent the x, y, and z rotation limits for the current turn */
    protected _turnLimit: XYZ;

    /** protected 'XYZ' variable to represent the current amount of x, y, and z rotation that has been performed for the current turn. */
    protected _turnData: XYZ;

    /** protected boolean to represent whether or not a turn is currently being performed on the cube. */
    protected _turnActive: boolean = false;

    /** protected number to act as a counter for time where no turn is performed */
    protected _waitCounter: number = 0;

    /** protected variable that represents the current threejs scene */
    protected _scene: THREE.Scene;

    /** @constructor main constructor for the 'Cube' class. */
    public constructor() {
        if (Cube.instance !== undefined) throw new Error("Error! can't create more than one instance of a singleton class!");
        Cube._instance = this;
    }



    public static get instance(): Cube {
        return Cube._instance;
    }
    public get position(): Record<EdgeTile | CornerTile | CenterTile, CubeTile> {
        return this._position;
    }
    protected get rotationGroup(): THREE.Group {
        return this._rotationGroup;
    }
    public get moveQueue(): Queue<CubeMove> {
        return this._moveQueue;
    }
    protected get currTurn(): CubeMove {
        return this._currTurn;
    }
    protected get turnLimit(): XYZ {
        return this._turnLimit;
    }
    protected get turnData(): XYZ {
        return this._turnData;
    }
    protected get turnActive(): boolean {
        return this._turnActive;
    }
    protected get waitCounter(): number {
        return this._waitCounter;
    }
    protected get scene(): THREE.Scene {
        return this._scene;
    }

    protected set position(val: Record<CornerTile | EdgeTile | CenterTile, CubeTile>) {
        this._position = val;
    }
    protected set rotationGroup(val: THREE.Group) {
        this._rotationGroup = val;
    }
    public set moveQueue(val: Queue<CubeMove>) {
        this._moveQueue = val;
    }
    protected set currTurn(val: CubeMove) {
        this._currTurn = val;
    }
    protected set turnLimit(val: XYZ) {
        this._turnLimit = val;
    }
    protected set turnData(val: XYZ) {
        this._turnData = val;
    }
    protected set waitCounter(val: number) {
        this._waitCounter = val;
    }
    protected set turnActive(val: boolean) {
        this._turnActive = val;
    }



    /** public function to generate the threejs scene */
    public generateScene() {

        // get window sizing
        const WIDTH: number = window.innerWidth;
        const HEIGHT: number = window.innerHeight;

        // create the rendering element and add it to the html
        const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.domElement.setAttribute("id", "canvas-wrapper")
        renderer.setSize(WIDTH, HEIGHT);
        document.body.appendChild(renderer.domElement);

        // set the background color of the renderer
        renderer.setClearColor(0x696969);

        // create rendering scene
        this._scene = new THREE.Scene();

        // create camera for the scene
        const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT);

        // create variable to control the zoom factor
        const zoom: number = 40

        // move the camera away from the origin in the Z direction
        camera.translateZ(zoom);
        
        // add the camera to the scene
        this.scene.add(camera);
        
        // call function to generate the 3x3 cube
        this.generateCube();

        // create function to orbit the camera around the cube, and bind it to trigger whenever the user moves their mouse
        document.querySelector('#canvas-wrapper')!.addEventListener("mousemove", function(e: any) {

            // get x and y coordinates of the mouse relative to the center of the screen, and scale the values down by a factor of 100
            let x: number = (e.pageX - window.innerWidth / 2) * -0.01;
            let y: number = (e.pageY - window.innerHeight / 2) * 0.01;

            // limit the y value to be within pi/2 to prevent odd camera behaviour
            if (y > Math.PI/2) y = Math.PI/2;
            if (y < -Math.PI/2) y = -Math.PI/2;

            // set camera position based on the x and y coordinates of the mouse
            camera.position.x = Math.sin(x) * Math.cos(y) * zoom;
            camera.position.y = Math.sin(y) * zoom;
            camera.position.z = Math.cos(x) * Math.cos(y) * zoom;

            // make camrea point at the origin
            camera.lookAt(Cube.instance.scene.position);

        }, false); 

        // create recursive function to render the scene
        function render() {

            // get next animation frame
            requestAnimationFrame(render);

            // call function to render the current state of the cube
            Cube.instance.renderCube();

            // render the scene
            renderer.render(Cube.instance.scene, camera);
        }

        // call recursive function
        render();
    }



    /** Protected function to render the cube and handle cube moves */
    protected renderCube() {

        // check if a wait is being performed
        if (this.waitCounter != 0) {

            // print stuff to the console to take up time
            console.log("wait");

            // incrament the wait counter, and apply modulus so that it will reset to 0 when it reaches the count
            this.waitCounter = (this.waitCounter + this.currTurn.speed) % this.currTurn.count;
        }

        // check if a turn is currently being performed or if there are any turns currently in the queue
        else if (!this.turnActive && this.moveQueue.size()) {

            // get the next turn in the queue
            this.currTurn = <CubeMove>this.moveQueue.dequeue();

            // check if there is no move data
            if (this.currTurn.moveType.move.length === 0) {

                // incrament the wait counter so that a different case will trigger on the next iteration of the loop
                this.waitCounter += this.currTurn.speed;

                // exit current loop iteration
                return;
            }

            // update variable to show that a turn is currently being performed
            this.turnActive = true;

            // call function to properly apply the current move to the cube's variable data
            this.applyMove(this.currTurn);

            // adjust speed attribute to follow the proper direction if the standard rotation direction is counter-clockwise relative to the world axis
            if (Math.max(this.currTurn.moveType.axis.x, this.currTurn.moveType.axis.y, this.currTurn.moveType.axis.z) !== 0) this.currTurn.speed *= -1;

            // check if the current turn is a prime turn or not (is it counter-clockwise), and invert turn speed if it is
            if (!this.currTurn.prime) this.currTurn.speed *= -1;
            
            // set the turn limit to the axis limits for the type of turn, multiplied by the count of how many times this move should be performed
            this.turnLimit = new XYZ(
                this.currTurn.moveType.axis.x * this.currTurn.speed / Math.abs(this.currTurn.speed) * this.currTurn.count,
                this.currTurn.moveType.axis.y * this.currTurn.speed / Math.abs(this.currTurn.speed) * this.currTurn.count,
                this.currTurn.moveType.axis.z * this.currTurn.speed / Math.abs(this.currTurn.speed) * this.currTurn.count
            );

            // reset the turn data variable
            this.turnData = new XYZ(0, 0, 0);
        }

        // check if a turn is currently active
        else if (this.turnActive) {

            // add the speed values to turn data, stopping the rotation when the values have reached the maximum allowed rotation.
            this.turnData.x = (Math.abs(this.turnData.x + this.currTurn.speed) > Math.abs(this.turnLimit.x)) ? this.turnLimit.x : this.turnData.x + this.currTurn.speed;
            this.turnData.y = (Math.abs(this.turnData.y + this.currTurn.speed) > Math.abs(this.turnLimit.y)) ? this.turnLimit.y : this.turnData.y + this.currTurn.speed;
            this.turnData.z = (Math.abs(this.turnData.z + this.currTurn.speed) > Math.abs(this.turnLimit.z)) ? this.turnLimit.z : this.turnData.z + this.currTurn.speed;

            // set the rotation of the origin piece to the current rotation values
            this.rotationGroup.rotation.set(this.turnData.x, this.turnData.y, this.turnData.z);

            // check if all rotation factors have reached their maximum value
            if (this.turnData.x === this.turnLimit.x && this.turnData.y === this.turnLimit.y && this.turnData.z === this.turnLimit.z) {

                // update variable to show that the turn is no longer active
                this.turnActive = false;

                // add pieces in the rotation group back to the main scene
                for (let piece of [...this.rotationGroup.children]) this.scene.add(piece);

                // properly move the pieces around in both memory and visually after the turn is completed
                for (let i = 0; i < this.currTurn.count; i++) this.permuteTiles(this.currTurn);
            }
        }
    }



    /** function to generate the cube in memory and visually */
    protected generateCube() {
        
        // create constants for all of the corner pieces
        const AER: THREE.Group = constructCorner(white, blue, orange);
        const BNQ: THREE.Group = constructCorner(white, red, blue);
        const CJM: THREE.Group = constructCorner(white, green, red);
        const DFI: THREE.Group = constructCorner(white, orange, green);

        const ULG:  THREE.Group = constructCorner(yellow, green, orange);
        const VPK:  THREE.Group = constructCorner(yellow, red, green);
        const WTO:  THREE.Group = constructCorner(yellow, blue, red);
        const ShHS: THREE.Group = constructCorner(yellow, orange, blue);


        // create constants for all of the edge pieces
        const AQ: THREE.Group = constructEdge(white, blue);
        const BM: THREE.Group = constructEdge(white, red);
        const CI: THREE.Group = constructEdge(white, green);
        const DE: THREE.Group = constructEdge(white, orange);

        const LF: THREE.Group = constructEdge(green, orange);
        const JP: THREE.Group = constructEdge(green, red);
        const RH: THREE.Group = constructEdge(blue, orange);
        const TN: THREE.Group = constructEdge(blue, red);

        const UK:  THREE.Group = constructEdge(yellow, green);
        const VO:  THREE.Group = constructEdge(yellow, red);
        const WS:  THREE.Group = constructEdge(yellow, blue);
        const ShG: THREE.Group = constructEdge(yellow, orange);


        // creat constants for all of the center pieces
        const U: THREE.Group = constructCenter(white);
        const L: THREE.Group = constructCenter(orange);
        const F: THREE.Group = constructCenter(green);
        const R: THREE.Group = constructCenter(red);
        const B: THREE.Group = constructCenter(blue);
        const D: THREE.Group = constructCenter(yellow);

        // if the scene exists, add all of the pieces to the current scene
        if (this.scene !== undefined) this.scene.add(AQ, BM, CI, DE, LF, JP, RH, TN, UK, VO, WS, ShG, AER, BNQ, CJM, DFI, ULG, VPK, WTO, ShHS, U, L, F, R, B, D);

        // assign all pieces to the correct tiles in memory
        this.position = {

            "a": {color: TileColor.W, piece: AER, pieceType: PieceType.Corner, origin: CornerTile.A},
            "b": {color: TileColor.W, piece: BNQ, pieceType: PieceType.Corner, origin: CornerTile.B},
            "c": {color: TileColor.W, piece: CJM, pieceType: PieceType.Corner, origin: CornerTile.C},
            "d": {color: TileColor.W, piece: DFI, pieceType: PieceType.Corner, origin: CornerTile.D},

            "e": {color: TileColor.O, piece: AER,  pieceType: PieceType.Corner, origin: CornerTile.E},
            "f": {color: TileColor.O, piece: DFI,  pieceType: PieceType.Corner, origin: CornerTile.F},
            "g": {color: TileColor.O, piece: ULG,  pieceType: PieceType.Corner, origin: CornerTile.G},
            "h": {color: TileColor.O, piece: ShHS, pieceType: PieceType.Corner, origin: CornerTile.H},

            "i": {color: TileColor.G, piece: DFI, pieceType: PieceType.Corner, origin: CornerTile.I},
            "j": {color: TileColor.G, piece: CJM, pieceType: PieceType.Corner, origin: CornerTile.J},
            "k": {color: TileColor.G, piece: VPK, pieceType: PieceType.Corner, origin: CornerTile.K},
            "l": {color: TileColor.G, piece: ULG, pieceType: PieceType.Corner, origin: CornerTile.L},

            "m": {color: TileColor.R, piece: CJM, pieceType: PieceType.Corner, origin: CornerTile.M},
            "n": {color: TileColor.R, piece: BNQ, pieceType: PieceType.Corner, origin: CornerTile.N},
            "o": {color: TileColor.R, piece: WTO, pieceType: PieceType.Corner, origin: CornerTile.O},
            "p": {color: TileColor.R, piece: VPK, pieceType: PieceType.Corner, origin: CornerTile.P},

            "q": {color: TileColor.B, piece: BNQ,  pieceType: PieceType.Corner, origin: CornerTile.Q},
            "r": {color: TileColor.B, piece: AER,  pieceType: PieceType.Corner, origin: CornerTile.R},
            "s": {color: TileColor.B, piece: ShHS, pieceType: PieceType.Corner, origin: CornerTile.S},
            "t": {color: TileColor.B, piece: WTO,  pieceType: PieceType.Corner, origin: CornerTile.T},

            "u":  {color: TileColor.Y, piece: ULG,  pieceType: PieceType.Corner, origin: CornerTile.U},
            "v":  {color: TileColor.Y, piece: VPK,  pieceType: PieceType.Corner, origin: CornerTile.V},
            "w":  {color: TileColor.Y, piece: WTO,  pieceType: PieceType.Corner, origin: CornerTile.W},
            "sh": {color: TileColor.Y, piece: ShHS, pieceType: PieceType.Corner, origin: CornerTile.Sh},


            "A": {color: TileColor.W, piece: AQ, pieceType: PieceType.Edge, origin: EdgeTile.A},
            "B": {color: TileColor.W, piece: BM, pieceType: PieceType.Edge, origin: EdgeTile.B},
            "C": {color: TileColor.W, piece: CI, pieceType: PieceType.Edge, origin: EdgeTile.C},
            "D": {color: TileColor.W, piece: DE, pieceType: PieceType.Edge, origin: EdgeTile.D},

            "E": {color: TileColor.O, piece: DE,  pieceType: PieceType.Edge, origin: EdgeTile.E},
            "F": {color: TileColor.O, piece: LF,  pieceType: PieceType.Edge, origin: EdgeTile.F},
            "G": {color: TileColor.O, piece: ShG, pieceType: PieceType.Edge, origin: EdgeTile.G},
            "H": {color: TileColor.O, piece: RH,  pieceType: PieceType.Edge, origin: EdgeTile.H},
            
            "I": {color: TileColor.G, piece: CI, pieceType: PieceType.Edge, origin: EdgeTile.I},
            "J": {color: TileColor.G, piece: JP, pieceType: PieceType.Edge, origin: EdgeTile.J},
            "K": {color: TileColor.G, piece: UK, pieceType: PieceType.Edge, origin: EdgeTile.K},
            "L": {color: TileColor.G, piece: LF, pieceType: PieceType.Edge, origin: EdgeTile.L},

            "M": {color: TileColor.R, piece: BM, pieceType: PieceType.Edge, origin: EdgeTile.M},
            "N": {color: TileColor.R, piece: TN, pieceType: PieceType.Edge, origin: EdgeTile.N},
            "O": {color: TileColor.R, piece: VO, pieceType: PieceType.Edge, origin: EdgeTile.O},
            "P": {color: TileColor.R, piece: JP, pieceType: PieceType.Edge, origin: EdgeTile.P},

            "Q": {color: TileColor.B, piece: AQ, pieceType: PieceType.Edge, origin: EdgeTile.Q},
            "R": {color: TileColor.B, piece: RH, pieceType: PieceType.Edge, origin: EdgeTile.R},
            "S": {color: TileColor.B, piece: WS, pieceType: PieceType.Edge, origin: EdgeTile.S},
            "T": {color: TileColor.B, piece: TN, pieceType: PieceType.Edge, origin: EdgeTile.T},

            "U":  {color: TileColor.Y, piece: UK,  pieceType: PieceType.Edge, origin: EdgeTile.U},
            "V":  {color: TileColor.Y, piece: VO,  pieceType: PieceType.Edge, origin: EdgeTile.V},
            "W":  {color: TileColor.Y, piece: WS,  pieceType: PieceType.Edge, origin: EdgeTile.W},
            "SH": {color: TileColor.Y, piece: ShG, pieceType: PieceType.Edge, origin: EdgeTile.Sh},

            "up":    {color: TileColor.W, piece: U, pieceType: PieceType.Center, origin: CenterTile.U},
            "left":  {color: TileColor.O, piece: L, pieceType: PieceType.Center, origin: CenterTile.L},
            "front": {color: TileColor.G, piece: F, pieceType: PieceType.Center, origin: CenterTile.F},
            "right": {color: TileColor.R, piece: R, pieceType: PieceType.Center, origin: CenterTile.R},
            "back":  {color: TileColor.B, piece: B, pieceType: PieceType.Center, origin: CenterTile.B},
            "down":  {color: TileColor.Y, piece: D, pieceType: PieceType.Center, origin: CenterTile.D}
        };
    }



    /** 
     * function to create a group of all pieces that will move based on the turn data passed in
     * @param cubeMove the cube move data to be performed
     */
    public applyMove(cubeMove: CubeMove) {


        // create empty set to store all of the pieces that will be moved
        let piecesToMove: Set<THREE.Group> = new Set();

        // loop over every subarray of cube tile move data
        for (let group of cubeMove.moveType.move) {
            // loop over every cube tile in the move data
            for (let item of group) {
                // add the piece at the current tile to the set of pieces to move
                piecesToMove.add(this.position[item[0]].piece);
            }
        }

        // create new empty group to store all moving pieces, and add it to the current scene
        this.rotationGroup = new THREE.Group();
        this.scene.add(this.rotationGroup);

        // add all pieces to be moved to the rotation group
        for (let piece of [...piecesToMove]) this.rotationGroup.add(piece);
    }



    /**
     * function to move around the pieces in both memory and visually 
     * @param cubeMove the move to be performed
     * @param applyVisually optional parameter to tell the function whether or not to visually apply the move to the cube
     */
    protected permuteTiles(cubeMove: CubeMove, applyVisually: boolean = true) {

        // invert the move data if the move is supposed to be prime (counter-clockwise)
        cubeMove.moveType.move = (cubeMove.prime) ? prime(cubeMove.moveType.move) : cubeMove.moveType.move;

        // loop over every array of pieces in the piece move data
        for (let moveGroup of cubeMove.moveType.move) {

            // create variable for the current buffer piece
            let buffer: CubeTile[] = [];

            // create buffer for the memory references to the current buffer piece
            let prev: (CornerTile | EdgeTile | CenterTile)[] = [];

            // add loop over the first subarray of tile move data
            for (let ref of moveGroup[0]) {

                // add data to the piece buffer
                buffer.push(this.position[ref]);

                // add data to the piece reference buffer
                prev.push(ref);
            }

            // create variable to act as a buffer for the coordinates of the current piece
            let coordBuffer: XYZ = new XYZ(buffer[0].piece.position.x, buffer[0].piece.position.y, buffer[0].piece.position.z);

            // check if the move should be applied visually, and rotate buffer piece if so
            if (applyVisually) {
                buffer[0].piece.rotateOnWorldAxis(new THREE.Vector3((cubeMove.prime ? -1 : 1), 0, 0), cubeMove.moveType.axis.x);
                buffer[0].piece.rotateOnWorldAxis(new THREE.Vector3(0, (cubeMove.prime ? -1 : 1), 0), cubeMove.moveType.axis.y);
                buffer[0].piece.rotateOnWorldAxis(new THREE.Vector3(0, 0, (cubeMove.prime ? -1 : 1)), cubeMove.moveType.axis.z);
            }

            // loop over every piece in the current move data by index
            for (let i = 1; i < moveGroup.length; i++) {

                // check if the move should be applied visually, and rotate current piece if so
                if (applyVisually) {
                    this.position[moveGroup[i][0]].piece.rotateOnWorldAxis(new THREE.Vector3((cubeMove.prime ? -1 : 1), 0, 0), cubeMove.moveType.axis.x);
                    this.position[moveGroup[i][0]].piece.rotateOnWorldAxis(new THREE.Vector3(0, (cubeMove.prime ? -1 : 1), 0), cubeMove.moveType.axis.y);
                    this.position[moveGroup[i][0]].piece.rotateOnWorldAxis(new THREE.Vector3(0, 0, (cubeMove.prime ? -1 : 1)), cubeMove.moveType.axis.z);
                }

                // loop over very tile in the current piece move data
                for (let j = 0; j < moveGroup[i].length; j++) {
                    // swap buffer and current piece in memory
                    this.position[prev[j]] = this.position[moveGroup[i][j]];
                    this.position[moveGroup[i][j]] = buffer[j];
                } 

                // check if the move should be applied visually, and move current piece if so
                if (applyVisually) {
                    this.position[moveGroup[i][0]].piece.position.set(
                        this.position[prev[0]].piece.position.x, 
                        this.position[prev[0]].piece.position.y, 
                        this.position[prev[0]].piece.position.z
                    );
                }

                // check if the move should be applied visually, and move buffer piece if so
                this.position[prev[0]].piece.position.set(coordBuffer.x, coordBuffer.y, coordBuffer.z);

                // update coordinate buffer to be the current piece
                coordBuffer = new XYZ(
                    this.position[moveGroup[i][0]].piece.position.x, 
                    this.position[moveGroup[i][0]].piece.position.y, 
                    this.position[moveGroup[i][0]].piece.position.z
                );

                // loop over every tile in the current piece move data by index
                for (let j = 0; j < moveGroup[i].length; j++) {

                    // update buffer reference data
                    prev[j] = moveGroup[i][j];
                    
                    // update buffer piece data
                    buffer[j] = this.position[prev[j]];
                }
            }
        }
    }
}



function main() {

    let test: Cube = new Cube();

    test.generateScene();

    test.moveQueue.enqueue({moveType: Move.U, count: 2, prime: false, speed: 0.01});

    test.moveQueue.enqueue({moveType: Move.wait, count: 100, prime: false, speed: 1});

    test.moveQueue.enqueue({moveType: Move.U, count: 2, prime: false, speed: 0.01});
}

main();