/*
* This script describes functions that are utilized by vector objects
* Frequently used in physics calculations
* 
* This script follows the Javascript Module pattern, and adds a variable named "vec2d" to the global scope
*
* Version 1.1
* Author: Marcus Aromatorio
*/

"use strict";

var vec2d = (function(){

	// Function definitions are made "public" in the return statement below

	/*
	* Method to return a 2D vector object
	*
	* Requires: None
	* Inputs: x and y
	* Process: Construct a vector using given coordinates and add methods
	* Output: Vector2d object
	*
	*/
	function newVector(x, y){
		var vector = new Vector(x, y);

		return vector;
	}

	var Vector = function (x, y){

		this.x = x;
		this.y = y;

		// Add methods to the vector
		this.scale = _scale;
		this.magSq = _magSq;
		this.mag = _mag;
		this.normalize = _normalize;
		this.add = _add;
		
	}

	/*
	* Method that returns a vector between two specified coordinate points
	*
	* Requires: Vector2d
	* Inputs: x1, y1, x2, y2 (numbers)
	* Process: Take the difference between x and y coordinates, call newVector with results
	* Output: result of newVector
	*
	*/
	function between(x1, y1, x2, y2){
		// Local variables for calculation
		var vector, x, y;

		x = x2 - x1;
		y = y2 - y1;
		vector = newVector(x, y);

		return vector;
	}

	/*
	* Method that returns a vector between two given vectors
	*
	* Requires: Vector2d
	* Inputs: vec1, vec2 (vectors)
	* Process: Take the difference between x and y components, call newVector with results
	* Output: result of newVector
	*
	*/
	function vectorBetween(vec1, vec2){
		// Local variables for calculation
		var vector, x, y;

		x = vec2.x - vec1.x;
		y = vec2.y - vec1.y;
		vector = newVector(x, y);

		return vector;
	}

	/*
	* Method that scales the vector by a scalar
	*
	* Requires: Vector2d
	* Inputs: scalar
	* Process: Multiply x and y values by scalar
	* Output: none
	*
	*/
	function _scale(scalar){
		this.x *= scalar;
		this.y *= scalar;
	}

	/*
	* Method that returns the squared magnitude of the vector
	*
	* Requires: Vector2d
	* Inputs: none
	* Process: Square x and y, return the sum
	* Output: Squared magitude (number)
	*
	*/
	function _magSq(){
		return (this.x * this.x + this.y * this.y);
	}

	/*
	* Method that returns the magnitude of the vector, using square root
	*
	* Requires: Vector2d
	* Inputs: none
	* Process: Take square root of sum of squared components
	* Output: Magnitude (number)
	*
	*/
	function _mag(){
		var mag = this.x * this.x + this.y * this.y;

		mag = Math.sqrt(mag);	// This calculaton takes longer than normal, use sparingly

		return mag;
	}

	/*
	* Method that makes the vector a unit vector (magnitude of 1)
	*
	* Requires: Vector2d
	* Inputs: none
	* Process: Divide the components of the vector by its magnitude
	* Output: none
	* 
	*/
	function _normalize(){
		var length = this.mag();
		this.x /= length;
		this.y /= length;
	}

	/*
	* Method that adds a vector to another vector
	*
	* Requires: Vector2d
	* Inputs: Other vector
	* Process: add components
	* Output: none
	*
	*/
	function _add(other){
		this.x += other.x;
		this.y += other.y;
	}

	// Return the public interface as an object with scope closure
	return {
		newVector: newVector,
		vectorBetween: vectorBetween,
		between: between
	};
}());