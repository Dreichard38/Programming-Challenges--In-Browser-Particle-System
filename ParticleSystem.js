
// This is the abstract base class for all the different elements drawn on the canvas
class Element {
	// Each element has an x and y value, along with an x and y velocity value
	constructor(x, y, dx, dy) {
		this.x = x;
		this.y = y;
		this.dx = dx;
		this.dy = dy;
	}
	
	// Every frame, this function is called, which moves each element dx pixels down
	// and dy pixels to the right, along with checking to see if it's outside the canvas
	doFrame(ctx) {
		this.x += this.dx;
		this.y += this.dy;
		// If the element is out of bounds, remove its' doFrame member function,
		// To stop it from doing anything when it's called
		if (this.x > canvas.width || this.y > canvas.height) {
			delete this.doFrame;
		}
		// If the element is in bounds, call this.dorender to move it
		else {
			this.dorender(ctx);
		}
	}
	
	// Since this is an abstract base class not meant to be declared on its own,
	// dorender isn't defined in element. It takes the parameter ctx, which is of type canvasContext.
	dorender(ctx) {}
}

// The snow class slowly drifts down and to the right
class Snow extends Element {
	
	// The subclass constructor defines x, y, dx and dy, so it doesn't have any parameters
	constructor() {
		// Default dx and dy values, passed into the superclass constructor to get aded to the object
		var dx = 2,
			 dy = 1;
		// Choose at random whether it's going to start on the x or y axis
		if(Math.round(Math.random()) === 1) {
			// If it starts on the x axis, x is zero and y is any point on the y axis
			super(0, randInt(1, canvas.height), dx, dy);
		}
		else {
			// The opposite is true if it starts on the y axis
			super(randInt(1, canvas.width), 0, dx, dy);
		}
	}
	
	// All that needs to be done in dorender for snow is to 
	// make a 5x5 square with a black border and no fill
	dorender(ctx) {
		ctx.strokeRect(this.x, this.y, 5, 5);
	}
}

// The Rain element simply travels down the y axis of the canvas, 
// and has a variable drop length and y velocity
class Rain extends Element {

	constructor() {
		// These are the minimum and mazimum allowable values 
		// for falling speed and raindrop length
		var minDy = 2,
			 maxDy = 5,
			 minLen = 4,
			 maxLen = 10;
		// Call the superclass constructor, passing in a random location on the x axis for x, zeroes for y and dx,
		// and a random number between minDy and maxDy for the falling velocity
		super(randInt(1, canvas.width), 0, 0, randInt(minDy, maxDy));
		// Rain also has the additional member variable len, which represents the length of the raindrop
		this.len = randInt(minLen, maxLen);
	}
	
	// For dorender in Rain, simply draw a vertical line this.len pixels long starting at point (x, y)
	dorender(ctx) {
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.x, this.y + this.len);
		ctx.stroke();
	}
}

// The Bug element creates a picture of a bug that travels horizontally, 
// bouncing up and down in the y direction while moving
class Bug extends Element {

	constructor() {
		// dyLoop is a lookup table for the vertical oscillation each bug does.
		// Each frame, dy is changed to the next value in the table befroe being added to y,
		// making the bug move back and forth. curDyIndex holds the index in the table that
		// the Bug is currently on, and increments every frame.
		var dyLoop = [0, 1, 2, 1, 0, -1, -2, -1],
			 curDyIndex = randInt(0, dyLoop.length),
			 minDx = 1,
			 maxDx = 6;
		
		// Each bug starts on the y axis, so x is zero and its y is a random number on the y axis.
		// Its x velocity is randomly chosen between minDx and maxDx, and its y velocity is the 
		// the value in dyLoop that corresponds to the randomly chosen curDyIndex.
		super(0, randInt(1, canvas.height), randInt(minDx, maxDx), dyLoop[curDyIndex]);
		
		// bugPic is the picture of the bug being displayed, and dyLoop and curDyIndex are officially made member
		// variables down here, since the superclass constructor had to be called before they could be set.
		this.bugPic = document.getElementById("bug");
		this.dyLoop = dyLoop;
		this.curDyIndex = curDyIndex;
	}
	
	// In the dorender for bug, the bug is drawn, then the dy value is advanced to the next value in dyLoop,
	// wrapping around to the start after reaching the end.
	dorender(ctx) {
		ctx.drawImage(bug, this.x, this.y);
		this.dy = this.dyLoop[this.curDyIndex];
		this.curDyIndex = (this.curDyIndex + 1) % this.dyLoop.length;
	}
}

// The paused variable is true when the sim is paused, and false when it's running.
var paused = false,
	 // Selection is a reference to the current type of element being inserted into the canvas.
	 selection = Snow,
	 // canvasElements holds all the elements currently on or outside of the canvas, 
	 // and is cleared every time the type of element is changed.
	 canvasElements = [],
	 // canvas is a reference to the canvas element in the DOM, and is what everything is written to.
	 canvas;

// onInit is called exactly once, when the DOM is finished loading. It instanciates canvas, then 
// starts the requestAnimationFrame loop.
function onInit() {
	canvas = document.getElementById("particleCanvas");
	// This calls onFrame() as soon as a new frame is ready for display in the browser.
	window.requestAnimationFrame(onFrame);
}

// Called every frame, everything done each frame is done in here.
function onFrame() {
	// Get the object from the canvas that lets you add elements to it
	var ctx = canvas.getContext('2d');
	// Display all the elements in canvasElements if the sim isn't paused
	if(!paused) {
		// Every frame, start by clearing the canvas,
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		// Then call each existing elements' doFrame function
		canvasElements.forEach((el) => el.doFrame(ctx));
		// After that, add a new element of type selection to canvasElements, to keep everything going indefinitely
		canvasElements.push(new selection());
	}
	// Regardless of whether or not it's paused, keep requesting animation frames, otherwise the sim will stop
	window.requestAnimationFrame(onFrame);
}

// Called when the pause button is clicked
function onPauseChange() {
	// Get the reference to the pause button element in the DOM
	var pauseButton = document.getElementById("pause");
	// Invert the paused value
	paused = !paused;
	// Change the pause button's text to mirror the current paused state
	pauseButton.value = paused ? 'Unpause' : 'Pause';
}

// Called when any of the other buttons are clicked
// 	type: reference to a valid type of element, to be displayed on the canvas
function onChangeType(type) {
	// Set selection to type, to make that type of element get displayed
	selection = type;
	// Clear out the previous type of element from canvaseElements
	canvasElements = [];
}

// Utility function to calculate a random integer between min and max, inclusive
function randInt(min, max) {
	return Math.floor((Math.random() * max) + min);
}