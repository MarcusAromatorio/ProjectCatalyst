/*
* The gameContainers script defines the containers for physics objects, essentially boxes with collision
*
* This script utilizes the module pattern's "loose augmentation" technique, referenced here:
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
	*
	* Function to call the container constructor and give back the result
	*
	* Requires: none
	* Input: x, y as integer coordinats, width and height as integer metrics
	* Process: Invoke the Container constructor
	* Output: Container object
	*
	*/
	game.makeContainer = function(x, y, width, height){
		var container = new Container(x, y, width, height);

		game.containers.push(container);

		return container;
	}

	/*
	*
	* Function to return a new container object
	*
	* Requires: none
	* Input: x, y as integer coordinats, width and height as integer metrics
	* Process: Define collidable regions based on specified inputs
	* Output: Container object
	*
	*/
	var Container = function(x, y, width, height){

		// The X and Y locations define the top-left corner of the left wall
		// The container consists of a left, right, and bottom wall.
		// Wall thickness depends on which side: left and right have their widths set to 5, bottom has height set to 5
		var leftWall = {x:0, y:0, width:0, height:0};
		var rightWall = {x:0, y:0, width:0, height:0};
		var bottomWall = {x:0, y:0, width:0, height:0};

		this.x = x;
		this.y = y;
		this.thickness = 5;

		this.width = width;
		this.height = height;

		leftWall.x = x;
		leftWall.y = y;
		leftWall.height = height;
		leftWall.width = this.thickness;

		rightWall.x = x + width - this.thickness;
		rightWall.y = y;
		rightWall.height = height;
		rightWall.width = this.thickness;

		bottomWall.x = x;
		bottomWall.y = y + height - this.thickness;
		bottomWall.width = width;
		bottomWall.height = this.thickness;

		this.rightWall = rightWall;
		this.leftWall = leftWall;
		this.bottomWall = bottomWall;
		this.blocks = [this.leftWall, this.rightWall, this.bottomWall];


	}


	// Returning the augmented game object back to the global scope to allow further augmentations
	return game;

// Passing the known (or unknown) variable Catalyst in at execution
// As JS loads scripts asynchronously, this script may or may not be the first to execute
}(Catalyst || {}));