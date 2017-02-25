var utilsCreepAction = require('utils.creep.action');

function setHarvestAction(creep) {
    creep.memory.action = 'harvest';
}

function setTransferAction(creep) {
    creep.memory.action = 'transferEnergy';
}

function run(creep) {
    
    // if no energy - harvest
    if (creep.memory.action != 'harvest' && creep.carry.energy == 0) {
        setHarvestAction(creep);
    }
    
    if (creep.carry.energy == creep.carryCapacity && creep.room.energyAvailable === creep.room.energyCapacityAvailable) {
        creep.memory.action = 'upgrade';
    }
    
    // if full energy - tranfer
    if (creep.memory.action != 'upgrade' && creep.carry.energy == creep.carryCapacity) {
        setTransferAction(creep);
    }
    
    utilsCreepAction.performAction(creep);
}


module.exports = {
    run: run,
    minParts: [CARRY,MOVE,WORK],
    maxParts: [CARRY,MOVE,WORK]
};