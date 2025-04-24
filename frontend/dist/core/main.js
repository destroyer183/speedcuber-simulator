function rotate(newX, newY) {
    let x = newX;
    let y = newY;
    let cube = document.getElementById('cube');
    cube.style.transform = "rotateX(" + x + "deg) rotateY(" + y + "deg)";
}
document.querySelector('#cube-container').addEventListener("mousemove", mouseOver, false);
function mouseOver(e) {
    let x = e.pageX * 0.2;
    let y = e.pageY * 0.2;
    rotate(y, x);
}
start();
export function start() {
}
//# sourceMappingURL=main.js.map