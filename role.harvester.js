var utilsCreepAction = require('utils.creep.action');

function setHarvestAction(creep) {
    creep.memory.action = 'harvest';
}

function setTransferAction(creep) {
    creep.memory.action = 'transferEnergy';
}

function run(creep) {
    var action = creep.memory.action;
    
    // if no energy - harvest
    if (action != 'harvest' && creep.carry.energy == 0) {
        setHarvestAction(creep);
    }
    
    // if full energy - tranfer
    if (action == 'harvest' && creep.carry.energy == creep.carryCapacity) {
        setTransferAction(creep);
    }
    
    utilsCreepAction.performAction(creep);
}


module.exports = {
    run: run
};