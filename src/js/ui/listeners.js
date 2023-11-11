const Phaser = require('phaser');
const GameScene = require('../game');

function registerEventListeners() {
    document.getElementById('button-play').addEventListener('click', () => {
        document.getElementById('title-screen').style.display = 'none';
        document.body.style.overflow = 'hidden';

        new Phaser.Game({
            width: 800,
            height: 600,
            type: Phaser.AUTO,
            backgroundColor: 0x000000,
            scene: GameScene
        });
    });
};

module.exports = {
    registerEventListeners
};