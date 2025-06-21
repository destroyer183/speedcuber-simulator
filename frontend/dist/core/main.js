import { Cube } from "./cube";
import { CallbackData, SolveType } from "./dataTypes";
import * as Move from "./cubeMoveType";
/** Singleton class to represent the user interface and its functionality, besides the cube. */
export class UserInterface {
    /** @constructor main constructor for the 'Interface' class. */
    constructor() {
        /** protected variable to represent the current cube scramble */
        this._scramble = [];
        // check if the singleton instance already exists, and if it does, throw an error since there is only supposed to be one instance of this class
        if (UserInterface._instance !== undefined)
            throw new Error("Error! can't create more than one instance of a singleton class!");
        // set singleton instance
        UserInterface._instance = this;
        // create new cube object and store it in a variable
        this._cube = new Cube();
        // call function to initialize the interface
        this.initializeInterface();
        // call function to initialize the cube in the interface
        this.cube.generateScene();
        // call function to link the cube to the solver
        this.cube.linkSolver();
    }
    static get instance() {
        return this._instance;
    }
    get cube() {
        return this._cube;
    }
    get scramble() {
        return this._scramble;
    }
    set scramble(val) {
        this._scramble = val;
    }
    /** function to initialize the user interface and bind buttons to their cooresponding functions */
    initializeInterface() {
        // set the cube's reference to the interface
        this.cube.userInterface = UserInterface.instance;
        // bind buttons to functions
        document.getElementById("random-scramble").addEventListener("click", function () { UserInterface.instance.generateScramble(); });
        document.getElementById("begin-scramble").addEventListener("click", function () { UserInterface.instance.beginScramble(); });
        document.getElementById("begin-solve").addEventListener("click", function () { UserInterface.instance.beginSolve(); });
        document.getElementById("reset-cube").addEventListener("click", function () { UserInterface.instance.resetCube(); });
    }
    /**
     * function that the cube will call when it is done performing an action
     * @param callbackData the data that will tell this function what action has been completed
     */
    interfaceCallback(callbackData) {
        console.log(this.cube.data);
        // hide error message
        document.getElementById("error-message").style.display = "none";
        // check if the scramble has been applied to the cube
        if (callbackData == CallbackData.ScrambleDone) {
            // update which buttons are displayed
            document.getElementById("random-scramble").style.display = "none";
            document.getElementById("begin-scramble").style.display = "none";
            document.getElementById("begin-solve").style.display = "initial";
            document.getElementById("reset-cube").style.display = "initial";
        }
        // check if the scramble has been undone
        else if (callbackData == CallbackData.ScrambleUndone) {
            // update which buttons are displayed
            document.getElementById("random-scramble").style.display = "initial";
            document.getElementById("begin-scramble").style.display = "initial";
            document.getElementById("begin-solve").style.display = "none";
            document.getElementById("reset-cube").style.display = "none";
            // show scramble input box and hide scramble output text
            document.getElementById("scramble-input").style.display = "initial";
            document.getElementById("scramble-output").style.display = "none";
        }
        // check if the solve has been completed
        else if (callbackData == CallbackData.SolveDone) {
            // update which buttons are displayed
            document.getElementById("random-scramble").style.display = "initial";
            document.getElementById("begin-scramble").style.display = "initial";
            document.getElementById("begin-solve").style.display = "none";
            document.getElementById("reset-cube").style.display = "none";
            // show scramble input box and hide scramble output text
            document.getElementById("scramble-input").style.display = "initial";
            document.getElementById("scramble-output").style.display = "none";
        }
    }
    /** public function to generate and apply a random scramble to the cube */
    generateScramble() {
        // hide all buttons
        document.getElementById("random-scramble").style.display = "none";
        document.getElementById("begin-scramble").style.display = "none";
        document.getElementById("begin-solve").style.display = "none";
        document.getElementById("reset-cube").style.display = "none";
        // hide error message
        document.getElementById("error-message").style.display = "none";
        // create empty string to store the scramble data as a string to be displayed
        let scrambleText = "";
        // loop 20 times to generate 20 random moves
        for (let i = 0; i < 20; i++) {
            // generate base move
            let move = { moveType: Move.U, count: 1, prime: false, speed: 0.2 };
            // create array of all possible move directions for a scramble
            const moveOptions = [Move.U, Move.L, Move.F, Move.R, Move.B, Move.D];
            // select a random move from the possible moves
            move.moveType = moveOptions[Math.floor(Math.random() * 6)];
            // make the move count either one or two
            move.count *= Math.ceil(Math.random() * 2);
            // make the turn direction either prime or not, prevent turn from being prime if turn is a double move
            move.prime = (Math.random() > 0.5 && move.count === 1) ? true : false;
            // add the move to the scramble move array
            this.scramble.push(move);
            // switch case on the move type
            switch (move.moveType) {
                // U case, add string to scramble text and then exit switch case
                case Move.U: {
                    scrambleText += "U";
                    break;
                }
                case Move.L: {
                    scrambleText += "L";
                    break;
                }
                case Move.F: {
                    scrambleText += "F";
                    break;
                }
                case Move.R: {
                    scrambleText += "R";
                    break;
                }
                case Move.B: {
                    scrambleText += "B";
                    break;
                }
                case Move.D: {
                    scrambleText += "D";
                    break;
                }
            }
            // add an apostrophe to the scramble text if the move is prime
            scrambleText += (move.prime) ? "'" : "";
            // add a 2 to the scramble text if the move is a double move
            scrambleText += (move.count == 2) ? "2" : "";
            // add a space to the scramble text to separate each move
            scrambleText += " ";
        }
        // hide scramble input
        document.getElementById("scramble-input").style.display = "none";
        // add scramble text to the scramble display
        document.getElementById("scramble-output").innerHTML = scrambleText.trim();
        document.getElementById("scramble-output").style.display = "initial";
        // set return data for the cube
        this.cube.returnData = CallbackData.ScrambleDone;
        // add all moves to the cube's move queue
        this.cube.moveQueue.enqueue(...this.scramble);
    }
    /** public function to verify and begin performing the inputted scramble. */
    beginScramble() {
        // get the scramble text, and trim off any leading or trailing whitespace
        let scrambleText = document.getElementById("scramble-input").value.trim();
        // convert the scramble text to an array
        let scrambleData = scrambleText.split(" ");
        // check if the scramble is long enough, and put error message on screen to show that the scramble is too short if it is less than 15 moves long
        if (scrambleData.length < 15) {
            document.getElementById("error-message").innerHTML = "Error: Scramble must be at least 15 moves long.";
            document.getElementById("error-message").style.left = document.getElementById("scramble-input").offsetLeft + "px";
            document.getElementById("error-message").style.display = "initial";
            // exit this entire function
            return;
        }
        // loop over the inputted scramble data
        for (let move of scrambleData) {
            // generate base cube move
            let cubeMove = { moveType: Move.U, count: 1, prime: false, speed: 0.2 };
            // apply switch case on the first character of the inputted move
            switch (move[0]) {
                // U case, set move data for the cube move and exit the switch statement
                case "U": {
                    cubeMove.moveType = Move.U;
                    break;
                }
                case "L": {
                    cubeMove.moveType = Move.L;
                    break;
                }
                case "F": {
                    cubeMove.moveType = Move.F;
                    break;
                }
                case "R": {
                    cubeMove.moveType = Move.R;
                    break;
                }
                case "B": {
                    cubeMove.moveType = Move.B;
                    break;
                }
                case "D": {
                    cubeMove.moveType = Move.D;
                    break;
                }
                // default case if no other case triggers
                // this only happens if the inputted move is invalid
                default: {
                    // put error message on screen to show that the scramble text is invalid
                    document.getElementById("error-message").innerHTML = "Error: Scramble contains invalid moves.";
                    document.getElementById("error-message").style.left = document.getElementById("scramble-input").offsetLeft + "px";
                    document.getElementById("error-message").style.display = "relative";
                    // exit this entire function
                    return;
                }
            }
            // check if move data is longer than one character
            if (move.length == 2) {
                // apply switch case on the second character of the move data
                switch (move[1]) {
                    // prime case, set move direction to prime and exit switch statement
                    case "'": {
                        cubeMove.prime = true;
                        break;
                    }
                    // double case, set move count to two and exit switch statement
                    case "2": {
                        cubeMove.count = 2;
                        break;
                    }
                    // default case if no other case triggers
                    // this will only trigger if there is an invalid character in the move data string
                    default: {
                        // put error message on screen to show that the scramble text is invalid
                        document.getElementById("error-message").innerHTML = "Error: Scramble contains invalid move data.";
                        document.getElementById("error-message").style.left = document.getElementById("scramble-input").offsetLeft + "px";
                        document.getElementById("error-message").style.display = "initial";
                        // exit this entire function
                        return;
                    }
                }
            }
            // check if the move data is longer than two characters, this means there is an invalid move
            else if (move[0].length > 2) {
                // put error message on screen to show that the scramble text is invalid
                document.getElementById("error-message").innerHTML = "Error: Scramble contains invalid move data.";
                document.getElementById("error-message").style.left = document.getElementById("scramble-input").offsetLeft + "px";
                document.getElementById("error-message").style.display = "initial";
                // exit this entire function
                return;
            }
            // add move to scramble
            this.scramble.push(cubeMove);
        }
        // hide all buttons
        document.getElementById("random-scramble").style.display = "none";
        document.getElementById("begin-scramble").style.display = "none";
        document.getElementById("begin-solve").style.display = "none";
        document.getElementById("reset-cube").style.display = "none";
        // hide error message
        document.getElementById("error-message").style.display = "none";
        // hide scramble input
        document.getElementById("scramble-input").style.display = "none";
        // add scramble text to the scramble display
        document.getElementById("scramble-output").innerHTML = scrambleText.trim();
        document.getElementById("scramble-output").style.display = "initial";
        // set return data for the cube
        this.cube.returnData = CallbackData.ScrambleDone;
        // add all moves to the cube's move queue
        this.cube.moveQueue.enqueue(...this.scramble);
    }
    /** public function to begin solving the cube at beginner difficulty */
    beginSolve() {
        // hide all buttons
        document.getElementById("random-scramble").style.display = "none";
        document.getElementById("begin-scramble").style.display = "none";
        document.getElementById("begin-solve").style.display = "none";
        document.getElementById("reset-cube").style.display = "none";
        // set return data for the cube
        this.cube.returnData = CallbackData.SolveDone;
        // call function on cube to begin the solve
        this.cube.solve(SolveType.Beginner, this.scramble);
    }
    /** public function to reset the cube if a scramble has been applied */
    resetCube() {
        // hide all buttons
        document.getElementById("random-scramble").style.display = "none";
        document.getElementById("begin-scramble").style.display = "none";
        document.getElementById("begin-solve").style.display = "none";
        document.getElementById("reset-cube").style.display = "none";
        // hide error message
        document.getElementById("error-message").style.display = "none";
        // reverse scramble move order
        this.scramble.reverse();
        // reverse scramble move direction
        for (let move of this.scramble)
            move.prime = !move.prime;
        // set return data for the cube
        this.cube.returnData = CallbackData.ScrambleUndone;
        // send moves to the cube
        this.cube.moveQueue.enqueue(...this.scramble);
        // clear scramble data
        this.scramble = [];
    }
}
function main() {
    let userInterface = new UserInterface();
}
main();
//# sourceMappingURL=main.js.map