/*
*  Comp4357 Lab 0
*  Daniel McRae (A01173248)
*  ChatGPT was used to assist with commenting this code.
*/

// Button class represents individual buttons used in the game.
class Button {
    constructor(color, width, height, id) {
        //Stores parameter values in the button, and initializes the styling.
        this.id = id;
        this.btn = document.createElement("button");
        this.btn.width = width;
        this.btn.height = height;
        this.btn.style.backgroundColor = color;
        this.btn.style.width = width;
        this.btn.style.height = height;
        this.btn.className = "memory_button";

        //Creates a text element, and sets the button's id as the text.
        this.txt = document.createElement("h1");
        this.txt.innerHTML = id + 1;

        //Append the text element to the button, and the button to the document.
        this.btn.appendChild(this.txt);
        document.body.appendChild(this.btn);
    }

    // Displays the button's label text
    ShowText() {
        if (!this.btn.hasChildNodes()) {
            this.txt = document.createElement("h1");
            this.txt.innerHTML = this.id + 1;
            this.btn.appendChild(this.txt);
        }
    }

    // Hides the button's label text
    HideText() {
        this.txt.remove();
    }

    // Sets the button's position on the screen
    SetLocation(x, y) {
        this.btn.style.position = "absolute"; // Use absolute positioning for proper movement
        this.btn.style.left = x;
        this.btn.style.top = y;
    }
}

// Game class manages the overall game logic and flow
class Game {
    constructor(numButtons, timesMoved, moveDelay) {
        this.statusMessages = new StatusMessages(); // Initialize status message handler
        this.statusMessages.HideMessage(); // Hide any existing messages

        let buttons = [];
        for (let i = 0; i < numButtons; i++) {
            // Create buttons with random colors and the specified dimensions
            buttons[i] = new Button(this.GetRandomColour(), '10em', '5em', i);
        }

        this.buttons = buttons;
        this.timesMoved = timesMoved;
        this.moveDelay = moveDelay;

        this.progress = -1; // Tracks progress through button sequence
        this.active = false; // Prevents interaction with game buttons
    }

    // Starts the game, moving the buttons, and enabling interaction afterwards.
    Begin() {
        for (let i = 0; i < this.buttons.length; i++) {
            // Setup button click events, requiring a consistent reference
            this.buttons[i].btn.onclick = function () { currentGame.Select(i); }
            this.buttons[i].HideText(); // Hide button text
        }

        // Moves buttons periodically based on the specified delay
        for (let inc = 0; inc < this.timesMoved; inc++) {
            setTimeout(() => this.MoveButtons(), 1000 * inc * this.moveDelay);
        }

        // Enables game interaction after the buttons have moved
        setTimeout(() => this.active = true, 1000 * this.moveDelay * (this.timesMoved - 1));
    }

    // Handles the logic when a button is selected by the player
    Select(button) {
        // Ignore invalid selections/inactive games
        if (!this.active || button <= this.progress) return; 

        //Check if the selected button's id is correct.
        if (button == this.progress + 1) {
            this.progress++;
            this.buttons[button].ShowText();

            //Checks for game completion
            if (this.progress >= this.buttons.length - 1) {
                this.Victory();
                this.active = false;
            }
        } else {
            // Trigger game over if wrong button was selected
            this.GameOver();
            this.active = false;
        }
    }

    // Displays victory message and stops the game
    Victory() {
        this.statusMessages.DisplayVictoryMessage();
    }

    // Handles game over logic, reveals all buttons and displays message
    GameOver() {
        this.statusMessages.DisplayFailureMessage();

        for (let i = 0; i < this.buttons.length; i++) {
            this.buttons[i].ShowText(); 
        }
    }

    // Generates a random hex color for button backgrounds
    GetRandomColour() {
        return Math.floor(Math.random() * 16777215).toString(16);
    }

    // Moves all buttons to random positions on the screen
    MoveButtons() {
        //Gets the button size to properly prevent overlap/out of window placement
        let offHeight = this.buttons[0].btn.offsetHeight;
        let offWidth = this.buttons[0].btn.offsetWidth;

        //Gets the size of the window
        let width = window.innerWidth;
        let height = window.innerHeight;

        for (let i = 0; i < this.buttons.length; i++) {
            // Randomly generate positions for buttons within the given window
            let x = Math.max(Math.min(Math.random() * width, width - offWidth), offWidth);
            let y = Math.max(Math.min(Math.random() * height, height - offHeight), offHeight * 2);

            this.buttons[i].SetLocation(x + "px", y + "px");

            // Check for collisions and reposition if necessary
            while (this.CheckCollision(this.buttons[i].btn)) {
                x = Math.max(Math.min(Math.random() * width, width - offWidth), offWidth);
                y = Math.max(Math.min(Math.random() * height, height - offHeight), offHeight * 2);
                this.buttons[i].SetLocation(x + "px", y + "px");
            }
        }
    }

    // Checks if a button collides with any other button
    CheckCollision(button) {
        let btnWidth = button.offsetWidth;
        let btnHeight = button.offsetHeight;

        let posX = parseInt(button.style.left);
        let posY = parseInt(button.style.top);

        // Check collisions with other buttons
        for (let i = 0; i < this.buttons.length; i++) {
            let current = this.buttons[i].btn;
            if (current === button) continue; // Skip self

            let currentX = parseInt(current.style.left);
            let currentY = parseInt(current.style.top);
            let currentWidth = current.offsetWidth;
            let currentHeight = current.offsetHeight;

            // Detect overlap in both x and y axes
            let xOverlap = (posX < currentX + currentWidth && posX + btnWidth > currentX);
            let yOverlap = (posY < currentY + currentHeight && posY + btnHeight > currentY);

            if (xOverlap && yOverlap) {
                return true; // Collision detected
            }
        }

        return false; // No collision
    }
}

// Class to handle status messages such as victory or failure
class StatusMessages {
    constructor() {
        this.container = document.getElementById("statusMessage"); // Reference to the status message element
    }

    // Displays failure message
    DisplayFailureMessage() {
        this.container.innerHTML = FailureMessage;
    }

    // Displays victory message
    DisplayVictoryMessage() {
        this.container.innerHTML = VictoryMessage;
    }

    // Hides any displayed message
    HideMessage() {
        this.container.innerHTML = "";
    }
}

let currentGame;

// Resets the game by removing buttons and starting a new game
function Reset() {
    let buttons = document.body.getElementsByClassName("memory_button");
    let count = document.body.getElementsByClassName("buttonCount")[0].value;

    //Remove existing buttons
    while (buttons.length > 0) {
        buttons[0].remove();
    }
    console.log(count);
    currentGame = new Game(count, 3, 2); // Start a new game
    setTimeout(() => currentGame.Begin(), 1000 * 5);
}