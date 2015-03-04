/*
* The gameObjects script defines methods whose return values are used as game objects
*
* This script utilizes the module pattern's "loose augmentation" technique, referenced here:
* http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html
*
* Version 1.1
* Authors: Marcus Aromatorio & Joseph Horsmann 
*
*/


// Strict Mode adheres to ECMAScript 5's syntax manually
"use strict";

// The game is augmented through an IIFE
var Catalyst = (function (game) {

	/*
	* Method to return a particle (single "chemical" particle) object
	*
	* Requires: None
	* Inputs: Type is a string, x and y are numbers
	* Process: Construct a particle of appropriate type and return the associated object
	* Output: Particle object
	*
	*/
	game.makeParticle = function(type, x, y){

		// Begin constructing the ball object
		var particle = new Particle(type, x, y);



		switch(type){
			case "catalyst": // The catalyst particle has different properties than default
				particle.mass = 2.2;
				particle.radius = 3;
				particle.color = "red";
				particle.density = 1.45;
			break;
			case "catalyst2": // The second catalyst particle is large and blue
				particle.mass = 6.4;
				particle.radius = 7;
				particle.color = "blue";
				particle.density = 0.65;
			break;
			case "oxygen":
				particle.mass = 0.5;
				particle.radius = 10;
				particle.color = "purple";
				particle.density = 0.1;
			break;
			case "demo": // The demonstration chemical is the same as the default
			default:
				particle.mass = 4.0;
				particle.radius = 5;
				particle.color = "green";
				particle.density = 1.0;
			break;
		}

		// Add particle to particles array
		game.particles.push(particle);

		// End by returning the particle object
		return particle;

	};

	var Particle = function(type, x, y){

		this.x = x;
		this.y = y;
		this.mass = 0.0;
		this.radius = 5;
		this.color = "green"
		this.density = 0.0;

		this.position = vec2d.newVector(x, y);
		this.velocity = vec2d.newVector(0, 0);
		this.acceleration = vec2d.newVector(0,0);
		this.addForce = _addForce;
		this.addGravity = _addGravity;
		this.update = _updateParticle;
		this.collidingWith = _collidingWith;
		this.addForce = _addForce;
		this.checkReaction = _checkReaction;
		this.setPosition = _setPosition;
		this.collisionList = [];
		this.type = type;
		this.invertY = _invertY;
		this.invertX = _invertX;

	}

	/*
	* Method that calls makeParticle a specified number of times, giving each particle a specific offset location
	*
	* Requires: Vector2d
	* Inputs: type, amount, startX, startY, rowLength
	* Process: Call makeParticle "amount" times, passing "type", "offsetX", "offsetY", and increment offsets
	* Output: none
	*
	*/
	game.makeParticles = function (type, amount, startX, startY, rowLength){
		// Local variables to describe individual particle positions
		var offsetX = startX;
		var offsetY = startY;

		// Loop to call makeParticle "amount" times
		for (var i = 0; i < amount; i++){
			// Local variable to store particle object
			var particle = game.makeParticle(type, offsetX, offsetY);

			// Game's particle array is added to in makeParticle(), no need to do it here

			// Increment the offset by the radius of the particle (particle-type dependent)
			offsetX += particle.radius * 2;

			// If the number of particles already made is divisible by rowLength, the row is full
			if(i % rowLength == 0 && i != 0){
				// Increment offsetY and reset offsetX to start a new row
				offsetX = startX + particle.radius;
				offsetY += particle.radius * 2;
			}

		}
	}

	/*
	* Method to test collision with other particles
	*
	* Requires: Vector2d
	* Inputs: Other vector
	* Process: Consider the magnitude of the vector between the two particles, returning true if too small (intersescting)
	* Output: Boolean value
	*
	*/
	function _collidingWith(other){
		// Take a temporary vector from the positions of the two particles
		//debugger;
		var distSq = vec2d.vectorBetween(this.position, other.position).magSq();

		// Variables used to determine collision radii (squared radii of both particles)
		var radSq = this.radius * this.radius;
		var otherRad = other.radius * other.radius;

		// If the square distance is less than the sum of squared radii, the particles are colliding
		if(distSq <= (radSq + otherRad)){
			// The particles are colliding, add other to collisionList and return true
			this.collisionList.push(other);
			return true;
		}
		else
			return false;

	}

	/*
	* Method to alter properties of particles based on known colliding bodies
	*
	* Requires: none
	* Inputs: none
	* Process: Particle-type based, loop through known collisions and change if specific reactant is present
	* Output: none
	*
	*/
	function _checkReaction(){
		// First loop through collisionList and see if a catalyst has collided with the particle
		// Temporary variable to track if a reaction will occur
		var shouldReact = false;
		var alternateReaction = false;

		// Check the list of collided particles for specific types
		for(var i = 0; i < this.collisionList.length; i++){
			if(this.collisionList[i].type == "catalyst" && this.type == "demo")
				shouldReact = true;
			else if(this.collisionList[i].type == "catalyst2" && this.type == "catalyst")
				shouldReact = true;
			else if(this.collisionList[i].type == "demo" && this.type == "catalyst2")
				shouldReact = true;
			else if(this.collisionList[i].type == "oxygen" && this.type == "catalyst2"){
				shouldReact = true;
				alternateReaction = true;
			}
		}// End for-loop

		// Should the particle react? if not, exit early
		if(!shouldReact)
			return;

		// Play a sound to notify a reaction
		game.playSoundEffect();

		// Switch statement for particle type
		switch(this.type){
			case "demo":
				// The demonstration particle changes color and type to continue reaction
				this.type = "catalyst";
				this.color = "red";
				this.radius = 3;
				this.mass = 2.1;
				this.density = 1.25;
			break;
			case "catalyst":
				this.type = "catalyst2";
				this.mass = 6.4;
				this.color = "blue";
				this.radius = 7;
				this.density = 0.85;
			break;
			case "catalyst2":
				if(alternateReaction){
					this.type = "oxygen";
					this.mass = 0.5;
					this.radius = 10;
					this.color = "purple";
					this.density = 0.1;
				}
				else{
					this.type = "demo";
					this.mass = 1.0;
					this.radius = 5;
					this.color = "green";
					this.density = 1.0;
				}
			break;
			default:
				// Catalysts and default-type particles do nothing on their own & this block should not execute
				console.log( "Erroneous collision response");
			break;
		}
	}

	/*
	* Method added to particle objects that alter their acceleration by a force
	*
	* Requires: Vector2d
	* Inputs: vector force
	* Process: Newton's Second Law alters the acceleration vector of the ball (a += f/m)
	* Output: none
	*
	*/
	function _addForce(force){
		// Scale the force by the inverse of mass, Newtons Second Law
		var tempVector = vec2d.newVector(force.x, force.y);

		tempVector.scale(1.0/this.mass);

		// Add the force to acceleration
		this.acceleration.add(tempVector);
	}

	/*
	* Special-case Method added to particle objects that alter their acceleration by a force of gravity
	*
	* Requires: Vector2d
	* Inputs: vector force
	* Process: Gravity is only added after altering the effect by the particle's density
	* Output: none
	*
	*/
	function _addGravity(force){
		// Scale the force by the particle's density (not exactly realistic density, but for our effect it works)
		var tempVector = vec2d.newVector(force.x, force.y);

		tempVector.scale(this.density);

		// Add the force
		this.addForce(tempVector);
	}

	/*
	* Updates the particle that behaves as a kinematic object
	*
	* Requires: Vector2d
	* Inputs: delta time
	* Process: Move by velocity, accelerate velocity, set acceleration to zero
	* Output: none
	*
	*/
	function _updateParticle(dt){
		var tempVelocity = vec2d.newVector(this.velocity.x, this.velocity.y);
		tempVelocity.scale(0.5);
		this.position.add(tempVelocity);
		this.velocity.add(this.acceleration);
		this.acceleration.x = 0;
		this.acceleration.y = 0;

		// Collision happens per-frame, empty the collisionList after each frame
		this.collisionList = [];
	}

	/*
	* Sets the position to a specified x and y value
	*
	* Requires: Vector2d
	* Inputs: x and y (numbers)
	* Process: Components of x and y are overwritten
	* Output: none
	*
	*/
	function _setPosition(x, y){
		this.position.x = x;
		this.position.y = y;
	}

	/*
	* Inverts the particle's Y velocity component
	*
	* Requires: none
	* Inputs: damping ratio
	* Process: flip the Y velocity's sign, after scaling by the damping ratio
	* Output: none
	*
	*/
	function _invertY(damp){
		this.velocity.y *= (-1 * damp);

	}

	/*
	* Inverts the particle's X velocity component
	*
	* Requires: none
	* Inputs: damping ratio
	* Process: flip the X velocity's sign, after scaling by the damping ratio
	* Output: none
	*
	*/
	function _invertX(damp){
		this.velocity.x *= (-1 * damp);

	}

	// Returning the augmented game object back to the global scope to allow further augmentations
	return game;

// Passing the known (or unknown) variable Catalyst in at execution
// As JS loads scripts asynchronously, this script may or may not be the first to execute
}(Catalyst || {}));