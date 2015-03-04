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
		{ objectiveText: "Level 2 - Create a green mixture", highScores: [1,1,1,1,1] },
		{ objectiveText: "Level 3 - Create a blue mixture", highScores: [1,1,1,1,1] },
		{ objectiveText: "Level 4 - Create a blue mixture", highScores: [1,1,1,1,1] },
		{ objectiveText: "Level 5 - Create a red mixture", highScores: [1,1,1,1,1] },
		{ objectiveText: "Level 6 - Create a green mixture", highScores: [1,1,1,1,1] }
	];

	// Array denoting the level-specific number of clicks allowed
	// This array is used in conjunction with game.roundClicks, initialized in gameVariables.js
	game.allowedClicks = [
		3, // LEVEL 1
		3, // LEVEL 2
		3, // LEVEL 3
		3, // LEVEL 4
		3  // LEVEL 5
	];
			
	// Returning the augmented game object back to the global scope to allow further augmentations
	return game;
	
}(Catalyst || {}));