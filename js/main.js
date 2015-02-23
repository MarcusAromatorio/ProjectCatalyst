/*
* The main script of Catalyst, handles the game loop for updates and drawing
*
* This script utilizes the module pattern's "loose augmentation" technique, referenced here:
*
* http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html
*
* Version 1.0
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
						otherParticle.addForce(vec2d.vectorBetween(otherParticle.position, particle.position));
					}
				}
			}// End nested for-loop
			// Each particle may need to change properties if they are reacting with other colliding particles
			particle.checkReaction();

			// Every particle is affected by gravity
			particle.addForce(game.GRAVITY);

			// Each particle stays within the canvas screen
			// TODO: Clean up this section
			if(particle.position.x > 640 - particle.radius){
				particle.setPosition(640 - particle.radius, particle.position.y)
				particle.addForce(vec2d.newVector(-particle.velocity.x, 0));

			}
			if(particle.position.x < 0 + particle.radius){
				particle.setPosition(0 + particle.radius, particle.position.y)
				particle.addForce(vec2d.newVector(-particle.velocity.x, 0));

			}
			if(particle.position.y > 480 - particle.radius){
				particle.setPosition(particle.position.x, 480 - particle.radius)
				particle.addForce(vec2d.newVector(0, -particle.velocity.y));

			}
			if(particle.position.y < 0 + particle.radius){
				particle.setPosition(particle.position.x, 0 + particle.radius);
				particle.addForce(vec2d.newVector(0, -particle.velocity.y));

			}
		}// End first for-loop
		console.log(game.state);


		// Draw the screen after updating
		game.draw();
		
		// Check to see if the player has completed a level
		if(game.state == game.states.IN_GAME) {
			game.checkSuccess();
		}
	};


	game.checkSuccess = function(){
		var gameWon = true;
<<<<<<< HEAD
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
			game.particles = [];
		}
=======
		for(var i = 0; i < game.particles.length; i++){

			if(game.particles[i].type != "catalyst"){
				gameWon = false;
			}
		}
>>>>>>> origin/master
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
<<<<<<< HEAD
		
		// Display the text for the main menu
		if(game.state == game.states.MAIN_MENU) {
			ctx.save();
			ctx.font = 'bold 40px Orbitron';
			ctx.fillText("Catalyst", 380, 270);
			ctx.font = 'bold 20px Orbitron';
			ctx.fillText("Click to begin continue", 380, 300);
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

		// TODO: Once more functions and states are complete, clean up this section for readability
		// Until then, loop through list of particles and draw them
		for(var i = 0; i < game.particles.length; i++){

			ctx.save();

			var particle = game.particles[i];
			ctx.fillStyle = particle.color;
			ctx.beginPath();
			ctx.arc(particle.position.x, particle.position.y, particle.radius, 0, 2 * Math.PI);
			ctx.fill();

			ctx.restore();
		}

	};

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
		
		/*
		switch(game.state){
			case game.states.MAIN_MECHANIC_DEMO:
			// To begin the demonstration, fifty demo particles are added to the scene
				game.makeParticles("demo", 50, 320, 100, 10);
				game.update();
			break;
			default:
			// Nothing happens, should always have explicit state
			break;
		}
		*/
		
		// Increment the current Level
		game.currentLevel += 1;
		
		if(game.state == game.states.IN_GAME && game.currentLevel == 2) {
			// To begin the demonstration, fifty demo particles are added to the scene
			game.makeParticles("demo", 50, 320, 100, 10);
		}
		
		if(game.state == game.states.IN_GAME && game.currentLevel == 3) {
			// To begin the demonstration, fifty demo particles are added to the scene
			game.makeParticles("demo", 50, 320, 100, 10);
		}
		
		game.update();
	}


	/*
	* Method to drop the catalyst
	*
	* Requires: "In-game"
	* Inputs: X and Y coordinates
	* Process: add a catalyst on screen to drop at the point specified
	* Output: none
	*
	*/
	game.dropCatalyst = function(x, y){


	};

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