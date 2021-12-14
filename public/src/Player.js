import Bitmap from './Bitmap.js'

function Player(x, y, direction) {
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.weapon = new Bitmap('assets/knife_hand.png', 319, 320);
    this.paces = 0;
  }

  Player.prototype.rotate = function(angle) {
    this.direction = (this.direction + angle + CIRCLE) % (CIRCLE);
  };

  Player.prototype.walk = function(distance, map) {
    var dx = Math.cos(this.direction) * distance;
    var dy = Math.sin(this.direction) * distance;
    let objX = map.get(this.x + dx, this.y)
    let objY = map.get(this.x, this.y + dy)

    if (objX.height <= 0) this.x += dx;
    if (objY.height <= 0) this.y += dy;
    this.paces += distance;
  };

  Player.prototype.update = function(controls, map, seconds) {
    if (controls.left) this.rotate(-Math.PI * seconds);
    if (controls.right) this.rotate(Math.PI * seconds);
    if (controls.forward) this.walk(3 * seconds, map);
    if (controls.backward) this.walk(-3 * seconds, map);
  };


  const CIRCLE = Math.PI * 2;
  
  export default Player;