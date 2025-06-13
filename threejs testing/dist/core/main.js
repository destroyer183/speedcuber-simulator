import * as THREE from "three";
import { TileColor, PieceType, XYZ } from "./dataTypes";
import { white, orange, green, red, blue, yellow } from "./dataTypes";
import { constructCorner, constructEdge, constructCenter, constructOrigin } from "./pieceConstructor";
import * as MoveData from "./cubeMoveData";
import { prime } from "./cubeMoveData";
import * as Move from "./cubeMoveType";
import { MoveNotation } from "./cubeMoveType";
import { Queue } from "./queue";
/** Singleton class to represent a 3x3 rubiks cube and all related functionality. */
export class Cube {
    /** @constructor main constructor for the 'Cube' class. */
    constructor() {
        /** protected queue to store every move that needs to be performed on the cube */
        this._moveQueue = new Queue();
        /** protected boolean to represent whether or not a turn is currently being performed on the cube. */
        this._turnActive = false;
        if (Cube.instance !== undefined)
            throw new Error("Error! can't create more than one instance of a singleton class!");
        Cube._instance = this;
        this.generateScene();
    }
    static get instance() {
        return Cube._instance;
    }
    get position() {
        return this._position;
    }
    get origin() {
        return this._origin;
    }
    get moveQueue() {
        return this._moveQueue;
    }
    get currTurn() {
        return this._currTurn;
    }
    get turnLimit() {
        return this._turnLimit;
    }
    get turnData() {
        return this._turnData;
    }
    get turnActive() {
        return this._turnActive;
    }
    get scene() {
        return this._scene;
    }
    set position(val) {
        this._position = val;
    }
    set origin(val) {
        this._origin = val;
    }
    set moveQueue(val) {
        this._moveQueue = val;
    }
    set currTurn(val) {
        this._currTurn = val;
    }
    set turnLimit(val) {
        this._turnLimit = val;
    }
    set turnData(val) {
        this._turnData = val;
    }
    set turnActive(val) {
        this._turnActive = val;
    }
    /** Protected function to generate the threejs scene */
    generateScene() {
        // get window sizing
        const WIDTH = window.innerWidth;
        const HEIGHT = window.innerHeight;
        // create the rendering element and add it to the html
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.domElement.setAttribute("id", "canvas-wrapper");
        renderer.setSize(WIDTH, HEIGHT);
        document.body.appendChild(renderer.domElement);
        // set the background color of the renderer
        renderer.setClearColor(0x696969);
        // create rendering scene
        this._scene = new THREE.Scene();
        // create camera for the scene
        const camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT);
        // move the camera away from the origin in the Z direction
        camera.translateZ(25);
        // add the camera to the scene
        this.scene.add(camera);
        // call function to generate the 3x3 cube
        this.generateCube();
        // create function to orbit the camera around the cube, and bind it to trigger whenever the user moves their mouse
        document.querySelector('#canvas-wrapper').addEventListener("mousemove", function (e) {
            // get x and y coordinates of the mouse relative to the center of the screen, and scale the values down by a factor of 100
            let x = (e.pageX - window.innerWidth / 2) * -0.01;
            let y = (e.pageY - window.innerHeight / 2) * 0.01;
            // limit the y value to be within pi/2 to prevent odd camera behaviour
            if (y > Math.PI / 2)
                y = Math.PI / 2;
            if (y < -Math.PI / 2)
                y = -Math.PI / 2;
            // set camera position based on the x and y coordinates of the mouse
            camera.position.x = Math.sin(x) * Math.cos(y) * 25;
            camera.position.y = Math.sin(y) * 25;
            camera.position.z = Math.cos(x) * Math.cos(y) * 25;
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
    renderCube() {
        // shorten variable name to prevent lines of code from going off-screen
        // let this: Cube = Cube.instance;
        // check if a turn is currently being performed or if there are any turns currently in the queue
        if (!this.turnActive && this.moveQueue.size()) {
            // update variable to show that a turn is currently being performed
            this.turnActive = true;
            // get the next turn in the queue
            this.currTurn = this.moveQueue.dequeue();
            // call function to properly apply the current move to the cube's variable data
            this.applyMove(this.currTurn);
            // check if the current turn is a prime turn or not (is it counter-clockwise)
            if (!this.currTurn.prime) {
                // invert turn speed and turn count
                this.currTurn.speed *= -1;
                this.currTurn.count *= -1;
            }
            // set the turn limit to the axis limits for the type of turn, multiplied by the count of how many times this move should be performed
            this.turnLimit = new XYZ(this.currTurn.moveType.axis.x * this.currTurn.count, this.currTurn.moveType.axis.y * this.currTurn.count, this.currTurn.moveType.axis.z * this.currTurn.count);
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
            this.origin.rotation.set(this.turnData.x, this.turnData.y, this.turnData.z);
            // check if all rotation factors have reached their maximum value
            if (this.turnData.x === this.turnLimit.x && this.turnData.y === this.turnLimit.y && this.turnData.z === this.turnLimit.z) {
                // update variable to show that the turn is no longer active
                this.turnActive = false;
                // add pieces attached to the origin piece back to the main scene
                // for (let piece of [...this.origin.children]) this.scene.add(piece);
                for (let piece of this.origin.children)
                    scene.add(piece);
                // clear children attached to the origin piece
                this.origin.clear();
            }
        }
    }
    generateCube() {
        const AER = constructCorner(white, blue, orange);
        const BNQ = constructCorner(white, red, blue);
        const CJM = constructCorner(white, green, red);
        const DFI = constructCorner(white, orange, green);
        const ULG = constructCorner(yellow, green, orange);
        const VPK = constructCorner(yellow, red, green);
        const WTO = constructCorner(yellow, blue, red);
        const ShHS = constructCorner(yellow, orange, blue);
        const AQ = constructEdge(white, blue);
        const BM = constructEdge(white, red);
        const CI = constructEdge(white, green);
        const DE = constructEdge(white, orange);
        const LF = constructEdge(green, orange);
        const JP = constructEdge(green, red);
        const RH = constructEdge(blue, orange);
        const TN = constructEdge(blue, red);
        const UK = constructEdge(yellow, green);
        const VO = constructEdge(yellow, red);
        const WS = constructEdge(yellow, blue);
        const ShG = constructEdge(yellow, orange);
        const U = constructCenter(white);
        const L = constructCenter(orange);
        const F = constructCenter(green);
        const R = constructCenter(red);
        const B = constructCenter(blue);
        const D = constructCenter(yellow);
        this.origin = constructOrigin();
        this.scene.add(AQ, BM, CI, DE, LF, JP, RH, TN, UK, VO, WS, ShG, AER, BNQ, CJM, DFI, ULG, VPK, WTO, ShHS, U, L, F, R, B, D, this.origin);
        this.position = {
            "a": { color: TileColor.W, piece: AER, pieceType: PieceType.Corner },
            "b": { color: TileColor.W, piece: BNQ, pieceType: PieceType.Corner },
            "c": { color: TileColor.W, piece: CJM, pieceType: PieceType.Corner },
            "d": { color: TileColor.W, piece: DFI, pieceType: PieceType.Corner },
            "e": { color: TileColor.O, piece: AER, pieceType: PieceType.Corner },
            "f": { color: TileColor.O, piece: DFI, pieceType: PieceType.Corner },
            "g": { color: TileColor.O, piece: ULG, pieceType: PieceType.Corner },
            "h": { color: TileColor.O, piece: ShHS, pieceType: PieceType.Corner },
            "i": { color: TileColor.G, piece: DFI, pieceType: PieceType.Corner },
            "j": { color: TileColor.G, piece: CJM, pieceType: PieceType.Corner },
            "k": { color: TileColor.G, piece: VPK, pieceType: PieceType.Corner },
            "l": { color: TileColor.G, piece: ULG, pieceType: PieceType.Corner },
            "m": { color: TileColor.R, piece: CJM, pieceType: PieceType.Corner },
            "n": { color: TileColor.R, piece: BNQ, pieceType: PieceType.Corner },
            "o": { color: TileColor.R, piece: WTO, pieceType: PieceType.Corner },
            "p": { color: TileColor.R, piece: VPK, pieceType: PieceType.Corner },
            "q": { color: TileColor.B, piece: BNQ, pieceType: PieceType.Corner },
            "r": { color: TileColor.B, piece: AER, pieceType: PieceType.Corner },
            "s": { color: TileColor.B, piece: ShHS, pieceType: PieceType.Corner },
            "t": { color: TileColor.B, piece: WTO, pieceType: PieceType.Corner },
            "u": { color: TileColor.Y, piece: ULG, pieceType: PieceType.Corner },
            "v": { color: TileColor.Y, piece: VPK, pieceType: PieceType.Corner },
            "w": { color: TileColor.Y, piece: WTO, pieceType: PieceType.Corner },
            "sh": { color: TileColor.Y, piece: ShHS, pieceType: PieceType.Corner },
            "A": { color: TileColor.W, piece: AQ, pieceType: PieceType.Edge },
            "B": { color: TileColor.W, piece: BM, pieceType: PieceType.Edge },
            "C": { color: TileColor.W, piece: CI, pieceType: PieceType.Edge },
            "D": { color: TileColor.W, piece: DE, pieceType: PieceType.Edge },
            "E": { color: TileColor.O, piece: DE, pieceType: PieceType.Edge },
            "F": { color: TileColor.O, piece: LF, pieceType: PieceType.Edge },
            "G": { color: TileColor.O, piece: ShG, pieceType: PieceType.Edge },
            "H": { color: TileColor.O, piece: RH, pieceType: PieceType.Edge },
            "I": { color: TileColor.G, piece: CI, pieceType: PieceType.Edge },
            "J": { color: TileColor.G, piece: JP, pieceType: PieceType.Edge },
            "K": { color: TileColor.G, piece: UK, pieceType: PieceType.Edge },
            "L": { color: TileColor.G, piece: LF, pieceType: PieceType.Edge },
            "M": { color: TileColor.R, piece: BM, pieceType: PieceType.Edge },
            "N": { color: TileColor.R, piece: TN, pieceType: PieceType.Edge },
            "O": { color: TileColor.R, piece: VO, pieceType: PieceType.Edge },
            "P": { color: TileColor.R, piece: JP, pieceType: PieceType.Edge },
            "Q": { color: TileColor.B, piece: AQ, pieceType: PieceType.Edge },
            "R": { color: TileColor.B, piece: RH, pieceType: PieceType.Edge },
            "S": { color: TileColor.B, piece: WS, pieceType: PieceType.Edge },
            "T": { color: TileColor.B, piece: TN, pieceType: PieceType.Edge },
            "U": { color: TileColor.Y, piece: UK, pieceType: PieceType.Edge },
            "V": { color: TileColor.Y, piece: VO, pieceType: PieceType.Edge },
            "W": { color: TileColor.Y, piece: WS, pieceType: PieceType.Edge },
            "SH": { color: TileColor.Y, piece: ShG, pieceType: PieceType.Edge },
            "up": { color: TileColor.W, piece: U, pieceType: PieceType.Center },
            "left": { color: TileColor.O, piece: L, pieceType: PieceType.Center },
            "front": { color: TileColor.G, piece: F, pieceType: PieceType.Center },
            "right": { color: TileColor.R, piece: R, pieceType: PieceType.Center },
            "back": { color: TileColor.B, piece: B, pieceType: PieceType.Center },
            "down": { color: TileColor.Y, piece: D, pieceType: PieceType.Center }
        };
    }
    applyMove(cubeMove) {
        let moveData = [];
        switch (cubeMove.moveType.move) {
            case MoveNotation.U:
                moveData = (cubeMove.prime) ? prime(MoveData.U) : MoveData.U;
                break;
            case MoveNotation.L:
                moveData = (cubeMove.prime) ? prime(MoveData.L) : MoveData.L;
                break;
            case MoveNotation.F:
                moveData = (cubeMove.prime) ? prime(MoveData.F) : MoveData.F;
                break;
            case MoveNotation.R:
                moveData = (cubeMove.prime) ? prime(MoveData.R) : MoveData.R;
                break;
            case MoveNotation.B:
                moveData = (cubeMove.prime) ? prime(MoveData.B) : MoveData.B;
                break;
            case MoveNotation.D:
                moveData = (cubeMove.prime) ? prime(MoveData.D) : MoveData.D;
                break;
            case MoveNotation.u:
                moveData = (cubeMove.prime) ? prime(MoveData.u) : MoveData.u;
                break;
            case MoveNotation.l:
                moveData = (cubeMove.prime) ? prime(MoveData.l) : MoveData.l;
                break;
            case MoveNotation.f:
                moveData = (cubeMove.prime) ? prime(MoveData.f) : MoveData.f;
                break;
            case MoveNotation.r:
                moveData = (cubeMove.prime) ? prime(MoveData.r) : MoveData.r;
                break;
            case MoveNotation.b:
                moveData = (cubeMove.prime) ? prime(MoveData.b) : MoveData.b;
                break;
            case MoveNotation.d:
                moveData = (cubeMove.prime) ? prime(MoveData.d) : MoveData.d;
                break;
            case MoveNotation.x:
                moveData = (cubeMove.prime) ? prime(MoveData.x) : MoveData.x;
                break;
            case MoveNotation.y:
                moveData = (cubeMove.prime) ? prime(MoveData.y) : MoveData.y;
                break;
            case MoveNotation.z:
                moveData = (cubeMove.prime) ? prime(MoveData.z) : MoveData.z;
                break;
            case MoveNotation.M:
                moveData = (cubeMove.prime) ? prime(MoveData.M) : MoveData.M;
                break;
            case MoveNotation.E:
                moveData = (cubeMove.prime) ? prime(MoveData.E) : MoveData.E;
                break;
            case MoveNotation.S:
                moveData = (cubeMove.prime) ? prime(MoveData.S) : MoveData.S;
                break;
        }
        let piecesToMove = new Set();
        for (let group of moveData) {
            for (let item of group) {
                piecesToMove.add(this.position[item].piece);
            }
        }
        for (let piece of [...piecesToMove])
            this.origin.attach(piece);
        for (let i = 0; i < cubeMove.count; i++)
            this.permuteTiles(moveData);
    }
    permuteTiles(moveData) {
        for (let moveGroup of moveData) {
            let buffer = this.position[moveGroup[0]];
            let prev = moveGroup[0];
            for (let i = 1; i < moveGroup.length; i++) {
                this.position[prev] = this.position[moveGroup[i]];
                this.position[moveGroup[i]] = buffer;
                buffer = this.position[prev];
                prev = moveGroup[i];
            }
        }
    }
}
function main() {
    let test = new Cube();
    test.moveQueue.enqueue({ moveType: Move.R, count: 1, prime: false, speed: 0.02 });
    // test.moveQueue.enqueue({moveType: Move.U, count: 1, prime: false, speed: 0.02});
    // test.moveQueue.enqueue({moveType: Move.R, count: 1, prime: true,  speed: 0.02});
    // test.moveQueue.enqueue({moveType: Move.U, count: 1, prime: true,  speed: 0.02});
}
main();
//# sourceMappingURL=main.js.map