var utilsCreepAction = require('utils.creep.action');

function run(creep) {
    
    // if no energy - harvest
    if (creep.carry.energy == 0) {
        creep.memory.action = 'withdraw';
    }
    
    // if full energy - tranfer
    if (creep.carry.energy > 0) {
        creep.memory.action = 'transferEnergy';
    }
    
    var failedAction = utilsCreepAction.performAction(creep);
}

module.exports = {
    run: run,
};