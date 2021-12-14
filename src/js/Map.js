import Bitmap from './Bitmap.js'

const WORLD_TYPES = {
  WALL: "wall",
  FLOOR: "floor",
  NULL: "null"
}

function WorldObject(type, height, texture = null) {
  this.type = type
  this.height = height
  if(texture)
    this.texture = texture
}

const TEXTURES = {
  "concrete": new Bitmap('assets/wall_texture.jpg', 1024, 1024),
  "brick": new Bitmap("assets/brick_wall_2.jpg", 1024, 1024)
}

const outOfBounds = new WorldObject(WORLD_TYPES.NULL, -1)

function Map(size) {
    this.size = size;
    this.wallGrid = new Array(size * size);
    this.skybox = new Bitmap('assets/deathvalley_panorama.jpg', 2000, 750);
    this.wallTexture = new Bitmap('assets/wall_texture.jpg', 1024, 1024);
    this.light = 0;
  }

  Map.prototype.get = function(x, y) {
    x = Math.floor(x);
    y = Math.floor(y);
    if (x < 0 || x > this.size - 1 || y < 0 || y > this.size - 1) return outOfBounds;
    return this.wallGrid[y * this.size + x];
  };

  Map.prototype.randomize = function() {
    this.wallGrid[0] = new WorldObject(WORLD_TYPES.FLOOR, 0)
    for (let i = 1; i < this.size * this.size; i++) {
      let randomType = Math.random()
      let object
      if (randomType < 0.3) {
        let texture = Math.random() < 0.5 ? TEXTURES.concrete : TEXTURES.brick
        object = new WorldObject(WORLD_TYPES.WALL, 1, texture)
      } else {
        object = new WorldObject(WORLD_TYPES.FLOOR, 0)
      }
      this.wallGrid[i] = object;
    }
  };

  Map.prototype.cast = function(point, angle, range) {
    var self = this;
    var sin = Math.sin(angle);
    var cos = Math.cos(angle);
    var noWall = { length2: Infinity };

    return ray({ x: point.x, y: point.y, height: 0, distance: 0 });

    function ray(origin) {
      var stepX = step(sin, cos, origin.x, origin.y);
      var stepY = step(cos, sin, origin.y, origin.x, true);
      var nextStep = stepX.length2 < stepY.length2
        ? inspect(stepX, 1, 0, origin.distance, stepX.y)
        : inspect(stepY, 0, 1, origin.distance, stepY.x);

      if (nextStep.distance > range) return [origin];
      return [origin].concat(ray(nextStep));
    }

    function step(rise, run, x, y, inverted) {
      if (run === 0) return noWall;
      var dx = run > 0 ? Math.floor(x + 1) - x : Math.ceil(x - 1) - x;
      var dy = dx * (rise / run);
      return {
        x: inverted ? y + dy : x + dx,
        y: inverted ? x + dx : y + dy,
        length2: dx * dx + dy * dy
      };
    }

    function inspect(step, shiftX, shiftY, distance, offset) {
      var dx = cos < 0 ? shiftX : 0;
      var dy = sin < 0 ? shiftY : 0;
      let object = self.get(step.x - dx, step.y - dy);
      step.height = object.height
      step.texture = object.texture
      step.distance = distance + Math.sqrt(step.length2);
      if (shiftX) step.shading = cos < 0 ? 2 : 0;
      else step.shading = sin < 0 ? 2 : 1;
      step.offset = offset - Math.floor(offset);
      return step;
    }
  };

  Map.prototype.update = function(seconds) {
    // Handles the lightning effect
    if (this.light > 0) this.light = Math.max(this.light - 9 * seconds, 0);
    else if (Math.random() * 5 < seconds) { 
        console.log("lighting crash")
        this.light = 2; }
  };

  export default Map