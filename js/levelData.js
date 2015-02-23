/*
*
* This script contains the information that changes level-to-level as the player progresses through the game.
*
* Version 1.0
* Authors: Marcus Aromatorio & Joseph Horsmann
*
*/

"use strict";

var Catalyst = (function (game){
	var objectiveText;
	
	// Array of level data objects
	game.levelInformation = [
		{ objectiveText: "Level 1 - Create a red mixture" }, // Temporary for demo
		{ objectiveText: "Level 2 - Create a blue mixture" },  // Temporary for demo
		//{ objectiveText: "Tutorial 1 - Change the color of the mixture" },
		//{ objectiveText: "Tutorial 2 - Raise the height of the mixture" },
		{ objectiveText: "Tutorial 3 - Make the mixture explode" },
		{ objectiveText: "Level 1 - Make a purple mixture 6 units tall" },
		{ objectiveText: "Level 2 - Make a mixture explode to reach the indicated height" }
	];
			
	// Returning the augmented game object back to the global scope to allow further augmentations
	return game;
	
}(Catalyst || {}));