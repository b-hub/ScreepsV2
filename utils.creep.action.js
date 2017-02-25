var utilsCreepTravel = require('utils.creep.travel');
var utilsSource = require('utils.source');

function goHarvest(creep) {
    var source = creep.room.find(FIND_SOURCES)[0];
    var target = utilsSource.allocate(creep, source);
    
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

function goTransferEnergy(creep, target) {
    var target = Game.spawns['Spawn1'];
    var err = creep.transfer(target, RESOURCE_ENERGY);
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
            goTransferEnergy(creep, Game.getObjectById(creep.memory.targetId));
            break;
        default:
            creep.say("No action!");
            break;
    }
}

module.exports = {
    performAction: performAction
};