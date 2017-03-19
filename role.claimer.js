var utilsCreepTravel = require('utils.creep.travel');

function run(creep) {
    if (!creep) return;
    
    var targetRoom = creep.memory.targetRoom;
    if (creep.room.name != targetRoom) {
        utilsCreepTravel.moveTo(creep, new RoomPosition(25, 25, targetRoom));
        creep.say(targetRoom);
        return;
    }
    
    creep.say("Claiming");
    if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller);
    }
}

module.exports = {
    run: run
};