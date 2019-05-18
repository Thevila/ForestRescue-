/*!
 * Space Invaders - Made with ♥ by ---
 *
 * Use arrow keys to move (← or →)
 * Use spacebar to shoot
 */
////////////////////////////////////////////////////

/** Constants **/
const canvas_width = 1024;
const canvas_height = 720;

/** Objects **/
var spaceship = new Spaceship();
var enemies = new Array();
var keys = new Keys();
var bullets = new Array();
var collision = new Collision();

/** Canvas **/
var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
canvas.width = canvas_width;
canvas.height = canvas_height;


var drawCanvas = function() {
  // Draw the canvas
  ctx.fillStyle = '#0000';
  ctx.clearRect(0, 0, canvas_width, canvas_height);
  ctx.beginPath();
  ctx.rect(0, 0, canvas_width, canvas_height);
  ctx.closePath();
  ctx.fill();
}

/** Key events **/
document.onkeydown = function(e) {
  keys.keyDown(e);
}
document.onkeyup = function(e) {
  keys.keyUp(e);
}



// ---- Objects

function bg() {

  // Object size
  this.width = 512;
  this.height = 320;

  // Initial position
  this.x = 1;
  this.y = 1;

  // Show object on screen
  this.render = function() {
    this.image = new Image();
    this.image.src = 'https://blog.sklambert.com/wp-content/uploads/2013/07/tileset_ground.png';
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

/** Spaceship **/
function Spaceship() {

  // Object size
  this.width = 68;
  this.height = 50;

  // Verify move direction
  this.isLeft = false;
  this.isRight = false;
  this.isUp = false;
  this.isDown = false;

  //"Speed" that the spaceships moves
  const speed = 10;

  // Initial position
  this.x = (canvas_width / 2) - (this.width / 2);
  this.y = canvas_height - 60;

  // Show object on screen
  this.render = function() {
    this.image = new Image();
    this.image.src = 'images/spaceship.png';
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  // Drive spaceship to left
  this.goLeft = function() {
    this.updatePosition(this.x - speed, this.y);
  }

  // Drive spaceship to right
  this.goRight = function() {
    this.updatePosition(this.x + speed, this.y);
  }
  
    // Drive spaceship to up
  this.goUp = function() {
    this.updatePosition(this.x, this.y - speed);
  }
  
    // Drive spaceship to down
  this.goDown = function() {
    this.updatePosition(this.x, this.y + speed);
  }
  
  // Update the object position
  this.updatePosition = function(posX, posY) {
    if ((posX > 0) && (posX < canvas_width - this.width)) {
      this.x = posX;
      this.y = posY;
    }
  }

}

/** Enemy **/
function Enemy() {

    // Object size
    this.width = 35;
    this.height = 25;
  
    // Random position
    this.x = (Math.floor(Math.random() * ((canvas_width - 40) - 40)) + 40);
    this.y = (Math.floor(Math.random() * ((canvas_height - 250) - 20)) + 20);
  
    // Show object on screen
    this.render = function() {
      this.image = new Image();
      this.image.src = 'images/enemy.png';
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
  
  }
  function box() {

    // Object size
    this.width = 89;
    this.height = 84;
  
    // Random position
    this.x = 10;
    this.y = 10;
  
    // Show object on screen
    this.render = function() {
      this.image = new Image();
      this.image.src = 'images/box.png';
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
  
  }

/** Bullet **/
function Bullet(spaceship) {

  // Object size
  this.width = 5;
  this.height = 15;

  // Initial position on the spaceship
  this.x = spaceship.x + 32;
  this.y = spaceship.y - 15;  //https://www.w3schools.com/graphics/canvas_coordinates.asp

  const speed = 20;

  // Show object on screen
  this.render = function() {
    ctx.fillStyle = "#FFFF00";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  // Move bullet
  this.move = function() {
    this.y = this.y - speed;
    if (this.y <= 0) {
      return false;
    }
    return true;
  }
}

/** Keys **/
function Keys() {

    this.leftKey = 37;
    this.rightKey = 39;
	this.upKey = 38;
	this.downKey = 40;
    this.spaceKey = 32;
  
    // Check key pressed (onkeydown)
    this.keyDown = function(e) {
      //In Firefox, the keyCode property does not work on the onkeypress event (will only return 0). For a cross-browser solution, use the which property together with keyCode
      keyPressed = e.which ? e.which : window.event.keyCode;
  
      switch (keyPressed) {
        case this.leftKey:
          spaceship.isLeft = true;
          break;
        case this.rightKey:
          spaceship.isRight = true;
          break;
		case this.upKey:
          spaceship.isUp = true;
          break;
		case this.downKey:
          spaceship.isDown = true;
          break;
        case this.spaceKey:
        bullets[bullets.length] = new Bullet(spaceship);
          break;
      }
    }
  
    // Check key pressed (onkeyup)
    this.keyUp = function(e) {
      keyPressed = e.which ? e.which : window.event.keyCode;
  
      switch (keyPressed) {
        case this.leftKey:
          spaceship.isLeft = false;
          break;
        case this.rightKey:
          spaceship.isRight = false;
          break;
		case this.upKey:
          spaceship.isUp = false;
          break;
		case this.downKey:
          spaceship.isDown = false;
          break;
      }
    }
}

// ---- End Objects

/** First enemies **/
var firstEnemies = function() {
    // Five first enemies
    for (var i = 0; i < 5; i++) {
      enemies[enemies.length] = new Enemy();
    }
  }

 /** Collision **/
function Collision() {

  // Check if has a collision
  this.hasCollision = function(bullet, enemy) {
    if ((bullet.y) < enemy.y) {
      return false;
    } else if (bullet.y > (enemy.y + enemy.height)) {
      return false;
    } else if ((bullet.x + bullet.width) < enemy.x) {
      return false;
    } else if (bullet.x > (enemy.x + enemy.width)) {
      return false;
    }
    return true;
  }
} 

/** Check collisions **/
var checkColisions = function() {
  
  for (idBullet in bullets) {
    for (idEnemy in enemies) {
      if (collision.hasCollision(bullets[idBullet], enemies[idEnemy])) {

        // Dead enemy
        bullets.splice(idBullet, 1);
        enemies.splice(idEnemy, 1);
 
        // Resurrect enemy
        enemies.push(new Enemy());
        break;
      }
    }
  }
}

/** Render **/
var render = function() {

  // Bullets
  for (index in bullets) {
    bullets[index].render();
    if (!bullets[index].move()) {
      bullets.splice(index, 1); //https://www.w3schools.com/jsref/jsref_splice.asp
    }
  }

    // Enemies
    for (index in enemies) {
      enemies[index].render();
    }

    // Spaceship moves
    if (spaceship.isLeft) 
        spaceship.goLeft();
    else if (spaceship.isRight)     
        spaceship.goRight();
	else if (spaceship.isUp)     
        spaceship.goUp();
	else if (spaceship.isDown)     
        spaceship.goDown();

}

/* O método window.requestAnimationFrame() fala para o navegador que deseja-se realizar 
    uma animação e pede que o navegador chame uma função específica para atualizar um 
    quadro de animação antes da próxima repaint (repintura). 
    O método tem como argumento uma callback que deve ser invocado antes da repaint. 
  Essa função funciona em diversos brownsers e caso o brownser não suporte HTML5
    ele usa o setTimeout 
*/
window.requestAnimationFrame = (function() {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 80);
    };
})();


/** Main **/
var main = function() {

  drawCanvas();
  spaceship.render();
  render();
  checkColisions();
  requestAnimationFrame(main);
}


// PLAY!
firstEnemies();
main();