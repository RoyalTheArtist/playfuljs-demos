function MiniMap(canvas, map, multiplier = 4) {
    this.ctx = canvas.getContext('2d');
    this.multiplier = multiplier
    this.size = map.size * this.multiplier
    this.mapX = canvas.width - this.size - 10
    this.mapY = 0 + 10
    console.log(this.mapX, this.mapY)
}

MiniMap.prototype.render = function(player, map) {
    // draw the minimap
    this.ctx.save()
    this.ctx.fillStyle = "rgba(0,0,0, .5)"
    this.ctx.fillRect(this.mapX,this.mapY,this.size, this.size)
    this.ctx.save()

    this.ctx.fillStyle = "rgba(255,255,255, .5)"
    for ( let row = 0; row < map.size; row++) {
        for (let col = 0; col < map.size; col++) {
            let wallIndex = row * map.size + col

            if (map.wallGrid[wallIndex].height > 0) {
                this.ctx.fillRect(this.mapX + (this.multiplier * col), this.mapY + (this.multiplier * row),this.multiplier,this.multiplier)
            }
        }
    }
    // draw the player
    this.ctx.fillStyle = "rgb(0,255,0)"
    this.ctx.fillRect((player.x * this.multiplier) + this.mapX - 1 , (player.y * this.multiplier) + this.mapY - 1, 2, 2)
    this.ctx.restore()
}

export default MiniMap