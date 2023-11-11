const { Circle, Vec2 } = require('planck');
const { world, getNextObjectID } = require('../game');

class Player {
    constructor(socket) {
        this.socket = socket;

        this.body = world.createBody({
            type: 'dynamic',
            position: Vec2(10, 11),
            fixedRotation: true
        });
        this.body.createFixture({
            shape: Circle(1),
            friction: 0.0,
            restitution: 0.0
        });

        this.movement = {
            up: false,
            down: false,
            left: false,
            right: false
        };

        this.netData = {
            id: getNextObjectID(),
            type: 0,
            position: this.body.getPosition()
        };
    };

    setVelocity(x, y) {
        this.body.setLinearVelocity(Vec2(x, y));
    };

    get moving() {
        const velocity = this.body.getLinearVelocity();
        return velocity.x > 0 || velocity.y > 0;
    };
};

module.exports = Player;