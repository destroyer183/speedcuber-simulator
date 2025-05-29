import * as THREE from 'three';


const smoothness = 9;
const cylinderSegments = 1;
const edgeRadius = 0.2;

const wireFrameGreen = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
const wireFrameRed   = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
const wireFrameWhite = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
const wireFrameGray  = new THREE.MeshBasicMaterial({ color: 0xd3d3d3, wireframe: true });
const colorWhite = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
const colorGreen = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
const colorRed   = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide });
const colorGray  = new THREE.MeshBasicMaterial({ color: 0xd3d3d3, side: THREE.DoubleSide });



THREE.BufferGeometry.prototype.mergeShapes = function (...shapes) {

    let vertices = [];
    let indices = [];

    for (let shape of shapes) {
        indices.push(...([...shape.getIndex().array].map(item => item + vertices.length / 3)));
        vertices.push(...shape.getAttribute("position").array);
    }

    let position = new THREE.Float32BufferAttribute(new Float32Array(vertices), 3);
    let index = new THREE.Uint16BufferAttribute(new Uint16Array(indices), 1);

    this.setAttribute("position", position);
    this.setIndex(index);
}



export function constructCorner(size, upColor, frontColor, rightColor, innerColor) {

    let halfSize = size * 0.5 - edgeRadius;

    let group = new THREE.Group();


    // corners

    let corner1 = new THREE.SphereGeometry(edgeRadius, smoothness * 2, smoothness * 2, -Math.PI * 1/2, Math.PI * 1/2, Math.PI * 0, Math.PI * 1/2);
    corner1.translate(-halfSize, halfSize, -halfSize);

    let corner2 = new THREE.SphereGeometry(edgeRadius, smoothness, smoothness * 2, Math.PI * 1/2, Math.PI * 1/4, Math.PI * 0, Math.PI * 1/2);
    corner2.rotateX(-Math.PI * 1/2);
    corner2.translate(halfSize, halfSize, -halfSize);

    let h = Math.sqrt(2 * edgeRadius**2);

    let n = (h * Math.tan(Math.PI/6)) / 2;

    let e = h / 2; // b

    let theta = Math.atan(edgeRadius / e);

    let f = Math.sqrt(e**2 + n**2 - 2 * n * e * Math.cos(theta)); // a

    let x = Math.PI / 2 - Math.acos( (f**2 + e**2 - n**2) / (2 * f * e) );

    let corner3 = new THREE.SphereGeometry(edgeRadius, smoothness, smoothness, -Math.PI * 5/6, Math.PI * 2/3, Math.PI * 0, Math.PI * 1/3);
    corner3.rotateX(x);
    corner3.rotateY(Math.PI/4);
    corner3.translate(halfSize, halfSize, halfSize);

    let corner4 = new THREE.SphereGeometry(edgeRadius, smoothness, smoothness * 2, Math.PI * 3/4, Math.PI * 1/4, Math.PI * 0, Math.PI * 1/2);
    corner4.rotateZ(Math.PI * 1/2);
    corner4.translate(-halfSize, halfSize, halfSize);



    // edges
    let edge1 = new THREE.CylinderGeometry(edgeRadius, edgeRadius, size - edgeRadius * 2, smoothness * 2, cylinderSegments, true, Math.PI * 2/4, Math.PI * 1/2);
    edge1.rotateZ(Math.PI * 1/2);
    edge1.translate(0, halfSize, -halfSize);

    let edge2 = new THREE.CylinderGeometry(edgeRadius, edgeRadius, size - edgeRadius * 2, smoothness, cylinderSegments, true, Math.PI * 3/4, Math.PI * 1/4);
    edge2.rotateX(Math.PI * 1/2);
    edge2.translate(halfSize, halfSize, 0);

    let edge3 = new THREE.CylinderGeometry(edgeRadius, edgeRadius, size - edgeRadius * 2, smoothness, cylinderSegments, true, Math.PI * 1/4, Math.PI * 1/4);
    edge3.rotateZ(Math.PI * 1/2);
    edge3.translate(0, halfSize, halfSize);

    let edge4 = new THREE.CylinderGeometry(edgeRadius, edgeRadius, size - edgeRadius * 2, smoothness * 2, cylinderSegments, true, Math.PI * 1, Math.PI * 1/2);
    edge4.rotateX(Math.PI * 1/2);
    edge4.translate(-halfSize, halfSize, 0);

    

    // side
    let side = new THREE.PlaneGeometry(size - edgeRadius * 2, size - edgeRadius * 2, 4, 4);
    side.rotateX(-Math.PI * 1/2);
    side.translate(0, size * 1/2, 0);



    let topFace = new THREE.BufferGeometry();
    
    topFace.mergeShapes(corner4, corner3, corner1, corner2, edge1, edge2, edge3, edge4, side);

    let frontFace = topFace.clone();
    let rightFace = topFace.clone();

    frontFace.rotateY(Math.PI/2);
    frontFace.rotateX(Math.PI/2);

    rightFace.rotateY(-Math.PI/2);
    rightFace.rotateZ(-Math.PI/2);

    group.add(new THREE.Mesh(topFace, upColor));
    group.add(new THREE.Mesh(frontFace, frontColor));
    group.add(new THREE.Mesh(rightFace, rightColor));



    let alpha = Math.atan((size)/Math.sqrt(2 * (size - edgeRadius * 1 - (edgeRadius * Math.sin(Math.PI/4)) * 2) ** 2));

    let newArcTop = Math.asin((size/2 - edgeRadius)/(size*2) + Math.sin(alpha)) - alpha;
    let newArcBottom = alpha - Math.asin(Math.sin(alpha) - 1/4);

    let horizontalArc = Math.acos((2 * ((size*2)*Math.cos(alpha - newArcBottom))**2 - 2 * (size - edgeRadius * 2)**2) / (2 * ((size*2)*Math.cos(alpha - newArcBottom))**2));
    let horizontalRot = Math.PI/4 - horizontalArc/2;

    let verticalArc = newArcTop + newArcBottom;

    let a = (size*2);
    let b = alpha - newArcBottom;
    let c = horizontalRot;
    let d = edgeRadius;

    let segSize = Math.asin( ((d/a) + Math.sin(b) - Math.sin(c)*Math.cos(b)) / Math.sqrt(1 + Math.sin(c)**2)) + Math.atan(Math.sin(c));

    segSize -= (alpha - newArcBottom);

    verticalArc = segSize * 5;

    let verticalRot = Math.PI/2 - alpha - newArcTop;
    verticalRot = Math.PI/2 - (alpha - newArcBottom) - verticalArc;

    let cutoutRad = (size*2)*Math.cos(alpha - newArcBottom);

    let cutout = new THREE.CircleGeometry(cutoutRad, smoothness * 2, horizontalRot, horizontalArc);
    cutout.translate(halfSize - (cutoutRad * Math.cos(horizontalRot)), -halfSize * 1 - (cutoutRad * Math.sin(horizontalRot)), 0);

    let backSide = new THREE.BufferGeometry();

    let circleVertices = cutout.getAttribute("position");

    let vertices = [
        halfSize, halfSize, 0,

        halfSize, -halfSize, 0
    ];
    let indices = [];

    let backEdgeSize = 4;

    for (let i = 2; i < 2 + backEdgeSize; i++) {

        let x = circleVertices.getX(i);
        let y = circleVertices.getY(i);
        let z = circleVertices.getZ(i);

        // console.log(x + ", " + y + ", " + z);

        vertices.push(x, y, z);
        indices.push(0, i - 1, i);
    }

    let backEdgeRadius = size/2 + vertices[vertices.length - 2];
    let backEdgeHeight = size - edgeRadius - backEdgeRadius;
    let backEdgeZOffset = halfSize - backEdgeHeight/2;

    console.log(backEdgeRadius);

    vertices.push(vertices[vertices.length - 2], vertices[vertices.length - 2], vertices[vertices.length - 1]);
    indices.push(0, vertices.length / 3 - 2, vertices.length / 3 - 1);

    vertices.push(vertices[vertices.length - 5], vertices[vertices.length - 6], vertices[vertices.length - 4]);
    indices.push(0, vertices.length / 3 - 2, vertices.length / 3 - 1);

    for (let i = (circleVertices.count - 1) - backEdgeSize; i < circleVertices.count; i++) {

        let x = circleVertices.getX(i);
        let y = circleVertices.getY(i);
        let z = circleVertices.getZ(i);

        // console.log(x + ", " + y + ", " + z);

        vertices.push(x, y, z);
        indices.push(0, vertices.length / 3 - 2, vertices.length / 3 - 1);
    }

    let positionAttribute = new THREE.Float32BufferAttribute(new Float32Array(vertices), 3);
    let indexAttribute = new THREE.Uint16BufferAttribute(new Uint16Array(indices), 1);
    backSide.setAttribute("position", positionAttribute);
    backSide.setIndex(indexAttribute);

    backSide.rotateX(Math.PI/2);
    backSide.translate(0, -halfSize - edgeRadius, 0);


    let backEdge = new THREE.CylinderGeometry(backEdgeRadius, backEdgeRadius, backEdgeHeight, smoothness, cylinderSegments, true, -Math.PI/2, Math.PI/2);
    backEdge.rotateX(Math.PI/2);
    backEdge.translate(-size/2 + backEdgeRadius, -halfSize - edgeRadius + backEdgeRadius, backEdgeZOffset);

    // maybe taper this inwards?



    let backCorner = new THREE.SphereGeometry(backEdgeRadius, smoothness, smoothness, -Math.PI/2, Math.PI/2, Math.PI/2, Math.PI/2);
    backCorner.translate(-size/2 + backEdgeRadius, -size/2 + backEdgeRadius, -size/2 + backEdgeRadius);


    
    let backSphereTemplate = new THREE.SphereGeometry(size * 2, smoothness * 2, 5, Math.PI * 1/2 + horizontalRot, horizontalArc, verticalRot, verticalArc);

    backSphereTemplate.translate(
        halfSize - (((size*2) * Math.cos(alpha - newArcBottom)) * Math.cos(horizontalRot)),
        -halfSize - ((size*2) * Math.sin(alpha - newArcBottom)) - edgeRadius,
        halfSize - (((size*2) * Math.cos(alpha - newArcBottom)) * Math.cos(horizontalRot)),
    );

    let corner = new THREE.CircleGeometry(edgeRadius, smoothness * 2, Math.PI, Math.PI/2);
    corner.translate(-halfSize, -halfSize, halfSize);

    let cornerPiece = new THREE.BufferGeometry();

    let cornerPoints = corner.getAttribute("position");


    let pointX = -(size/2) + edgeRadius - (size*2)*(Math.cos(alpha - newArcBottom) - Math.cos(segSize + (alpha - newArcBottom))) * Math.sin(horizontalRot);
    let pointY = pointX;
    let pointZ = halfSize - (size*2)*(Math.cos(alpha - newArcBottom) - Math.cos(segSize + (alpha - newArcBottom))) * Math.cos(horizontalRot);

    let backCornerVertices = [
        pointX, pointY, pointZ,
        size / -2, (size - edgeRadius * 2) / -2, (size - edgeRadius * 2) / 2
    ];

    let backCornerIndices = [];

    for (let i = 2; i < cornerPoints.count; i++) {

        let x = cornerPoints.getX(i);
        let y = cornerPoints.getY(i);
        let z = cornerPoints.getZ(i);

        // console.log(x + ", " + y + ", " + z);

        backCornerVertices.push(x, y, z);
        backCornerIndices.push(0, i, i - 1);
    }

    let cornerPositionAttribute = new THREE.Float32BufferAttribute(new Float32Array(backCornerVertices), 3);
    let cornerIndexAttribute = new THREE.Uint16BufferAttribute(new Uint16Array(backCornerIndices), 3);
    cornerPiece.setAttribute("position", cornerPositionAttribute);
    cornerPiece.setIndex(cornerIndexAttribute);



    let backSphere1 = new THREE.BufferGeometry();

    backSphere1.mergeShapes(backSphereTemplate, cornerPiece, backSide, backEdge);

    let backSphere2 = backSphere1.clone();
    let backSphere3 = backSphere1.clone();

    backSphere2.rotateY(-Math.PI/2);
    backSphere2.rotateZ(-Math.PI/2);
    
    backSphere3.rotateY(Math.PI/2);
    backSphere3.rotateX(Math.PI/2);

   
    let backSphere = new THREE.BufferGeometry()
    backSphere.mergeShapes(backSphere1, backSphere2, backSphere3, backCorner);

    group.add(new THREE.Mesh(backSphere, innerColor));

    

    return group;
}



export function constructEdge(size, upColor, frontColor, innerColor) {

    let halfSize = size * 0.5 - edgeRadius;

    let group = new THREE.Group();

    const wireFrameGreen = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    const wireFrameWhite = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
    const wireFrameGray  = new THREE.MeshBasicMaterial({ color: 0xd3d3d3, wireframe: true });

    // corners

    let corner1 = new THREE.SphereGeometry(edgeRadius, smoothness * 2, smoothness * 2, -Math.PI * 1/2, Math.PI * 1/2, Math.PI * 0, Math.PI * 1/2);
    corner1.translate(-halfSize, halfSize, -halfSize);

    let corner2 = new THREE.SphereGeometry(edgeRadius, smoothness, smoothness * 2, Math.PI * 1/1, Math.PI * 1/2, Math.PI * 0, Math.PI * 1/2);
    corner2.translate(halfSize, halfSize, -halfSize);

    let corner3 = new THREE.SphereGeometry(edgeRadius, smoothness, smoothness, Math.PI * 0, Math.PI * 1/4, Math.PI * 0, Math.PI * 1/2);
    corner3.rotateZ(-Math.PI * 1/2);
    corner3.translate(halfSize, halfSize, halfSize);

    let corner4 = new THREE.SphereGeometry(edgeRadius, smoothness, smoothness * 2, Math.PI * 3/4, Math.PI * 1/4, Math.PI * 0, Math.PI * 1/2);
    corner4.rotateZ(Math.PI * 1/2);
    corner4.translate(-halfSize, halfSize, halfSize);

    
    
    // edges
    let edge1 = new THREE.CylinderGeometry(edgeRadius, edgeRadius, size - edgeRadius * 2, smoothness * 2, cylinderSegments, true, Math.PI * 1/2, Math.PI * 1/2);
    edge1.rotateZ(Math.PI * 1/2);
    edge1.translate(0, halfSize, -halfSize);

    let edge2 = new THREE.CylinderGeometry(edgeRadius, edgeRadius, size - edgeRadius * 2, smoothness * 2, cylinderSegments, true, Math.PI * 1/2, Math.PI * 1/2);
    edge2.rotateX(Math.PI * 1/2);
    edge2.translate(halfSize, halfSize, 0);

    let edge3 = new THREE.CylinderGeometry(edgeRadius, edgeRadius, size - edgeRadius * 2, smoothness * 2, cylinderSegments, true, Math.PI * 1/4, Math.PI * 1/4);
    edge3.rotateZ(Math.PI * 1/2);
    edge3.translate(0, halfSize, halfSize);

    let edge4 = new THREE.CylinderGeometry(edgeRadius, edgeRadius, size - edgeRadius * 2, smoothness * 2, cylinderSegments, true, Math.PI * 1, Math.PI * 1/2);
    edge4.rotateX(Math.PI * 1/2);
    edge4.translate(-halfSize, halfSize, 0);



    // side
    let side = new THREE.PlaneGeometry(size - edgeRadius * 2, size - edgeRadius * 2, 4, 4);
    side.rotateX(-Math.PI * 1/2);
    side.translate(0, size * 1/2, 0);



    let topFace = new THREE.BufferGeometry();
    
    topFace.mergeShapes(corner4, corner3, corner1, corner2, edge1, edge2, edge3, edge4, side);

    let frontFace = topFace.clone();

    frontFace.rotateY(Math.PI);
    frontFace.rotateX(Math.PI/2);

    group.add(new THREE.Mesh(topFace, wireFrameWhite));
    group.add(new THREE.Mesh(frontFace, wireFrameGreen));



    return group;
}