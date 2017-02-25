var utilsGame = require('utils.game');

function handleSpawn(spawn) {
    if (spawn.spawning) return;
    
    if (spawn.energy == spawn.energyCapacity) {
        spawn.createCreep([CARRY,WORK,MOVE],undefined,{role: 'harvester'});
    }
    
}

module.exports = function() {
    utilsGame.getSpawns().forEach(handleSpawn);
};