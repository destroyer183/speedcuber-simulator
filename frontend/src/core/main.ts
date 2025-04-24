

function rotate(newX: number, newY: number) {

    let x: number = newX;
    let y: number = newY;

    let cube: HTMLElement = <HTMLElement>document.getElementById('cube');

    cube.style.transform = "rotateX(" + x + "deg) rotateY(" + y + "deg)";
}

document.querySelector('#cube-container')!.addEventListener("mousemove", mouseOver, false);

function mouseOver(e: any){
    let x: number = e.pageX * 0.2;
    let y: number = e.pageY * 0.2;
    rotate(y, x);
}


start()


export function start() {
}