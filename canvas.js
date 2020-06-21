let canvas = document.querySelector("canvas");

canvas.width = 500;
canvas.height = 500;

let c = canvas.getContext('2d');

/*** Sounds ***/
let blop = new Audio("./Sounds/Blop.mp3");

// Axe Swings
let axeSwing1 = new Audio("./Sounds/axeSwing1.mp3");
let axeSwing2 = new Audio("./Sounds/axeSwing2.mp3");
let axeSwing3 = new Audio("./Sounds/axeSwing3.mp3");
let axeSwing4 = new Audio("./Sounds/axeSwing4.mp3");
let axeSwing5 = new Audio("./Sounds/axeSwing5.mp3")

let backgroundMusic = new Audio("./Sounds/backgroundMusic.mp3");
backgroundMusic.currentTime = 0;
backgroundMusic.loop = true; // The music plays after the user click into the game.


// Mouse Positions
let mouse = {
  x: undefined,
  y: undefined,
}

/*** Event Listeners ***/ 
// Mouse Position Setter
canvas.addEventListener("mousemove", function(e) { 
  let cRect = canvas.getBoundingClientRect();              // Gets the CSS positions along with width/height
  mouse.x = Math.round(e.clientX - cRect.left);        // Subtract the 'left' of the canvas from the X/Y
  mouse.y = Math.round(e.clientY - cRect.top);         // positions to get make (0,0) the top left of the 
  //console.log(mouse.x, mouse.y);
});

// Button click detection
canvas.addEventListener("click", function() {blop.play()});

let playClick = function() {
  if (mouse.x > playButton.x && mouse.x < playButton.x + playButton.width 
  && mouse.y < playButton.y + playButton.height && mouse.y > playButton.y) {
    c.clearRect(0, 0, canvas.width, canvas.height);
    introInstructions();
    backgroundMusic.play();
    canvas.removeEventListener("click", playClick);
  } else {
    alert("It's outside the button!");
    backgroundMusic.play();
  }
};
canvas.addEventListener("click", playClick);


/*** Objects ***/
let playButton = {
  width: 150,
  height: 50,
  colour: "red",
  x: 60,
  y: 230,
}

let playButtonText = {
  text: "Play",
  colour: "white",
  font: "40px Arial",
  x: playButton.x + 35,
  y: playButton.y + 40
}

// Sprites
// Axe Button
let axeButton = new Image();
axeButton.width = 250;
axeButton.height = 250;
axeButton.X = (canvas.width - axeButton.width) / 2;
axeButton.Y = (canvas.height - axeButton.height) / 2;
axeButton.src = "./Sprites/Axe_Button.png";

let axeButton2 = new Image();
axeButton2.width = 250;
axeButton2.height = 250;
axeButton2.X = axeButton.X;
axeButton2.Y = axeButton.Y;
axeButton2.src = "./Sprites/Axe_Button2.png";

// Button Function
let lumberValue = 0; // Actual Number of Lumber
let lumberNumber = 0; // Display for the user
let buttonValue = 1;

function addLumber() {
  lumberValue += buttonValue;
  let sound = Math.floor(Math.random() * 5 + 1);
  switch (sound) {
    case 1:
      axeSwing1.play();
    case 2:
      axeSwing2.play();
    case 3:
      axeSwing3.play();
    case 4:
      axeSwing4.play();
    case 5:
      axeSwing5.play();
  }
}

let backgroundStart = new Image();
backgroundStart.width = 500;
backgroundStart.height = 500;
backgroundStart.src = "./Sprites/startMenu.png";
backgroundStart.onload = function () {
  c.drawImage(backgroundStart, 0, 0);
  addPlayButton();
}

// Store Boxes
function StoreBox(place, bought, cost, x, y, width, height) {
  this.picture = new Image();
  this.picture.src = "./Sprites/soldOut.png";
  this.place = place;
  this.bought = bought;
  this.stock = 1;
  this.cost = cost;
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.buy = function() {
    if (this.stock > 0) {
      if (mouse.x > this.x && mouse.x < this.x + this.width
      && mouse.y > this.y && mouse.y < this.y + this.height) {
        if (lumberValue >= this.cost) {
          lumberValue -= this.cost;
          this.stock -= 1;
          console.log(this.stock, this.cost);
          if (place == "first") {
            buttonValue += 9;
          }
          canvas.removeEventListener("click", this.buy());
        }
      }
    } else {
      this.sold();
    }
  }
  this.sold = function() {
    c.beginPath();
    c.drawImage(this.picture, this.x, this.y);
  }
}

let firstBox = new StoreBox("first",false, 250, 103, 120, 108, 100);
let secondBox = new StoreBox("second", false, 750, 310, 120, 108, 100);
let thirdBox = new StoreBox("third", false, 1500, 103, 293, 108, 100);

// Store
let store = new Image();
store.activated = false;
store.width = 500;
store.height = 500;
store.X = 450;
store.Y = 0;
store.src = "./Sprites/store.png";
store.openText = function() {
  c.font = "15px Arial";
  // First Box
  c.fillText("Upgrade Axe", 115, 230);
  c.fillText("Cost: 250 Lumbers", 95, 250);
  // Second Box
  c.fillText("Hire Lumberjack", 305, 230);
  c.fillText("Cost: 750 Lumbers", 300, 250);
  // Third Box
  c.fillText("Buy Sawmill", 115, 400);
  c.fillText("Cost: 1500", 115, 415);
  // Fourth Box
  c.font = "30px Arial";
  c.fillText("None", 325, 410);
  // Desc.
  c.font = "20px Arial";
  c.fillText("Hover your mouse on these items to buy them!", 55, 450)
  canvas.removeEventListener("mousedown", addLumber);
}
store.open = function() {
  if ((mouse.x > store.X && mouse.x < store.X + 50) 
  && (mouse.y > 60 && mouse.y < 160)) {
    while (store.X > 0) {
      store.X -= 1;
    }
    store.activated = true;
  }
}
store.close = function() {
  if (mouse.x > 0 && mouse.x < 60 && mouse.y > 60 && mouse.y < 160) {
    while (store.X < 450) {
      store.X += 1;
    }
    canvas.addEventListener("mousedown", addLumber);
    store.activated = false;
  }
}

function addStore() {
  c.globalAlpha = 1;
  c.drawImage(store, store.X, store.Y);
  store.open();
  store.close();
}

// Background
function component(width, height, src, x, y) {
  this.image = new Image();
  this.image.src = src;
  this.width = width;
  this.height = height;
  this.speedX = -1;
  this.speedY = 0;    
  this.x = x;
  this.y = y;    
  this.update = function() {
    c.drawImage(this.image, this.x, this.y, this.width, this.height);
    c.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
  }
  this.newPos = function() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x == -(this.width)) {
      this.x = 0;
    }
  }    
}

let forestBackground = new component(1000, 500, "./Sprites/forest.png", 0, 0);

// These numbers, below this, are the same numbers above this. 
function gameButton() {
  if ((mouse.x > axeButton.X && mouse.x < axeButton.X + axeButton.width) 
  && (mouse.y < axeButton.Y + axeButton.height && mouse.y > axeButton.Y)) {
    c.beginPath();
    c.drawImage(axeButton2, axeButton2.X, axeButton2.Y);
    c.globalAlpha = 0.5;
    c.drawImage(axeButton, axeButton.X, axeButton.Y);
    canvas.style.cursor = "pointer";
    canvas.addEventListener("mousedown", addLumber); 
  } else {
    c.globalAlpha = 1;
    c.drawImage(axeButton, axeButton.X, axeButton.Y);
    canvas.style.cursor = "default";
    canvas.removeEventListener("mousedown", addLumber);
  }
}

/*** Display ***/
function addPlayButton() {
  c.beginPath();
  c.strokeRect(playButton.x, playButton.y, playButton.width, playButton.height);
  c.fillStyle = playButton.colour;
  c.fillRect(playButton.x, playButton.y, playButton.width, playButton.height);
  c.fillStyle = playButtonText.colour;
  c.font = playButtonText.font;
  c.fillText(playButtonText.text, playButtonText.x, playButtonText.y);
}

function introInstructions() {
  c.beginPath();
  c.font = "28px Arial";
  c.fillStyle = "black";
  c.fillText("How To Play?", 12, 50);
  c.font = "20px Arial";
  c.fillText("1. Click the button with an axe to gain lumber", 10, 125);
  c.fillText("2. Buy some upgrades in the store.", 10, 250);
  c.fillText("3. Have 1 million lumbers to win the game!", 10, 375);
  canvas.addEventListener("click", startGame);
}

// Lumber Numbers
let lumberBackground = new Image();
lumberBackground.X = 0;
lumberBackground.Y = 0;
lumberBackground.width = 260;
lumberBackground.height = 50;
lumberBackground.update = function() {
  if (lumberValue >= 1000000) {
    lumberNumber = (lumberValue / 1000000).toFixed(2) + "M";
  } else if (lumberValue >= 1000){
    lumberNumber = (lumberValue / 1000).toFixed(2) + "K";
  } else {
    lumberNumber = lumberValue;
  }
}

function lumberCount() {
  c.beginPath();
  c.globalAlpha = 1;
  c.fillStyle = "red";
  c.fillRect(lumberBackground.X, lumberBackground.Y, lumberBackground.width, lumberBackground.height);
  lumberBackground.update();
  c.font = "30px Arial";
  c.fillStyle = "white";
  c.fillText("Lumber: " + lumberNumber, 12, 40);
}

// Shows actual amount of lumber when the mouse is hovering over the displayed one.
function showLumberValue() {
  if ((mouse.x > lumberBackground.X && mouse.x < lumberBackground.X + lumberBackground.width) 
  && (mouse.y < lumberBackground.Y + lumberBackground.height && mouse.y > lumberBackground.Y)) {
    c.beginPath();
    c.globalAlpha = 1;
    c.fillStyle = "white";
    c.font = "30px Arial";
    c.fillText(lumberValue, mouse.x, mouse.y);
  }
}

let secondAdd = function() {
  setTimeout(function() {lumberValue += 0.05}, 1000);
}
let thirdAdd = function() {
  setTimeout(function() {lumberValue += 0.1}, 1000)
}

// Update function
function startGame() {
  requestAnimationFrame(startGame);
  canvas.removeEventListener("click", startGame);
  c.clearRect(0, 0, canvas.width, canvas.height);
  // Put functions and others below this comment.
  c.globalAlpha = 1;
  forestBackground.newPos();    
  forestBackground.update();
  lumberCount();
  showLumberValue();
  gameButton();
  addStore();
  if (store.activated == true) {
    store.openText();
    canvas.addEventListener("click", firstBox.buy());
    canvas.addEventListener("click", secondBox.buy());
    canvas.addEventListener("click", thirdBox.buy());
  }
  if (secondBox.stock == 0) {
    secondAdd();
  }
  if (thirdBox.stock == 0) {
    thirdAdd(); 
  }
  if (lumberValue >= 1000000) {
    alert("Congratulations! You finished the game! Refresh the website to play again.")
  }
}