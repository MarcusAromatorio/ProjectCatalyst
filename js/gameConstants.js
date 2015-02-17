/*
* The gameConstants script contains the game's constant values, as the name implies
*
* All game states are located in this script
* This script utilizes the module pattern's "loose augmentation" technique, referenced here:
*
* http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html
*
* Version 1.0
* Author: Marcus Aromatorio
*
*/

// Strict Mode adheres to ECMAScript 5's syntax manually
"use strict";

var Catalyst = (function (game) {

	// The states object contains all of the constants that describe game state
	game.states = {

		// In different code blocks, these states can be accessed as
		// game.states.MAIN_MENU

		DEFAULT: 0,
		MAIN_MENU: 1,
		MAIN_MECHANIC_DEMO: -1

	};

	// The keyboard key values if they are needed in the future
	game.KEYBOARD = {
		"KEY_LEFT": 37,
		"KEY_UP": 38,
		"KEY_RIGHT": 39,
		"KEY_DOWN": 40,
		"KEY_SPACE": 32,
		"KEY_P":80
	};

	// Requires: Vector2d
	game.GRAVITY;


	// Returning the augmented game object back to the global scope to allow further augmentations
	return game;

// Passing the known (or unknown) global variable Catalyst in at execution
// As JS loads scripts asynchronously, this script may or may not be the first to execute
}(Catalyst || {}));