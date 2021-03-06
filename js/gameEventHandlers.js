/*
* The gameEventHandlers script defines what functions need to execute when certain events are invoked
* Largely referenced in the initializer script, utilizes the module pattern's "loose augmentation"
* Loose augmentation technique referenced here: 
*
* http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html
* 
* Version 1.0
* Authors: Marcus Aromatorio & Joseph Horsmann 
* 
*/

// Strict Mode adheres to ECMAScript 5's syntax manually
"use strict";

// The game is augmented through an IIFE
var Catalyst = (function (game) {

	/*
	* Mouse click event handler
	*
	* Requires: game.constants
	* Inputs: result of onmousedown event
	* Process: game state dependent (press buttons, drop catalyst, etc)
	* Output: none
	*
	*/
	game.handleMouseClick = function(e){
		
		// Get the mouse position within the canvas
		var mouse = game.getMouse(e);

		// When the player clicks on the level end screen, progress to the next level
		if(game.state == game.states.ENDED_GAME) {
			if(game.currentLevel <= 6) {	
				game.timer = 10;
				game.state = game.states.IN_GAME;
				game.reset();
			}
			else {
				game.state = game.states.GAME_FINISHED_MENU;
			}
			return;
		}

		// If the game is over, reset the level and start from the main menu
		if(game.state == game.states.GAME_FINISHED_MENU){
			game.currentLevel = 0;
			game.timer = 10;
			game.state = game.states.MAIN_MENU;
			game.reset();
		}
		
		// Restart the level if the player clicks on the fail screen
		if(game.state == game.states.LEVEL_FAILED) {
			game.state = game.states.IN_GAME;
			game.timer = 10;
			game.particles = [];
			game.currentLevel -= 1;
			game.reset();
			return;
		}
		
		// Progress to the instructions screen when the player clicks on the main menu
		if(game.state == game.states.MAIN_MENU) {
			game.state = game.states.INSTRUCTION_MENU;
			return;
		}
		
		// Progress to the first level of the game when the player clicks on the instructions screen
		if(game.state == game.states.INSTRUCTION_MENU) {
			game.state = game.states.IN_GAME;
			game.reset();
			return;
		}

		if(game.paused && game.state == game.states.IN_GAME){
			game.paused = false;
			game.timerInterval = setInterval(function(){game.timer -= 0.01},10);

		}

		// Check if the player has exceeded allotted number of particle-drops
		if(game.roundClicks > game.allowedClicks[game.currentLevel - 2])
			return;

		game.roundClicks++;
		
		// Create particles when the player clicks in-game and progress to the end game state if they're gotten them all
		if(game.state == game.states.IN_GAME) {
			// The player is clicking inside the demonstration of the main mechanic
			// All that needs to be done is to drop the catalyst from the mouse location
			if(e.button == 0) {
				if(game.pressed1 == true) {
					game.makeParticle("catalyst", mouse.x, mouse.y);
				}
				else if(game.pressed2 == true) {
					game.makeParticle("catalyst2", mouse.x, mouse.y);
				}
				else if(game.pressed3 == true) {
					game.makeParticle("demo", mouse.x, mouse.y);
				}
				else if(game.pressed4 == true) {
					game.makeParticle("oxygen", mouse.x, mouse.y);
				}
				else {
					game.makeParticle("demo", mouse.x, mouse.y);
				}
			}
		}
	}


	// Returning the augmented game object back to the global scope to allow further augmentations
	return game;

// Passing the known (or unknown) variable Catalyst in at execution
// As JS loads scripts asynchronously, this script may or may not be the first to execute
}(Catalyst || {}));