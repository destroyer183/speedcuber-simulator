import * as THREE from "three";
import { EdgeTile, CornerTile, CenterTile, TileColor, CubeTile } from "./cubeData";
import { ColorType, white, orange, green, red, blue, yellow, gray } from "./cubeData";
import { pieceSize, pieceOffset } from "./cubeData";
import { constructCorner, constructEdge, constructCenter } from "./pieceConstructor.js";



export class Cube {
    
    protected position: Record<EdgeTile | CornerTile | CenterTile, CubeTile>;
    protected cubeGroup: THREE.Group = new THREE.Group();



    public generateCube() {

        
        const AER: THREE.Group = constructCorner(white, blue, orange);
        const BNQ: THREE.Group = constructCorner(white, red, blue);
        const CJM: THREE.Group = constructCorner(white, green, red);


        const BQ: THREE.Group = constructEdge(white, blue);


    }
}



function main() {

    const WIDTH = window.innerWidth;
    const HEIGHT = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.domElement.setAttribute("id", "canvas-wrapper")
    renderer.setSize(WIDTH, HEIGHT);
    document.body.appendChild(renderer.domElement);

    renderer.setClearColor(0x696969);

    const scene = new THREE.Scene();


    const camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT);
    camera.position.z = 20;
    scene.add(camera);

    const pieceSize = 5;
    const pieceGap = 0.1;
    const pieceOffset = pieceSize + pieceGap;



    const cornerPiece = constructCorner(white, orange, green); // COMMENT EVERYTHING IN THIS FUNCTION ONCE IT IS COMPLETE

    
    const edgePiece = constructEdge(white, green);


    const centerPiece = constructCenter(green);

    let mainGroup = new THREE.Group()

    mainGroup.add(cornerPiece, edgePiece, centerPiece);

    // scene.add(cornerPiece);
    // scene.add(edgePiece);
    // scene.add(centerPiece);
    scene.add(mainGroup);

    // for generating the full cube, associate a directional offset with each colour.

    document.querySelector('#canvas-wrapper')!.addEventListener("mousemove", function(e: any) {

        let x = (e.pageX * 0.01 + window.screen.height / 2);
        let y = (e.pageY * 0.01 + window.screen.width / 2);
        // cornerPiece.rotation.set(y, x, 0);
        // edgePiece.rotation.set(y, x, 0);
        // centerPiece.rotation.set(y, x, 0);
        mainGroup.rotation.set(y, x, 0);

    }, false); 

    function render() {
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
    render();
}


main()