import * as THREE from "three";
import { EdgeTile, CornerTile, CenterTile, TileColor, CubeTile, PieceType } from "./cubeData";
import { ColorType, white, orange, green, red, blue, yellow, gray } from "./cubeData";
import { constructCorner, constructEdge, constructCenter } from "./pieceConstructor";



export class Cube {
    
    protected position: Record<EdgeTile | CornerTile | CenterTile, CubeTile>;
    protected cubeGroup: THREE.Group = new THREE.Group();

    constructor() {
        this.generateScene();
    }

    public generateScene() {

        const WIDTH = window.innerWidth;
        const HEIGHT = window.innerHeight;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.domElement.setAttribute("id", "canvas-wrapper")
        renderer.setSize(WIDTH, HEIGHT);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.body.appendChild(renderer.domElement);

        renderer.setClearColor(0x696969);

        const scene = new THREE.Scene();


        const camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT);
        camera.position.z = 20;
        scene.add(camera);

        const light = new THREE.PointLight(0x404040); // soft white light
        light.position.set(0, 15, 0);
        light.castShadow = true;
        scene.add( light );

        light.shadow.mapSize.width = 512;
        light.shadow.mapSize.height = 512;
        light.shadow.camera.near = 0.5;
        light.shadow.camera.far = 500;

        
        this.generateCube();


        scene.add(this.cubeGroup);

        // for generating the full cube, associate a directional offset with each colour.

        let temp: Cube = this;

        document.querySelector('#canvas-wrapper')!.addEventListener("mousemove", function(e: any) {

            let x = (e.pageX * 0.01 + window.screen.height / 2);
            let y = (e.pageY * 0.01 + window.screen.width / 2);

            temp.cubeGroup.rotation.set(y, x, 0);

        }, false); 

        function render() {
            requestAnimationFrame(render);


            // temp.cubeGroup.rotation.y += 0.01;

            renderer.render(scene, camera);
        }
        render();
    }

    public generateCube() {
        
        const AER: THREE.Group = constructCorner(white, blue, orange);
        const BNQ: THREE.Group = constructCorner(white, red, blue);
        const CJM: THREE.Group = constructCorner(white, green, red);
        const DFI: THREE.Group = constructCorner(white, orange, green);

        const ULG:  THREE.Group = constructCorner(yellow, green, orange);
        const VPK:  THREE.Group = constructCorner(yellow, red, green);
        const WTO:  THREE.Group = constructCorner(yellow, blue, red);
        const ShHS: THREE.Group = constructCorner(yellow, orange, blue);


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

        const U: THREE.Group = constructCenter(white);
        const L: THREE.Group = constructCenter(orange);
        const F: THREE.Group = constructCenter(green);
        const R: THREE.Group = constructCenter(red);
        const B: THREE.Group = constructCenter(blue);
        const D: THREE.Group = constructCenter(yellow);

        this.cubeGroup.add(AQ, BM, CI, DE, LF, JP, RH, TN, UK, VO, WS, ShG, AER, BNQ, CJM, DFI, ULG, VPK, WTO, ShHS, U, L, F, R, B, D);

        this.position = {

            "a": {color: TileColor.W, piece: AER, pieceType: PieceType.Edge},
            "b": {color: TileColor.W, piece: BNQ, pieceType: PieceType.Edge},
            "c": {color: TileColor.W, piece: CJM, pieceType: PieceType.Edge},
            "d": {color: TileColor.W, piece: DFI, pieceType: PieceType.Edge},

            "e": {color: TileColor.O, piece: AER,  pieceType: PieceType.Edge},
            "f": {color: TileColor.O, piece: DFI,  pieceType: PieceType.Edge},
            "g": {color: TileColor.O, piece: ULG,  pieceType: PieceType.Edge},
            "h": {color: TileColor.O, piece: ShHS, pieceType: PieceType.Edge},

            "i": {color: TileColor.G, piece: DFI, pieceType: PieceType.Edge},
            "j": {color: TileColor.G, piece: CJM, pieceType: PieceType.Edge},
            "k": {color: TileColor.G, piece: VPK, pieceType: PieceType.Edge},
            "l": {color: TileColor.G, piece: ULG, pieceType: PieceType.Edge},

            "m": {color: TileColor.R, piece: CJM, pieceType: PieceType.Edge},
            "n": {color: TileColor.R, piece: BNQ, pieceType: PieceType.Edge},
            "o": {color: TileColor.R, piece: WTO, pieceType: PieceType.Edge},
            "p": {color: TileColor.R, piece: VPK, pieceType: PieceType.Edge},

            "q": {color: TileColor.B, piece: BNQ,  pieceType: PieceType.Edge},
            "r": {color: TileColor.B, piece: AER,  pieceType: PieceType.Edge},
            "s": {color: TileColor.B, piece: ShHS, pieceType: PieceType.Edge},
            "t": {color: TileColor.B, piece: WTO,  pieceType: PieceType.Edge},

            "u":  {color: TileColor.Y, piece: ULG,  pieceType: PieceType.Edge},
            "v":  {color: TileColor.Y, piece: VPK,  pieceType: PieceType.Edge},
            "w":  {color: TileColor.Y, piece: WTO,  pieceType: PieceType.Edge},
            "sh": {color: TileColor.Y, piece: ShHS, pieceType: PieceType.Edge},


            "A": {color: TileColor.W, piece: AQ, pieceType: PieceType.Corner},
            "B": {color: TileColor.W, piece: BM, pieceType: PieceType.Corner},
            "C": {color: TileColor.W, piece: CI, pieceType: PieceType.Corner},
            "D": {color: TileColor.W, piece: DE, pieceType: PieceType.Corner},

            "E": {color: TileColor.O, piece: DE,  pieceType: PieceType.Corner},
            "F": {color: TileColor.O, piece: LF,  pieceType: PieceType.Corner},
            "G": {color: TileColor.O, piece: ShG, pieceType: PieceType.Corner},
            "H": {color: TileColor.O, piece: RH,  pieceType: PieceType.Corner},
            
            "I": {color: TileColor.G, piece: CI, pieceType: PieceType.Corner},
            "J": {color: TileColor.G, piece: JP, pieceType: PieceType.Corner},
            "K": {color: TileColor.G, piece: UK, pieceType: PieceType.Corner},
            "L": {color: TileColor.G, piece: LF, pieceType: PieceType.Corner},

            "M": {color: TileColor.R, piece: BM, pieceType: PieceType.Corner},
            "N": {color: TileColor.R, piece: TN, pieceType: PieceType.Corner},
            "O": {color: TileColor.R, piece: VO, pieceType: PieceType.Corner},
            "P": {color: TileColor.R, piece: JP, pieceType: PieceType.Corner},

            "Q": {color: TileColor.B, piece: AQ, pieceType: PieceType.Corner},
            "R": {color: TileColor.B, piece: RH, pieceType: PieceType.Corner},
            "S": {color: TileColor.B, piece: WS, pieceType: PieceType.Corner},
            "T": {color: TileColor.B, piece: TN, pieceType: PieceType.Corner},

            "U":  {color: TileColor.Y, piece: UK,  pieceType: PieceType.Corner},
            "V":  {color: TileColor.Y, piece: VO,  pieceType: PieceType.Corner},
            "W":  {color: TileColor.Y, piece: WS,  pieceType: PieceType.Corner},
            "SH": {color: TileColor.Y, piece: ShG, pieceType: PieceType.Corner},

            "up":    {color: TileColor.W, piece: U, pieceType: PieceType.Center},
            "left":  {color: TileColor.O, piece: L, pieceType: PieceType.Center},
            "front": {color: TileColor.G, piece: F, pieceType: PieceType.Center},
            "right": {color: TileColor.R, piece: R, pieceType: PieceType.Center},
            "back":  {color: TileColor.B, piece: B, pieceType: PieceType.Center},
            "down":  {color: TileColor.Y, piece: D, pieceType: PieceType.Center}
        };
    }
}




function main() {

    let test: Cube = new Cube();

}

main();