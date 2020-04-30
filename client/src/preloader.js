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

        this.load.image('7C', 'src/assets/7C.png');
        this.load.image('7D', 'src/assets/7D.png');
        this.load.image('7H', 'src/assets/7H.png');
        this.load.image('7S', 'src/assets/7S.png');
        this.load.image('8C', 'src/assets/8C.png');
        this.load.image('8D', 'src/assets/8D.png');
        this.load.image('8H', 'src/assets/8H.png');
        this.load.image('8S', 'src/assets/8S.png');
        this.load.image('9C', 'src/assets/9C.png');
        this.load.image('9D', 'src/assets/9D.png');
        this.load.image('9H', 'src/assets/9H.png');
        this.load.image('9S', 'src/assets/9S.png');
        this.load.image('10C', 'src/assets/10C.png');
        this.load.image('10D', 'src/assets/10D.png');
        this.load.image('10H', 'src/assets/10H.png');
        this.load.image('10S', 'src/assets/10S.png');
        this.load.image('JC', 'src/assets/JC.png');
        this.load.image('JD', 'src/assets/JD.png');
        this.load.image('JH', 'src/assets/JH.png');
        this.load.image('JS', 'src/assets/JS.png');
        this.load.image('QC', 'src/assets/QC.png');
        this.load.image('QD', 'src/assets/QD.png');
        this.load.image('QH', 'src/assets/QH.png');
        this.load.image('QS', 'src/assets/QS.png');
        this.load.image('KC', 'src/assets/KC.png');
        this.load.image('KD', 'src/assets/KD.png');
        this.load.image('KH', 'src/assets/KH.png');
        this.load.image('KS', 'src/assets/KS.png');
        this.load.image('AC', 'src/assets/AC.png');
        this.load.image('AD', 'src/assets/AD.png');
        this.load.image('AH', 'src/assets/AH.png');
        this.load.image('AS', 'src/assets/AS.png');
    }

    startGame ()
    {
         this.scene.start('Game');
    }

}