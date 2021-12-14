import Player from './js/Player.js';
import Map from './js/Map.js';
import Camera from './js/Camera.js'
import Controls from './js/Controls.js'
import MiniMap from './js/MiniMap.js'

var CIRCLE = Math.PI * 2;
var MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)


function GameLoop() {
    // Initalizes 
    this.frame = this.frame.bind(this);
    this.lastTime = 0;
    this.callback = function() {};
}

GameLoop.prototype.start = function(callback) {
    this.callback = callback;
    requestAnimationFrame(this.frame);
};

GameLoop.prototype.frame = function(time) {
    // Continually draws to the canvas
    // Updates game loop every 1/5 of a second
    var seconds = (time - this.lastTime) / 1000;
    this.lastTime = time;
    if (seconds < 0.2) this.callback(seconds);
    requestAnimationFrame(this.frame);
};

// Start the game
var display = document.getElementById('display');
var player = new Player(0, 0, Math.PI * 0.3);
var map = new Map(32);
var controls = new Controls();
var camera = new Camera(display, MOBILE ? 160 : 320, .8);
var loop = new GameLoop();
let minimap = new MiniMap(display, map, MOBILE ? 1: 5)

map.randomize();

loop.start(seconds => {
    map.update(seconds);
    player.update(controls.states, map, seconds);
    camera.render(player, map);
    minimap.render(player, map)
});

window.onresize = () => {
    camera.resize()
}