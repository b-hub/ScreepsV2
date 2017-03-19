var utilsCreepAction = require('utils.creep.action');

var minParts = [CARRY,MOVE,WORK];
var incParts = [CARRY,MOVE,MOVE,WORK,WORK];
var incCost = 350;
var minCost = 200;
var maxCost = 3 * incCost;

function run(creep) {
    
    // if no energy - harvest
    if (creep.memory.action != 'withdraw' && creep.carry.energy == 0) {
        creep.memory.action = 'harvest';
    }
    
    if (!creep.memory.action && creep.carry.energy > 40 && creep.room.energyAvailable === creep.room.energyCapacityAvailable) {
        creep.memory.action = 'build';
    }
    
    // if full energy - tranfer
    if (!creep.memory.action && creep.carry.energy > 0) {
        creep.memory.action = 'transferEnergy';
    }
    
    var failedAction = utilsCreepAction.performAction(creep);
    
    if (failedAction == 'build' && creep.carry.energy > 0 || creep.room.controller.ticksToDowngrade < 2000) {
        creep.memory.action = 'upgrade';
        
    } else if (failedAction == 'harvest' && creep.carry.energy == 0) {
        creep.memory.action = 'withdraw';
    }
    
    var repairTargets = creep.pos.findInRange(FIND_STRUCTURES, 3, {
        filter: (s) => {
            return (s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART) && s.hits < s.hitsMax;
        }
    });
    
    if (repairTargets.length) {
        creep.repair(repairTargets[0]);
    }
}

function getParts(energy) {
    if (energy < minCost) return [];
    if (energy < incCost) return minParts;
    if (energy >= maxCost) energy = maxCost;
    
    var cost = incCost;
    var parts = incParts.slice(0);
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