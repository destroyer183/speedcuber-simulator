import * as THREE from "three";
// cube piece sizing and spacing
const pieceSize = 5;
const pieceGap = 0.05;
const pieceOffset = pieceSize + pieceGap;
// simple class to allow xyz data to be more easily understandable
export class XYZ {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}
// simple class to allow color variables to store more info for simpler rendering
export class ColorType {
    constructor(color, coordinateOffset, upRotationOffset, frontRotationOffset = new XYZ(0, 0, 0)) {
        this.color = color;
        this.coordinateOffset = coordinateOffset;
        this.upRotationOffset = upRotationOffset;
        this.frontRotationOffset = frontRotationOffset;
    }
}
const colorWhite = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
const colorOrange = new THREE.MeshBasicMaterial({ color: 0xff5000, side: THREE.DoubleSide });
const colorGreen = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
const colorRed = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide });
const colorBlue = new THREE.MeshBasicMaterial({ color: 0x0000ff, side: THREE.DoubleSide });
const colorYellow = new THREE.MeshBasicMaterial({ color: 0xcfff04, side: THREE.DoubleSide });
const colorGray = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });
const white = new ColorType(colorWhite, new XYZ(0, pieceOffset, 0), new XYZ(0, 0, 0));
const orange = new ColorType(colorOrange, new XYZ(-pieceOffset, 0, 0), new XYZ(0, 0, Math.PI / 2), new XYZ(0, -Math.PI / 2, 0));
const green = new ColorType(colorGreen, new XYZ(0, 0, pieceOffset), new XYZ(Math.PI / 2, 0, 0), new XYZ(0, 0, 0));
const red = new ColorType(colorRed, new XYZ(pieceOffset, 0, 0), new XYZ(0, 0, -Math.PI / 2), new XYZ(0, Math.PI / 2, 0));
const blue = new ColorType(colorBlue, new XYZ(0, 0, -pieceOffset), new XYZ(-Math.PI / 2, 0, 0), new XYZ(0, Math.PI, 0));
const yellow = new ColorType(colorYellow, new XYZ(0, -pieceOffset, 0), new XYZ(0, 0, Math.PI));
const gray = new ColorType(colorGray, new XYZ(0, 0, 0), new XYZ(0, 0, 0));
export { pieceSize, pieceGap, pieceOffset, white, orange, green, red, blue, yellow, gray };
export var EdgeTile;
(function (EdgeTile) {
    EdgeTile["A"] = "A";
    EdgeTile["B"] = "B";
    EdgeTile["C"] = "C";
    EdgeTile["D"] = "D";
    EdgeTile["E"] = "E";
    EdgeTile["F"] = "F";
    EdgeTile["G"] = "G";
    EdgeTile["H"] = "H";
    EdgeTile["I"] = "I";
    EdgeTile["J"] = "J";
    EdgeTile["K"] = "K";
    EdgeTile["L"] = "L";
    EdgeTile["M"] = "M";
    EdgeTile["N"] = "N";
    EdgeTile["O"] = "O";
    EdgeTile["P"] = "P";
    EdgeTile["Q"] = "Q";
    EdgeTile["R"] = "R";
    EdgeTile["S"] = "S";
    EdgeTile["T"] = "T";
    EdgeTile["U"] = "U";
    EdgeTile["V"] = "V";
    EdgeTile["W"] = "W";
    EdgeTile["Sh"] = "SH";
})(EdgeTile || (EdgeTile = {}));
;
export var CornerTile;
(function (CornerTile) {
    CornerTile["A"] = "a";
    CornerTile["B"] = "b";
    CornerTile["C"] = "c";
    CornerTile["D"] = "d";
    CornerTile["E"] = "e";
    CornerTile["F"] = "f";
    CornerTile["G"] = "g";
    CornerTile["H"] = "h";
    CornerTile["I"] = "i";
    CornerTile["J"] = "j";
    CornerTile["K"] = "k";
    CornerTile["L"] = "l";
    CornerTile["M"] = "m";
    CornerTile["N"] = "n";
    CornerTile["O"] = "o";
    CornerTile["P"] = "p";
    CornerTile["Q"] = "q";
    CornerTile["R"] = "r";
    CornerTile["S"] = "s";
    CornerTile["T"] = "t";
    CornerTile["U"] = "u";
    CornerTile["V"] = "v";
    CornerTile["W"] = "w";
    CornerTile["Sh"] = "sh";
})(CornerTile || (CornerTile = {}));
;
export var CenterTile;
(function (CenterTile) {
    CenterTile["U"] = "up";
    CenterTile["L"] = "left";
    CenterTile["F"] = "front";
    CenterTile["R"] = "right";
    CenterTile["B"] = "back";
    CenterTile["D"] = "down";
})(CenterTile || (CenterTile = {}));
;
export var PieceType;
(function (PieceType) {
    PieceType["Corner"] = "corner";
    PieceType["Edge"] = "edge";
    PieceType["Center"] = "center";
})(PieceType || (PieceType = {}));
;
export var TileColor;
(function (TileColor) {
    TileColor["W"] = "white";
    TileColor["O"] = "orange";
    TileColor["G"] = "green";
    TileColor["R"] = "red";
    TileColor["B"] = "blue";
    TileColor["Y"] = "yellow";
})(TileColor || (TileColor = {}));
;
export var MoveType;
(function (MoveType) {
    MoveType["U"] = "UMove";
    MoveType["L"] = "LMove";
    MoveType["F"] = "FMove";
    MoveType["R"] = "RMove";
    MoveType["B"] = "BMove";
    MoveType["D"] = "DMove";
    MoveType["u"] = "uMove";
    MoveType["l"] = "lMove";
    MoveType["f"] = "fMove";
    MoveType["r"] = "rMove";
    MoveType["b"] = "bMove";
    MoveType["d"] = "dMove";
    MoveType["x"] = "xMove";
    MoveType["y"] = "yMove";
    MoveType["z"] = "zMove";
    MoveType["M"] = "MMove";
    MoveType["E"] = "EMove";
    MoveType["S"] = "SMove";
})(MoveType || (MoveType = {}));
;
//# sourceMappingURL=cubeData.js.map