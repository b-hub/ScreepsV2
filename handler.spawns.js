var utilsGame = require('utils.game');
var utilsSource = require('utils.source');
var roleHandler = require('roleHandler');

function handleSpawn(spawn) {
    if (spawn.spawning) return;
    
    var creeps = spawn.pos.findInRange(FIND_MY_CREEPS,1).filter(c => c.ticksToLive < 1250);
    if (creeps.length) {
        spawn.renewCreep(creeps[0]);
    }
    
    //if (spawn.room.name == 'W81S22') return;
    //if (spawn.room.name == 'W82S21') return;

    if (utilsSource.harvestingPositionsAvailable(spawn.room)) {
        if (roleHandler.build(spawn, 'harvester', Object.keys(Game.creeps).length > 1)) return;
     }// else if (spawn.room.name == 'W81S21' && utilsSource.harvestingPositionsAvailable(Game.rooms['W82S21'])) {
    //     if (roleHandler.build(spawn, 'harvester', false)) return;
    // }
}

module.exports = function() {
    utilsGame.getSpawns().forEach(handleSpawn);
};