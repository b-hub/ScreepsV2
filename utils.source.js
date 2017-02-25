function getSavedInfo(source) {
    var gameObjId = source.id;
    if (!Memory[gameObjId]) {
        Memory[gameObjId] = {};
    }
    return Memory[gameObjId];
}

function calculateMaxCreepCount(source) {
    var pos = source.pos;
    return _.filter(source.room.lookAtArea(pos.y-1, pos.x-1, pos.y+1, pos.x+1, true), {
        filter: (e) => {
            return e.type === LOOK_TERRAIN && e.terrain !== 'wall';
        }
    }).length;
}

function maxCreepCount(source) {
    var savedInfo = getSavedInfo(source);
    if (savedInfo.maxCreepCount) {
        return savedInfo.maxCreepCount;
    }
    
    var count = calculateMaxCreepCount(source);
    savedInfo.maxCreepCount = count;
    return count;
}

function calculateHarvestingPositions(source) {
    var pos = source.pos;
    var areaSearch = source.room.lookAtArea(pos.y-1, pos.x-1, pos.y+1, pos.x+1, true)
    
    return areaSearch.filter(e => e.terrain === 'plain')
        .map(e => { return new RoomPosition(e.x, e.y, source.room.name); });
    
}

function getHarvestingPositions(source) {
    var savedInfo = getSavedInfo(source);
    if (savedInfo.harvestingPositions) {
        return savedInfo.harvestingPositions;
    }
    
    var positions = calculateHarvestingPositions(source);
    savedInfo.harvestingPositions = positions.map(e => {return {pos: e, allocatedCreepName: undefined};});
    return positions;
}

function harvestingPositionsAvailable(room) {
    var sources = room.find(FIND_SOURCES);
    for (var i in sources) {
        if (getHarvestingPositions(sources[i]).filter(isFree).length) return true;
    }
    return false;
}

function allocate(creep, source) {
    var existingSourceId = creep.memory.sourceId;
    if (existingSourceId) {
        var pos = creep.memory.harvestingPosition;
        source = Game.getObjectById(existingSourceId);
        if (pos) {
            return {
                target: new RoomPosition(pos.x, pos.y, pos.roomName),
                source: source
            };
        }
        
        return allocateWithSource(creep, source);
    }
    if (source) {
        return allocateWithSource(creep, source);
    }
    var sources = creep.room.find(FIND_SOURCES);
    for (var i in sources) {
        var allocation = allocateWithSource(creep, sources[i]);
        if (allocation) return allocation;
    }
    
    return;
}

function allocateWithSource(creep, source) {
    var savedInfo = getSavedInfo(source);
    
    var harvestingPositions = getHarvestingPositions(source);
    
    var allocatedPositions = harvestingPositions.filter(e => e.allocatedCreepName == creep.name);
    if (allocatedPositions.length) {
        var pos = allocatedPositions[0].pos;
        creep.memory.sourceId = source.id;
        creep.memory.harvestingPosition = pos;
        return {
            target: new RoomPosition(pos.x, pos.y, pos.roomName),
            source: source
        };
    }
    
    var freePositions = harvestingPositions.filter(isFree);
    if (!freePositions.length) return;
    
    var freePos = freePositions[0];
    freePos.allocatedCreepName = creep.name;
    creep.memory.sourceId = source.id;
    creep.memory.harvestingPosition = freePos.pos;
    return {
        target: new RoomPosition(freePos.pos.x, freePos.pos.y, freePos.pos.roomName),
        source: source
    };
}

function isFree(harvestingPosition) {
    var allocatedCreepName = harvestingPosition.allocatedCreepName
    return !allocatedCreepName || !Game.creeps[allocatedCreepName];
}

module.exports = {
    maxCreepCount: maxCreepCount,
    allocate: allocate,
    harvestingPositionsAvailable: harvestingPositionsAvailable
};