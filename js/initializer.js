/*
* This script initializes the game through an Immediately Invoking Function Expression (IIFE)
* 
* The game follows the Module Pattern of javascript
*
*
* Version 1.0
* Authors: Marcus Aromatorio & Joseph Horsmann 
* 
*/

// Strict Mode adheres to ECMAScript 5's syntax manually
"use strict";

/* 
*  The IIFE is executed below, beginning with an anonymous function
*  This code will return scoped variables to provide closure over the script
*  The function is assigned to a variable so that it may be exported to other scripts as needed
*/
var Catalyst = (function(){


	// The "game" object is created here, and necessary properties are set for initializing below
	var game = {};

	// This function initializes the game's starting varables and state
	game.init = function(){

		// To begin, game variables are defined
		game.state = game.states.MAIN_MENU;
		game.lastTime = (+new Date);	// (+new Date) calls the Date.valueOf() function, returning a primitive number
		game.canvas = document.querySelector("canvas");
		game.ctx = game.canvas.getContext("2d");

		game.GRAVITY = vec2d.newVector(0.0, 1.5);

		game.backgroundAudio = document.querySelector("#bgMusic");
		game.backgroundAudio.volume = 0.15;
		game.winAudio = document.querySelector("#winSound");
		game.winAudio.volume = 0.6;
		game.loseAudio = document.querySelector("#loseSound");
		game.loseAudio.volume = 0.32;
		game.soundEffect = document.querySelector("#effectSounds");
		game.soundEffect.volume = 0.31;

		// After defining game variables, window events and in-game functionalities are connected
		// window-related and user-input functions are located in the gameEventHandlers script
		// The gameEventHandlers script augments the game object to have these events already defined
		game.canvas.onmousedown = game.handleMouseClick;

		//Event Listeners for window
		window.addEventListener("keydown", function(e){
			//Console.log("keydown=" + e.keyCode);
			game.keydown[e.keyCode] = true;
		});
	
		window.addEventListener("keyup", function(e){
			//Console.log("keyup=" + e.keyCode);
			game.keydown[e.keyCode] = false;
		});
		
		// Load the high scores saved to local storage
		game.scoresArray = JSON.parse(localStorage.getItem('savedScores'));
		if(game.scoresArray != null) {
			for (var i = 0; i < 2; i++) {
				game.levelInformation[i].highScores = game.scoresArray[i];
			}
		}
		console.log(game.levelInformation[0].highScores);
		console.log(game.levelInformation[1].highScores);

		// Before the game starts calculatons, start the background music
		game.backgroundAudio.play();

		// Initialization finishes by calling the game's reset method, which is game-state dependent
		game.reset();
	};

	// The initialization of the game begins after the page has completed loading
	// All scripts will have been loaded when the window.onload event fires
	window.onload = game.init;

	// This short event removes the right click context menu on this page
	window.oncontextmenu = function(){
		return false;
	}

	// the game object is returned here so that it may be added to in other scripts that augment it
	return game;
}());
