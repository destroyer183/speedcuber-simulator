import * as THREE from 'three';
import { roundEdgedBox } from "./roundEdgeBox.js";


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





    let colors = [
        new THREE.MeshBasicMaterial({ color: 0xffffff }),
        new THREE.MeshBasicMaterial({ color: 0xff5f1f }),
        new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
        new THREE.MeshBasicMaterial({ color: 0xff0000 }),
        new THREE.MeshBasicMaterial({ color: 0x0000ff }),
        new THREE.MeshBasicMaterial({ color: 0xffff00 }),
        new THREE.MeshBasicMaterial({ color: 0x000000 }),
    ];

    const roundCube = roundEdgedBox(5, colors);

    // const roundCube = new THREE.Mesh(roundCubeGeometry, basicMaterial);

    // roundCube.rotation.set(0.4, 0.2, 0);

    scene.add(roundCube);

    document.querySelector('#canvas-wrapper').addEventListener("mousemove", function(e) {

        let x = (e.pageX * 0.01 + window.screen.height / 2);
        let y = (e.pageY * 0.01 + window.screen.width / 2);
        roundCube.rotation.set(y, x, 0)

    }, false);

    function render() {
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
    render();
}

main();