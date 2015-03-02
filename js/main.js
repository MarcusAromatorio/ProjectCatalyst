/*
* The main script of Catalyst, handles the game loop for updates and drawing
*
* This script utilizes the module pattern's "loose augmentation" technique, referenced here:
*
* http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html
*
* Version 1.6
* Authors: Marcus Aromatorio & Joseph Horsmann 
*
*/

// Strict Mode adheres to ECMAScript 5's syntax manually
"use strict";

// Import the game from the possibly preexisting Catalyst global
var Catalyst = (function (game){


	/*
	* Main update method
	*
	* Requires: All scripts loaded
	* Inputs: none
	* Process: Game State dependent, simulate basic physics if playing game
	* Output: none
	*
	*/
	game.update = function (){

		// Temporary pause feature: will be improved. Used for debug purposes
		// Currently cannot un-pause, used to look at interactions more closely
		if(game.keydown[game.KEYBOARD["KEY_P"]] && !game.paused)
			game.paused = true;
		else
			game.paused = false;

		if(game.paused){
			// Exit update()
			console.log(game.GRAVITY.y);
			return;
		}
		// End temporary pause feature

		game.animationID = requestAnimationFrame(game.update);
		game.deltaTime = calculateDeltaTime();

		// The following nested loops update each particle and test collisions between them
		for(var i = 0; i < game.particles.length; i++){
			var particle = game.particles[i];
			particle.update();
			// With a nested loop, test each particle's collision with one another
			// Start at the array length and loop backwards
			for(var j = game.particles.length - 1; j >= 0; j--){
				// Make sure not to test collision with the same object
				if(i != j){
					// Temporary reference to other particle to test collision
					var otherParticle = game.particles[j];
					// If there is a collision between the two particles, add appropriate forces
					if(particle.collidingWith(otherParticle)){
						// Since two particles are colliding, they push each other away by adding force to one another
						particle.addForce(vec2d.vectorBetween(particle.position, otherParticle.position));
					}
				}
			}// End nested for-loop
			// Each particle may need to change properties if they are reacting with other colliding particles
			particle.checkReaction();

			// Every particle is affected by gravity
			particle.addForce(game.GRAVITY);

			// Check if the particle is colliding against any container
			game.collideContainer(particle);

			// Each particle stays within the canvas screen
			if(particle.position.x > 640 - particle.radius){
				particle.setPosition(640 - particle.radius, particle.position.y);
				particle.invertX(0.8);
				
			}
			if(particle.position.x < 0 + particle.radius){
				particle.setPosition(0 + particle.radius, particle.position.y);
				particle.invertX(0.8);

			}
			if(particle.position.y > 480 - particle.radius){
				particle.setPosition(particle.position.x, 480 - particle.radius);
				particle.invertY(0.8);

			}
			if(particle.position.y < 0 + particle.radius){
				particle.setPosition(particle.position.x, 0 + particle.radius);
				particle.invertY(0.8);

			}
		}// End first for-loop
		
		// Update strings for timer display, gets around floating point accuracy problems
		game.timerString = game.timer.toString();
		game.timerSubstring = game.timerString.substring(0,4);

		// Draw the screen after updating
		game.draw();
		
		// Check to see if the player has completed a level
		if(game.state == game.states.IN_GAME) {
			game.checkSuccess();
		}
		
		// Check to see if the player has failed a level
		if(game.timer <= 0) {
			game.state = game.states.LEVEL_FAILED;
			game.timer = 0;
		}
		
		// Pause the timer if the game state is not IN_GAME
		if(game.state != game.states.IN_GAME) {
			clearInterval(game.timerInterval);
		}
	};

	/*
	*
	* Function to calculate whether a particle collides with a container
	*
	* Requires: none
	* Input: particle object
	* Process: If the particle is within the bounds of either of the three walls of the container, reverse its respective velocity
	* Output: none
	*
	*/
	game.collideContainer = function(particle){

		// If the containers array is empty, exit early as no collsion needs to be calculated
		if(game.containers.length == 0)
			return;

		// The particle must be overlapping (radius of particle and bounding box) to collide
		// Take reference variables of particle properties for ease of coding
		var position = particle.position;
		var radius = particle.radius;

		// Loop through each container in the array and check against the position of the particle
		for(var i = 0; i < game.containers.length; i++){

			// Temporary variable to the specific container
			var container = game.containers[i];

			// Each container has an array of its walls, called blocks
			// Each block is just a rectangle, and can have its collision calculated separately
			// Each block has x, y, width, and height properties

			for(var j = 0; j < container.blocks.length; j++){
				// Temporary variables for ease of collision calculation
				var block = container.blocks[j];
				var halfX = block.x + block.width / 2;
				var halfY = block.y + block.height / 2;

				// These boolean variables describe the left/right and above/below position of the particle
				// Either of these being false implies the opposite is true (to the right and below)
				var toLeft = (position.x < halfX);
				var above = (position.y < halfY);

				// Variables to hold the value of whether the particle is colliding on any of the four sides of the block
				var leftOverlap = (position.x + radius > block.x && toLeft);
				var aboveOverlap = (position.y + radius < block.y && above);
				var belowOverlap = (position.y - radius > block.y + block.height && !above);
				var rightOverlap = (position.x - radius < block.x + block.width && !toLeft);

				if(leftOverlap && rightOverlap && belowOverlap && aboveOverlap){

					if(leftOverlap){
						particle.setPosition(block.x - radius, position.y);
						particle.invertX(0.8);
					}
					if(rightOverlap){
						particle.setPosition(block.x + block.width + radius, position.y);
						particle.invertX(0.8);
					}
					if(aboveOverlap){
						particle.setPosition(position.x, block.y + radius);
						particle.invertY(0.8);
					}
					if(belowOverlap){
						particle.setPosition(position.x, block.y + block.height + radius);
						particle.invertY(0.8);
					}
				}
			}
		}
	}

/*****
			// Only consider collision if the particle is within range of touching the container
			// These four boolean variables are to check if the particle is touching the outside edges of the container
			var hitOutsideLeft = position.x + radius > container.x;
			var hitOutsideRight = position.x - radius < container.x + container.width;
			var hitOutsideBottom = position.y - radius < container.y + container.height;
			var hitOutsideTop = position.y + radius > container.y;

			// If ALL four conditions are true, the particle is colliding somewhere with the container
			if(hitOutsideLeft && hitOutsideRight && hitOutsideBottom && hitOutsideTop){

				// Within this block, the particle position (considered with the radius of the particle as "padding") is within the container
				// An extra case where collisiondoes not happen is the open space insde, test for it here
				// If the following test fails, there is still no collision, and the loop ends and iterates

				// To save time and prevent double-calculation, store booleans in temporary variables
				var hitInsideLeft = (position.x - radius < container.x + container.thickness);
				var hitInsideRight = (position.x + radius > container.x + container.width - container.thickness);
				var hitInsideBottom = (position.y + radius > container.y + container.height - container.thickness);

				// If any variable is true, the particle is repositioned and inverted in orthogonal velocity

				// If ALL variables are false, the particle is somewhere outside the container and hitting one of the outer edges
				if(!hitInsideLeft && !hitInsideRight && !hitInsideBottom){
					// See if the particle is hitting the left wall
					if(particle.x < container.x + container.thickness &&
						particle.y > container.y &&
						particle.y < container.y + container.height){
						// This three conditional statement makes sure the particle is within the left side and not the bottom or top
						particle.setPosition(container.x - radius, position.y);
						particle.invertX(0.8);
					}
					else if(particle.x > container.x + container.width &&
							particle.y > container.y &&
							particle.y < container.y + container.height){
						// This checks to make sure the particle is outside and to the right
						particle.setPosition(container.x + container.width, position.y);
						particle.invertX(0.8);
					}
					else{
						// Otherwise, the particle is colliding with either the top or bottom
						// A smaller check is viable - height compared against half-height of container
						if(particle.y > container.y + container.height / 2){
							particle.setPosition(position.x, container.y + container.height);
							particle.invertY(0.8);
						}
						else{
							// The particle is colliding with either top sides (left or right is irrelevant, they have the same response)
							particle.setPosition(position.x, container.y);
							particle.invertY(0.8);
						}
					}
				}
				else{
					// Here is where the particle is checked for internal collisions on the container
					if(hitInsideLeft){
						particle.setPosition(container.x + container.thickness, position.y);
						particle.invertX(0.8);
					}

					if(hitInsideRight){
						particle.setPosition(container.x + container.width - container.thickness, position.y);
						particle.invertX(0.8);
					}

					if(hitInsideBottom){
						particle.setPosition(position.x, container.y + container.height - container.thickness);
						particle.invertY(0.8);
					}
				}
			}
		}
	}*/


	game.checkSuccess = function(){
		var gameWon = true;
		for(var i = 0; i < game.particles.length; i++) {
			// For the first level, win only if there are no green particles
			if(game.currentLevel == 2) {
				if(game.particles[i].type != "catalyst") {
					gameWon = false;
				}
			}
			
			// For the second level, win only if there are no green or red particles
			if(game.currentLevel == 3) {
				if(game.particles[i].type != "catalyst2") {
					gameWon = false;
				}
			}
		}
		
		if(gameWon == true) {
			// Clear the particles on-screen and progress to the ENDED_GAME state
			game.state = game.states.ENDED_GAME;
		}
		
		return gameWon;
	}

	/*
	* Main draw method
	*
	* Requires: All scripts loaded
	* Inputs: none
	* Process: Game State dependent, draw all graphics
	* Output: none
	*
	*/
	game.draw = function(){
		// Temporary variable for readability
		var ctx = game.ctx;

		ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
		
		// Draw the background image
		var backgroundImage = new Image();
		backgroundImage.src = "images/background.jpg";
		ctx.drawImage(backgroundImage,0,0);
		
		// Set text properties
		ctx.font = 'bold 20px Orbitron';
		ctx.fillStyle = "#818181";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		
		// Draw the timer
		ctx.save();
		ctx.fillText("Time",60,150);
		ctx.fillText("Left:",60,180);
		if(game.timerSubstring == 10) {
			ctx.fillText(game.timerSubstring+".00",60,210);
		}
		else if(game.timerSubstring == 0) {
			ctx.fillText(game.timerSubstring+".00",60,210);
		}
		else {
			ctx.fillText(game.timerSubstring,60,210);
		}
		ctx.restore();
		
		// Display the text for the main menu
		if(game.state == game.states.MAIN_MENU) {
			ctx.save();
			ctx.font = 'bold 40px Orbitron';
			ctx.fillText("Catalyst", 380, 270);
			ctx.font = 'bold 20px Orbitron';
			ctx.fillText("Click to begin", 380, 300);
			ctx.restore();
		}
		
		// Display the text for the instructions menu
		if(game.state == game.states.INSTRUCTION_MENU) {
			ctx.save();
			ctx.fillText("Goal:", 380, 210);
			ctx.fillText("Create correctly colored mixtures", 380, 240);
			ctx.fillText("Controls:", 380, 300);
			ctx.fillText("Left click to drop a red catalyst", 380, 330);
			ctx.fillText("Middle click to drop a green catalyst", 380, 360);
			ctx.fillText("Right click to drop a blue catalyst", 380, 390);
			ctx.restore();
		}
		
		// Draw the objective text
		if(game.state == game.states.IN_GAME) {
			ctx.save();
			ctx.fillText(game.levelInformation[game.currentLevel-2].objectiveText,320,30);
			ctx.restore();
		}
		
		// Draw the level completed text
		if(game.state == game.states.ENDED_GAME) {
			ctx.save();
			ctx.fillText("You've won! Click to continue", 380, 280);
			ctx.restore();
		}
		
		// Draw the game is finished text
		if(game.state == game.states.GAME_FINISHED_MENU) {
			ctx.save();
			ctx.fillText("You've completed the game!", 380, 270);
			ctx.fillText("Thanks for playing", 380, 300);
			ctx.restore();
		}
		
		// Draw the level failed text
		if(game.state == game.states.LEVEL_FAILED) {
			ctx.save();
			ctx.fillText("You failed", 380, 270);
			ctx.fillText("Click to try again", 380, 300);
			ctx.restore();
		}

		// TODO: Once more functions and states are complete, clean up this section for readability
		// Until then, loop through list of particles and draw them
		for(var i = 0; i < game.particles.length; i++){

			ctx.save();

			var particle = game.particles[i];
			ctx.fillStyle = particle.color;
			ctx.beginPath();
			ctx.arc(particle.position.x, particle.position.y, particle.radius, 0, 2 * Math.PI);

			// If the game is in an ended state, draw the particles with 50% opacity to indicate a change
			if(game.state == game.states.ENDED_GAME || game.state == game.states.GAME_FINISHED_MENU)
				ctx.globalAlpha = 0.5;

			ctx.fill();

			ctx.restore();
		}

		for(var j = 0; j < game.containers.length; j++){
			ctx.save();

			var container = game.containers[j];
			ctx.fillStyle = "black";

			for(var q = 0; q < container.blocks.length; q++){
				var block = container.blocks[q];
				ctx.fillRect(block.x, block.y, block.width, block.height);
			}

			ctx.restore();
		}
	}

	/*
	* Method to start up a new game state
	*
	* Requires: gameConstants
	* Inputs: none
	* Process: Game-State dependent, start up new "scene"
	* Output: none
	*
	*/
	game.reset = function() {
		// Game-state dependent, uses switch statement to start different scenarios

		// Clear the particles on screen
		game.particles = [];
		
		// Increment the current Level
		game.currentLevel += 1;
		
		if(game.state == game.states.IN_GAME && game.currentLevel == 2) {
			// To begin the demonstration, fifty demo particles are added to the scene
			game.makeParticles("demo", 50, 320, 250, 10);
		}
		
		if(game.state == game.states.IN_GAME && game.currentLevel == 3) {
			// To begin the demonstration, fifty demo particles are added to the scene
			game.makeParticles("demo", 50, 320, 250, 10);
			game.makeContainer(280, 400, 30, 60);
		}
		
		if(game.state == game.states.IN_GAME) {
			game.timerInterval = setInterval(function(){game.timer -= 0.01},10);
		}
		
		game.update();
	}


	/*
	* Calculate how many miliseconds are occurring between frames
	*
	* Requires: previous frame time (game.lastTime)
	* Inputs: none
	* Process: Take difference from previous time to current time, set new previous frame time, divide 1000 by difference
	* Output: Ratio of one over the fps
	*
	*/
	function calculateDeltaTime(){
		// Temporary local variables defined to reduce verbosity 
		var last = game.lastTime;
		var current = (+new Date);	// Casts the new date object to a number
		var delta = current - last; // Difference between last time and now

		// Divide 1000 by the delta to calculate how many frames should pass in one second
		var fps = 1000 / delta;

		// Set the lastTime global to the current time
		game.lastTime = current;

		// Return the value of 1 / fps for a time-based delta, rather than frame-based delta
		return 1 / fps;
	};

	/*
	* Grab the mouse location relative to the canvas
	*
	* Requires: none
	* Inputs: Result of mousedown event
	* Process: Create object with x and y property describing mouse coordinate
	* Output: {x, y}
	*
	*/
	game.getMouse = function(e){

		var mouse = {};	// Object for the mouse coodinates

		// Set necessary properties of the object
		mouse.x = e.pageX - e.target.offsetLeft;
		mouse.y = e.pageY - e.target.offsetTop;

		return mouse;
	}

	// Returning the augmented game object back to the global scope to allow further augmentations
	return game;

// Passing the known (or unknown) global variable Catalyst in at execution
// As JS loads scripts asynchronously, this script may or may not be the first to execute
}(Catalyst || {}));