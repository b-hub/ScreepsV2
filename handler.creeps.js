var utilsGame = require('utils.game');
var roleHandler = require('roleHandler');

module.exports = function() {
    
    Object.keys(Memory.creeps).forEach(name => {
       if (Game.creeps[name]) return;

       delete Memory.creeps[name];
    });
    utilsGame.getCreeps().forEach(roleHandler.commandCreep);


    var towers = [].concat.apply([], Object.keys(Game.rooms).map(function(e){
        return Game.rooms[e].find(FIND_MY_STRUCTURES, {
            filter: {structureType: STRUCTURE_TOWER}
        });
    }));
    
    towers.forEach(roleHandler.commandTower);
};