
const cylinderSegments = 9;
const smoothness = cylinderSegments;
const radius = 0.5;

export function roundEdgedBox(width, height, depth, colors) {

    width = width || 1;
    height = height || 1;
    depth = depth || 1;

    let halfWidth = width * 0.5 - radius;
    let halfHeight = height * 0.5 - radius;
    let halfDepth = depth * 0.5 - radius;

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

    // corners - 8 eighths of a sphere
    // let corner1Geometry = new THREE.SphereBufferGeometry(radius, smoothness, smoothness, 0, Math.PI * 0.5, 0, Math.PI * 0.5);
    // corner1Geometry.translate(-halfWidth, halfHeight, halfDepth);

    // let corner1 = new THREE.Mesh(corner1Geometry, backColor);



    // let corner11 = new THREE.SphereGeometry(radius, smoothness, smoothness, Math.PI * 0.5, Math.PI * 0.25, Math.PI * 0.5, Math.PI * 0.25);
    // corner11.rotateZ(Math.PI * 0.5);
    // corner11.translate(halfWidth, halfHeight, halfDepth);

    // let corner12 = new THREE.SphereGeometry(radius, smoothness, smoothness, Math.PI * 0.5, Math.PI * 0.25, Math.PI * 0.25, Math.PI * 0.25);
    // corner12.translate(halfWidth, halfHeight, halfDepth);

    let corner11 = new THREE.SphereGeometry(radius, smoothness, smoothness, -Math.PI * 1/6, Math.PI * 2/3, Math.PI * 0, Math.PI * 1/3);
    corner11.rotateX(Math.PI * 11/36);
    corner11.rotateY(Math.PI * 9/36);
    corner11.translate(halfWidth, halfHeight, halfDepth);



    let corner12 = new THREE.SphereGeometry(radius, smoothness, smoothness, Math.PI * 1/2, Math.PI * 2/3, Math.PI * 0, Math.PI * 1/3);
    corner12.rotateX(Math.PI * 11/36);
    corner12.rotateY(Math.PI * 9/36);
    corner12.translate(halfWidth, halfHeight, halfDepth);



    let corner13 = new THREE.SphereGeometry(radius, smoothness, smoothness, Math.PI * 7/6, Math.PI * 2/3, Math.PI * 0, Math.PI * 1/3);
    corner13.rotateX(Math.PI * 11/36);
    corner13.rotateY(Math.PI * 9/36);
    corner13.translate(halfWidth, halfHeight, halfDepth);




    let corner14 = new THREE.SphereGeometry(radius, smoothness, smoothness, Math.PI * 0.5, Math.PI * 0.25, Math.PI * 0.25, Math.PI * 0.25);
    corner14.rotateY(Math.PI * 0.25);
    corner14.translate(halfWidth, halfHeight, halfDepth);

    let corner15 = new THREE.SphereGeometry(radius, smoothness, smoothness, Math.PI * 1, Math.PI * 0.25, Math.PI * 0.25, Math.PI * 0.25);
    corner15.rotateX(Math.PI * 0.5);
    corner15.translate(halfWidth, halfHeight, halfDepth);



    let corner16 = new THREE.SphereGeometry(radius, smoothness, smoothness, Math.PI * 0.5, Math.PI * 0.25, Math.PI * 0.5, Math.PI * 0.25);
    corner16.rotateZ(Math.PI * 0.5);
    corner16.rotateX(-Math.PI * 0.25);
    corner16.translate(halfWidth, halfHeight, halfDepth);


    let corner17 = new THREE.SphereGeometry(radius, smoothness, smoothness, Math.PI * 1, Math.PI * 0.25, Math.PI * 0.25, Math.PI * 0.25);
    corner17.rotateX(Math.PI * 0.5);
    corner17.rotateZ(Math.PI * 0.25);
    corner17.translate(halfWidth, halfHeight, halfDepth);



    let corner3 = new THREE.SphereGeometry(radius, smoothness, smoothness, 0, Math.PI * 0.5, Math.PI * 0.5, Math.PI * 0.5);
    corner3.translate(-halfWidth, -halfHeight, halfDepth);

    let corner4 = new THREE.SphereGeometry(radius, smoothness, smoothness, Math.PI * 0.5, Math.PI * 0.5, Math.PI * 0.5, Math.PI * 0.5);
    corner4.translate(halfWidth, -halfHeight, halfDepth);

    // const positionAttribute = corner1Geometry.getAttribute("position");

    // console.log(positionAttribute);

    // let vertices = [];
    // let indices = corner1Geometry.index.array;
    
    // let toggle = 0;

    // let max = 0

    // for (let i = 0; i < positionAttribute.count; i++) {

    //     console.log(positionAttribute.getX(i) + ", " + positionAttribute.getY(i) + ", " + positionAttribute.getZ(i));

    //     vertices.push(positionAttribute.getX(i));
    //     vertices.push(positionAttribute.getY(i));
    //     vertices.push(positionAttribute.getZ(i));

    //     toggle = (toggle + 1) % 3

    //     // max = (corner1Geometry.index.array[i] > max) ? corner1Geometry.index.array[i] : max;
    //     // indices.push(corner1Geometry.index.array[i]);

    // }

    // // console.log("max: " + max);
    // // while (vertices.length % 3 != 0) vertices.pop();
        
    // console.log("vertices: " + vertices);
    // console.log("indices: " + indices);

    // let shape = new THREE.PolyhedronGeometry(vertices, indices, 2 * Math.PI);
    // // shape.translate(-halfWidth, halfHeight, halfDepth);


    // group.add(new THREE.Mesh(shape, backColor)); 
    // group.add(corner1);


    
    group.add(new THREE.Mesh(corner11, wireFrameGreen)); 
    group.add(new THREE.Mesh(corner12, wireFrameRed));
    group.add(new THREE.Mesh(corner13, wireFrameWhite)); 
    // group.add(new THREE.Mesh(corner13, wireFrameRed));
    // group.add(new THREE.Mesh(corner14, wireFrameRed));
    // group.add(new THREE.Mesh(corner15, wireFrameWhite));
    // group.add(new THREE.Mesh(corner16, wireFrameWhite));

    // group.add(new THREE.Mesh(corner3, downColor)); 
    // group.add(new THREE.Mesh(corner4, downColor));
    

    // edges - 2 fourths for each dimension
    // width
    let edge11 = new THREE.CylinderGeometry(radius, radius, width - radius * 2, smoothness, cylinderSegments, true, 0, Math.PI * 0.25);
    edge11.rotateZ(Math.PI * 0.5);
    edge11.translate(0, halfHeight, halfDepth);

    let edge12 = new THREE.CylinderGeometry(radius, radius, width - radius * 2, smoothness, cylinderSegments, true, Math.PI * 0.25, Math.PI * 0.25);
    edge12.rotateZ(Math.PI * 0.5);
    edge12.translate(0, halfHeight, halfDepth);



    let edge21 = new THREE.CylinderGeometry(radius, radius, width - radius * 2, smoothness, cylinderSegments, true, Math.PI * 0.75, Math.PI * 0.25);
    edge21.rotateX(Math.PI * 0.5);
    edge21.translate(halfWidth, halfHeight, 0);

    let edge22 = new THREE.CylinderGeometry(radius, radius, width - radius * 2, smoothness, cylinderSegments, true, Math.PI * 0.5, Math.PI * 0.25);
    edge22.rotateX(Math.PI * 0.5);
    edge22.translate(halfWidth, halfHeight, 0);



    // height
    let edge31 = new THREE.CylinderGeometry(radius, radius, height - radius * 2, smoothness, cylinderSegments, true, 0, Math.PI * 0.25);
    edge31.translate(halfWidth, 0, halfDepth);

    let edge32 = new THREE.CylinderGeometry(radius, radius, width - radius * 2, smoothness, cylinderSegments, true, Math.PI * 0.25, Math.PI * 0.25);
    // edge32.rotateZ(Math.PI * 0.5);
    edge32.translate(halfWidth, 0, halfDepth);



    let edge4 = new THREE.CylinderGeometry(radius, radius, height - radius * 2, smoothness, cylinderSegments, true, Math.PI * 1.75, Math.PI * 0.25);
    edge4.translate(-halfWidth, 0, halfDepth);

    // depth
    let edge5 = new THREE.CylinderGeometry(radius, radius, depth - radius * 2, smoothness, cylinderSegments, true, 0, Math.PI * 0.25);
    edge5.rotateX(-Math.PI * 0.5);
    edge5.translate(halfWidth, halfHeight, 0);

    let edge6 = new THREE.CylinderGeometry(radius, radius, depth - radius * 2, smoothness, cylinderSegments, true, Math.PI * 0.5, Math.PI * 0.25);
    edge6.rotateX(-Math.PI * 0.5);
    edge6.translate(halfWidth, -halfHeight, 0);

    group.add(new THREE.Mesh(edge11, wireFrameGreen));
    group.add(new THREE.Mesh(edge12, wireFrameWhite));

    group.add(new THREE.Mesh(edge21, wireFrameWhite));
    group.add(new THREE.Mesh(edge22, wireFrameRed));

    group.add(new THREE.Mesh(edge31, wireFrameGreen));
    group.add(new THREE.Mesh(edge32, wireFrameRed));

    // group.add(new THREE.Mesh(edge4, trimColor));
    // group.add(new THREE.Mesh(edge5, trimColor));
    // group.add(new THREE.Mesh(edge6, trimColor));

    
    // sides
    // front
    let side1 = new THREE.PlaneGeometry(width - radius * 2, height - radius * 2, cylinderSegments, cylinderSegments);
    side1.translate(0, 0, depth * 0.5);

    // right
    let side2 = new THREE.PlaneGeometry(depth - radius * 2, height - radius * 2, cylinderSegments, cylinderSegments);
    side2.rotateY(Math.PI * 0.5);
    side2.translate(width * 0.5, 0, 0);


    // top
    let top = new THREE.PlaneGeometry(width - radius * 2, depth - radius * 2, cylinderSegments, cylinderSegments);
    top.rotateX(-Math.PI * 0.5);
    top.translate(0, height * 0.5, 0);

    // bottom
    let bottom = new THREE.PlaneGeometry(width - radius * 2, depth - radius * 2, cylinderSegments, cylinderSegments);
    bottom.rotateX(Math.PI * 0.5);
    bottom.translate(0, -height * 0.5, 0);



    
    return group;
}