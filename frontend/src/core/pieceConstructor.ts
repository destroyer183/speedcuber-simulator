import * as THREE from 'three';
import { ColorType, pieceSize, gray } from './dataTypes';


const smoothness = 9; // define constant for number of segments for shapes
const edgeRadius = 0.2; // define constant for radius of curved edges 
const cylinderSegments = 1; // define constant for number of vertical radial cylinder segments



// create new function for buffer geometries that merges multiple buffer geometries
// this is done by extending the class we want to add the function to, as typescript won't allow you to directly add the function to the class externally
class ExBufferGeometry extends THREE.BufferGeometry {

    mergeShapes(...shapes: any[]) {

        // define variable to store the vertices that make up buffer geometries
        let vertices = [];

        // define variable to store the indices of the vertices that make up buffer geometries
        // each three consecutive values in this array are indices of different points in the vertices array, 
        // which each set of points representing a triangular plane that will be drawn
        let indices = [];

        // add old content to vertices and indices
        // use a try/catch statement to avoid unnecessary crashes
        try {
            vertices.push(...this.getAttribute("position").array);
            indices.push(...this.getIndex()!.array);
        } catch {}

        // loop over very buffer geometry passed in
        for (let shape of shapes) {
            indices.push(...([...shape.getIndex()!.array].map(item => item + vertices.length / 3))); // add indices from a geometry, and offset them by the number of previous vertices
            vertices.push(...shape.getAttribute("position").array); // add vertices from a geometry
        }

        // convert vertices and indices to proper data types to merge them into the parent buffer geometry
        const position = new THREE.Float32BufferAttribute(new Float32Array(vertices), 3);
        const index = new THREE.Uint16BufferAttribute(new Uint16Array(indices), 1);

        // update position and index attributes on parent buffer geometry
        this.setAttribute("position", position);
        this.setIndex(index);
    }
}



// define function to create a corner piece for a rubiks cube
// take in arguments for size, face colors, inner color, and whether or not to draw as a wire frame or not
export function constructCorner(upColor: ColorType, frontColor: ColorType, rightColor: ColorType, innerColor: ColorType = gray) {

    // define constant for radius of edges on the back piece of the corner
    const backEdgeRadius = pieceSize/4;

    // define constant for half the size of the cube minus the edge size
    const halfSize = pieceSize * 0.5 - edgeRadius;

    // create new group to store all parts of the corner piece in a single variable
    let group = new THREE.Group();

    // corners

    // create new sphere to act as a rounded corner of a face
    let corner1 = new THREE.SphereGeometry(edgeRadius, smoothness * 2, smoothness * 2, -Math.PI/2, Math.PI/2, 0, Math.PI/2);
    // translate corner into proper position
    corner1.translate(-halfSize, halfSize, -halfSize);

    let corner2 = new THREE.SphereGeometry(edgeRadius, smoothness, smoothness * 2, Math.PI/2, Math.PI/4, 0, Math.PI/2);
    // rotate corner counter-clockwise around the x-axis
    corner2.rotateX(-Math.PI/2);
    corner2.translate(halfSize, halfSize, -halfSize);

    // perform math to determine the proper rotations that need to be performed 
    // in order to make three differently colored pieces of a single corner come together seamlessly
    const h = Math.sqrt(2 * edgeRadius**2);
    const n = (h * Math.tan(Math.PI/6))/2;
    const e = h/2; // b
    const theta = Math.atan(edgeRadius/e);
    const f = Math.sqrt(e**2 + n**2 - 2 * n * e * Math.cos(theta)); // a
    const x = Math.PI/2 - Math.acos( (f**2 + e**2 - n**2) / (2 * f * e) );

    let corner3 = new THREE.SphereGeometry(edgeRadius, smoothness, smoothness, -Math.PI * 5/6, Math.PI * 2/3, 0, Math.PI/3);
    corner3.rotateX(x);
    corner3.rotateY(Math.PI/4);
    corner3.translate(halfSize, halfSize, halfSize);

    let corner4 = new THREE.SphereGeometry(edgeRadius, smoothness, smoothness * 2, Math.PI * 3/4, Math.PI/4, 0, Math.PI/2);
    corner4.rotateZ(Math.PI/2);
    corner4.translate(-halfSize, halfSize, halfSize);



    // edges
    // create new cylinder to act as a rounded edge of a face
    let edge1 = new THREE.CylinderGeometry(edgeRadius, edgeRadius, pieceSize - edgeRadius * 2, smoothness * 2, cylinderSegments, true, Math.PI/2, Math.PI/2);
    edge1.rotateZ(Math.PI/2);
    edge1.translate(0, halfSize, -halfSize);

    let edge2 = new THREE.CylinderGeometry(edgeRadius, edgeRadius, pieceSize - edgeRadius * 2, smoothness, cylinderSegments, true, Math.PI * 3/4, Math.PI/4);
    edge2.rotateX(Math.PI/2);
    edge2.translate(halfSize, halfSize, 0);

    let edge3 = new THREE.CylinderGeometry(edgeRadius, edgeRadius, pieceSize - edgeRadius * 2, smoothness, cylinderSegments, true, Math.PI/4, Math.PI/4);
    edge3.rotateZ(Math.PI/2);
    edge3.translate(0, halfSize, halfSize);

    let edge4 = new THREE.CylinderGeometry(edgeRadius, edgeRadius, pieceSize - edgeRadius * 2, smoothness * 2, cylinderSegments, true, Math.PI, Math.PI/2);
    edge4.rotateX(Math.PI/2);
    edge4.translate(-halfSize, halfSize, 0);

    

    // side
    // create new plane to act as a face of the cube
    let side = new THREE.PlaneGeometry(pieceSize - edgeRadius * 2, pieceSize - edgeRadius * 2);
    side.rotateX(-Math.PI/2);
    side.translate(0, pieceSize/2, 0);



    // create new buffer geometry to act as the entire top face of the corner
    let topFace = new ExBufferGeometry();
    
    // merge all parts of the top face together
    topFace.mergeShapes(corner4, corner3, corner1, corner2, edge1, edge2, edge3, edge4, side);

    // create clones of the top face to act as the front and right faces of the corner piece
    let frontFace = topFace.clone();
    let rightFace = topFace.clone();

    // translate front face into proper position
    frontFace.rotateY(Math.PI/2);
    frontFace.rotateX(Math.PI/2);

    // translate right face into proper position
    rightFace.rotateY(-Math.PI/2);
    rightFace.rotateZ(-Math.PI/2);

    // convert the faces to meshes and add them to the group
    group.add(new THREE.Mesh(topFace, upColor.color));
    group.add(new THREE.Mesh(frontFace, frontColor.color));
    group.add(new THREE.Mesh(rightFace, rightColor.color));


    

    // perform lots of math that I can't properly explain without visuals
    // this determines the positioning and size of a spherical portion of the back side of the corner piece
    const alpha = Math.atan( (pieceSize) / Math.sqrt(2 * (pieceSize - edgeRadius - (edgeRadius * Math.sin(Math.PI/4)) * 2) ** 2) );

    const newArcTop = Math.asin( (pieceSize/2 - edgeRadius) / (pieceSize*2) + Math.sin(alpha) ) - alpha;
    const newArcBottom = alpha - Math.asin(Math.sin(alpha) - 1/4);

    const horizontalArc = Math.acos((2 * ((pieceSize*2) * Math.cos(alpha - newArcBottom))**2 - 2 * (pieceSize - edgeRadius * 2)**2) / (2 * ((pieceSize*2) * Math.cos(alpha - newArcBottom))**2));
    const horizontalRot = Math.PI/4 - horizontalArc/2;

    const a = pieceSize*2;
    const b = alpha - newArcBottom;
    const c = horizontalRot;
    const d = edgeRadius;

    const segSize = Math.asin( ( (d/a) + Math.sin(b) - Math.sin(c) * Math.cos(b) ) / Math.sqrt( 1 + Math.sin(c)**2) ) + Math.atan(Math.sin(c)) - (alpha - newArcBottom);

    const verticalArc = segSize * 5;

    const verticalRot = Math.PI/2 - (alpha - newArcBottom) - verticalArc;

    const cutoutRad = (pieceSize*2) * Math.cos(alpha - newArcBottom);

    // create circle that will act as a cutout of a square for the back sides of the sphere
    let cutout = new THREE.CircleGeometry(cutoutRad, smoothness * 2, horizontalRot, horizontalArc);
    cutout.translate(halfSize - (cutoutRad * Math.cos(horizontalRot)), -halfSize - (cutoutRad * Math.sin(horizontalRot)), 0);

    // create buffer for the square with a cutout
    let backCutout = new ExBufferGeometry();

    // get vertex coordinates of the cutout arc
    let circleVertices = cutout.getAttribute("position");

    // create initial vertices for the cutout square
    let vertices = [
        halfSize, halfSize, 0,

        halfSize, -halfSize, 0
    ];

    // create empty array to store the indices of the cutout square
    let indices = [];

    // loop over every vertex in the cutout, excluding ones we have already defined in a different position
    for (let i = 2; i < circleVertices.count; i++) {

        // get x, y, z coordinates at a certain point in the vertex array
        let x = circleVertices.getX(i);
        let y = circleVertices.getY(i);
        let z = circleVertices.getZ(i);

        // console.log(x + ", " + y + ", " + z);

        // add new values to the vertices and indices arrays
        vertices.push(x, y, z);
        indices.push(0, i - 1, i);
    }

    // convert vertex and index attributes to a different format so they can be added to the buffer geometry
    const positionAttribute = new THREE.Float32BufferAttribute(new Float32Array(vertices), 3);
    const indexAttribute = new THREE.Uint16BufferAttribute(new Uint16Array(indices), 1);

    // add position and index attributes to the buffer geometry
    backCutout.setAttribute("position", positionAttribute);
    backCutout.setIndex(indexAttribute);

    // move cutout into proper place
    backCutout.rotateX(Math.PI/2);
    backCutout.translate(0, -halfSize - edgeRadius, 0);

    // define variables to simplify the code for the height and positioning of the back side edges
    const backEdgeHeight = pieceSize - edgeRadius - backEdgeRadius;
    const backEdgeZOffset = halfSize - backEdgeHeight/2;

    // define vertices for a face of the back side
    let backFaceVertices = [
        -pieceSize/2 + backEdgeRadius, -pieceSize/2, -pieceSize/2 + backEdgeRadius,
         pieceSize/2 - edgeRadius,     -pieceSize/2, -pieceSize/2 + backEdgeRadius,
        -pieceSize/2 + backEdgeRadius, -pieceSize/2,  pieceSize/2 - edgeRadius,

         pieceSize/2 - edgeRadius,     -pieceSize/2, -pieceSize/2 + backEdgeRadius,
         pieceSize/2 - edgeRadius,     -pieceSize/2,  pieceSize/2 - edgeRadius,
        -pieceSize/2 + backEdgeRadius, -pieceSize/2,  pieceSize/2 - edgeRadius,
    ];
    // define indices for a face of the back side
    let backFaceIndices = [
        0, 1, 2,
        3, 4, 5
    ];

    // create back face buffer geometry
    let backFace = new ExBufferGeometry();

    const backFacePositionAttribute = new THREE.Float32BufferAttribute(new Float32Array(backFaceVertices), 3);
    const backFaceIndexAttribute = new THREE.Uint16BufferAttribute(new Uint16Array(backFaceIndices), 1);
    backFace.setAttribute("position", backFacePositionAttribute);
    backFace.setIndex(backFaceIndexAttribute);



    // create cylinder to act as a rounded edge on the back side of the corner piece
    // maybe taper this inwards?
    let backEdge = new THREE.CylinderGeometry(backEdgeRadius, backEdgeRadius, backEdgeHeight, smoothness, cylinderSegments, true, -Math.PI/2, Math.PI/2);
    backEdge.rotateX(Math.PI/2);
    backEdge.translate(-pieceSize/2 + backEdgeRadius, -halfSize - edgeRadius + backEdgeRadius, backEdgeZOffset);


    //  create sphere to act as the corner piece of the rounded back edges
    let backCorner = new THREE.SphereGeometry(backEdgeRadius, smoothness, smoothness, -Math.PI/2, Math.PI/2, Math.PI/2, Math.PI/2);
    backCorner.translate(-pieceSize/2 + backEdgeRadius, -pieceSize/2 + backEdgeRadius, -pieceSize/2 + backEdgeRadius);


    // create sphere to act as a curved and rounded portion of the back side of the corner piece
    let backSphereTemplate = new THREE.SphereGeometry(pieceSize * 2, smoothness * 2, 5, Math.PI/2 + horizontalRot, horizontalArc, verticalRot, verticalArc);

    backSphereTemplate.translate(
         halfSize - ((pieceSize*2) * Math.cos(alpha - newArcBottom)) * Math.cos(horizontalRot),
        -halfSize - ((pieceSize*2) * Math.sin(alpha - newArcBottom)) - edgeRadius,
         halfSize - ((pieceSize*2) * Math.cos(alpha - newArcBottom)) * Math.cos(horizontalRot),
    );

    // create circle to seamlessly fill in a portion of the back side of the corner piece that isn't covered by other pieces
    let fillCornerTemplate = new THREE.CircleGeometry(edgeRadius, smoothness * 2, Math.PI, Math.PI/2);
    fillCornerTemplate.translate(-halfSize, -halfSize, halfSize);

    // create buffer attribute for the fill corner
    let fillCorner = new ExBufferGeometry();

    // get position attribute of corner circle
    let cornerPoints = fillCornerTemplate.getAttribute("position");

    // determine the x, y, z coordinates of the center point of the fill corner
    const pointX = -(pieceSize/2) + edgeRadius - (pieceSize*2) * (Math.cos(alpha - newArcBottom) - Math.cos(segSize + (alpha - newArcBottom))) * Math.sin(horizontalRot);
    const pointY = pointX;
    const pointZ = halfSize - (pieceSize*2) * (Math.cos(alpha - newArcBottom) - Math.cos(segSize + (alpha - newArcBottom))) * Math.cos(horizontalRot);

    // define initial vertices for the fill corner
    let fillCornerVertices = [
        pointX, pointY, pointZ,
        pieceSize / -2, (pieceSize - edgeRadius * 2) / -2, (pieceSize - edgeRadius * 2) / 2
    ];

    // define empty array to store the indices that make up the fill corner
    let fillCornerIndices = [];

    // loop over every vertex in the fill corner template, excluding ones we have already defined in a different position
    for (let i = 2; i < cornerPoints.count; i++) {

        let x = cornerPoints.getX(i);
        let y = cornerPoints.getY(i);
        let z = cornerPoints.getZ(i);

        // console.log(x + ", " + y + ", " + z);

        fillCornerVertices.push(x, y, z);
        fillCornerIndices.push(0, i, i - 1);
    }

    // update position and index attributes of the fill corner buffer geometry
    const cornerPositionAttribute = new THREE.Float32BufferAttribute(new Float32Array(fillCornerVertices), 3);
    const cornerIndexAttribute = new THREE.Uint16BufferAttribute(new Uint16Array(fillCornerIndices), 3);
    fillCorner.setAttribute("position", cornerPositionAttribute);
    fillCorner.setIndex(cornerIndexAttribute);



    // create buffere geometry to act as one third of the back side of the corner piece
    let backPiece1 = new ExBufferGeometry();

    // merge all pieces of the back side
    backPiece1.mergeShapes(backSphereTemplate, fillCorner, backEdge, backCutout, backFace);

    // create two clones of 'backSphere1'
    let backPiece2 = backPiece1.clone();
    let backPiece3 = backPiece1.clone();

    // rotate new back pieces into correct positions
    backPiece2.rotateY(-Math.PI/2);
    backPiece2.rotateZ(-Math.PI/2);
    
    backPiece3.rotateY(Math.PI/2);
    backPiece3.rotateX(Math.PI/2);

   
    // create new buffer geometry to act as the entire back piece of the corner piece
    let innerSide = new ExBufferGeometry()

    // merge all parts of the back piece into a sigle buffer geometry
    innerSide.mergeShapes(backPiece1, backPiece2, backPiece3, backCorner);

    // add inner side to group
    group.add(new THREE.Mesh(innerSide, innerColor.color));

    // rotate cube into correct orientation
    group.translateX(upColor.coordinateOffset.x + frontColor.coordinateOffset.x + rightColor.coordinateOffset.x);
    group.translateY(upColor.coordinateOffset.y + frontColor.coordinateOffset.y + rightColor.coordinateOffset.y);
    group.translateZ(upColor.coordinateOffset.z + frontColor.coordinateOffset.z + rightColor.coordinateOffset.z);

    // rotate cube into correct orientation
    group.rotation.set(
        upColor.upRotationOffset.x + frontColor.frontRotationOffset.x,
        upColor.upRotationOffset.y + frontColor.frontRotationOffset.y,
        upColor.upRotationOffset.z + frontColor.frontRotationOffset.z
    );

    // return the group containing all four pieces of the corner piece
    return group;
}



// define function to create an edge piece for a rubiks cube
// take in arguments for size, face colors, inner color,  and whether or not to draw as a wire frame or not
export function constructEdge(upColor: ColorType, frontColor: ColorType, innerColor: ColorType = gray) {

    // define constant for the radius of the rounded back edges
    const backEdgeRadius = pieceSize/4;

    // define constant for half the size of the cube minus the edge size
    const halfSize = pieceSize * 0.5 - edgeRadius;

    // create new group to store all parts of the corner piece in a single variable
    let group = new THREE.Group();

    // corners
    // create rounded and curved corner by using a torus shape
    let corner1 = new THREE.TorusGeometry(backEdgeRadius - edgeRadius, edgeRadius, smoothness * 8, smoothness * 2, Math.PI/2);
    corner1.rotateX(Math.PI/2);
    corner1.rotateY(Math.PI);
    corner1.translate(-pieceSize/2 + backEdgeRadius, pieceSize/2 - edgeRadius, -pieceSize/2 + backEdgeRadius);

    let corner2 = new THREE.TorusGeometry(backEdgeRadius - edgeRadius, edgeRadius, smoothness * 8, smoothness * 2, Math.PI/2);
    corner2.rotateX(Math.PI/2);
    corner2.rotateY(Math.PI/2);
    corner2.translate(pieceSize/2 - backEdgeRadius, pieceSize/2 - edgeRadius, -pieceSize/2 + backEdgeRadius);

    // create rounded corner by making a sphere
    let corner3 = new THREE.SphereGeometry(edgeRadius, smoothness, smoothness * 2, 0, Math.PI/4, 0, Math.PI/2);
    corner3.rotateZ(-Math.PI/2);
    corner3.translate(halfSize, halfSize, halfSize);

    let corner4 = new THREE.SphereGeometry(edgeRadius, smoothness, smoothness * 2, Math.PI * 3/4, Math.PI/4, 0, Math.PI/2);
    corner4.rotateZ(Math.PI/2);
    corner4.translate(-halfSize, halfSize, halfSize);

    
    
    // edges
    // create rounded edges using cylinders
    let edge1 = new THREE.CylinderGeometry(edgeRadius, edgeRadius, pieceSize - backEdgeRadius * 2,          smoothness * 2, cylinderSegments, true, Math.PI/2, Math.PI/2);
    edge1.rotateZ(Math.PI/2);
    edge1.translate(0, halfSize, -halfSize);

    let edge2 = new THREE.CylinderGeometry(edgeRadius, edgeRadius, pieceSize - backEdgeRadius - edgeRadius, smoothness * 2, cylinderSegments, true, Math.PI/2, Math.PI/2);
    edge2.rotateX(Math.PI/2);
    edge2.translate(halfSize, halfSize, (backEdgeRadius - edgeRadius)/2);

    let edge3 = new THREE.CylinderGeometry(edgeRadius, edgeRadius, pieceSize - edgeRadius * 2,              smoothness * 2, cylinderSegments, true, Math.PI/4, Math.PI/4);
    edge3.rotateZ(Math.PI/2);
    edge3.translate(0, halfSize, halfSize);

    let edge4 = new THREE.CylinderGeometry(edgeRadius, edgeRadius, pieceSize - backEdgeRadius - edgeRadius, smoothness * 2, cylinderSegments, true, Math.PI, Math.PI/2);
    edge4.rotateX(Math.PI/2);
    edge4.translate(-halfSize, halfSize, (backEdgeRadius - edgeRadius)/2);



    // side
    // create side pieces using planes
    let sideSeg1 = new THREE.PlaneGeometry(pieceSize - edgeRadius * 2, pieceSize - backEdgeRadius - edgeRadius);
    sideSeg1.rotateX(-Math.PI/2);
    sideSeg1.translate(0, pieceSize * 1/2, (backEdgeRadius - edgeRadius)/2);

    let sideSeg2 = new THREE.PlaneGeometry(pieceSize - backEdgeRadius * 2, backEdgeRadius - edgeRadius);
    sideSeg2.rotateX(-Math.PI/2);
    sideSeg2.translate(0, pieceSize/2, -pieceSize/2 + backEdgeRadius/2 + edgeRadius/2);

    // create side pieces to align with the curved corners by using circles
    let sideSeg3 = new THREE.CircleGeometry(backEdgeRadius - edgeRadius, smoothness * 2, Math.PI/2, Math.PI/2);
    sideSeg3.rotateX(-Math.PI/2);
    sideSeg3.translate(-pieceSize/2 + backEdgeRadius, pieceSize/2, -pieceSize/2 + backEdgeRadius);

    let sideSeg4 = new THREE.CircleGeometry(backEdgeRadius - edgeRadius, smoothness * 2, 0, Math.PI/2);
    sideSeg4.rotateX(-Math.PI/2);
    sideSeg4.translate(pieceSize/2 - backEdgeRadius, pieceSize/2, -pieceSize/2 + backEdgeRadius);

    // create buffer geometry to combine the pieces of the top face
    let topFace = new ExBufferGeometry();
    
    // merge all the pieces of the top face together
    topFace.mergeShapes(corner4, corner3, corner1, corner2, edge1, edge2, edge3, edge4, sideSeg1, sideSeg2, sideSeg3, sideSeg4);

    // create a clone of the top face to act as the front face
    let frontFace = topFace.clone();

    // rotate the front face into the correct position
    frontFace.rotateY(Math.PI);
    frontFace.rotateX(Math.PI/2);

    // add top and front faces to the main group

    group.add(new THREE.Mesh(topFace, upColor.color));
    group.add(new THREE.Mesh(frontFace, frontColor.color));
    


    // back side
    // create rounded edges for the back side of the edge piece using cylinders
    let backEdge1 = new THREE.CylinderGeometry(backEdgeRadius, backEdgeRadius, pieceSize - edgeRadius - backEdgeRadius, smoothness * 2, cylinderSegments, true, -Math.PI/2, Math.PI/2);
    backEdge1.rotateY(-Math.PI/2);
    backEdge1.translate(-pieceSize/2 + backEdgeRadius, edgeRadius/2 + backEdgeRadius/2 - edgeRadius, -pieceSize/2 + backEdgeRadius);

    let backEdge2 = new THREE.CylinderGeometry(backEdgeRadius, backEdgeRadius, pieceSize - edgeRadius - backEdgeRadius, smoothness * 2, cylinderSegments, true, Math.PI/1, Math.PI/2);
    backEdge2.rotateY(-Math.PI/2);
    backEdge2.translate(pieceSize/2 - backEdgeRadius, edgeRadius/2 + backEdgeRadius/2 - edgeRadius, -pieceSize/2 + backEdgeRadius);


    // create faces for the back side of the edge piece using planes
    let backFace1 = new THREE.PlaneGeometry(pieceSize - backEdgeRadius * 2, pieceSize - edgeRadius - backEdgeRadius);
    backFace1.translate(0, (backEdgeRadius - edgeRadius)/2, -pieceSize/2);

    let backFace2 = new THREE.PlaneGeometry(pieceSize - backEdgeRadius - edgeRadius, pieceSize - backEdgeRadius - edgeRadius);
    backFace2.rotateY(Math.PI/2);
    backFace2.translate(-pieceSize/2, (backEdgeRadius - edgeRadius)/2, (backEdgeRadius - edgeRadius)/2);

    // create rounded corner for the back side of the corner piece using a sphere
    let backCorner = new THREE.SphereGeometry(backEdgeRadius, smoothness * 2, smoothness * 2, -Math.PI/2, Math.PI/2, 0, Math.PI/2);
    backCorner.rotateZ(Math.PI/2);
    backCorner.translate(-pieceSize/2 + backEdgeRadius, -pieceSize/2 + backEdgeRadius, -pieceSize/2 + backEdgeRadius);

    // create a buffer geometry to store all the pieces of one half of the back side in a single variable
    let innerSide1 = new ExBufferGeometry();
    innerSide1.mergeShapes(backEdge1, backEdge2, backFace1, backFace2, backCorner);

    // create a clone of 'innerSide1' to act as the other half of the back side of the edge piece
    let innerSide2 = innerSide1.clone();

    // rotate 'innerSide2' into the correct position
    innerSide2.rotateZ(Math.PI);
    innerSide2.rotateX(-Math.PI/2);

    // make extra inner edge to fill the last gap in the back side of the edge piece
    let innerEdge = new THREE.CylinderGeometry(backEdgeRadius, backEdgeRadius, pieceSize - backEdgeRadius * 2, smoothness * 2, cylinderSegments, true, Math.PI/2, Math.PI/2);
    innerEdge.rotateZ(-Math.PI/2);
    innerEdge.translate(0, -pieceSize/2 + backEdgeRadius, -pieceSize/2 + backEdgeRadius);

    // make buffer geometry to store all componenets of the inner side of the edge piece
    let innerSide = new ExBufferGeometry();

    // merge all pieces of the inner side of the edge piece into a single variable
    innerSide.mergeShapes(innerSide1, innerSide2, innerEdge);

    // add inner side to the main group
    group.add(new THREE.Mesh(innerSide, innerColor.color));

    // translate piece into correct rotation
    group.translateX(upColor.coordinateOffset.x + frontColor.coordinateOffset.x);
    group.translateY(upColor.coordinateOffset.y + frontColor.coordinateOffset.y);
    group.translateZ(upColor.coordinateOffset.z + frontColor.coordinateOffset.z);

    // rotate cube into correct orientation
    group.rotation.set(
        upColor.upRotationOffset.x + frontColor.frontRotationOffset.x,
        upColor.upRotationOffset.y + frontColor.frontRotationOffset.y,
        upColor.upRotationOffset.z + frontColor.frontRotationOffset.z
    );

    // return the main group
    return group;
}


// define function to create a center piece for a rubiks cube
// take in arguments for size, face color, inner color, and whether or not to draw as a wire frame or not
export function constructCenter(upColor: ColorType, innerColor: ColorType = gray) {

    // define constant for the radius of the rounded back edges
    const backEdgeRadius = pieceSize/4;

    // define constant for half the size of the cube minus the edge size
    const halfSize = pieceSize * 0.5 - edgeRadius;

    // create new group to store all parts of the center piece in a single variable
    let group = new THREE.Group();

    // corners
    // create rounded and curved corner by using a torus shape
    let corner1 = new THREE.TorusGeometry(backEdgeRadius - edgeRadius, edgeRadius, smoothness * 8, smoothness * 2, Math.PI/2);
    corner1.rotateX(Math.PI/2);
    corner1.rotateY(Math.PI);
    corner1.translate(-pieceSize/2 + backEdgeRadius, pieceSize/2 - edgeRadius, -pieceSize/2 + backEdgeRadius);

    let corner2 = new THREE.TorusGeometry(backEdgeRadius - edgeRadius, edgeRadius, smoothness * 8, smoothness * 2, Math.PI/2);
    corner2.rotateX(Math.PI/2);
    corner2.rotateY(Math.PI/2);
    corner2.translate(pieceSize/2 - backEdgeRadius, pieceSize/2 - edgeRadius, -pieceSize/2 + backEdgeRadius);

    let corner3 = new THREE.TorusGeometry(backEdgeRadius - edgeRadius, edgeRadius, smoothness * 8, smoothness * 2, Math.PI/2);
    corner3.rotateX(Math.PI/2);
    corner3.translate(pieceSize/2 - backEdgeRadius, pieceSize/2 - edgeRadius, pieceSize/2 - backEdgeRadius);

    let corner4 = new THREE.TorusGeometry(backEdgeRadius - edgeRadius, edgeRadius, smoothness * 8, smoothness * 2, Math.PI/2);
    corner4.rotateX(Math.PI/2);
    corner4.rotateY(-Math.PI/2);
    corner4.translate(-pieceSize/2 + backEdgeRadius, pieceSize/2 - edgeRadius, pieceSize/2 - backEdgeRadius);



    // edges
    // create rounded edges using cylinders
    let edge1 = new THREE.CylinderGeometry(edgeRadius, edgeRadius, pieceSize - backEdgeRadius * 2,          smoothness * 2, cylinderSegments, true, Math.PI/2, Math.PI/2);
    edge1.rotateZ(Math.PI/2);
    edge1.translate(0, halfSize, -halfSize);

    let edge2 = new THREE.CylinderGeometry(edgeRadius, edgeRadius, pieceSize - backEdgeRadius * 2,          smoothness * 2, cylinderSegments, true, Math.PI/2, Math.PI/2);
    edge2.rotateZ(Math.PI/2);
    edge2.rotateY(-Math.PI/2);
    edge2.translate(halfSize, halfSize, 0);

    let edge3 = new THREE.CylinderGeometry(edgeRadius, edgeRadius, pieceSize - backEdgeRadius * 2,          smoothness * 2, cylinderSegments, true, Math.PI/2, Math.PI/2);
    edge3.rotateZ(Math.PI/2);
    edge3.rotateY(Math.PI);
    edge3.translate(0, halfSize, halfSize);

    let edge4 = new THREE.CylinderGeometry(edgeRadius, edgeRadius, pieceSize - backEdgeRadius * 2,          smoothness * 2, cylinderSegments, true, Math.PI/2, Math.PI/2);
    edge4.rotateZ(Math.PI/2);
    edge4.rotateY(Math.PI/2);
    edge4.translate(-halfSize, halfSize, 0);



    // side
    // create side pieces using planes
    let sideSeg1 = new THREE.PlaneGeometry(pieceSize - backEdgeRadius * 2, pieceSize - edgeRadius * 2);
    sideSeg1.rotateX(-Math.PI/2);
    sideSeg1.translate(0, pieceSize/2, 0);

    let sideSeg2 = new THREE.PlaneGeometry(backEdgeRadius - edgeRadius, pieceSize - backEdgeRadius * 2);
    sideSeg2.rotateX(-Math.PI/2);
    sideSeg2.translate((pieceSize - backEdgeRadius - edgeRadius)/2, pieceSize/2, 0);

    let sideSeg3 = new THREE.PlaneGeometry(backEdgeRadius - edgeRadius, pieceSize - backEdgeRadius * 2);
    sideSeg3.rotateX(-Math.PI/2);
    sideSeg3.translate((-pieceSize + backEdgeRadius + edgeRadius)/2, pieceSize/2, 0);

    // create side pieces to align with the curved corners by using circles
    let sideSeg4 = new THREE.CircleGeometry(backEdgeRadius - edgeRadius, smoothness * 2, Math.PI/2, Math.PI/2);
    sideSeg4.rotateX(-Math.PI/2);
    sideSeg4.translate(-pieceSize/2 + backEdgeRadius, pieceSize/2, -pieceSize/2 + backEdgeRadius);

    let sideSeg5 = new THREE.CircleGeometry(backEdgeRadius - edgeRadius, smoothness * 2, 0, Math.PI/2);
    sideSeg5.rotateX(-Math.PI/2);
    sideSeg5.translate(pieceSize/2 - backEdgeRadius, pieceSize/2, -pieceSize/2 + backEdgeRadius);

    let sideSeg6 = new THREE.CircleGeometry(backEdgeRadius - edgeRadius, smoothness * 2, -Math.PI/2, Math.PI/2);
    sideSeg6.rotateX(-Math.PI/2);
    sideSeg6.translate(pieceSize/2 - backEdgeRadius, pieceSize/2, pieceSize/2 - backEdgeRadius);

    let sideSeg7 = new THREE.CircleGeometry(backEdgeRadius - edgeRadius, smoothness * 2, Math.PI, Math.PI/2);
    sideSeg7.rotateX(-Math.PI/2);
    sideSeg7.translate(-pieceSize/2 + backEdgeRadius, pieceSize/2, pieceSize/2 - backEdgeRadius);



    // create buffer geometry to combine the pieces of the top face
    let topFace = new ExBufferGeometry();
    
    // merge all the pieces of the top face together
    topFace.mergeShapes(corner1, corner2, corner3, corner4, edge1, edge2, edge3, edge4, sideSeg1, sideSeg2, sideSeg3, sideSeg4, sideSeg5, sideSeg6, sideSeg7);

    // add top face to the main group
    group.add(new THREE.Mesh(topFace, upColor.color));



    // inner side
    // create rounded edges for the back side of the center piece using cylinders
    let backEdge1 = new THREE.CylinderGeometry(backEdgeRadius, backEdgeRadius, pieceSize - edgeRadius - backEdgeRadius, smoothness * 2, cylinderSegments, true, -Math.PI/2, Math.PI/2);
    backEdge1.rotateY(-Math.PI/2);
    backEdge1.translate(-pieceSize/2 + backEdgeRadius, edgeRadius/2 + backEdgeRadius/2 - edgeRadius, -pieceSize/2 + backEdgeRadius);

    let backEdge2 = new THREE.CylinderGeometry(backEdgeRadius, backEdgeRadius, pieceSize - backEdgeRadius * 2, smoothness * 2, cylinderSegments, true, Math.PI/2, Math.PI/2);
    backEdge2.rotateZ(-Math.PI/2);
    backEdge2.translate(0, -pieceSize/2 + backEdgeRadius, -pieceSize/2 + backEdgeRadius);

    // create face for the back side of the edge piece using planes
    let backFace = new THREE.PlaneGeometry(pieceSize - backEdgeRadius * 2, pieceSize - edgeRadius - backEdgeRadius);
    backFace.translate(0, (backEdgeRadius - edgeRadius)/2, -pieceSize/2);

    // create rounded corner for the back side of the corner piece using a sphere
    let backCorner = new THREE.SphereGeometry(backEdgeRadius, smoothness * 2, smoothness * 2, -Math.PI/2, Math.PI/2, Math.PI/2, Math.PI/2);
    backCorner.translate(-pieceSize/2 + backEdgeRadius, -pieceSize/2 + backEdgeRadius, -pieceSize/2 + backEdgeRadius);


    // create a buffer geometry to store all the pieces of one half of the back side in a single variable
    let innerSide1 = new ExBufferGeometry();
    innerSide1.mergeShapes(backEdge1, backEdge2, backFace, backCorner);



    // create a clone of 'innerSide1' to act as the other four parts of the back side of the center piece
    let innerSide2 = innerSide1.clone();
    let innerSide3 = innerSide1.clone();
    let innerSide4 = innerSide1.clone();

    // rotate other inner sides into the correct position
    innerSide2.rotateY(Math.PI/2);
    innerSide3.rotateY(Math.PI);
    innerSide4.rotateY(-Math.PI/2);



    // create additional face to fill the bottom of the center piece
    let bottomFace = new THREE.PlaneGeometry(pieceSize - backEdgeRadius * 2, pieceSize - backEdgeRadius * 2);
    bottomFace.rotateX(-Math.PI/2);
    bottomFace.translate(0, -pieceSize/2, 0);


    // make buffer geometry to store all componenets of the inner side of the edge piece
    let innerSide = new ExBufferGeometry();

    // merge all pieces of the inner side of the edge piece into a single variable
    innerSide.mergeShapes(innerSide1, innerSide2, innerSide3, innerSide4, bottomFace);

    // add inner side to the main group
    group.add(new THREE.Mesh(innerSide, innerColor.color));
   
    // translate piece into correct rotation
    group.translateX(upColor.coordinateOffset.x);
    group.translateY(upColor.coordinateOffset.y);
    group.translateZ(upColor.coordinateOffset.z);

    // rotate cube into correct orientation
    group.rotation.set(upColor.upRotationOffset.x, upColor.upRotationOffset.y, upColor.upRotationOffset.z);



    // return the main group
    return group;
}



// function to create the middle piece of a rubiks cube, takes in one argument for the color of the piece
export function constructOrigin(innerColor: ColorType = gray) {

    // define constant for the radius of the rounded back edges
    const backEdgeRadius = pieceSize/4;

    // define constant for half the size of the cube minus the edge size
    const halfSize = pieceSize * 0.5 - edgeRadius;

    // create new group to store all parts of the center piece in a single variable
    let group = new THREE.Group();

    // corners
    let corner1 = new THREE.SphereGeometry(backEdgeRadius, smoothness * 2, smoothness * 2, -Math.PI/2, Math.PI/2, 0, Math.PI/2);
    corner1.translate(-pieceSize/2 + backEdgeRadius, pieceSize/2 - backEdgeRadius, -pieceSize/2 + backEdgeRadius);

    let corner2 = corner1.clone();
    corner2.rotateY(-Math.PI/2);

    // edges
    let edge1 = new THREE.CylinderGeometry(backEdgeRadius, backEdgeRadius, pieceSize - backEdgeRadius * 2, smoothness * 2, cylinderSegments, true, Math.PI/2, Math.PI/2);
    edge1.rotateZ(Math.PI/2);
    edge1.translate(0, pieceSize/2 - backEdgeRadius, -pieceSize/2 + backEdgeRadius);

    let edge2 = edge1.clone();
    let edge3 = edge1.clone();

    edge2.rotateY(-Math.PI/2);
    edge3.rotateY(Math.PI/2);

    // faces
    let face1 = new THREE.PlaneGeometry(pieceSize - backEdgeRadius * 2, pieceSize - backEdgeRadius * 2);
    face1.rotateX(-Math.PI/2);
    face1.translate(0, pieceSize/2, 0);

    // make buffer geometry to store a section of the piece with a corners, edges, and a face
    let piece1: ExBufferGeometry = new ExBufferGeometry();

    // merge corner and edge together
    piece1.mergeShapes(corner1, corner2, edge1, edge2, edge3, face1);

    // duplicate piece
    let piece2 = piece1.clone();
    let piece3 = piece1.clone();
    let piece4 = piece1.clone();

    // rotate pieces into correct position
    piece1.rotateZ(Math.PI/2);
    piece2.rotateZ(Math.PI/2);
    piece3.rotateZ(Math.PI/2);
    piece4.rotateZ(Math.PI/2);

    piece2.rotateY(-Math.PI/2);
    piece3.rotateY(Math.PI);
    piece4.rotateY(Math.PI/2);


    // make buffer geometry to store all parts of the piece
    let piece: ExBufferGeometry = new ExBufferGeometry();

    // merge pieces together
    piece.mergeShapes(piece1, piece2, piece3, piece4);

    // clone face1 to make the top face of the piece
    let topFace = face1.clone();

    // clone face1 to make the bottom face of the piece
    let bottomFace = face1.clone();

    // translate bottom piece into correct position
    bottomFace.translate(0, -pieceSize, 0);

    // add top and bottom faces to the main piece
    piece.mergeShapes(topFace, bottomFace);

    // convert full piece to a mesh and add it to the main group
    group.add(new THREE.Mesh(piece, innerColor.color));

    // return the main group
    return group;
}