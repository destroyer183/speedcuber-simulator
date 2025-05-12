import * as THREE from 'three';

const smoothness = 9;
const cylinderSegments = 1;
const radius = 0.2;

export function roundEdgedBox(size, colors) {

    let halfSize = size * 0.5 - radius;

    let group = new THREE.Group();

    const upColor = colors[0];
    const leftColor = colors[1];
    const frontColor = colors[2];
    const rightColor = colors[3];
    const backColor = colors[4];
    const downColor = colors[5];
    const trimColor = colors[6];
    const wireFrameGreen = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    const wireFrameRed   = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    const wireFrameWhite = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
    const wireFrameGray  = new THREE.MeshBasicMaterial({ color: 0xd3d3d3, wireframe: true });
    const colorGray  = new THREE.MeshBasicMaterial({ color: 0xd3d3d3, side: THREE.DoubleSide });
    const colorWhite = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const colorRed   = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const colorGreen = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

    // corners - 8 eighths of a sphere

    let corner11 = new THREE.SphereGeometry(radius, smoothness, smoothness * 2, Math.PI * 3/4, Math.PI * 1/4, Math.PI * 0, Math.PI * 1/2);
    corner11.rotateZ(Math.PI * 1/2);
    corner11.translate(-halfSize, halfSize, halfSize);

    let corner12 = new THREE.SphereGeometry(radius, smoothness, smoothness * 2, Math.PI * 1/2, Math.PI * 1/4, Math.PI * 0, Math.PI * 1/2);
    corner12.rotateZ(Math.PI * 1/2);
    corner12.translate(-halfSize, halfSize, halfSize);



    let corner21 = new THREE.SphereGeometry(radius, smoothness, smoothness, -Math.PI * 1/6, Math.PI * 2/3, Math.PI * 0, Math.PI * 1/3);
    corner21.rotateX(Math.PI * 11/36);
    corner21.rotateY(Math.PI * 9/36);
    corner21.translate(halfSize, halfSize, halfSize);

    let corner22 = new THREE.SphereGeometry(radius, smoothness, smoothness, Math.PI * 1/2, Math.PI * 2/3, Math.PI * 0, Math.PI * 1/3);
    corner22.rotateX(Math.PI * 11/36);
    corner22.rotateY(Math.PI * 9/36);
    corner22.translate(halfSize, halfSize, halfSize);

    let corner23 = new THREE.SphereGeometry(radius, smoothness, smoothness, Math.PI * 7/6, Math.PI * 2/3, Math.PI * 0, Math.PI * 1/3);
    corner23.rotateX(Math.PI * 11/36);
    corner23.rotateY(Math.PI * 9/36);
    corner23.translate(halfSize, halfSize, halfSize);



    let corner31 = new THREE.SphereGeometry(radius, smoothness, smoothness * 2, -Math.PI * 3/4, Math.PI * 1/4, Math.PI * 0, Math.PI * 1/2);
    corner31.rotateX(Math.PI * 1);
    corner31.translate(halfSize, -halfSize, halfSize);

    let corner32 = new THREE.SphereGeometry(radius, smoothness, smoothness * 2, -Math.PI * 1, Math.PI * 1/4, Math.PI * 0, Math.PI * 1/2);
    corner32.rotateX(Math.PI * 1);
    corner32.translate(halfSize, -halfSize, halfSize);



    let corner4 = new THREE.SphereGeometry(radius, smoothness * 2, smoothness * 2, Math.PI * 0, Math.PI * 1/2, Math.PI * 0, Math.PI * 1/2);
    corner4.rotateX(Math.PI * 1/2);
    corner4.translate(-halfSize, -halfSize, halfSize);



    let corner5 = new THREE.SphereGeometry(radius, smoothness * 2, smoothness * 2, -Math.PI * 1/2, Math.PI * 1/2, Math.PI * 0, Math.PI * 1/2);
    corner5.translate(-halfSize, halfSize, -halfSize);



    let corner61 = new THREE.SphereGeometry(radius, smoothness, smoothness * 2, Math.PI * 1/2, Math.PI * 1/4, Math.PI * 0, Math.PI * 1/2);
    corner61.rotateX(-Math.PI * 1/2);
    corner61.translate(halfSize, halfSize, -halfSize);

    let corner62 = new THREE.SphereGeometry(radius, smoothness, smoothness * 2, Math.PI * 3/4, Math.PI * 1/4, Math.PI * 0, Math.PI * 1/2);
    corner62.rotateX(-Math.PI * 1/2);
    corner62.translate(halfSize, halfSize, -halfSize);



    let corner7 = new THREE.SphereGeometry(radius, smoothness * 2, smoothness * 2, Math.PI * 1, Math.PI * 1/2, Math.PI * 0, Math.PI * 1/2);
    corner7.rotateZ(-Math.PI * 1/2);
    corner7.translate(halfSize, -halfSize, -halfSize);



    group.add(new THREE.Mesh(corner11, wireFrameWhite));
    group.add(new THREE.Mesh(corner12, wireFrameGreen));

    group.add(new THREE.Mesh(corner21, wireFrameGreen)); 
    group.add(new THREE.Mesh(corner22, wireFrameRed));
    group.add(new THREE.Mesh(corner23, wireFrameWhite)); 

    group.add(new THREE.Mesh(corner31, wireFrameGreen));
    group.add(new THREE.Mesh(corner32, wireFrameRed));

    group.add(new THREE.Mesh(corner4, wireFrameGreen));
    group.add(new THREE.Mesh(corner5, wireFrameWhite));
    
    group.add(new THREE.Mesh(corner61, wireFrameWhite));
    group.add(new THREE.Mesh(corner62, wireFrameRed));

    group.add(new THREE.Mesh(corner7, wireFrameRed));
    // edges



    let edge11 = new THREE.CylinderGeometry(radius, radius, size - radius * 2, smoothness * 2, cylinderSegments, true, Math.PI * 2/4, Math.PI * 1/2);
    edge11.rotateZ(Math.PI * 1/2);
    edge11.translate(0, halfSize, -halfSize);

    let edge12 = new THREE.CylinderGeometry(radius, radius, size - radius * 2, smoothness, cylinderSegments, true, Math.PI * 3/4, Math.PI * 1/4);
    edge12.rotateX(Math.PI * 1/2);
    edge12.translate(halfSize, halfSize, 0);

    let edge13 = new THREE.CylinderGeometry(radius, radius, size - radius * 2, smoothness, cylinderSegments, true, Math.PI * 1/4, Math.PI * 1/4);
    edge13.rotateZ(Math.PI * 1/2);
    edge13.translate(0, halfSize, halfSize);

    let edge14 = new THREE.CylinderGeometry(radius, radius, size - radius * 2, smoothness * 2, cylinderSegments, true, Math.PI * 1, Math.PI * 1/2);
    edge14.rotateX(Math.PI * 1/2);
    edge14.translate(-halfSize, halfSize, 0);



    let edge21 = new THREE.CylinderGeometry(radius, radius, size - radius * 2, smoothness, cylinderSegments, true, Math.PI * 0, Math.PI * 1/4);
    edge21.rotateZ(Math.PI * 1/2);
    edge21.translate(0, halfSize, halfSize);

    let edge22 = new THREE.CylinderGeometry(radius, radius, size - radius * 2, smoothness, cylinderSegments, true, Math.PI * 0, Math.PI * 1/4);
    edge22.translate(halfSize, 0, halfSize);

    let edge23 = new THREE.CylinderGeometry(radius, radius, size - radius * 2, smoothness * 2, cylinderSegments, true, Math.PI * 0, Math.PI * 1/2);
    edge23.rotateZ(-Math.PI * 1/2);
    edge23.translate(0, -halfSize, halfSize);

    let edge24 = new THREE.CylinderGeometry(radius, radius, size - radius * 2, smoothness * 2, cylinderSegments, true, Math.PI * 3/2, Math.PI * 1/2);
    edge24.translate(-halfSize, 0, halfSize);



    let edge31 = new THREE.CylinderGeometry(radius, radius, size - radius * 2, smoothness, cylinderSegments, true, Math.PI * 1/2, Math.PI * 1/4);
    edge31.rotateX(Math.PI * 1/2);
    edge31.translate(halfSize, halfSize, 0);
    
    let edge32 = new THREE.CylinderGeometry(radius, radius, size - radius * 2, smoothness * 2, cylinderSegments, true, Math.PI * 1/2, Math.PI * 1/2);
    edge32.translate(halfSize, 0, -halfSize);

    let edge33 = new THREE.CylinderGeometry(radius, radius, size - radius * 2, smoothness * 2, cylinderSegments, true, Math.PI * 0, Math.PI * 1/2);
    edge33.rotateX(Math.PI * 1/2);
    edge33.translate(halfSize, -halfSize, 0);

    let edge34 = new THREE.CylinderGeometry(radius, radius, size - radius * 2, smoothness, cylinderSegments, true, Math.PI * 1/4, Math.PI * 1/4);
    edge34.translate(halfSize, 0, halfSize);

    group.add(new THREE.Mesh(edge11, wireFrameWhite));
    group.add(new THREE.Mesh(edge12, wireFrameWhite));
    group.add(new THREE.Mesh(edge13, wireFrameWhite));
    group.add(new THREE.Mesh(edge14, wireFrameWhite));

    group.add(new THREE.Mesh(edge21, wireFrameGreen));
    group.add(new THREE.Mesh(edge22, wireFrameGreen));
    group.add(new THREE.Mesh(edge23, wireFrameGreen));
    group.add(new THREE.Mesh(edge24, wireFrameGreen));

    group.add(new THREE.Mesh(edge31, wireFrameRed));
    group.add(new THREE.Mesh(edge32, wireFrameRed));
    group.add(new THREE.Mesh(edge33, wireFrameRed));
    group.add(new THREE.Mesh(edge34, wireFrameRed));


    
    // sides
    // top
    let side1 = new THREE.PlaneGeometry(size - radius * 2, size - radius * 2, 4, 4);
    side1.rotateX(-Math.PI * 1/2);
    side1.translate(0, size * 1/2, 0);

    // front
    let side2 = new THREE.PlaneGeometry(size - radius * 2, size - radius * 2, 4, 4);
    side2.translate(0, 0, size * 1/2);

    // right
    let side3 = new THREE.PlaneGeometry(size - radius * 2, size - radius * 2, 4, 4);
    side3.rotateY(Math.PI * 1/2);
    side3.translate(size * 1/2, 0, 0);

    group.add(new THREE.Mesh(side1, wireFrameWhite));
    group.add(new THREE.Mesh(side2, wireFrameGreen));
    group.add(new THREE.Mesh(side3, wireFrameRed));



    let alpha = Math.atan((size)/Math.sqrt(2 * (size - radius * 1 - (radius * Math.sin(Math.PI/4)) * 2) ** 2));

    let newArcTop = Math.asin((size/2 - radius)/(size*2) + Math.sin(alpha)) - alpha;
    let newArcBottom = alpha - Math.asin(Math.sin(alpha) - 1/4);

    let horizontalArc = Math.acos((2 * ((size*2)*Math.cos(alpha - newArcBottom))**2 - 2 * (size - radius * 2)**2) / (2 * ((size*2)*Math.cos(alpha - newArcBottom))**2));
    let horizontalRot = Math.PI/4 - horizontalArc/2;

    let verticalArc = newArcTop + newArcBottom;

    // radius = (size*2)*sinx - (size*2)*sin(alpha - newArcBottom)
    // radius = (size*2)*(sinx - sin(alpha - newArcBottom))
    // radius/(size*2) = sinx - sin(alpha - newArcBottom)
    // sinx = radius/(size*2) + sin(alpha - newArcBottom)
    let segSize = Math.asin(radius/(size*2) + Math.sin(alpha - newArcBottom)) - (alpha - newArcBottom);

    verticalArc = segSize * (4.3);

    let verticalRot = Math.PI/2 - alpha - newArcTop;
    verticalRot = Math.PI/2 - (alpha - newArcBottom) - verticalArc;



    let cutoutRad = (size*2)*Math.cos(alpha - newArcBottom);

    let cutout = new THREE.CircleGeometry(cutoutRad, smoothness * 2, horizontalRot, horizontalArc);
    cutout.translate(halfSize - (cutoutRad * Math.cos(horizontalRot)), -halfSize * 1 - (cutoutRad * Math.sin(horizontalRot)), 0);

    let side4 = new THREE.BufferGeometry();

    let circleVertices = cutout.getAttribute("position");

    let vertices = [
        (size - radius * 2) / 2, (size - radius * 2) / 2, 0,
        // (size - radius * 2) / -2, (size - radius * 2) / 2, 0,
        (size - radius * 2) / 2, (size - radius * 2) / -2, 0
    ];
    let indices = [];

    for (let i = 2; i < circleVertices.count; i++) {

        let x = circleVertices.getX(i);
        let y = circleVertices.getY(i);
        let z = circleVertices.getZ(i);

        // console.log(x + ", " + y + ", " + z);

        vertices.push(x, y, z);
        indices.push(0, i - 1, i);
    }


    let positionAttribute = new THREE.Float32BufferAttribute(new Float32Array(vertices), 3);
    let indexAttribute = new THREE.Float32BufferAttribute(new Float32Array(indices), 3);
    side4.setAttribute("position", positionAttribute);
    side4.setIndex(indexAttribute);

    let side5 = side4.clone();
    let side6 = side4.clone();

    side4.rotateY(-Math.PI * 1/2)
    side4.translate(-halfSize - radius, 0, 0);

    side5.translate(0, 0, -halfSize - radius);

    side6.rotateX(Math.PI * 1/2);
    side6.translate(0, -halfSize - radius, 0);


    
    let backSphere1 = new THREE.SphereGeometry(size * 2, smoothness * 2, 5, Math.PI * 1/2 + horizontalRot, horizontalArc, verticalRot, verticalArc);

    backSphere1.translate(
        halfSize - (((size*2) * Math.cos(alpha - newArcBottom)) * Math.cos(horizontalRot)),
        -halfSize - ((size*2) * Math.sin(alpha - newArcBottom)) - radius,
        halfSize - (((size*2) * Math.cos(alpha - newArcBottom)) * Math.cos(horizontalRot)),
    );

    let backSphere2 = backSphere1.clone();
    let backSphere3 = backSphere1.clone();

    backSphere2.rotateY(-Math.PI/2);
    backSphere2.rotateZ(-Math.PI/2);

    
    // backSphere2.translate(-halfSize - radius * 0, -halfSize - radius * 1, -halfSize - radius * 0);
    // backSphere3.translate(-halfSize - radius * 1, -halfSize - radius * 0, -halfSize - radius * 1);

    let tempPoints = backSphere1.getAttribute("position");

    let pointObtained = false;

    let pointX;
    let pointY;
    let pointZ;

    for (let i = 0; i < tempPoints.count; i++) {

        let x = tempPoints.getX(i);
        let y = tempPoints.getY(i);
        let z = tempPoints.getZ(i);

        if (-2.2 > y && y > -2.4 && !pointObtained) {
            console.log(x + ", " + y + ", " + z);
            pointX = x;
            pointY = y;
            pointZ = z;
            pointObtained = true;
        }
    }



    let corner = new THREE.CircleGeometry(radius, smoothness * 2, Math.PI, Math.PI/2);
    corner.translate(-halfSize, -halfSize, halfSize);

    let cornerPiece1 = new THREE.BufferGeometry();

    let cornerPoints = corner.getAttribute("position");

    // let zOffset = (size*2)*Math.cos(alpha-newArcBottom) - (size*2)*Math.cos(segSize + (alpha-newArcBottom));


    // determine angle that gives proper y offest
    // use angle to determine z offset

    // let height = pointX + 2.5;

    // height = (size*2)*sinx - (size*2)*sin(alpha - newArcBottom)
    // height = (size*2)*(sinx - sin(alpha - newArcBottom))
    // height/(size*2) + sin(alpha - newArcBottom) = sinx

    // let angle = Math.asin(height/(size*2) + Math.sin(alpha - newArcBottom));
    // let zDiff = (size*2)*Math.cos(alpha - newArcBottom) - (size*2)*Math.cos(angle);
    
    let cornerVertices = [
        pointX, pointY, pointZ,
        size / -2, (size - radius * 2) / -2, (size - radius * 2) / 2
    ];

    let cornerIndices = [];


    for (let i = 2; i < cornerPoints.count; i++) {

        let x = cornerPoints.getX(i);
        let y = cornerPoints.getY(i);
        let z = cornerPoints.getZ(i);

        // console.log(x + ", " + y + ", " + z);

        cornerVertices.push(x, y, z);
        cornerIndices.push(0, i, i - 1);
    }

    let cornerPositionAttribute = new THREE.Float32BufferAttribute(new Float32Array(cornerVertices), 3);
    let cornerIndexAttribute = new THREE.Float32BufferAttribute(new Float32Array(cornerIndices), 3);
    cornerPiece1.setAttribute("position", cornerPositionAttribute);
    cornerPiece1.setIndex(cornerIndexAttribute);



    group.add(new THREE.Mesh(side4, wireFrameGray));
    group.add(new THREE.Mesh(side5, wireFrameGray));
    group.add(new THREE.Mesh(side6, wireFrameGray));
    group.add(new THREE.Mesh(backSphere1, wireFrameGray));
    group.add(new THREE.Mesh(cornerPiece1, wireFrameGray));
    
    group.add(new THREE.Mesh(backSphere2, wireFrameGray));
    // group.add(new THREE.Mesh(backSphere3, colorGray));


    
    return group;
}