var utilsCreepAction = require('utils.creep.action');

function setHarvestAction(creep) {
    creep.memory.action = 'harvest';
}

function setUpgradeAction(creep) {
    creep.memory.action = 'upgrade';
}

function run(creep) {
    var action = creep.memory.action;
    
    // if no energy - harvest
    if (action != 'harvest' && creep.carry.energy == 0) {
        setHarvestAction(creep);
    }
    
    // if full energy - tranfer
    if (creep.carry.energy > 0) {
        setTransferAction(creep);
    }
    
    utilsCreepAction.performAction(creep);
}


module.exports = {
    run: run,
    minParts: [CARRY,MOVE,WORK],
    maxParts: [CARRY,MOVE,WORK]
};