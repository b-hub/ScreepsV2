var utilsCreepTravel = require('utils.creep.travel');
var utilsSource = require('utils.source');

function endAction(creep) {
    delete creep.memory.action;
}

function goHarvest(creep) {
    if (creep.carry.energy >= creep.carryCapacity - creep.getActiveBodyparts(WORK)) {
        return;
    }
    
    var allocation = utilsSource.allocate(creep);
    if (!allocation) return;
    
    var {target,source} = allocation;

    if (!target) return;
    if (source.energy == 0) return;
    
    if (creep.pos.x !== target.x || creep.pos.y !== target.y) {
        utilsCreepTravel.moveTo(creep, target);
        return true;
    }
    
    var err = creep.harvest(source);
    
    var containers = creep.pos.findInRange(FIND_STRUCTURES, 1, {
       filter: s => {
           return s.structureType === STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] < s.storeCapacity;
       } 
    });
    
    if (containers.length) {
        creep.transfer(containers[0], RESOURCE_ENERGY);
    }

    return true;

}

function goTransferEnergy(creep) {
    var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: s => {
            return (s.structureType === STRUCTURE_SPAWN || s.structureType === STRUCTURE_EXTENSION) && s.energy < s.energyCapacity;
        }
    });
    
    if (!target) return false;
    
    var err = creep.transfer(target, RESOURCE_ENERGY);
    switch (err) {
        case ERR_NOT_IN_RANGE:
            utilsCreepTravel.moveTo(creep, target);
            break;
    }
    
    return true;
}

function goUpgrade(creep) {
    var target = creep.room.controller;
    var err = creep.upgradeController(target);
    switch (err) {
        case ERR_NOT_IN_RANGE:
            utilsCreepTravel.moveTo(creep, target);
            break;
    }
}

function goWithdraw(creep) {
    var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: s => {
            return s.structureType === STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0;
        }
    });
    
    if (!target) return;
    var err = creep.withdraw(target, RESOURCE_ENERGY);
    switch (err) {
        case ERR_NOT_IN_RANGE:
            utilsCreepTravel.moveTo(creep, target);
            break;
        case OK:
            return;
    }
    
    return true;
}

function goBuild(creep) {
    var target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
    if (!target) return;
    
    var err = creep.build(target);
    switch (err) {
        case ERR_NOT_IN_RANGE:
            utilsCreepTravel.moveTo(creep, target);
            break;
    }
    
    return true;
}

function performAction(creep) {
    var action = creep.memory.action;
    var result = true;
    
    switch (action) {
        case 'harvest':
            result = goHarvest(creep);
            break;
        case 'transferEnergy':
            result = goTransferEnergy(creep);
            break;
        case 'upgrade':
            goUpgrade(creep);
            break;
        case 'withdraw':
            result = goWithdraw(creep);
            break;
        case 'build':
            result = goBuild(creep);
            break;
        default:
            creep.say("No action!");
            break;
    }
    
    if (!result) {
        endAction(creep);
        return action;
    }
}

module.exports = {
    performAction: performAction
};