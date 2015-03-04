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
	var highScores = [];
	
	// Array of level data objects
	game.levelInformation = [
		{ objectiveText: "Level 1 - Create a red mixture", highScores: [1,1,1,1,1] },
		{ objectiveText: "Level 2 - Create a blue mixture", highScores: [1,1,1,1,1] }
	];
			
	// Returning the augmented game object back to the global scope to allow further augmentations
	return game;
	
}(Catalyst || {}));