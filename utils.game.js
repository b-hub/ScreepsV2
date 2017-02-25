function getInnerObjects(obj) {
    return Object.keys(obj).map(name => obj[name]);
}

module.exports = {
    getCreeps: function() {
        var creepsObj = Game.creeps;
        return Object.keys(creepsObj).map(name => creepsObj[name]);
    },
    
    getSpawns: function() {
        return getInnerObjects(Game.spawns);
    }
};