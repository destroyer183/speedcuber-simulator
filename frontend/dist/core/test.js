"use strict";
function createHoleGeometry(squareWidth, radius, segments) {
    const squareGeometry = new THREE.PlaneGeometry(squareWidth, squareWidth);
    const circleGeometry = new THREE.CircleGeometry(radius, segments);
    const holeGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array();
    const uvs = new Float32Array();
    // Square positions
    const squarePositions = squareGeometry.attributes.position.array;
    for (let i = 0; i < squarePositions.length; i += 3) {
        positions.push(squarePositions[i], squarePositions[i + 1], squarePositions[i + 2]);
    }
    // Circle positions
    const circlePositions = circleGeometry.attributes.position.array;
    for (let i = 0; i < circlePositions.length; i += 3) {
        positions.push(circlePositions[i], circlePositions[i + 1], circlePositions[i + 2]);
    }
    holeGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    // Uvs
    const squareUvs = squareGeometry.attributes.uv.array;
    for (let i = 0; i < squareUvs.length; i++) {
        uvs.push(squareUvs[i]);
    }
    const circleUvs = circleGeometry.attributes.uv.array;
    for (let i = 0; i < circleUvs.length; i++) {
        uvs.push(circleUvs[i]);
    }
    holeGeometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    // Create faces
    const squareIndices = squareGeometry.index.array;
    const circleIndices = circleGeometry.index.array;
    const indices = new Uint16Array();
    // Add square faces
    for (let i = 0; i < squareIndices.length; i++) {
        indices.push(squareIndices[i]);
    }
    // Add circle faces (offset by number of square vertices)
    for (let i = 0; i < circleIndices.length; i++) {
        indices.push(squareIndices.length + circleIndices[i]);
    }
    holeGeometry.setIndex(new THREE.BufferAttribute(indices, 1));
    return holeGeometry;
}
function createHoleMesh(squareWidth, radius, segments, material) {
    const holeGeometry = createHoleGeometry(squareWidth, radius, segments);
    return new THREE.Mesh(holeGeometry, material);
}
// Example Usage:
const ;
this.scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// Create a material
const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    side: THREE.DoubleSide
});
// Create the square with a hole
const holeMesh = createHoleMesh(2, 0.5, 32, material); // squareWidth, radius, segments, material
this.scene.add(holeMesh);
// Set camera position
camera.position.z = 3;
// Render the scene
function animate() {
    requestAnimationFrame(animate);
    renderer.render(this.scene, camera);
}
animate();
//# sourceMappingURL=test.js.map