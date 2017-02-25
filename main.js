var handleCreeps = require('handler.creeps');
var handleSpawns = require('handler.spawns');

module.exports.loop = function () {
    handleSpawns();
    handleCreeps();
    
    //console.log(Game.cpu.getUsed());
}