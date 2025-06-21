import * as THREE from "three";
import { MoveType } from "./cubeMoveType";

// cube piece sizing and spacing
const pieceSize = 5;
const pieceGap = 0.05;
const pieceOffset = pieceSize + pieceGap;

/** simple class to allow xyz data to be more easily understandable */
export class XYZ {
    constructor(
        public x: number,
        public y: number,
        public z: number
    ) {}
}

/** simple class to allow color variables to store more info for simpler rendering */
export class ColorType {
    constructor(
        public color: THREE.MeshBasicMaterial,
        public coordinateOffset: XYZ,
        public upRotationOffset: XYZ,
        public frontRotationOffset: XYZ = new XYZ(0, 0, 0)
    ) {}
}

// create constants for each type of color that will be used during rendering
const colorWhite:  THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
const colorOrange: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ color: 0xff5000, side: THREE.DoubleSide })
const colorGreen:  THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
const colorRed:    THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide });
const colorBlue:   THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff, side: THREE.DoubleSide })
const colorYellow: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ color: 0xcfff04, side: THREE.DoubleSide })
const colorGray:   THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });

// create proper ColorType elements for each color to attach position and rotation data to each color
const white:  ColorType = new ColorType(colorWhite,  new XYZ(0, pieceOffset, 0),  new XYZ(0, 0, 0));
const orange: ColorType = new ColorType(colorOrange, new XYZ(-pieceOffset, 0, 0), new XYZ(0, 0, Math.PI/2),  new XYZ(0, -Math.PI/2, 0));
const green:  ColorType = new ColorType(colorGreen,  new XYZ(0, 0, pieceOffset),  new XYZ(Math.PI/2, 0, 0),  new XYZ(0, 0, 0));
const red:    ColorType = new ColorType(colorRed,    new XYZ(pieceOffset, 0, 0),  new XYZ(0, 0, -Math.PI/2), new XYZ(0, Math.PI/2, 0));
const blue:   ColorType = new ColorType(colorBlue,   new XYZ(0, 0, -pieceOffset), new XYZ(-Math.PI/2, 0, 0), new XYZ(0, Math.PI, 0));
const yellow: ColorType = new ColorType(colorYellow, new XYZ(0, -pieceOffset, 0), new XYZ(0, 0, Math.PI));
const gray:   ColorType = new ColorType(colorGray,   new XYZ(0, 0, 0), new XYZ(0, 0, 0));

// export piece constants and color data
export { pieceSize, pieceGap, pieceOffset, white, orange, green, red, blue, yellow, gray };

// create enumeration for the letter references to all edge tiles
export enum EdgeTile {
    A = "A",
    B = "B",
    C = "C",
    D = "D",

    E = "E",
    F = "F",
    G = "G",
    H = "H",

    I = "I",
    J = "J",
    K = "K",
    L = "L",

    M = "M",
    N = "N",
    O = "O",
    P = "P",

    Q = "Q",
    R = "R",
    S = "S",
    T = "T",

    U = "U",
    V = "V",
    W = "W",
    Sh = "SH"
};

// create enumeration for the letter references to all corner tiles
export enum CornerTile {
    A = "a",
    B = "b",
    C = "c",
    D = "d",

    E = "e",
    F = "f",
    G = "g",
    H = "h",

    I = "i",
    J = "j",
    K = "k",
    L = "l",

    M = "m",
    N = "n",
    O = "o",
    P = "p",

    Q = "q",
    R = "r",
    S = "s",
    T = "t",

    U = "u",
    V = "v",
    W = "w",
    Sh = "sh"
};

// create enumeration for the letter references to all corner tiles
export enum CenterTile {
    U = "up",
    L = "left",
    F = "front",
    R = "right",
    B = "back",
    D = "down"
};

// create enumeration for each type of piece
export enum PieceType {
    Corner = "corner",
    Edge = "edge",
    Center = "center"
};

// create enumeration for each color
export enum TileColor {
    W = "white",
    O = "orange",
    G = "green",
    R = "red",
    B = "blue",
    Y = "yellow"
};

// creat enumeration for each solve type
export enum SolveType {
    Beginner = "beginner",
    Intermediate = "intermediate",
    Advanced = "advanced"
};

// create enumeration for the different types of interface callback data
export enum CallbackData {
    ScrambleDone = "scrambleDone",
    ScrambleUndone = "scrambleUndone",
    SolveDone = "solveDone"
};

// create type to condense piece data for the cube
export type CubeTile = {color: TileColor, piece: THREE.Group, pieceType: PieceType, origin: CornerTile | EdgeTile | CenterTile};

// create type to condense move data for different types of cube moves
export type CubeMove = {moveType: MoveType, count: number, prime: boolean, speed: number};

// create type to shorten some lines of code for the tile move data because I'm lazy
export type MoveDataType = (CornerTile[][] | EdgeTile[][] | CenterTile[][])[];