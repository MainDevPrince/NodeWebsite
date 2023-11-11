const Phaser = require('phaser');
const { io } = require('socket.io-client');

class GameScene extends Phaser.Scene {
    constructor() {
        super('game');
    };

    preload() {};

    create() {
        this.objects = new Map();

        this.activePlayer = this.add.circle(0, 0, 20, 0xffffff);
        this.cameras.main.startFollow(this.activePlayer);

        // Set up movement
        this.movement = {
            up: false,
            down: false,
            left: false,
            right: false
        };
        this.addKey('W', 'up');
        this.addKey('S', 'down');
        this.addKey('A', 'left');
        this.addKey('D', 'right');
        this.inputsDirty = false;

        setInterval(this.tick.bind(this), 30);

        // Connect to the server
        this.socket = io();

        this.socket.on('connect', () => {
            console.log('Connected!');
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected');
            for (const [key, object] of this.objects) {
                object.destroy();
                this.objects.delete(key);
            };
        });

        this.socket.on('activePlayerID', (id) => {
            this.objects.set(id, this.activePlayer);
        });

        this.socket.on('newObject', (netData) => {
            let object;
            const x = netData.position.x * 20, y = 20 - (netData.position.y * 20); // Y-axis inverted; 20x scale factor
            switch (netData.type) {
                case 0: {
                    object = this.add.circle(x, y, 20, 0xffffff);
                    break;
                }
                case 1: {
                    object = this.add.circle(x, y, 20, 0xff0000);
                    break;
                }
                case 2: {
                    object = this.add.rectangle(x, y, 40, 40, 0x0000ff);
                    break;
                }
            };
            this.objects.set(netData.id, object);
        });

        this.socket.on('updateObject', (id, position) => {
            if (this.objects.has(id)) {
                const object = this.objects.get(id);
                object.setPosition(position.x * 20, 20 - (position.y * 20));
            } else {
                console.warn(`Object with ID ${id} not found`);
            }
        });

        this.socket.on('deleteObject', (id) => {
            if (this.objects.has(id)) {
                console.log(this.objects.get(id));
                this.objects.get(id).destroy();
                this.objects.delete(id);
            } else {
                console.warn(`Object with ID ${id} not found`);
            }
        });
    };

    addKey(keyCode, valueToToggle) {
        const key = this.input.keyboard.addKey(keyCode);
        key.on('down', () => {
            this.movement[valueToToggle] = true;
            this.inputsDirty = true;
        });
        key.on('up', () => {
            this.movement[valueToToggle] = false;
            this.inputsDirty = true;
        });
    };

    tick() {
        if (this.inputsDirty) {
            this.inputsDirty = false;
            this.socket.emit('input', this.movement);
        }
    };

    update() {};
};

module.exports = GameScene;