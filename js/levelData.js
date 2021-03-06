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
		{ objectiveText: "Level 1 - Turn all particles red", highScores: [1,1,1,1,1] },
		{ objectiveText: "Level 2 - Turn all particles green", highScores: [1,1,1,1,1] },
		{ objectiveText: "Level 3 - Turn all particles blue", highScores: [1,1,1,1,1] },
		{ objectiveText: "Level 4 - Turn all particles blue", highScores: [1,1,1,1,1] },
		{ objectiveText: "Level 5 - Turn all particles red", highScores: [1,1,1,1,1] },
		{ objectiveText: "Level 6 - Turn all particles green", highScores: [1,1,1,1,1] }
	];

	// Array denoting the level-specific number of clicks allowed
	// This array is used in conjunction with game.roundClicks, initialized in gameVariables.js
	game.allowedClicks = [
		2, // LEVEL 1 - 3 clicks
		1, // LEVEL 2 - 2 clicks
		0, // LEVEL 3 - 1 click
		1, // LEVEL 4 - 2 clicks
		0, // LEVEL 5 - 1 clicks
		1  // LEVEL 6 - 2 clicks
	];
			
	// Returning the augmented game object back to the global scope to allow further augmentations
	return game;
	
}(Catalyst || {}));