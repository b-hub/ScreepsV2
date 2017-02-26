var roleHarvester = require('role.harvester');
var roleClaimer = require('role.claimer');
var roleRunner = require('role.runner');

var creepRoleMap = {
    harvester: roleHarvester,
    claimer: roleClaimer,
    runner: roleRunner
};

function getRole(creep) {
    if (!creep) return;
    return creepRoleMap[creep.memory.role]; 
}

function commandCreep(creep) {
    var role = getRole(creep);
    if (!role) {
       creep.say("No role");
       return;
    }
    role.run(creep);
}

function build(spawn, roleName, maxParts) {
    var role = creepRoleMap[roleName];
    if (!role) console.log("RoleHandler: Unknown role to spawn?");

    creepParts = role.getParts(spawn.room.energyAvailable);
    if (!creepParts.length) return false;
    
    if (maxParts && role.getParts(spawn.room.energyCapacityAvailable).length != creepParts.length) return false;

    var err = spawn.createCreep(creepParts, undefined, {role: roleName});
    console.log(err, spawn.room.energyAvailable);
    
    console.log("Creating creep: " + roleName + " with parts: " + creepParts.join());
    return true;
}

module.exports = {
    commandCreep: commandCreep,
    build: build
};