import * as THREE from 'three';
import { constructCorner, constructEdge, constructCenter } from "./pieceConstructor.js";






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

    const colorWhite  = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    const colorOrange = new THREE.MeshBasicMaterial({ color: 0xff5f1f, side: THREE.DoubleSide });
    const colorGreen  = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
    const colorRed    = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide });
    const colorBlue   = new THREE.MeshBasicMaterial({ color: 0x0000ff, side: THREE.DoubleSide });
    const colorYellow = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
    const colorGray   = new THREE.MeshBasicMaterial({ color: 0xd3d3d3, side: THREE.DoubleSide });

    const pieceSize = 5;
    const pieceGap = 0.1;
    const pieceOffset = pieceSize + pieceGap;

    const cornerPiece = constructCorner(pieceSize, colorWhite, colorGreen, colorRed, colorGray, false); // COMMENT EVERYTHING IN THIS FUNCTION ONCE IT IS COMPLETE
    cornerPiece.translateX(pieceOffset);
    cornerPiece.translateY(pieceOffset);
    cornerPiece.translateZ(pieceOffset);
    
    const edgePiece = constructEdge(pieceSize, colorWhite, colorGreen, colorGray, false);
    edgePiece.translateY(pieceOffset);
    edgePiece.translateZ(pieceOffset);

    const centerPiece = constructCenter(pieceSize, colorWhite, colorGray, false);
    centerPiece.translateY(pieceOffset);

    let mainGroup = new THREE.Group()

    mainGroup.add(cornerPiece, edgePiece, centerPiece);

    // scene.add(cornerPiece);
    // scene.add(edgePiece);
    // scene.add(centerPiece);
    scene.add(mainGroup);

    // for generating the full cube, associate a directional offset with each colour.

    document.querySelector('#canvas-wrapper').addEventListener("mousemove", function(e) {

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

main();