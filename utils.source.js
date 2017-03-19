function getSavedInfo(sourceId) {
    if (!Memory.sources) {
        Memory.sources = {};
    }
    if (!Memory.sources[sourceId]) {
        Memory.sources[sourceId] = {};
    }
    return Memory.sources[sourceId];
}

function calculateHarvestingPositions(source) {
    var pos = source.pos;
    var areaSearch = source.room.lookAtArea(pos.y-1, pos.x-1, pos.y+1, pos.x+1, true)
    
    return areaSearch.filter(e => e.terrain === 'plain')
        .map(e => { return new RoomPosition(e.x, e.y, source.room.name); });
    
}

function getHarvestingPositions(sourceId) {
    var savedInfo = getSavedInfo(sourceId);
    if (savedInfo.harvestingPositions) {
        return savedInfo.harvestingPositions;
    }
    var source = Game.getObjectById(sourceId);
    if (!source) return;
    var positions = calculateHarvestingPositions(source);
    savedInfo.harvestingPositions = positions.map(e => {return {pos: e, allocatedCreepName: undefined, sourceId: source.id};});
    return savedInfo.harvestingPositions;
}

function harvestingPositionsAvailable(room) {
    var sources = room.find(FIND_SOURCES);

    for (var i in sources) {
        var harvestingPositions = getHarvestingPositions(sources[i].id);
        if (harvestingPositions.filter(isFree).length) return true;
    }
    return false;
}

function allocate(creep) {
    var existingSourceId = creep.memory.sourceId;
    if (existingSourceId) {
        return allocateWithSource(creep, existingSourceId);
    }

    var sources = creep.room.find(FIND_SOURCES);
    for (var i in sources) {
        var allocation = allocateWithSource(creep, sources[i].id);
        if (allocation) return allocation;
    }
    
    for (var id in Memory.sources) {
        var allocation = allocateWithSource(creep, id);
        if (allocation) return allocation;
    }
    
    return;
}

function allocateWithSource(creep, sourceId) {
    var harvestingPositions = getHarvestingPositions(sourceId);
    if (!harvestingPositions) return;
    var source = Game.getObjectById(sourceId);
    
    var allocatedPositions = harvestingPositions.filter(e => e.allocatedCreepName == creep.name);
    if (allocatedPositions.length) {
        var pos = allocatedPositions[0].pos;
        creep.memory.sourceId = source.id;
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
    allocate: allocate,
    harvestingPositionsAvailable: harvestingPositionsAvailable
};