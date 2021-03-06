/*
* This script defines the variables that the game code changes throughout play
* 
* All game variables are located in this script
* This script utilizes the module pattern's "loose augmentation" technique, referenced here:
*
* http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html
*
* Version 1.2
* Authors: Marcus Aromatorio & Joseph Horsmann 
*/

// Strict Mode adheres to ECMAScript 5's syntax manually
"use strict";

var Catalyst = (function (game){

	// This augmentation adds global variables to the game
	game.state;
	game.activeButtons = [];
	game.particles = [];
	game.keydown = [];
	game.canvas;
	game.ctx;
	game.animationID;
	game.deltaTime;
	game.lastTime;
	game.paused = true;
	game.currentLevel = 0;
	game.timer = 10;
	game.timerString;
	game.timerSubstring;
	game.timerInterval;
	game.scoreString;
	game.scoreSubstring;
	game.scoresArray = [];
	game.soundSources = ["sounds/Dut.mp3", "sounds/FastPop.mp3", "sounds/HighPop.mp3", "sounds/LowBloop.mp3", "sounds/Plop.mp3", "sounds/Pop.mp3"];
	game.winAudio;
	game.backgroundAudio;
	game.soundEffect;
	game.currentEffect = 0;
	game.loseAudio;
	game.pressed1 = true;
	game.pressed2 = false;
	game.pressed3 = false;
	game.pressed4 = false;
	game.roundClicks = 0;

	// Returning the augmented game object back to the global scope to allow further augmentations
	return game;

// Passing the known (or unknown) global variable Catalyst in at execution
// As JS loads scripts asynchronously, this script may or may not be the first to execute
}(Catalyst || {}));