const { Settings, World, Vec2 } = require('planck');
const Obstacle = require('./bodies/obstacle');

const movementSpeed = 0.013;
const diagonalSpeed = movementSpeed / Math.SQRT2;

Settings.maxLinearCorrection = 0;

const world = new World({ gravity: Vec2(0, 0) });

const players = new Set();
const objects = new Set();
const newObjects = new Set();
const deletedObjects = new Set();

let _nextObjectID = 0;
function getNextObjectID() {
    _nextObjectID++;
    return _nextObjectID;
};

module.exports = {
    world, players, objects, newObjects, deletedObjects, getNextObjectID
};

// objects.add(new Obstacle(1, Vec2(7, 4)));
objects.add(new Obstacle(2, Vec2(4, 7)));
objects.add(new Obstacle(1, Vec2(10, 15)));
objects.add(new Obstacle(2, Vec2(6, 18)));
objects.add(new Obstacle(1, Vec2(17, 5)));
objects.add(new Obstacle(2, Vec2(12, 8)));

function tick(delay) {
    setTimeout(() => {
        const tickStart = Date.now();

        // Update physics
        world.step(30);

        // Calculate movement
        for (const player of players) {
            const movement = Vec2(0, 0);
            if (player.movement.up) movement.y++;
            if (player.movement.down) movement.y--;
            if (player.movement.left) movement.x--;
            if (player.movement.right) movement.x++;

            const speed = (movement.x * movement.y !== 0) ? diagonalSpeed : movementSpeed;
            player.setVelocity(movement.x * speed, movement.y * speed);
            player.netData.position = player.body.getPosition();
        };

        // Send updates to client
        for (const player of players) {
            for (const object of newObjects) {
                if (object !== player) player.socket.emit('newObject', object.netData);
            };
            for (const player2 of players) {
                player.socket.emit('updateObject', player2.netData.id, player2.netData.position);
            };
            for (const object of deletedObjects) {
                player.socket.emit('deleteObject', object.netData.id);
            };
        };

        // Reset everything
        newObjects.clear();
        deletedObjects.clear();

        // Start next tick
        const newDelay = Math.max(0, 30 - (Date.now() - tickStart));
        tick(newDelay);
    }, delay);
};

tick(30);