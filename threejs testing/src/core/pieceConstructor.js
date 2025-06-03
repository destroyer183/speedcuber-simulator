import * as THREE from 'three';


const smoothness = 9; // define constant for number of segments for shapes
const edgeRadius = 0.2; // define constant for radius of curved edges 

// define constants for wire frame colors
const wireFrameGreen = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
const wireFrameRed   = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
const wireFrameWhite = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
const wireFrameGray  = new THREE.MeshBasicMaterial({ color: 0xd3d3d3, wireframe: true });

// define constants for solid colors
const colorWhite = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
const colorGreen = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
const colorRed   = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide });
const colorGray  = new THREE.MeshBasicMaterial({ color: 0xd3d3d3, side: THREE.DoubleSide });



// create new function for buffer geometries that merges multiple buffer geometries
THREE.BufferGeometry.prototype.mergeShapes = function (...shapes) {

    // define variable to store the vertices that make up buffer geometries
    let vertices = [];

    // define variable to store the indices of the vertices that make up buffer geometries
    // each three consecutive values in this array are indices of different points in the vertices array, 
    // which each set of points representing a triangular plane that will be drawn
    let indices = [];

    // loop over very buffer geometry passed in
    for (let shape of shapes) {
        indices.push(...([...shape.getIndex().array].map(item => item + vertices.length / 3))); // add indices from a geometry, and offset them by the number of previous vertices
        vertices.push(...shape.getAttribute("position").array); // add vertices from a geometry
    }

    // convert vertices and indices to proper data types to merge them into the parent buffer geometry
    let position = new THREE.Float32BufferAttribute(new Float32Array(vertices), 3);
    let index = new THREE.Uint16BufferAttribute(new Uint16Array(indices), 1);

    // update position and index attributes on parent buffer geometry
    this.setAttribute("position", position);
    this.setIndex(index);
}



// define function to create a corner piece for a rubiks cube
// take in arguments for size, face colors, inner color, and whether or not to draw as a wire frame or not
export function constructCorner(size, upColor, frontColor, rightColor, innerColor, isWireFrame = false) {

    // define constant for radius of edges on the back piece of the corner
    const backEdgeRadius = size/4;

    // define constant for half the size of the cube minus the edge size
    const halfSize = size * 0.5 - edgeRadius;

    // create new group to store all parts of the corner piece in a single variable
    let group = new THREE.Group();

    // corners

    // create new sphere to act as a rounded corner of a face
    let corner1 = new THREE.SphereGeometry(edgeRadius, smoothness * 2, smoothness * 2, -Math.PI * 1/2, Math.PI * 1/2, Math.PI * 0, Math.PI * 1/2);
    // translate corner into proper position
    corner1.translate(-halfSize, halfSize, -halfSize);

    let corner2 = new THREE.SphereGeometry(edgeRadius, smoothness, smoothness * 2, Math.PI * 1/2, Math.PI * 1/4, Math.PI * 0, Math.PI * 1/2);
    corner2.rotateX(-Math.PI * 1/2);
    corner2.translate(halfSize, halfSize, -halfSize);

    // perform math to determine the proper rotations that need to be performed 
    // in order to make three differently colored pieces of a single corner come together seamlessly
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
    // create new cylinder to act as a rounded edge of a face
    let edge1 = new THREE.CylinderGeometry(edgeRadius, edgeRadius, size - edgeRadius * 2, smoothness * 2, 1, true, Math.PI * 2/4, Math.PI * 1/2);
    edge1.rotateZ(Math.PI * 1/2);
    edge1.translate(0, halfSize, -halfSize);

    let edge2 = new THREE.CylinderGeometry(edgeRadius, edgeRadius, size - edgeRadius * 2, smoothness, 1, true, Math.PI * 3/4, Math.PI * 1/4);
    edge2.rotateX(Math.PI * 1/2);
    edge2.translate(halfSize, halfSize, 0);

    let edge3 = new THREE.CylinderGeometry(edgeRadius, edgeRadius, size - edgeRadius * 2, smoothness, 1, true, Math.PI * 1/4, Math.PI * 1/4);
    edge3.rotateZ(Math.PI * 1/2);
    edge3.translate(0, halfSize, halfSize);

    let edge4 = new THREE.CylinderGeometry(edgeRadius, edgeRadius, size - edgeRadius * 2, smoothness * 2, 1, true, Math.PI * 1, Math.PI * 1/2);
    edge4.rotateX(Math.PI * 1/2);
    edge4.translate(-halfSize, halfSize, 0);

    

    // side
    // create new plane to act as a face of the cube
    let side = new THREE.PlaneGeometry(size - edgeRadius * 2, size - edgeRadius * 2, 4, 4);
    side.rotateX(-Math.PI * 1/2);
    side.translate(0, size * 1/2, 0);



    // create new buffer geometry to act as the entire top face of the corner
    let topFace = new THREE.BufferGeometry();
    
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

    // convert the faces to meshes and add them to the group, with their color depending on whether or not they are to be drawn as wire frames or not
    if (isWireFrame) {
        group.add(new THREE.Mesh(topFace, wireFrameWhite));
        group.add(new THREE.Mesh(frontFace, wireFrameGreen));
        group.add(new THREE.Mesh(rightFace, wireFrameRed));
    } else {
        group.add(new THREE.Mesh(topFace, upColor));
        group.add(new THREE.Mesh(frontFace, frontColor));
        group.add(new THREE.Mesh(rightFace, rightColor));
    }


    // perform lots of math that I can't properly explain without visuals
    // this determines the positioning and size of a spherical portion of the back side of the corner piece
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

    // create circle that will act as a cutout of a square for the back sides of the sphere
    let cutout = new THREE.CircleGeometry(cutoutRad, smoothness * 2, horizontalRot, horizontalArc);
    cutout.translate(halfSize - (cutoutRad * Math.cos(horizontalRot)), -halfSize * 1 - (cutoutRad * Math.sin(horizontalRot)), 0);

    // create buffer for the square with a cutout
    let backCutout = new THREE.BufferGeometry();

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
    let positionAttribute = new THREE.Float32BufferAttribute(new Float32Array(vertices), 3);
    let indexAttribute = new THREE.Uint16BufferAttribute(new Uint16Array(indices), 1);

    // add position and index attributes to the buffer geometry
    backCutout.setAttribute("position", positionAttribute);
    backCutout.setIndex(indexAttribute);

    // move cutout into proper place
    backCutout.rotateX(Math.PI/2);
    backCutout.translate(0, -halfSize - edgeRadius, 0);

    // define variables to simplify the code for the height and positioning of the back side edges
    let backEdgeHeight = size - edgeRadius - backEdgeRadius;
    let backEdgeZOffset = halfSize - backEdgeHeight/2;

    // define vertices for a face of the back side
    let backFaceVertices = [
        -size/2 + backEdgeRadius, -size/2, -size/2 + backEdgeRadius,
         size/2 - edgeRadius,     -size/2, -size/2 + backEdgeRadius,
        -size/2 + backEdgeRadius, -size/2,  size/2 - edgeRadius,

         size/2 - edgeRadius,     -size/2, -size/2 + backEdgeRadius,
         size/2 - edgeRadius,     -size/2,  size/2 - edgeRadius,
        -size/2 + backEdgeRadius, -size/2,  size/2 - edgeRadius,
    ];
    // define indices for a face of the back side
    let backFaceIndices = [
        0, 1, 2,
        3, 4, 5
    ];

    // create back face buffer geometry
    let backFace = new THREE.BufferGeometry();

    let backFacePositionAttribute = new THREE.Float32BufferAttribute(new Float32Array(backFaceVertices), 3);
    let backFaceIndexAttribute = new THREE.Uint16BufferAttribute(new Uint16Array(backFaceIndices), 1);
    backFace.setAttribute("position", backFacePositionAttribute);
    backFace.setIndex(backFaceIndexAttribute);



    // create cylinder to act as a rounded edge on the back side of the corner piece
    // maybe taper this inwards?
    let backEdge = new THREE.CylinderGeometry(backEdgeRadius, backEdgeRadius, backEdgeHeight, smoothness, 1, true, -Math.PI/2, Math.PI/2);
    backEdge.rotateX(Math.PI/2);
    backEdge.translate(-size/2 + backEdgeRadius, -halfSize - edgeRadius + backEdgeRadius, backEdgeZOffset);


    //  create sphere to act as the corner piece of the rounded back edges
    let backCorner = new THREE.SphereGeometry(backEdgeRadius, smoothness, smoothness, -Math.PI/2, Math.PI/2, Math.PI/2, Math.PI/2);
    backCorner.translate(-size/2 + backEdgeRadius, -size/2 + backEdgeRadius, -size/2 + backEdgeRadius);


    // create sphere to act as a curved and rounded portion of the back side of the corner piece
    let backSphereTemplate = new THREE.SphereGeometry(size * 2, smoothness * 2, 5, Math.PI * 1/2 + horizontalRot, horizontalArc, verticalRot, verticalArc);

    backSphereTemplate.translate(
        halfSize - (((size*2) * Math.cos(alpha - newArcBottom)) * Math.cos(horizontalRot)),
        -halfSize - ((size*2) * Math.sin(alpha - newArcBottom)) - edgeRadius,
        halfSize - (((size*2) * Math.cos(alpha - newArcBottom)) * Math.cos(horizontalRot)),
    );

    // create circle to seamlessly fill in a portion of the back side of the corner piece that isn't covered by other pieces
    let fillCornerTemplate = new THREE.CircleGeometry(edgeRadius, smoothness * 2, Math.PI, Math.PI/2);
    fillCornerTemplate.translate(-halfSize, -halfSize, halfSize);

    // create buffer attribute for the fill corner
    let fillCorner = new THREE.BufferGeometry();

    // get position attribute of corner circle
    let cornerPoints = fillCornerTemplate.getAttribute("position");

    // determine the x, y, z coordinates of the center point of the fill corner
    let pointX = -(size/2) + edgeRadius - (size*2)*(Math.cos(alpha - newArcBottom) - Math.cos(segSize + (alpha - newArcBottom))) * Math.sin(horizontalRot);
    let pointY = pointX;
    let pointZ = halfSize - (size*2)*(Math.cos(alpha - newArcBottom) - Math.cos(segSize + (alpha - newArcBottom))) * Math.cos(horizontalRot);

    // define initial vertices for the fill corner
    let fillCornerVertices = [
        pointX, pointY, pointZ,
        size / -2, (size - edgeRadius * 2) / -2, (size - edgeRadius * 2) / 2
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
    let cornerPositionAttribute = new THREE.Float32BufferAttribute(new Float32Array(fillCornerVertices), 3);
    let cornerIndexAttribute = new THREE.Uint16BufferAttribute(new Uint16Array(fillCornerIndices), 3);
    fillCorner.setAttribute("position", cornerPositionAttribute);
    fillCorner.setIndex(cornerIndexAttribute);



    // create buffere geometry to act as one third of the back side of the corner piece
    let backPiece1 = new THREE.BufferGeometry();

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
    let innerSide = new THREE.BufferGeometry()

    // merge all parts of the back piece into a sigle buffer geometry
    innerSide.mergeShapes(backPiece1, backPiece2, backPiece3, backCorner);



    if (isWireFrame) {
        // group.add(new THREE.Mesh(backSphere1, wireFrameGray));
        group.add(new THREE.Mesh(innerSide, wireFrameGray));
    } else {
        // group.add(new THREE.Mesh(backSphere1, innerColor));
        group.add(new THREE.Mesh(innerSide, innerColor));
    }

    

    // return the group containing all four pieces of the corner piece
    return group;
}



// define function to create an edge piece for a rubiks cube
// take in arguments for size, face colors, inner color,  and whether or not to draw as a wire frame or not
export function constructEdge(size, upColor, frontColor, innerColor, isWireFrame = false) {

    // define constant for the radius of the rounded back edges
    const backEdgeRadius = size/4;

    // define constant for half the size of the cube minus the edge size
    const halfSize = size * 0.5 - edgeRadius;

    // create new group to store all parts of the corner piece in a single variable
    let group = new THREE.Group();

    // corners
    // create rounded and curved corner by using a torus shape
    let corner1 = new THREE.TorusGeometry(backEdgeRadius - edgeRadius, edgeRadius, smoothness * 8, smoothness * 2, Math.PI/2);
    corner1.rotateX(Math.PI/2);
    corner1.rotateY(Math.PI);
    corner1.translate(-size/2 + backEdgeRadius, size/2 - edgeRadius, -size/2 + backEdgeRadius);

    let corner2 = new THREE.TorusGeometry(backEdgeRadius - edgeRadius, edgeRadius, smoothness * 8, smoothness * 2, Math.PI/2);
    corner2.rotateX(Math.PI/2);
    corner2.rotateY(Math.PI/2);
    corner2.translate(size/2 - backEdgeRadius, size/2 - edgeRadius, -size/2 + backEdgeRadius);

    // create rounded corner by making a sphere
    let corner3 = new THREE.SphereGeometry(edgeRadius, smoothness, smoothness * 2, Math.PI * 0, Math.PI * 1/4, Math.PI * 0, Math.PI * 1/2);
    corner3.rotateZ(-Math.PI * 1/2);
    corner3.translate(halfSize, halfSize, halfSize);

    let corner4 = new THREE.SphereGeometry(edgeRadius, smoothness, smoothness * 2, Math.PI * 3/4, Math.PI * 1/4, Math.PI * 0, Math.PI * 1/2);
    corner4.rotateZ(Math.PI * 1/2);
    corner4.translate(-halfSize, halfSize, halfSize);

    
    
    // edges
    // create rounded edges using cylinders
    let edge1 = new THREE.CylinderGeometry(edgeRadius, edgeRadius, size - backEdgeRadius * 2,          smoothness * 2, 1, true, Math.PI * 1/2, Math.PI * 1/2);
    edge1.rotateZ(Math.PI * 1/2);
    edge1.translate(0, halfSize, -halfSize);

    let edge2 = new THREE.CylinderGeometry(edgeRadius, edgeRadius, size - backEdgeRadius - edgeRadius, smoothness * 2, 1, true, Math.PI * 1/2, Math.PI * 1/2);
    edge2.rotateX(Math.PI * 1/2);
    edge2.translate(halfSize, halfSize, backEdgeRadius/2 - edgeRadius/2);

    let edge3 = new THREE.CylinderGeometry(edgeRadius, edgeRadius, size - edgeRadius * 2,              smoothness * 2, 1, true, Math.PI * 1/4, Math.PI * 1/4);
    edge3.rotateZ(Math.PI * 1/2);
    edge3.translate(0, halfSize, halfSize);

    let edge4 = new THREE.CylinderGeometry(edgeRadius, edgeRadius, size - backEdgeRadius - edgeRadius, smoothness * 2, 1, true, Math.PI * 1/1, Math.PI * 1/2);
    edge4.rotateX(Math.PI * 1/2);
    edge4.translate(-halfSize, halfSize, backEdgeRadius/2 - edgeRadius/2);



    // side
    // create side pieces using planes
    let sideSeg1 = new THREE.PlaneGeometry(size - edgeRadius * 2, size - backEdgeRadius - edgeRadius, 4, 4);
    sideSeg1.rotateX(-Math.PI * 1/2);
    sideSeg1.translate(0, size * 1/2, (backEdgeRadius - edgeRadius)/2);

    let sideSeg2 = new THREE.PlaneGeometry(size - backEdgeRadius * 2, backEdgeRadius - edgeRadius, 4, 4);
    sideSeg2.rotateX(-Math.PI * 1/2);
    sideSeg2.translate(0, size/2, -size/2 + backEdgeRadius/2 + edgeRadius/2);

    // create side pieces to align with the curved corners by using circles
    let sideSeg3 = new THREE.CircleGeometry(backEdgeRadius - edgeRadius, smoothness * 2, Math.PI/2, Math.PI/2);
    sideSeg3.rotateX(-Math.PI/2);
    sideSeg3.translate(-size/2 + backEdgeRadius, size/2, -size/2 + backEdgeRadius);

    let sideSeg4 = new THREE.CircleGeometry(backEdgeRadius - edgeRadius, smoothness * 2, 0, Math.PI/2);
    sideSeg4.rotateX(-Math.PI/2);
    sideSeg4.translate(size/2 - backEdgeRadius, size/2, -size/2 + backEdgeRadius);

    // create buffer geometry to combine the pieces of the top face
    let topFace = new THREE.BufferGeometry();
    
    // merge all the pieces of the top face together
    topFace.mergeShapes(corner4, corner3, corner1, corner2, edge1, edge2, edge3, edge4, sideSeg1, sideSeg2, sideSeg3, sideSeg4);

    // create a clone of the top face to act as the front face
    let frontFace = topFace.clone();

    // rotate the front face into the correct position
    frontFace.rotateY(Math.PI);
    frontFace.rotateX(Math.PI/2);

    // add top and front faces to the main group
    if (isWireFrame) {
        group.add(new THREE.Mesh(topFace, wireFrameWhite));
        group.add(new THREE.Mesh(frontFace, wireFrameGreen));
    } else {
        group.add(new THREE.Mesh(topFace, upColor));
        group.add(new THREE.Mesh(frontFace, frontColor));
    }



    // back side
    // create rounded edges for the back side of the edge piece using cylinders
    let backEdge1 = new THREE.CylinderGeometry(backEdgeRadius, backEdgeRadius, size - edgeRadius - backEdgeRadius, smoothness * 2, 1, true, -Math.PI/2, Math.PI/2);
    backEdge1.rotateY(-Math.PI/2);
    backEdge1.translate(-size/2 + backEdgeRadius, edgeRadius/2 + backEdgeRadius/2 - edgeRadius, -size/2 + backEdgeRadius);

    let backEdge2 = new THREE.CylinderGeometry(backEdgeRadius, backEdgeRadius, size - edgeRadius - backEdgeRadius, smoothness * 2, 1, true, Math.PI/1, Math.PI/2);
    backEdge2.rotateY(-Math.PI/2);
    backEdge2.translate(size/2 - backEdgeRadius, edgeRadius/2 + backEdgeRadius/2 - edgeRadius, -size/2 + backEdgeRadius);


    // create faces for the back side of the edge piece using planes
    let backFace1 = new THREE.PlaneGeometry(size - backEdgeRadius * 2, size - edgeRadius - backEdgeRadius, 4, 4);
    backFace1.translate(0, (backEdgeRadius - edgeRadius)/2, -size/2);

    let backFace2 = new THREE.PlaneGeometry(size - backEdgeRadius - edgeRadius, size - backEdgeRadius - edgeRadius, 4, 4);
    backFace2.rotateY(Math.PI/2);
    backFace2.translate(-size/2, (backEdgeRadius - edgeRadius)/2, (backEdgeRadius - edgeRadius)/2);

    // create rounded corner for the back side of the corner piece using a sphere
    let backCorner = new THREE.SphereGeometry(backEdgeRadius, smoothness * 2, smoothness * 2, -Math.PI/2, Math.PI/2, 0, Math.PI/2);
    backCorner.rotateZ(Math.PI/2);
    backCorner.translate(-size/2 + backEdgeRadius, -size/2 + backEdgeRadius, -size/2 + backEdgeRadius);

    // create a buffer geometry to store all the pieces of one half of the back side in a single variable
    let innerSide1 = new THREE.BufferGeometry();
    innerSide1.mergeShapes(backEdge1, backEdge2, backFace1, backFace2, backCorner);

    // create a clone of 'innerSide1' to act as the other half of the back side of the edge piece
    let innerSide2 = innerSide1.clone();

    // rotate 'innerSide2' into the correct position
    innerSide2.rotateZ(Math.PI);
    innerSide2.rotateX(-Math.PI/2);

    // make extra inner edge to fill the last gap in the back side of the edge piece
    let innerEdge = new THREE.CylinderGeometry(backEdgeRadius, backEdgeRadius, size - backEdgeRadius * 2, smoothness * 2, 1, true, Math.PI/2, Math.PI/2);
    innerEdge.rotateZ(-Math.PI/2);
    innerEdge.translate(0, -size/2 + backEdgeRadius, -size/2 + backEdgeRadius);

    // make buffer geometry to store all componenets of the inner side of the edge piece
    let innerSide = new THREE.BufferGeometry();

    // merge all pieces of the inner side of the edge piece into a single variable
    innerSide.mergeShapes(innerSide1, innerSide2, innerEdge);

    // add inner side to the main group
    if (isWireFrame) {
        // group.add(new THREE.Mesh(innerSide1, wireFrameGray));
        group.add(new THREE.Mesh(innerSide, wireFrameGray));
    } else {
        // group.add(new THREE.Mesh(innerSide1, innerColor));
        group.add(new THREE.Mesh(innerSide, innerColor));
    }


    
    // return the main group
    return group;
}

// REMOVE EXTRA SEGMENTS FOR FLAT FACES WHEN DONE

// define function to create a center piece for a rubiks cube
// take in arguments for size, face color, inner color, and whether or not to draw as a wire frame or not
export function constructCenter(size, color, innerColor, isWireFrame = false) {

    // define constant for the radius of the rounded back edges
    const backEdgeRadius = size/4;

    // define constant for half the size of the cube minus the edge size
    const halfSize = size * 0.5 - edgeRadius;

    // create new group to store all parts of the corner piece in a single variable
    let group = new THREE.Group();


}