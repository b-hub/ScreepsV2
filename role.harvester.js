var utilsCreepAction = require('utils.creep.action');

var minParts = [CARRY,MOVE,WORK];
var incParts = [CARRY,MOVE,MOVE,WORK,WORK];
var incCost = 200;
var minCost = 350;

function run(creep) {
    
    // if no energy - harvest
    if (creep.memory.action != 'harvest' && creep.carry.energy == 0) {
        creep.memory.action = 'harvest';
    }
    
    if (creep.memory.action != 'harvest' && creep.carry.energy > 0 && creep.room.energyAvailable === creep.room.energyCapacityAvailable) {
        creep.memory.action = 'build';
    }
    
    // if full energy - tranfer
    if (creep.memory.action != 'build' && creep.carry.energy >= creep.carryCapacity - creep.getActiveBodyparts(WORK)) {
        creep.memory.action = 'transferEnergy';
    }
    
    utilsCreepAction.performAction(creep);
    
    creep.upgradeController(creep.room.controller);
}

function getParts(energy) {
    var cost = minCost;
    var parts = minParts.slice(0);
    while (cost + incCost <= energy){
        parts = parts.concat(incParts);
        cost += incCost;
    }
    return parts;
}

module.exports = {
    run: run,
    getParts: getParts
};