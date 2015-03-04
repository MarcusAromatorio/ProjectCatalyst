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
	game.update = function () {

		game.animationID = requestAnimationFrame(game.update);
		game.deltaTime = calculateDeltaTime();

		game.checkParticlePress();

		if(game.paused && game.state == game.states.IN_GAME){
			game.draw();
			return;
		}

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
			particle.addGravity(game.GRAVITY);

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

			// Play the lose audio only once
			if(game.state != game.states.LEVEL_FAILED)
				game.loseAudio.play();

			game.state = game.states.LEVEL_FAILED;
			game.timer = 0;

		}
		
		// Pause the timer if the game state is not IN_GAME
		if(game.state != game.states.IN_GAME || (game.paused && game.state == game.states.IN_GAME)) {
			clearInterval(game.timerInterval);
		}
	}


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
				if(game.particles[i].type != "demo") {
					gameWon = false;
				}
			}
			
			if(game.currentLevel == 4) {
				if(game.particles[i].type != "catalyst2") {
					gameWon = false;
				}
			}
			
			if(game.currentLevel == 5) {
				if(game.particles[i].type != "catalyst2") {
					gameWon = false;
				}
			}
			
			if(game.currentLevel == 6) {
				if(game.particles[i].type != "catalyst") {
					gameWon = false;
				}
			}
			
			if(game.currentLevel == 7) {
				if(game.particles[i].type != "demo") {
					gameWon = false;
				}
			}
		}
		
		if(gameWon == true) {
			// Clear the particles on-screen and progress to the ENDED_GAME state
			game.state = game.states.ENDED_GAME;

			// Play the game-won audio bit
			game.winAudio.play();
			
			// Save the high scores
			if(game.state == game.states.ENDED_GAME) {
				// Add the player's score into the high score array
				game.levelInformation[game.currentLevel-2].highScores.push(game.timer);
				
				// Order the highscores from highest(fastest) to lowest(slowest)
				game.levelInformation[game.currentLevel-2].highScores.sort(function(a,b){return b-a});
				
				// Splice the high scores arrays, so that there are only 5 in each
				for (var i = 0; i < 6; i++) {
					game.levelInformation[i].highScores = game.levelInformation[i].highScores.splice(0,5);
				}
				
				// Clear the scores Array and re-populate it with the 5 high scores from each level
				game.scoresArray = [];
				for (var i = 0; i < 6; i++) {
					game.scoresArray.push(game.levelInformation[i].highScores);
				}
			
				// Save the high scores to local storage
				localStorage.setItem('savedScores', JSON.stringify(game.scoresArray));
			}
		}
		
		return gameWon;
	}

	/*
	*
	* Method to switch the active particle type selected
	*
	* Requires: none
	* Input: none
	* Process: Set the appropriate game variables to true or false, depending on keypress
	* Output: none
	*
	*/
	game.checkParticlePress = function(){

		// Change the pressed variables as the player selects particles
		if(game.keydown[game.KEYBOARD["KEY_1"]] || game.keydown[game.KEYBOARD["KEY_NUM_1"]]) {
			game.pressed1 = true;
			game.pressed2 = false;
			game.pressed3 = false;
			game.pressed4 = false;
		}
		
		if(game.keydown[game.KEYBOARD["KEY_2"]] || game.keydown[game.KEYBOARD["KEY_NUM_2"]]) {
			game.pressed1 = false;
			game.pressed2 = true;
			game.pressed3 = false;
			game.pressed4 = false;
		}
		
		if(game.keydown[game.KEYBOARD["KEY_3"]] || game.keydown[game.KEYBOARD["KEY_NUM_3"]]) {
			game.pressed1 = false;
			game.pressed2 = false;
			game.pressed3 = true;
			game.pressed4 = false;
		}
		
		if(game.keydown[game.KEYBOARD["KEY_4"]] || game.keydown[game.KEYBOARD["KEY_NUM_4"]]) {
			game.pressed1 = false;
			game.pressed2 = false;
			game.pressed3 = false;
			game.pressed4 = true;
		}
	}




	/*
	* Method to play a sound effect
	*
	* Requires: none
	* Inputs: none
	* Process: Set soundEffect source to an index of the soundSources array and play it
	* Output: none
	*
	*/
	game.playSoundEffect = function(){

		game.soundEffect.src = game.soundSources[game.currentEffect];
		game.soundEffect.play();

		game.currentEffect++;

		if(game.currentEffect > game.soundSources.length - 1){
			game.currentEffect = 0;
		}
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
		ctx.textAlign = "left";
		ctx.fillText("Time:",28,120);
		if(game.timerSubstring == 10) {
			ctx.fillText(game.timerSubstring+".00",26,150);
		}
		else if(game.timerSubstring == 0) {
			ctx.fillText(game.timerSubstring+".00",30,150);
		}
		else {
			ctx.fillText(game.timerSubstring,30,150);
		}
		ctx.restore();
		
		// Display the text for the main menu
		if(game.state == game.states.MAIN_MENU) {
			ctx.save();
			ctx.font = 'bold 40px Orbitron';
			ctx.fillText("Catalyst", 380, 270);
			ctx.font = 'bold 20px Orbitron';
			ctx.fillText("Click to begin", 380, 310);
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
			if(game.paused)
				ctx.fillText("Click the mouse to start the round", 320, 150);
			ctx.fillText(game.levelInformation[game.currentLevel-2].objectiveText,320,30);
			ctx.restore();
		}
		
		// Draw the level completed text and high scores
		if(game.state == game.states.ENDED_GAME) {
			ctx.save();
			ctx.fillText("You've won! Click to continue", 380, 280);
			ctx.fillText("High Scores For This Level:", 380, 310);
			
			for (i = 0; i < 5; i++) {
				if(game.levelInformation[game.currentLevel-2].highScores[i] == 1){
					ctx.fillText("#"+ (i+1) +" - 1.00", 380, 340+(i*30));
				}
				else {
					// Update strings for score display, gets around floating point accuracy problems
					game.scoreString = game.levelInformation[game.currentLevel-2].highScores[i].toString();
					game.scoreSubstring = game.scoreString.substring(0,4);
					ctx.fillText("#"+ (i+1) +" - "+ game.scoreSubstring, 380, 340+(i*30));
				}
			}
			
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
		
		// Draw the particle selectors
		ctx.save();
		// Draw the first selector
		ctx.beginPath();
		ctx.arc(57,195,30,0,2*Math.PI);
		ctx.fillStyle = "red";
		ctx.fill();
		
		// Draw the second selector
		ctx.beginPath();
		ctx.arc(57,275,30,0,2*Math.PI);
		ctx.fillStyle = "blue";
		ctx.fill();
		
		// Draw the third selector
		ctx.beginPath();
		ctx.arc(57,355,30,0,2*Math.PI);
		ctx.fillStyle = "green";
		ctx.fill();
		
		// Draw the fourth selector
		ctx.beginPath();
		ctx.arc(57,435,30,0,2*Math.PI);
		ctx.fillStyle = "purple";
		ctx.fill();
		
		// Draw the number mapping for the selectors
		ctx.fillStyle = "white";
		ctx.fillText("1", 57, 198);
		ctx.fillText("2", 57, 278);
		ctx.fillText("3", 57, 358);
		ctx.fillText("4", 57, 438);
		ctx.restore();
		
		// Draw a border around the currently selected particle
		ctx.lineWidth = 5;
		ctx.strokeStyle = "white";
		
		if(game.pressed1 == true) {
			ctx.beginPath();
			ctx.arc(57,195,30,0,2*Math.PI);
			ctx.stroke();
		}
		
		if(game.pressed2 == true) {
			ctx.beginPath();
			ctx.arc(57,275,30,0,2*Math.PI);
			ctx.stroke();
		}
		
		if(game.pressed3 == true) {
			ctx.beginPath();
			ctx.arc(57,355,30,0,2*Math.PI);
			ctx.stroke();
		}
		
		if(game.pressed4 == true) {
			ctx.beginPath();
			ctx.arc(57,435,30,0,2*Math.PI);
			ctx.stroke();
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
			game.makeParticles("catalyst2", 40, 210, 250, 6);
		}
		
		if(game.state == game.states.IN_GAME && game.currentLevel == 4) {
			// To begin the demonstration, fifty demo particles are added to the scene
			game.makeParticles("catalyst", 40, 210, 250, 6);
		}
		
		if(game.state == game.states.IN_GAME && game.currentLevel == 5) {
			// To begin the demonstration, fifty demo particles are added to the scene
			game.makeParticles("demo", 40, 210, 250, 6);
		}
		
		if(game.state == game.states.IN_GAME && game.currentLevel == 6) {
			// To begin the demonstration, fifty demo particles are added to the scene
			game.makeParticles("demo", 40, 210, 250, 6);
		}
		
		if(game.state == game.states.IN_GAME && game.currentLevel == 7) {
			// To begin the demonstration, fifty demo particles are added to the scene
			game.makeParticles("catalyst", 40, 210, 250, 6);
		}
		
		cancelAnimationFrame(game.animationID);

		game.paused = true;

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