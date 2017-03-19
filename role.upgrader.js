var utilsCreepAction = require('utils.creep.action');

function run(creep) {
    var action = creep.memory.action;
    
    // if no energy - harvest
    if (action != 'harvest' && creep.carry.energy == 0) {
        creep.memory.action = 'withdraw';
    }
    
    // if full energy - tranfer
    if (creep.carry.energy > 0) {
        creep.memory.action = 'upgrade';
    }
    
    utilsCreepAction.performAction(creep);
    
    if (!creep.room.memory.upgradeContainerId) setUpgradeContainer(creep);
}

function setUpgradeContainer(creep) {
    var controller = creep.room.controller;
    var container = controller.pos.findClosestByRange(controller.pos.findInRange(FIND_STRUCTURES, 4, {
       filter: s => {
           return s.structureType === STRUCTURE_CONTAINER;
       } 
    }));
    
    creep.room.memory.upgradeContainerId = container.id;
}


module.exports = {
    run: run,
    minParts: [CARRY,MOVE,WORK],
    maxParts: [CARRY,MOVE,WORK]
};