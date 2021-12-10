var canvas = document.getElementById("canvas");
canvas.width = 1800;
canvas.height = 900;
var mouseX = -1;
var mouseY = -1;

var alienSprites = [];
var defenderSprite = new DefenderSprite(900, 860);
var bulletSprites = [];

canvas.addEventListener('mousemove', (event) => {
	mouseX = event.clientX;
	mouseY = event.clientY;
});

canvas.addEventListener('mouseup', (event) => {
	let clone = soundDefenderFireLaser.cloneNode(true);
	clone.volume = 0.3;
	clone.play();
	bulletSprites.push(new BulletSprite(defenderSprite.x, defenderSprite.y));
});

canvas.addEventListener('mousedown', (event) => {
	let clone = soundDefenderFireLaser.cloneNode(true);
	clone.volume = 0.3;
	clone.play();
	bulletSprites.push(new BulletSprite(defenderSprite.x, defenderSprite.y));
});

var soundMusic = new Audio("sound/423805__tyops__game-theme-4.wav");
var soundAliendExplode = new Audio("sound/Explosion+7.mp3");
var soundDefenderFireLaser = new Audio("sound/laser4.mp3");
soundAliendExplode.volume = 0.6;
soundDefenderFireLaser.volume = 0.1;

for (var x = 100; x+100 < canvas.width; x += 100) {
	for (var y = 100; y+400 < canvas.height; y += 40) {
		alienSprites.push( new AlienSprite(x, y));
	}
}

drawStars(canvas);
soundMusic.play();

var tickno = 0;
window.setInterval(tick, 30);

function tick() {
	tickno++;
	// bullets
	bulletSprites.forEach(function(item, index, array) { 
		item.tick(tickno);	
		// dispose obsolete sprites
		if (item.y < 0 ) {
			item.element.remove()
			bulletSprites.splice(index, 1);
		}
	});
	// aliens
	let bulletOffset = 16;
	alienSprites.forEach(function(alienSprite, alienIndex, alienArray) { 
		alienSprite.tick(tickno+alienIndex) 
		// check collisions with bullets
		bulletSprites.forEach(function(bulletSprite, bulletIndex, bulletArray) {
			if ( bulletSprite.x+bulletOffset >= alienSprite.x && 
			     bulletSprite.x+bulletOffset <= alienSprite.x+alienSprite.element.width &&
				 bulletSprite.y >= alienSprite.y && 
			     bulletSprite.y <= alienSprite.y+alienSprite.element.height ) {
				if (alienSprite.state == 0) {
					// remove bullet
					bulletSprite.element.remove()
					bulletSprites.splice(bulletIndex, 1);
				}
				// let alien explode
				alienSprite.state = 1;
				let clone = soundAliendExplode.cloneNode(true);
				clone.volume = 0.4;
				clone.play();
			}
		});
		// dispose obsolete sprites
		if (alienSprite.y < 0) {
			alienSprite.element.remove()
			alienSprites.splice(alienIndex, 1);			
		}
	});
	// defender
	defenderSprite.tick(tickno);
}

function BulletSprite(x, y) {
	this.tick = function(tickno) {
		this.y += this.vy;
		this.set(this.x, this.y)
	};
	this.set = function(x, y) {
		this.x = x;
		this.y = y;
		this.element.style.left = x+"px";
		this.element.style.top = y+"px";
	};
	this.element = document.createElement('img');
	this.element.src = "pic/defenderBullet-1.png";
	this.element.style.position = "absolute";
	this.x0 = x;
	this.y0 = y;
	this.set(x, y);
	this.vx = 0;
	this.vy = -12;
	document.getElementById("space").appendChild(this.element);
}

function DefenderSprite(x, y) {
	this.tick = function(tickno) {
		if ( mouseX > -1 ) {
			this.x = mouseX;
			this.set(this.x, this.y);
		}
	};
	this.set = function(x, y) {
		this.x = x;
		this.y = y;
		this.element.style.left = x+"px";
		this.element.style.top = y+"px";
	};
	this.element = document.createElement('img');
	this.element.src = "pic/defender.png";
	this.element.style.position = "absolute";
	this.x0 = x;
	this.y0 = y;
	this.set(x, y);
	this.vx = 0;
	this.vy = 0;
	document.getElementById("space").appendChild(this.element);
}

function AlienSprite(x, y) {
	this.tick = function(tickno) {
		this.x = this.x0 + 80*Math.sin(tickno / 30);
		this.set(this.x, this.y)
		if ( this.state == 0 ) {
			if ( tickno % 20 == 0 ) {
				this.element.src = "pic/alien1-1.png";
			}
			if ( tickno % 20 == 10 ) {
				this.element.src = "pic/alien1-2.png";
			}
		} else if ( this.state == 1) {
			this.frame += 1;
			if (this.frame < 30) {
				let frameNo = Math.floor(this.frame / 5);
				this.element.src = "pic/explosion1-"+frameNo+".png";
			} else {
				this.y = -1;
			}
		}
	};
	this.set = function(x, y) {
		this.x = x;
		this.y = y;
		this.element.style.left = x+"px";
		this.element.style.top = y+"px";
	};
	this.element = document.createElement('img');
	this.element.src = "pic/alien1-1.png";
	this.element.style.position = "absolute";
	this.x0 = x;
	this.y0 = y;
	this.set(x, y);
	this.vx = 0;
	this.vy = 0;
	this.state = 0;
	this.frame = 9;
	document.getElementById("space").appendChild(this.element);
}

function drawStars(canvas) {
	var ctx = canvas.getContext("2d");
	var colorLetter = '123456789';
	var numberStars = canvas.width * canvas.height / 600;
	for ( var i = 0; i < numberStars; i++) {
		let colorIndex = Math.floor(Math.random() * colorLetter.length);
		let colorCode = '#' + colorLetter[colorIndex] + colorLetter[colorIndex] + colorLetter[colorIndex];
		ctx.fillStyle = colorCode;
		let x = Math.floor(Math.random() * canvas.width);
		let y = Math.floor(Math.random() * canvas.height);
		ctx.fillRect(x, y, 2, 2);
	}
}