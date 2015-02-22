// RequestAnimrame: a browser API for getting smoth animations
window.requestAnimFrame = (function() {
	return window.requestAnimationFrame 	||
	window.webkitRequestAnimationFrame 		||
	window.mozRequestAnimationFrame 		||
	window.oRequestAnimationFrame			||
	window.msRequestAnimationFrame			||
	function( callback ){
		window.setTimeout(callback, 1000 / 60);
	};
})();

// Initializing the canvas
// Uing native JS but could be jQuery or anything
var cvs = document.getElementById("canvas");

// Initialize the context
var ctx = cvs.getContext("2d");

// Set width and height to full window
var W = window.innerWidth, H = window.innerHeight;
cvs.width = W;
cvs.height = H;

// Some variables for later use
var particleCount = 250,
	particles = [],
	minDist = 65,
	sf = 5,			// Speed factor
	af = -5000,		// Acelleration factor
	lines = true,	// Draw lines between particles if true
	rColor = true,
	color = "rgb(" + Math.floor((Math.random() * 200 + 55)) + ", " + Math.floor((Math.random() * 200 + 55))	 + ", " + Math.floor((Math.random() * 200 + 55))+ ")",
	dist;

	console.log(color);

// function to make canvas black
function paintCanvas(){
	// set color to black 
	ctx.fillStyle = "rgba(46, 46,73, 1)";

	// Rectangle of white from Top Left (0,0) to Bottom Right (W, H)
	ctx.fillRect(0,0,W,H);
}

// Now make some particles that attract each other when near
// Will set min. distance for it and draw a line between them when near

// Attraction is done by increasing velocity when near each other

// Make a function that will act as a class for the particles

function Particle(){
	// Position them randomly
	// Math.random()) generates random between 00 and 1 so we multiply this by canvas width and height
	this.x = Math.random() * W;
	this.y = Math.random() * H;

	// Also need to set some velocity
	this.vx = -1 + Math.random() * (Math.random() * sf);
	this.vy = -1 + Math.random() * (Math.random() * sf);

	// Now the sizes of the particles
	this.radius = Math.random() * (Math.random() * 5);

	this.color = (rColor == true)? "rgb(" + Math.floor((Math.random() * 200 + 55)) + ", " + Math.floor((Math.random() * 200 + 55))	 + ", " + Math.floor((Math.random() * 200 + 55))+ ")": color;

	// Now draw the paricles, use basic fillStyle and start the path
	// use 'arc' function to draw circle, uses x+y coordinates and then radius, 
	// then starte angle, and end angle, then boolean False for clockwise
	this.draw = function() {
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius* Math.sqrt(W*W + H*H)/1000, 0, Math.PI * 2, false);

		// fill the arcwe just made
		ctx.fill();
	}
}

// Push the particles into an array
for(var i = 0; i < particleCount; i++)
{
	particles.push(new Particle());
}


// Function to draw everything on canvas that we'll useo when we animate the whole scene
function draw(){
	// Call the paintCanvas function so it gets repainted each frame
	paintCanvas();

	// Call update function
	update();

	// Call function to draw particles using a loop
	for(var i = 0; i < particles.length; i++)
	{
		p = particles[i];
		p.draw();
	}

}


// Give life to the particles
function update(){
	// This function will update every particle position according to their veloccity
	for (var i = 0; i < particles.length; i++) {
		p = particles[i];

		// Change position
		p.x += p.vx;
		p.y += p.vy;

		// We don't want them to leave area so only change position when they touch walls
		if(p.x + p.radius > W)
			p.x = p.radius;
		else if(p.x - p.radius < 0)
			p.x = W - p.radius;

		if(p.y + p.radius > H)
			p.y = p.radius;
		else if(p.y - p.radius < 0)
			p.y = H - p.radius;

		// Now they need to attract, so check distance then compare to midDistance
		// We will have another loop so it is compared to everyparticle apart from itself
		for(var j = i + 1; j< particles.length; j++)
		{
			p2 = particles[j];
			distance(p,p2);
		}
	}
}

// Distance calculator between particles
function distance(p1, p2)
{
	var	dx = p1.x - p2.x,
	dy = p1.y - p2.y,
	dist = Math.sqrt(dx*dx + dy*dy);

	// Draw line if distance is smaller than minDistance 
	if(dist <= minDist)
	{
		// Draw the line
		if(lines == true)
		{
			ctx.beginPath();
			ctx.strokeStyle = "rgba(200,200,200," + (1.2 - dist/minDist) + ")";
			ctx.moveTo(p1.x, p1.y);
			ctx.lineTo(p2.x, p2.y);
			ctx.stroke();
			ctx.closePath();
		}

		// Some acceleration depending on distance
		var ax = dx/af,
			ay = dy/af;

		// Appy the acceleration
		p1.vx -= ax;
		p1.vy -= ay;

		p2.vx += ax;
		p2.vy += ay;	
	}
}

// Start main animation loop using requestAnimFrame
function animloop(){
	draw();
	requestAnimFrame(animloop);
}

animloop();

