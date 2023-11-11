const { Box, Circle } = require('planck');

class Obstacle {
    constructor(type, position) {
        const { world, getNextObjectID } = require('../game');
        
        if (type === 1) {
            world.createBody({
                type: 'static',
                position,
                fixedRotation: true
            }).createFixture(Circle(1));
        } else if (type === 2) {
            world.createBody({
                type: 'static',
                position,
                fixedRotation: true
            }).createFixture(Box(1, 1));
        }
        
        this.netData = {
            id: getNextObjectID(),
            type,
            position
        };
    };
};

module.exports = Obstacle;