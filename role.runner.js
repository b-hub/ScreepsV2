var utilsCreepAction = require('utils.creep.action');

function run(creep) {
    
    // if no energy - harvest
    if (creep.carry.energy == 0) {
        creep.memory.action = 'withdrawContainer';
    }
    
    // if full energy - tranfer
    if (creep.room.energyAvailable < creep.room.energyCapacityAvailable && creep.carry.energy > 0) {
        creep.memory.action = 'transferEnergy';
        
    } else if(creep.memory.action != 'storeEnergy') {
        creep.memory.action = 'withdrawContainer';
    }
    
    if (creep.carry.energy == creep.carryCapacity) {
        creep.memory.action = 'storeEnergy';
    }

    var failedAction = utilsCreepAction.performAction(creep);
    
    if (failedAction == 'transferEnergy') {
        creep.memory.action = 'storeEnergy';
    }
    
    var repairTargets = creep.pos.findInRange(FIND_STRUCTURES, 3, {
        filter: (s) => {
            return (s.structureType == STRUCTURE_ROAD) && s.hits < s.hitsMax;
        }
    });
    
    if (repairTargets.length) {
        creep.repair(repairTargets[0]);
    }
}

module.exports = {
    run: run,
};