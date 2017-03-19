var handleCreeps = require('handler.creeps');
var handleSpawns = require('handler.spawns');

module.exports.loop = function () {
    handleCreeps();
    handleSpawns();
    
    //console.log(Game.cpu.getUsed());
    renderSourceStats(Game.getObjectById('5873bc2e11e3e4361b4d72fa'), 24, 35);
    renderSourceStats(Game.getObjectById('5873bc2e11e3e4361b4d72fc'), 24, 41);
    
    renderControllerStats(Game.getObjectById('5873bc2e11e3e4361b4d72fb'), 20, 40);
}

function renderSourceStats(source, x, y) {
    if (!Memory.sources[source.id]) return;
    var sourceMemory = Memory.sources[source.id];
    if (source.ticksToRegeneration < 2) sourceMemory.energyLeftWhenLastReset = source.energy;
    new RoomVisual('W81S21').text("Wasted: " + sourceMemory.energyLeftWhenLastReset, x, y, {color: 'green', size: 0.7, align: 'left'}); 
}

function renderControllerStats(controller, x, y) {
    var controllerMemory = Memory[controller.id];
    var percentageProgressChange = Number((controller.progress - controllerMemory.progressLastTick) / controller.progressTotal * 100);
    var ticksTilComplete = Math.ceil(controller.progressTotal / (controller.progress - controllerMemory.progressLastTick));
    var timeTilComplete = Number(ticksTilComplete * 4 / 3600);
    controllerMemory.progressLastTick = controller.progress;
    new RoomVisual('W81S21').text(percentageProgressChange.toFixed(4) + '% per tick', 20, 39, {color: 'red', size: 0.7, align: 'right'}); 
    new RoomVisual('W81S21').text(ticksTilComplete + ' ticks ~ ' + timeTilComplete.toFixed(2) + 'hrs', x, y, {color: 'red', size: 0.7, align: 'right'}); 
}