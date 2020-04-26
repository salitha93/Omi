/*import io from 'socket.io-client';
/*import Card from '../helpers/card';
import Dealer from "../helpers/dealer";
import Zone from '../helpers/zone';*/
class Game extends Phaser.Scene {
    constructor() {
        super({
            key: 'Game'
        });
    }

    create() {

        console.log("Begun");

        this.add.text(0, 0).setText([
            'Player ID: ' + this.facebook.playerID,
            'Player Name: ' + this.facebook.playerName,
            'Window width: ' + window.innerWidth,
            'Window Height: ' + window.innerHeight
        ]);

        this.isPlayerA = false;
        this.opponentCards = [];

        this.zone = new Zone(this);
        this.dropZone = this.zone.renderZone();
        this.outline = this.zone.renderOutline(this.dropZone);

        this.dealer = new Dealer(this);

        let self = this;

        this.socket = io('https://server-omi.herokuapp.com');

        this.socket.on('connect', function () {
            console.log('Connected!');
        });

        this.socket.on('isPlayerA', function () {
            self.isPlayerA = true;
        })

        this.socket.on('dealCards', function () {
            self.dealer.dealCards();
            self.dealText.disableInteractive();
        })

        this.socket.on('cardPlayed', function (gameObject, isPlayerA) {
            if (isPlayerA !== self.isPlayerA) {
                let sprite = gameObject.textureKey;
                self.opponentCards.shift().destroy();
                self.dropZone.data.values.cards++;
                let card = new Card(self);
                card.render((((self.dropZone.x - 350*(window.innerWidth/1280)) + (self.dropZone.data.values.cards * 50*(window.innerWidth/1280)))), (self.dropZone.y), sprite).disableInteractive();
            }
        })

        this.dealText = this.add.text(75*(window.innerWidth/1280), 350*(window.innerHeight/780), ['DEAL CARDS']).setFontSize(18*(window.innerWidth/1280)).setFontFamily('Trebuchet MS').setColor('#00ffff').setInteractive();

        this.dealText.on('pointerdown', function () {
            self.socket.emit("dealCards");
        })

        this.dealText.on('pointerover', function () {
            self.dealText.setColor('#ff69b4');
        })

        this.dealText.on('pointerout', function () {
            self.dealText.setColor('#00ffff');
        })

        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        })

        this.input.on('dragstart', function (pointer, gameObject) {
            gameObject.setTint(0xff69b4);
            self.children.bringToTop(gameObject);
        })

        this.input.on('dragend', function (pointer, gameObject, dropped) {
            gameObject.setTint();
            if (!dropped) {
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }
        })

        this.input.on('drop', function (pointer, gameObject, dropZone) {
            dropZone.data.values.cards++;
            gameObject.x = (dropZone.x - 350*(window.innerWidth/1280)) + (dropZone.data.values.cards * 50*(window.innerWidth/1280));
            gameObject.y = dropZone.y;
            gameObject.disableInteractive();
            self.socket.emit('cardPlayed', gameObject, self.isPlayerA);
        })
    }

    update() {

    }
}