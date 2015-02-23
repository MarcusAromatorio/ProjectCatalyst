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
		// Consider which state the game is currently in using a switch statement
		
		/*
		switch(game.state){
			case game.states.MAIN_MECHANIC_DEMO:
				// Get the mouse position within the canvas
				var mouse = game.getMouse(e);
				// The player is clicking inside the demonstration of the main mechanic
				// All that needs to be done is to drop the catalyst from the mouse location
				if(e.button == 0)
					game.makeParticle("catalyst", mouse.x, mouse.y);
				else if(e.button == 1)
					game.makeParticle("demo", mouse.x, mouse.y);
				else if(e.button == 2)
					game.makeParticle("catalyst2", mouse.x, mouse.y);
			break;
			default:
				// Should not arrive at this code block
				// Defaults to no added function on mouseclick
			break;
		}
		*/
		
		// Get the mouse position within the canvas
		var mouse = game.getMouse(e);
		
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
		
		// Create particles when the player clicks in-game and progress to the end game state if they're gotten them all
		if(game.state == game.states.IN_GAME) {
			// The player is clicking inside the demonstration of the main mechanic
			// All that needs to be done is to drop the catalyst from the mouse location
			if(e.button == 0)
				game.makeParticle("catalyst", mouse.x, mouse.y);
			else if(e.button == 1)
				game.makeParticle("demo", mouse.x, mouse.y);
			else if(e.button == 2)
				game.makeParticle("catalyst2", mouse.x, mouse.y);
		}
		
		// When the player clicks on the level end screen, progress to the next level
		if(game.state == game.states.ENDED_GAME) {
			if(game.currentLevel <= 2) {
				game.state = game.states.IN_GAME;
				game.reset();
			}
			else {
				game.state = game.states.GAME_FINISHED_MENU;
			}
			return;
		}
	}


	// Returning the augmented game object back to the global scope to allow further augmentations
	return game;

// Passing the known (or unknown) variable Catalyst in at execution
// As JS loads scripts asynchronously, this script may or may not be the first to execute
}(Catalyst || {}));