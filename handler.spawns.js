var utilsGame = require('utils.game');
var utilsSource = require('utils.source');

function handleSpawn(spawn) {
    if (spawn.spawning) return;

    if (utilsSource.harvestingPositionsAvailable(spawn.room)) {
        spawn.createCreep([CARRY,WORK,MOVE],undefined,{role: 'harvester'});
    }
    
}

module.exports = function() {
    utilsGame.getSpawns().forEach(handleSpawn);
};