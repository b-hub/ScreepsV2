var PATH_STYLE = {
    fill: 'transparent',
    stroke: '#fff',
    lineStyle: 'dashed',
    strokeWidth: .15,
    opacity: .1
};

function moveTo(creep, target) {
    creep.moveTo(target, {visualizePathStyle: PATH_STYLE, reusePath: 5});
}

module.exports = {
    moveTo: moveTo
};