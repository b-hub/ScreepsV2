var roleHarvester = require('role.harvester');

var creepRoleMap = {
    harvester: roleHarvester
};

function commandCreep(creep) {
    if (!creep) return;
    var role = creepRoleMap[creep.memory.role]; 
    if (!role) {
       creep.say("No role");
       return;
    }
    role.run(creep);
}

module.exports = {
    commandCreep: commandCreep
};