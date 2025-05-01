function rotate(newX, newY) {
    let x = newX;
    let y = newY;
    let cube = document.getElementById('row');
    cube.style.transform = "rotateX(" + 0 + "deg) rotateY(" + y + "deg)";
}
// document.querySelector('#cube-container')!.addEventListener("mousemove", mouseOver, false);
// adjust how things work so that you can click and rotate the cube with right click
function mouseOver(e) {
    let x = e.pageX * 0.2 + window.screen.height / 2;
    let y = e.pageY * 0.2 + window.screen.width / 2;
    rotate(y, x);
}
function testRotate() {
    let cube = document.getElementById("cube");
    let children = Array.from(cube.querySelectorAll(".white"));
    let newLayer = document.createElement("div");
    children.push(cube.querySelector(".E.corner"));
    console.log(children.length);
    newLayer.setAttribute("id", "row");
    for (let i = 0; i < children.length; i++) {
        console.log("yes");
        newLayer.appendChild(children[i]);
    }
    cube.appendChild(newLayer);
    newLayer.style.transform = "rotateX(" + 0 + "deg) rotateY(" + 90 + "deg)";
}
// testRotate();
start();
export function start() {
}
//# sourceMappingURL=test.js.map