function run(creep) {
    if (!creep) return;
    
    var containers = [];
    
    if (!creep.memory.storageId) {
        for (var key in Game.rooms) {
            var room = Game.rooms[key];
            var stores = room.find(FIND_STRUCTURES, {filter: s => s.structureType === STRUCTURE_STORAGE});
            if (stores.length) {
                creep.memory.storageId = stores[0].id;
                break;
            }
        }
    }
    
    if (creep.carry.energy == creep.carryCapacity) {
        var target = Game.getObjectById(creep.memory.storageId);
        creep.moveTo(target);
        creep.transfer(target, RESOURCE_ENERGY);
        
        return;
    }

    if (!creep.memory.roomsToVisit || !creep.memory.roomsToVisit.length) {
        creep.memory.roomsToVisit = getRoomsToVisit();
        creep.memory.roomsVisited = [];
    }
    
    if (!creep.memory.roomsToVisit.some(n => n == creep.room.name)) {
        if (!creep.memory.targetRoom) {
            creep.memory.targetRoom = findClosestRoom(creep, creep.memory.roomsToVisit);
        } 
        creep.moveTo(creep.memory.targetRoom);
        return;
    } else {
        delete creep.memory.targetRoom;
    }
    
    if (!creep.memory.containersToVisit) {
        creep.memory.containersToVisit = creep.room.find(FIND_STRUCTURES, {
            filter: s => s.structureType === STRUCTURE_CONTAINER
        }).map(s => s.id);
        creep.memory.containersVisited = [];
    }
    
    var targetContainer = creep.pos.findClosestByRange(creep.memory.containersToVisit.map(id => Game.getObjectById(id)));
    var err = creep.withdraw(targetContainer, RESOURCE_ENERGY);
    switch (err) {
        case ERR_NOT_IN_RANGE:
            creep.moveTo(targetContainer);
            return;
    }
    
    if (err != OK) {
        return;
    }
    
    var containers = creep.memory.containersToVisit;
    containers.splice(containers.indexOf(targetContainer.id), 1);
    creep.memory.containersToVisit = containers;
    
    if (!creep.memory.containersToVisit.length) {
        delete creep.memory.containersToVisit;
        creep.memory.roomsToVisit.splice(creep.memory.roomsToVisit.indexOf(creep.room.name), 1);
    }
}

function findClosestRoom(creep, roomNames) {
    var maxCost = Infinity;
    var targetRoomPos;
    for (i in roomNames) {
        var roomPos = new RoomPosition(25, 25, roomNames[i]);
        var res = PathFinder.search(creep.pos, roomPos, {maxCost: maxCost});
        if (!res) continue;
        maxCost = res.cost;
        targetRoomPos = roomPos;
    }
    
    return targetRoomPos;
}

function getRoomsToVisit() {
    var rooms = [];
    for (var roomName in Game.rooms) {
        var room = Game.rooms[roomName];
        var containersFound = room.find(FIND_STRUCTURES, {
            filter: s => s.structureType === STRUCTURE_CONTAINER
        });
        if (containersFound.length > 0) {
            rooms.push(roomName);
        }
    }
    return rooms;
}

module.exports = {
    run: run
};