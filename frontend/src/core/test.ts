

function rotate(newX: number, newY: number) {

    let x: number = newX;
    let y: number = newY;

    let cube: HTMLElement = <HTMLElement>document.getElementById('row');

    cube.style.transform = "rotateX(" + 0 + "deg) rotateY(" + y + "deg)";
}

// document.querySelector('#cube-container')!.addEventListener("mousemove", mouseOver, false);

// adjust how things work so that you can click and rotate the cube with right click

function mouseOver(e: any){
    let x: number = e.pageX * 0.2 + window.screen.height / 2;
    let y: number = e.pageY * 0.2 + window.screen.width / 2;
    rotate(y, x);
}


function testRotate() {

    let cube: HTMLElement = <HTMLElement>document.getElementById("cube");

    let children: HTMLElement[] = Array.from(cube.querySelectorAll(".white"));

    let newLayer: HTMLElement = document.createElement("div");

    children.push(<HTMLElement>cube.querySelector(".E.corner"));

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