class Preloader extends Phaser.Scene {

    constructor ()
    {
        super('Preloader');
    }

    preload() {

        console.log("preload")

        this.facebook.showLoadProgress(this);
        this.facebook.once('startgame', this.startGame, this);

        this.load.image('cyanCardFront', 'src/assets/CyanCardFront.png');
        this.load.image('cyanCardBack', 'src/assets/CyanCardBack.png');
        this.load.image('magentaCardFront', 'src/assets/MagentaCardFront.png');
        this.load.image('magentaCardBack', 'src/assets/MagentaCardBack.png');
    }

    startGame ()
    {
         this.scene.start('Game');
    }

}