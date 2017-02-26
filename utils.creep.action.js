var utilsCreepTravel = require('utils.creep.travel');
var utilsSource = require('utils.source');

function goHarvest(creep) {
    var allocation = utilsSource.allocate(creep);
    if (!allocation) return;
    
    var {target,source} = allocation;

    if (!target) return;
    
    if (creep.pos.x !== target.x || creep.pos.y !== target.y) {
        utilsCreepTravel.moveTo(creep, target);
        return;
    }
    
    var err = creep.harvest(source);
    switch (err) {
        case ERR_NOT_IN_RANGE:
            utilsCreepTravel.moveTo(creep, target);
            break;
    }

}

function goTransferEnergy(creep) {
    var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: s => {
            return (s.structureType === STRUCTURE_SPAWN || s.structureType === STRUCTURE_EXTENSION) && s.energy < s.energyCapacity;
        }
    });
    var err = creep.transfer(target, RESOURCE_ENERGY);
    switch (err) {
        case ERR_NOT_IN_RANGE:
            utilsCreepTravel.moveTo(creep, target);
            break;
    }
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
    }
}

function goBuild(creep) {
    var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
    if (!targets.length) return;
    
    var target = targets[0];
    var err = creep.build(target);
    switch (err) {
        case ERR_NOT_IN_RANGE:
            utilsCreepTravel.moveTo(creep, target);
            break;
    }
}

function performAction(creep) {
    var action = creep.memory.action;
    
    switch (action) {
        case 'harvest':
            goHarvest(creep);
            break;
        case 'transferEnergy':
            goTransferEnergy(creep);
            break;
        case 'upgrade':
            goUpgrade(creep);
            break;
        case 'withdraw':
            goWithdraw(creep);
            break;
        case 'build':
            goBuild(creep);
            break;
        default:
            creep.say("No action!");
            break;
    }
}

module.exports = {
    performAction: performAction
};