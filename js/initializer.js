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
		game.state = game.states.MAIN_MECHANIC_DEMO;
		game.lastTime = (+new Date);	// (+new Date) calls the Date.valueOf() function, returning a primitive number
		game.canvas = document.querySelector("canvas");
		game.ctx = game.canvas.getContext("2d");

		game.GRAVITY = vec2d.newVector(0.0, 2.0);

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
