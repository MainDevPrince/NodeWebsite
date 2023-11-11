const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const { world, players, objects, newObjects, deletedObjects} = require('./game');
const Player = require('./bodies/player');

app.use(express.static('src'));

io.on('connection', (socket) => {
    console.log('Player connected');
    const player = new Player(socket);
    players.add(player);
    objects.add(player);
    newObjects.add(player);
    socket.emit('activePlayerID', player.netData.id);
    for (const object of objects) {
        if (object !== player) socket.emit('newObject', object.netData);
    };

    socket.on('disconnect', () => {
        console.log('Player disconnected');
        world.destroyBody(player.body);
        players.delete(player);
        objects.delete(player);
        deletedObjects.add(player);
    });

    socket.on('input', (movement) => { player.movement = movement; });
});

server.listen(process.env.PORT || 3000, () => {
    console.log('Arcane Arena v0.1.0');
    console.log(`Server listening on port ${server.address().port}...`);
    console.log('Press Ctrl+C to exit.');
});