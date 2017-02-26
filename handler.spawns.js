var utilsGame = require('utils.game');
var utilsSource = require('utils.source');
var roleHandler = require('roleHandler');

function handleSpawn(spawn) {
    if (spawn.spawning) return;

    if (utilsSource.harvestingPositionsAvailable(spawn.room) || utilsSource.harvestingPositionsAvailable(Game.rooms['W81S22'])) {
        if (roleHandler.build(spawn, 'harvester', Object.keys(Game.creeps).length > 1)) return;
    }
    
    var creeps = spawn.pos.findInRange(FIND_MY_CREEPS,1).filter(c => c.ticksToLive < 1000);
    if (creeps.length) {
        spawn.renewCreep(creeps[0]);
        creeps[0].say("renewing");
    }
}

module.exports = function() {
    utilsGame.getSpawns().forEach(handleSpawn);
};