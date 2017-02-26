var utilsGame = require('utils.game');
var utilsSource = require('utils.source');
var roleHandler = require('roleHandler');

function handleSpawn(spawn) {
    if (spawn.spawning) return;

    if (utilsSource.harvestingPositionsAvailable(spawn.room)) {
        if (roleHandler.build(spawn, 'harvester', Object.keys(Game.creeps).length > 1)) return;
    }
    
}

module.exports = function() {
    utilsGame.getSpawns().forEach(handleSpawn);
};