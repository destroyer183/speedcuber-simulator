import * as THREE from 'three';
import { constructCorner, constructEdge } from "./pieceConstructor.js";


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
    camera.position.z = 5;
    scene.add(camera);






    const colorWhite  = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    const colorOrange = new THREE.MeshBasicMaterial({ color: 0xff5f1f, side: THREE.DoubleSide });
    const colorGreen  = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
    const colorRed    = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide });
    const colorBlue   = new THREE.MeshBasicMaterial({ color: 0x0000ff, side: THREE.DoubleSide });
    const colorYellow = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
    const colorGray   = new THREE.MeshBasicMaterial({ color: 0xd3d3d3, side: THREE.DoubleSide });

    const cornerPiece = constructCorner(5, colorWhite, colorGreen, colorRed, colorGray); // COMMENT EVERYTHING IN THIS FUNCTION ONCE IT IS COMPLETE
    

    const edgePiece = constructEdge(5, colorWhite, colorGreen, colorGray);


    // const roundCube = new THREE.Mesh(roundCubeGeometry, basicMaterial);

    // roundCube.rotation.set(0.4, 0.2, 0);

    // scene.add(cornerPiece);
    scene.add(edgePiece);

    document.querySelector('#canvas-wrapper').addEventListener("mousemove", function(e) {

        let x = (e.pageX * 0.01 + window.screen.height / 2);
        let y = (e.pageY * 0.01 + window.screen.width / 2);
        cornerPiece.rotation.set(y, x, 0)
        edgePiece.rotation.set(y, x, 0)

    }, false);

    function render() {
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
    render();
}

main();