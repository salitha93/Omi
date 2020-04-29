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

    addCurrentPlayerPhoto (key)
    {
        this.add.image(400*(window.innerWidth/1280), 500*(window.innerHeight/780), key).setScale(0.3*(window.innerWidth/1280)).setInteractive();
    }
    addRightPlayerPhoto (key)
    {
        this.add.image(600*(window.innerWidth/1280), 350*(window.innerHeight/780), key).setScale(0.3*(window.innerWidth/1280)).setInteractive();
    }
    addFrontPlayerPhoto (key)
    {
        this.add.image(400*(window.innerWidth/1280), 200*(window.innerHeight/780), key).setScale(0.3*(window.innerWidth/1280)).setInteractive();
    }
    addLeftPlayerPhoto (key)
    {
        this.add.image(200*(window.innerWidth/1280), 350*(window.innerHeight/780), key).setScale(0.3*(window.innerWidth/1280)).setInteractive();
    }

    create() {

        console.log("Begun");

        let entryPointData = FBInstant.getEntryPointData();
        console.log("testx");
        console.log(JSON.stringify(entryPointData));

        this.add.text(0, 0).setText([
            'Player ID: ' + this.facebook.playerID,
            'Player Name: ' + this.facebook.playerName,
        ]);

        /*this.load.image('playerCurrent', this.facebook.playerPhotoURL);
        this.load.once('filecomplete-image-playerCurrent', this.addCurrentPlayerPhoto, this);
        this.load.start();*/

        this.isPlayerA = false;
        this.opponentCards = [];

        this.playerID = this.facebook.playerID;
        this.playerName = this.facebook.playerName;
        this.playerPhoto = FBInstant.player.getPhoto();
        this.playerIndex = 0;

        this.matchdata = {
            players: [],
        };

        this.zone = new Zone(this);
        this.dropZone = this.zone.renderZone();
        this.outline = this.zone.renderOutline(this.dropZone);

        this.dealer = new Dealer(this);

        let self = this;

        if (entryPointData)
        {
            this.matchdata.players = entryPointData.players ;

        }

        this.socket = io('http://localhost:3000');
        //this.socket = io('https://server-omi.herokuapp.com');

        this.socket.on('connect', function () {
            console.log('Connected!');

            console.log(self.matchdata.players.length);

            var playerAlreadyAdded = false;
            for ( var i = 0; i < self.matchdata.players.length; i++ )
            {
                if( self.matchdata.players[i].playerID === self.playerID)
                {
                    playerAlreadyAdded = true;
                    self.playerIndex = i;
                    console.log("playerAlreadyAdded");
                }
            }

            if(!playerAlreadyAdded)
            {

                if (self.matchdata.players.length < 3)
                {
                    console.log("Added player1")
                    self.matchdata.players.push(
                        {
                            playerID: self.playerID,
                            playerName: self.playerName,
                            playerPhoto: self.playerPhoto
                        }
                    );
                    console.log("Added player2")
                    self.playerIndex = self.matchdata.players.length - 1 ;
                    console.log("Plyaer index1: "+self.playerIndex);
                    console.log("Added player3")
                    
                }
                else
                {
                    self.playerIndex = -1 ;
                }
                console.log(JSON.stringify(self.matchdata));
            }
            
            self.socket.emit("playerAdded",self.matchdata.players);
        });

        this.socket.on('playerAdded', function (players) {
            if(self.matchdata.players < self.matchdata.players.length < players.length )
            {
                self.matchdata.players = players;
            }
            else if( self.matchdata.players[self.matchdata.players.length-1].playerID !== players[players.length-1].playerID )
            {
                self.matchdata.players.push(players[players.length -1 ]);
                self.socket.emit("playerAdded",self.matchdata.players);
            }

            var rightPlayerIndex = (self.playerIndex +1)%4;
            var frontPlayerIndex = (self.playerIndex +2)%4;
            var leftPlayerIndex = (self.playerIndex +3)%4;

            console.log(" Player Index: "+ self.playerIndex);

            for ( var i = 0; i < self.matchdata.players.length; i++ )
            {
                if(i === self.playerIndex)
                {
                    self.load.image('playerCurrent', self.matchdata.players[i].playerPhoto);
                    self.load.once('filecomplete-image-playerCurrent', self.addCurrentPlayerPhoto, self);
                    self.load.start();
                }
                else if( i === rightPlayerIndex )
                {
                    self.load.image('playerRight', self.matchdata.players[i].playerPhoto);
                    self.load.once('filecomplete-image-playerRight', self.addRightPlayerPhoto, self);
                    self.load.start();
                }
                else if( i === frontPlayerIndex )
                {
                    self.load.image('playerFront', self.matchdata.players[i].playerPhoto);
                    self.load.once('filecomplete-image-playerFront', self.addFrontPlayerPhoto, self);
                    self.load.start();
                }
                else if( i === leftPlayerIndex )
                {
                    self.load.image('playerLeft', self.matchdata.players[i].playerPhoto);
                    self.load.once('filecomplete-image-playerLeft', self.addLeftPlayerPhoto, self);
                    self.load.start();
                }
            }

            console.log("playerAdded");
            console.log(JSON.stringify(players));
        })

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
        this.inviteText = this.add.text(75*(window.innerWidth/1280), 400*(window.innerHeight/780), ['Invite Friends']).setFontSize(18*(window.innerWidth/1280)).setFontFamily('Trebuchet MS').setColor('#00ffff').setInteractive();


        this.dealText.on('pointerdown', function () {
            self.socket.emit("dealCards");
        })

        this.dealText.on('pointerover', function () {
            self.dealText.setColor('#ff69b4');
        })

        this.dealText.on('pointerout', function () {
            self.dealText.setColor('#00ffff');
        })

        this.inviteText.on('pointerdown', function () 
        {
            FBInstant.context.chooseAsync().then(function ()
            {
                self.contextID = FBInstant.context.getID();
            }).then(function()
            {
                let player = FBInstant.player.getName();
                let playerPhoto = FBInstant.player.getPhoto();

                function toDataURL(src, callback) {
                    let img = new Image();
                    img.crossOrigin = 'Anonymous';
                    img.onload = function() {
                      let canvas = document.createElement('CANVAS');
                      canvas.height = 533;
                      canvas.width = 960;
                      canvas.getContext('2d').drawImage(this, 0, 0, 960, 533);
                      callback(canvas.toDataURL());
                    };
                    img.src = src;
                  }

                let payload = 
                {
                    action: 'CUSTOM',
                    cta: "I'm In ",
                    text: {
                    default: player + ' has invited you to play ThreeNoughtFour',
                    },
                    template: 'play_turn',
                    data: { players: self.matchdata.players },
                    strategy: 'IMMEDIATE',
                    notification: 'NO_PUSH'
                };
            
                toDataURL
                (
                    playerPhoto,
                    function(dataUrl) {
                    payload.image = dataUrl;
                    FBInstant.updateAsync(payload);
                });
            });
            
        })

        this.inviteText.on('pointerover', function () {
            self.inviteText.setColor('#ff69b4');
        })

        this.inviteText.on('pointerout', function () {
            self.inviteText.setColor('#00ffff');
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