FBInstant.initializeAsync().then(function() {

const config = {
    type: Phaser.AUTO,
    parent: "phaser-example",
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x330000,
    scene: [
        Preloader, Game
    ]
};

const game = new Phaser.Game(config);

});