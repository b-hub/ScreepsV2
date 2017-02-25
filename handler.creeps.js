var utilsGame = require('utils.game');
var roleHandler = require('roleHandler');

module.exports = function() {
    
    Object.keys(Memory.creeps).forEach(name => {
       if (Game.creeps[name]) return;

       delete Memory.creeps[name];
    });
    utilsGame.getCreeps().forEach(roleHandler.commandCreep);
};