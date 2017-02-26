var PATH_STYLE = {
    fill: 'transparent',
    stroke: '#fff',
    lineStyle: 'dashed',
    strokeWidth: .15,
    opacity: .1
};

function moveTo(creep, target) {
    if (creep.memory.role == 'trucker') {
        creep.moveTo(target, {visualizePathStyle: PATH_STYLE, reusePath: 15});
        if(!creep.room.lookAt(creep.pos).some(e => e.structure && e.structure.structureType == STRUCTURE_ROAD || e.constructionSite)) {
            creep.room.createConstructionSite(creep.pos.x, creep.pos.y, STRUCTURE_ROAD);
        };
    }
    creep.moveTo(target, {visualizePathStyle: PATH_STYLE, reusePath: 5});
}

function getPath(fromPos, toPos) {
    if (!Memory.paths) {
        Memory.paths = {};
    }
    
    var paths = Memory.paths;
    var path = paths[fromPos.x+','+fromPos.y+','+fromPos.roomName+'|'+toPos.x+','+toPos.y+','+toPos.roomName];
    if (path) {
        return path;
    }
    
    var res = findOptimalPath(fromPos, toPos);
    path = Room.serializePath(res.path);
    paths[fromPos.x+','+fromPos.y+','+fromPos.roomName+'|'+toPos.x+','+toPos.y+','+toPos.roomName] = path;
    return path;
}

function findOptimalPath(fromPos, toPos) {
    console.log("before", Game.cpu.getUsed());
    var res = PathFinder.search(fromPos, {pos: toPos, range: 1}, {
      // We need to set the defaults costs higher so that we
      // can set the road cost lower in `roomCallback`
      plainCost: 2,
      swampCost: 10,
	  
      roomCallback: function(roomName) {

        let room = Game.rooms[roomName];
        // In this example `room` will always exist, but since PathFinder 
        // supports searches which span multiple rooms you should be careful!
        if (!room) return;
        let costs = new PathFinder.CostMatrix;

        room.find(FIND_STRUCTURES).forEach(function(structure) {
          if (structure.structureType === STRUCTURE_ROAD) {
            // Favor roads over plain tiles
            costs.set(structure.pos.x, structure.pos.y, 1);
          } else if (structure.structureType !== STRUCTURE_CONTAINER && 
                     (structure.structureType !== STRUCTURE_RAMPART ||
                      !structure.my)) {
            // Can't walk through non-walkable buildings
            costs.set(structure.pos.x, structure.pos.y, 0xff);
          }
        });

        return costs;
      },
    });
    console.log(res.path.join());
    console.log("after", Game.cpu.getUsed());
}

module.exports = {
    moveTo: moveTo
};