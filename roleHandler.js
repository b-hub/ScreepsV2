var roleHarvester = require('role.harvester');

var creepRoleMap = {
    harvester: roleHarvester.run
};

function commandCreep(creep) {
    if (!creep) return;
    var fn = creepRoleMap[creep.memory.role]; 
    if (!fn) {
       creep.say("No role");
       return;
    }
    fn(creep);
}

module.exports = {
    commandCreep: commandCreep
};