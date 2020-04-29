class Game extends Phaser.Scene {
    constructor() {
        super({
            key: 'Game'
        });

        this.profilePicScale = 0.1;
        this.widthScale  = window.innerWidth/306;
        this.heightScale = window.innerHeight/568;
    }

    addCurrentPlayerPhoto (key)
    {
        this.add.image(150*this.widthScale, 310*this.heightScale, key).setScale(this.profilePicScale*this.widthScale).setInteractive();
    }
    addRightPlayerPhoto (key)
    {
        this.add.image(285*this.widthScale, 180*this.heightScale, key).setScale(this.profilePicScale*this.widthScale).setInteractive();
    }
    addFrontPlayerPhoto (key)
    {
        this.add.image(150*this.widthScale, 60*this.heightScale, key).setScale(this.profilePicScale*this.widthScale).setInteractive();
    }
    addLeftPlayerPhoto (key)
    {
        this.add.image(25*this.widthScale, 180*this.heightScale, key).setScale(this.profilePicScale*this.widthScale).setInteractive();
    }
    addPlayerName(x ,y, key)
    {
        this.add.text(x*this.widthScale, y*this.heightScale, [key]).setFontSize(25*this.widthScale).setFontFamily('Georgia').setColor('#ffffff').setInteractive();
    }

    renderTabledCard( gameObject, playerIndex )
    {
        let sprite = gameObject.textureKey;
            let card = new Card(this);
            console.log("Rendring card of:"+ playerIndex );
            console.log("Right Player"+this.rightPlayerIndex)
            console.log("leftPlayerIndex"+this.leftPlayerIndex)
            console.log("frontPlayerIndex"+this.frontPlayerIndex)
            if ( (playerIndex === 0) && this.isSpectator ) {
                //self.opponentCards.shift().destroy();
                this.dropZone.data.values.cards.push(gameObject);
                card.render((this.dropZone.x), (this.dropZone.y + this.dropZone.input.hitArea.height/4), sprite).disableInteractive();
            }
            else if(playerIndex === this.playerIndex)
            {
                this.dropZone.data.values.cards.push(gameObject);
                card.render((this.dropZone.x), (this.dropZone.y + this.dropZone.input.hitArea.height/4), sprite).disableInteractive();
            }
            else if (playerIndex === this.rightPlayerIndex) {
                //self.opponentCards.shift().destroy();
                this.dropZone.data.values.cards.push(gameObject);
                card.render((this.dropZone.x + this.dropZone.input.hitArea.width/4 ), (this.dropZone.y), sprite).disableInteractive();
            }
            else if (playerIndex === this.frontPlayerIndex)
            {
                this.dropZone.data.values.cards.push(gameObject);
                card.render((this.dropZone.x), (this.dropZone.y - this.dropZone.input.hitArea.height/4), sprite).disableInteractive();
            }
            else if (playerIndex === this.leftPlayerIndex)
            {
                this.dropZone.data.values.cards.push(gameObject);
                card.render((this.dropZone.x - this.dropZone.input.hitArea.width/4), (this.dropZone.y), sprite).disableInteractive();
            }

            if (this.dropZone.data.values.cards.length === 4 )
            {
                //wait few seconds and trigger event to finalize the round
            }
    }

    create() {

        console.log("The game has begun");

        let entryPointData = FBInstant.getEntryPointData();
        console.log("testx");
        console.log(JSON.stringify(entryPointData));

        this.add.text(0, 0).setText([
            'Player ID: ' + this.facebook.playerID,
            'Player Name: ' + this.facebook.playerName,
            'Width: ' + window.innerWidth,
            'Height: ' + window.innerHeight,
        ]);

        this.isPlayerA = false;
        this.opponentCards = [];
        this.dealCards = [];

        this.playerID = this.facebook.playerID;
        this.playerName = this.facebook.playerName;
        this.playerPhoto = FBInstant.player.getPhoto();
        this.playerIndex = -1;
        this.rightPlayerIndex = 1;
        this.frontPlayerIndex = 2;
        this.leftPlayerIndex  = 3;
        this.isSpectator = true;
        this.tableID = -1;
        this.playTurrn = -1;

        this.playStarted = false;

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
           this.tableID = entryPointData.tableID;
        }

        console.log("tableID: " + this.tableID);

        //this.socket = io('http://localhost:3004');
        this.socket = io('https://server-omi.herokuapp.com');

        this.socket.on('connect', function () 
        {
            console.log('Connected!');

            var player = {
                playerID    : self.playerID,
                playerName  : self.playerName,
                playerPhoto : self.playerPhoto,
                tableID     : self.tableID
            }

            console.log(JSON.stringify(player));
            
            self.socket.emit("playerLoggedIn",player);
        });

        this.socket.on('playerAdded', function (players, tabledCards, dealCards, playTurn) {

            console.log("On Player Added");
            if(!self.playStarted)
            {
                console.log("play not started");

                self.matchdata.players = players;

                for ( var i = 0; i < self.matchdata.players.length; i++ )
                {
                    if(self.matchdata.players[i].playerID === self.playerID )
                    {
                        self.playerIndex = i;
                        self.isSpectator = false;
                        console.log("player Index: "+ self.playerIndex );
                    }
                }

                if(!self.isSpectator)
                {
                    self.rightPlayerIndex = (self.playerIndex +1)%4;
                    self.frontPlayerIndex = (self.playerIndex +2)%4;
                    self.leftPlayerIndex  = (self.playerIndex +3)%4;
                }

                console.log(" Player Index: "+ self.playerIndex);

                for ( var i = 0; i < self.matchdata.players.length; i++ )
                {
                    if(i === 0 && self.isSpectator )
                    {
                        self.load.image('playerCurrent', self.matchdata.players[i].playerPhoto);
                        self.load.once('filecomplete-image-playerCurrent', self.addCurrentPlayerPhoto, self);
                        self.load.start();
                        self.addPlayerName(360, 535, self.matchdata.players[i].playerName);
                    }
                    else if(i === self.playerIndex)
                    {
                        self.load.image('playerCurrent', self.matchdata.players[i].playerPhoto);
                        self.load.once('filecomplete-image-playerCurrent', self.addCurrentPlayerPhoto, self);
                        self.load.start();
                        self.addPlayerName(360, 535, self.matchdata.players[i].playerName);
                    }
                    else if( i === self.rightPlayerIndex )
                    {
                        self.load.image('playerRight', self.matchdata.players[i].playerPhoto);
                        self.load.once('filecomplete-image-playerRight', self.addRightPlayerPhoto, self);
                        self.load.start();
                    }
                    else if( i === self.frontPlayerIndex )
                    {
                        self.load.image('playerFront', self.matchdata.players[i].playerPhoto);
                        self.load.once('filecomplete-image-playerFront', self.addFrontPlayerPhoto, self);
                        self.load.start();
                    }
                    else if( i === self.leftPlayerIndex )
                    {
                        self.load.image('playerLeft', self.matchdata.players[i].playerPhoto);
                        self.load.once('filecomplete-image-playerLeft', self.addLeftPlayerPhoto, self);
                        self.load.start();
                    }
                }

                console.log("playerAdded");
                console.log(JSON.stringify(players));

                if( players.length === 4 )
                {
                    self.playStarted = true;

                    if( (dealCards.length > 0 )|| (tabledCards.length > 0 ))
                    {
                        if( !self.isSpectator && dealCards.length > 0  )
                        {
                            self.dealer.dealCards(dealCards);
                        }

                        for( var i = 0; i < tabledCards.length; i++ )
                        {
                            self.renderTabledCard( tabledCards[i].card, tabledCards[i].playerIndex );
                            console.log("Rendered Tabled Cards");
                        }
                        
                    }
                    else
                    {
                        console.log("Play Started");
                        self.socket.emit("startPlay");
                    }
                }
            }
        })

        this.socket.on('isPlayerA', function () {
            self.isPlayerA = true;
        })

        this.socket.on('dealCards', function (deal, playTurn) {
            if(!self.isSpectator)
            {
                self.dealer.dealCards(deal);
                self.dealText.disableInteractive();
                console.log("Deal length: "+self.dealCards.length);
            }
        })

        this.socket.on('cardPlayed', function (gameObject, playerIndex) {

            console.log("played card by (indx):"+ playerIndex )
            self.renderTabledCard( gameObject, playerIndex );
           /* let sprite = gameObject.textureKey;
            let card = new Card(self);
            if ( (playerIndex === 0) && self.isSpectator ) {
                //self.opponentCards.shift().destroy();
                self.dropZone.data.values.cards.push(gameObject);
                card.render((self.dropZone.x), (self.dropZone.y + self.dropZone.input.hitArea.height/4), sprite).disableInteractive();
            }
            else if (playerIndex === self.rightPlayerIndex) {
                //self.opponentCards.shift().destroy();
                self.dropZone.data.values.cards.push(gameObject);
                card.render((self.dropZone.x + self.dropZone.input.hitArea.width/4 ), (self.dropZone.y), sprite).disableInteractive();
            }
            else if (playerIndex === self.frontPlayerIndex)
            {
                self.dropZone.data.values.cards.push(gameObject);
                card.render((self.dropZone.x), (self.dropZone.y - self.dropZone.input.hitArea.height/4), sprite).disableInteractive();
            }
            else if (playerIndex === self.leftPlayerIndex)
            {
                self.dropZone.data.values.cards.push(gameObject);
                card.render((self.dropZone.x - self.dropZone.input.hitArea.width/4), (self.dropZone.y), sprite).disableInteractive();
            }

            if (self.dropZone.data.values.cards.length === 4 )
            {
                //wait few seconds and trigger event to finalize the round
            }*/

        })

        this.dealText = this.add.text(75*self.widthScale, 350*this.heightScale, ['DEAL CARDS']).setFontSize(18*self.widthScale).setFontFamily('Trebuchet MS').setColor('#00ffff').setInteractive();
        this.inviteText = this.add.text(75*self.widthScale, 400*this.heightScale, ['Invite Friends']).setFontSize(18*self.widthScale).setFontFamily('Trebuchet MS').setColor('#00ffff').setInteractive();


        this.dealText.on('pointerdown', function () {
            //self.socket.emit("dealCards");
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
                    default: player + ' has invited you to play Omi',
                    },
                    template: 'play_turn',
                    data: { tableID: self.tableID },
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
            //self.children.bringToTop(gameObject);
        })

        this.input.on('dragend', function (pointer, gameObject, dropped) {
            gameObject.setTint();
            if (!dropped) {
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }
        })

        this.input.on('drop', function (pointer, gameObject, dropZone) {
            /*dropZone.data.values.cards.push(gameObject);
            console.log("gameObject: "+ dropZone.data.values)
            gameObject.x = dropZone.x;
            gameObject.y = dropZone.y + dropZone.input.hitArea.height/4 ;
            gameObject.disableInteractive();
            self.children.bringToTop(gameObject);
            //console.log("game obj value: "+gameObject.extra.value)*/
            self.socket.emit('cardPlayed', gameObject, self.playerIndex);
            gameObject.destroy(); // Because dragend event hold the card at where it was last placed

        })
    }

    update() {

    }
}