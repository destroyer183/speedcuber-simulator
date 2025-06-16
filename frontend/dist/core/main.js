import * as THREE from "three";
import { TileColor, PieceType, XYZ } from "./dataTypes";
import { white, orange, green, red, blue, yellow } from "./dataTypes";
import { constructCorner, constructEdge, constructCenter } from "./pieceConstructor";
import { prime } from "./cubeMoveData";
import * as Move from "./cubeMoveType";
// import { MoveNotation } from "./cubeMoveType";
import { Queue } from "./queue";
/** Singleton class to represent a 3x3 rubiks cube and all related functionality. */
export class Cube {
    /** @constructor main constructor for the 'Cube' class. */
    constructor() {
        /** protected queue to store every move that needs to be performed on the cube */
        this._moveQueue = new Queue();
        /** protected boolean to represent whether or not a turn is currently being performed on the cube. */
        this._turnActive = false;
        /** protected number to act as a counter for time where no turn is performed */
        this._waitCounter = 0;
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
    get rotationGroup() {
        return this._rotationGroup;
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
    get waitCounter() {
        return this._waitCounter;
    }
    get scene() {
        return this._scene;
    }
    set position(val) {
        this._position = val;
    }
    set rotationGroup(val) {
        this._rotationGroup = val;
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
    set waitCounter(val) {
        this._waitCounter = val;
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
        // create variable to control the zoom factor
        const zoom = 40;
        // move the camera away from the origin in the Z direction
        camera.translateZ(zoom);
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
    renderCube() {
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
            this.currTurn = this.moveQueue.dequeue();
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
            if (Math.max(this.currTurn.moveType.axis.x, this.currTurn.moveType.axis.y, this.currTurn.moveType.axis.z) !== 0)
                this.currTurn.speed *= -1;
            // check if the current turn is a prime turn or not (is it counter-clockwise), and invert turn speed if it is
            if (!this.currTurn.prime)
                this.currTurn.speed *= -1;
            // set the turn limit to the axis limits for the type of turn, multiplied by the count of how many times this move should be performed
            this.turnLimit = new XYZ(this.currTurn.moveType.axis.x * this.currTurn.speed / Math.abs(this.currTurn.speed), this.currTurn.moveType.axis.y * this.currTurn.speed / Math.abs(this.currTurn.speed), this.currTurn.moveType.axis.z * this.currTurn.speed / Math.abs(this.currTurn.speed));
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
                for (let piece of [...this.rotationGroup.children])
                    this.scene.add(piece);
                // properly move the pieces around in both memory and visually after the turn is completed
                for (let i = 0; i < this.currTurn.count; i++)
                    this.permuteTiles(this.currTurn);
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
        this.scene.add(AQ, BM, CI, DE, LF, JP, RH, TN, UK, VO, WS, ShG, AER, BNQ, CJM, DFI, ULG, VPK, WTO, ShHS, U, L, F, R, B, D);
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
        cubeMove.moveType.move = (cubeMove.prime) ? prime(cubeMove.moveType.move) : cubeMove.moveType.move;
        let piecesToMove = new Set();
        for (let group of cubeMove.moveType.move) {
            for (let item of group) {
                piecesToMove.add(this.position[item[0]].piece);
            }
        }
        this.rotationGroup = new THREE.Group();
        this.scene.add(this.rotationGroup);
        for (let piece of [...piecesToMove])
            this.rotationGroup.add(piece);
    }
    permuteTiles(cubeMove) {
        for (let moveGroup of cubeMove.moveType.move) {
            let buffer = [];
            let prev = [];
            for (let ref of moveGroup[0]) {
                buffer.push(this.position[ref]);
                prev.push(ref);
            }
            let coordBuffer = new XYZ(buffer[0].piece.position.x, buffer[0].piece.position.y, buffer[0].piece.position.z);
            // create variable to allow individual pieces to properly follow the correct rotation direction of a turn
            let dir = 1;
            // if (Math.max(this.currTurn.moveType.axis.x, this.currTurn.moveType.axis.y, this.currTurn.moveType.axis.z) !== 0) dir = -1;
            buffer[0].piece.rotateOnWorldAxis(new THREE.Vector3((cubeMove.prime ? -1 : 1) * dir, 0, 0), cubeMove.moveType.axis.x);
            buffer[0].piece.rotateOnWorldAxis(new THREE.Vector3(0, (cubeMove.prime ? -1 : 1) * dir, 0), cubeMove.moveType.axis.y);
            buffer[0].piece.rotateOnWorldAxis(new THREE.Vector3(0, 0, (cubeMove.prime ? -1 : 1) * dir), cubeMove.moveType.axis.z);
            for (let i = 1; i < moveGroup.length; i++) {
                this.position[moveGroup[i][0]].piece.rotateOnWorldAxis(new THREE.Vector3((cubeMove.prime ? -1 : 1) * dir, 0, 0), cubeMove.moveType.axis.x);
                this.position[moveGroup[i][0]].piece.rotateOnWorldAxis(new THREE.Vector3(0, (cubeMove.prime ? -1 : 1) * dir, 0), cubeMove.moveType.axis.y);
                this.position[moveGroup[i][0]].piece.rotateOnWorldAxis(new THREE.Vector3(0, 0, (cubeMove.prime ? -1 : 1) * dir), cubeMove.moveType.axis.z);
                for (let j = 0; j < moveGroup[i].length; j++) {
                    this.position[prev[j]] = this.position[moveGroup[i][j]];
                    this.position[moveGroup[i][j]] = buffer[j];
                }
                this.position[moveGroup[i][0]].piece.position.set(this.position[prev[0]].piece.position.x, this.position[prev[0]].piece.position.y, this.position[prev[0]].piece.position.z);
                this.position[prev[0]].piece.position.set(coordBuffer.x, coordBuffer.y, coordBuffer.z);
                coordBuffer = new XYZ(this.position[moveGroup[i][0]].piece.position.x, this.position[moveGroup[i][0]].piece.position.y, this.position[moveGroup[i][0]].piece.position.z);
                for (let j = 0; j < moveGroup[i].length; j++) {
                    prev[j] = moveGroup[i][j];
                    buffer[j] = this.position[prev[j]];
                }
            }
        }
    }
}
function main() {
    let test = new Cube();
    test.moveQueue.enqueue({ moveType: Move.U, count: 1, prime: false, speed: 0.01 });
    test.moveQueue.enqueue({ moveType: Move.wait, count: 100, prime: false, speed: 1 });
    test.moveQueue.enqueue({ moveType: Move.U, count: 1, prime: false, speed: 0.01 });
}
main();
//# sourceMappingURL=main.js.map