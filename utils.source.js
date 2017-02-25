function calculateMaxCreepCount(source) {
    var pos = source.pos;
    return _.filter(source.room.lookAtArea(pos.y-1, pos.x-1, pos.y+1, pos.x+1, true), {
        filter: (e) => {
            return e.type === LOOK_TERRAIN && e.terrain !== 'wall';
        }
    }).length;
}

function maxCreepCount(source) {
    if (!Memory[source.id]) {
        Memory[source.id] = {};
    }
    var savedInfo = Memory[source.id];
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

function freeHarvestingPositions(source) {
    if (!Memory[source.id]) {
        Memory[source.id] = {};
    }
    var savedInfo = Memory[source.id];
    if (savedInfo.harvestingPositions) {
        return savedInfo.harvestingPositions.filter(isFree).map(e => e.pos);
    }
    
    var positions = calculateHarvestingPositions(source);
    savedInfo.harvestingPositions = positions.map(e => {return {pos: e, allocatedCreepName: undefined};});
    return positions;
}

function allocate(creep, source) {
    if (!Memory[source.id]) {
        Memory[source.id] = {};
    }
    var savedInfo = Memory[source.id];
    
    var harvestingPositions = savedInfo.harvestingPositions;
    if (!harvestingPositions) {
        savedInfo.harvestingPositions = calculateHarvestingPositions(source).map(e => {return {pos: e, allocatedCreepName: undefined};});
    }
    
    var allocatedToCreep = harvestingPositions.filter(e => e.allocatedCreepName === creep.name);

    if (allocatedToCreep.length) {
        var pos = allocatedToCreep[0].pos;
        return new RoomPosition(pos.x, pos.y, pos.roomName);
    }
    var freePositions = harvestingPositions.filter(isFree);
    if (!freePositions.length) return;
    
    var freePos = freePositions[0];
    freePos.allocatedCreepName = creep.name;
    return new RoomPosition(freePos.pos.x, freePos.pos.y, freePos.pos.roomName);
}

function isFree(harvestingPosition) {
    var allocatedCreepName = harvestingPosition.allocatedCreepName
    return !allocatedCreepName || !Game.creeps[allocatedCreepName];
}

module.exports = {
    maxCreepCount: maxCreepCount,
    harvestingPositions: freeHarvestingPositions,
    allocate: allocate
};