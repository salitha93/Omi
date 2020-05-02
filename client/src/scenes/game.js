class Game extends Phaser.Scene {
    constructor() {
        super({
            key: 'Game'
        });

        this.profilePicScale = 0.1;
        this.widthScale  = window.innerWidth/335;
        this.heightScale = window.innerHeight/524;
        //this.socketURL = 'http://localhost:3021';
        this.socketURL = 'https://server-omi.herokuapp.com';
    }

    addCurrentPlayerPhoto (key)
    {
        this.add.image(150*this.widthScale, 380*this.heightScale, key).setScale(this.profilePicScale*this.widthScale).setInteractive();
    }
    addRightPlayerPhoto (key)
    {
        this.add.image(285*this.widthScale, 260*this.heightScale, key).setScale(this.profilePicScale*this.widthScale).setInteractive();
    }
    addFrontPlayerPhoto (key)
    {
        this.add.image(150*this.widthScale, 120*this.heightScale, key).setScale(this.profilePicScale*this.widthScale).setInteractive();
    }
    addLeftPlayerPhoto (key)
    {
        this.add.image(25*this.widthScale, 260*this.heightScale, key).setScale(this.profilePicScale*this.widthScale).setInteractive();
    }
    addPlayerName(x ,y, key)
    {
        this.add.text(x*this.widthScale, y*this.heightScale, [key]).setFontSize(25*this.widthScale).setFontFamily('Georgia').setColor('#ffffff').setInteractive();
    }

    renderTabledCard( gameObject, playerIndex )
    {
        let sprite = gameObject.textureKey;
            let card = new Card(this);

            if ( (playerIndex === 0) && this.isSpectator ) {
                this.dropZone.data.values.cards.push(card.render((this.dropZone.x), (this.dropZone.y + this.dropZone.input.hitArea.height/4), sprite).disableInteractive());
            }
            else if(playerIndex === this.playerIndex)
            {
                this.dropZone.data.values.cards.push(card.render((this.dropZone.x), (this.dropZone.y + this.dropZone.input.hitArea.height/4), sprite).disableInteractive());
            }
            else if (playerIndex === this.rightPlayerIndex) {
               this.dropZone.data.values.cards.push(card.render((this.dropZone.x + this.dropZone.input.hitArea.width/4 ), (this.dropZone.y), sprite).disableInteractive());
            }
            else if (playerIndex === this.frontPlayerIndex)
            {
                this.dropZone.data.values.cards.push(card.render((this.dropZone.x), (this.dropZone.y - this.dropZone.input.hitArea.height/4), sprite).disableInteractive());
            }
            else if (playerIndex === this.leftPlayerIndex)
            {
                this.dropZone.data.values.cards.push(card.render((this.dropZone.x - this.dropZone.input.hitArea.width/4), (this.dropZone.y), sprite).disableInteractive());
            }

            if (this.dropZone.data.values.cards.length === 1 )
            {
                this.tableSuit = sprite.substr(1,1);
            }
            else if (this.dropZone.data.values.cards.length === 4 )
            {
                console.log("Sub Round: "+this.RoundNumber+" End");
                this.socket.emit("subRoundEnd", this.RoundNumber);
            }
    }

    destroyTabledCard()
    {
        console.log("tabled cards destroying");
        while(this.dropZone.data.values.cards.length)
        {
            console.log("Destroyed the tabled card");
            this.dropZone.data.values.cards.shift().destroy();
        }
    }

    disableAllDealCards()
    {
        console.log( "On disableDealCards length: "+ this.dealCards.length );
        for(var i = 0; i < this.dealCards.length ; i++)
        {
            if(this.dealCards[i].scene) // skip the refferences to the objects that we destroy at on drop event
            {
                this.dealCards[i].disableInteractive();
            }
        }
    }

    enableAllDealCards()
    {
        console.log( "On enableDealCards length: "+ this.dealCards.length );
        for(var i = 0; i < this.dealCards.length ; i++)
        {
            if(this.dealCards[i].scene)// skip the refferences to the objects that we destroy at on drop event
            {
                this.dealCards[i].setInteractive();
            }
        }
    }

    updateDealCardInterativity()
    {
        if(!this.isSpectator)
        {
            console.log("updateDealCardInterativity");
            console.log("play turn: "+ this.playTurn);
            console.log("player index: "+ this.playerIndex);
           /* if(this.playTurn === this.playerIndex )
            {
                this.enableAllDealCards();
            }
            else
            {
                this.disableAllDealCards();
            }*/
            var noAnyTableSuitCard = true;

            for(var i = 0; i < this.dealCards.length ; i++)
            {
                if(this.dealCards[i].scene)// skip the refferences to the objects that we destroy at on drop event
                {
                    if(this.playTurn === this.playerIndex )
                    {
                        console.log("deal card: "+ this.dealCards[i].extra.value)
                        console.log("deal card: "+ this.tableSuit)
                        if (this.dropZone.data.values.cards.length === 0)
                        {
                            this.dealCards[i].setInteractive();
                        }
                        else if(this.dealCards[i].extra.value.substr(1,1) === this.tableSuit )
                        {
                            noAnyTableSuitCard = false
                            this.dealCards[i].setInteractive();
                        }
                        else
                        {
                            this.dealCards[i].disableInteractive();
                        }

                    }
                    else
                    {
                        this.dealCards[i].disableInteractive();
                    }
                    
                }
            }

            if( (this.playTurn === this.playerIndex) && noAnyTableSuitCard )
            {
                this.enableAllDealCards();
            }

        }
    }

    updateScoreBoard()
    {
        if(!this.isSpectator)
        {

            this.myScore.setText([
                'You:  ' ,
                '  Match Points: '+ this.mainScores[this.playerIndex],
                '  Round Points: '+ this.subScores[this.playerIndex], 
            ]);

            this.oponentScore.setText([
                'Opponent:  ',
                '  Match Points: '+ this.mainScores[(this.playerIndex+1)%4],
                '  Round Points: '+ this.subScores[(this.playerIndex+1)%4], 
            ]);
        }

    }

    subRoundFinalize()
    {
        this.destroyTabledCard();
        this.updateScoreBoard();
    }

    showTrumpSelectionView( dealCards )
    {
        //var suits = ["AC","AS","AD","AH"];
        for (let i = 0; i < 4; i++) 
        {
            let trumpCard = new Card(this);
            trumpCard.extra.value = dealCards[i];
            let renderedTrumpCard = trumpCard.render((70 + (i * 55))*this.widthScale, 220*this.heightScale, dealCards[i])

            //renderedTrumpCard.setInteractive();
            renderedTrumpCard.on('pointerdown', function()
            {
                this.disableInteractive();
                console.log("Seleceted trup: "+trumpCard.extra.value.substr(1,1))
                this.scene.socket.emit("trumpSelected",trumpCard.extra.value.substr(1,1));
                //this.scene.updateRoundTrump(trumpCard.extra.value.substr(1,1));
                this.scene.discardTrumpSelectionView();
            })
            this.trumpCards.push(renderedTrumpCard);      
            // let opponentCard = new Card(scene);
            // scene.opponentCards.push(opponentCard.render((50 + (i * 10))*scene.widthScale, 10*scene.heightScale, opponentSprite).disableInteractive());
        }
    }

    discardTrumpSelectionView()
    {
        console.log("discard the trump selection")
        while(this.trumpCards.length)
        {
            this.trumpCards.shift().destroy();
        }
    }

    updateRoundTrump(trump)
    {
        this.roundTrump.setTexture(trump);
    }


    create() {

        console.log("The game has begun");

        let entryPointData = FBInstant.getEntryPointData();
        console.log(JSON.stringify(entryPointData));

        this.add.text(110*this.widthScale, 10*this.widthScale).setText([
            'Omi' 
        ]).setFontSize(50);

        this.oponentScore = this.add.text(200*this.widthScale, 100*this.widthScale).setText([
            'Opponent:  ',
            '  Match Points: '+ 0 ,
            '  Round Points: '+ 0, 
        ]).setFontSize(10);

        this.myScore = this.add.text(20*this.widthScale, 100*this.widthScale).setText([
            'You:  ' ,
            '  Match Points: '+ 0 ,
            '  Round Points: '+ 0, 
        ]).setFontSize(10);

        this.add.text(0*this.widthScale, 0*this.widthScale).setText([
            '  W: '+ window.innerWidth ,
            '  H: '+ window.innerHeight, 
        ]).setFontSize(10);

        this.isPlayerA  = false;
        this.dealCards  = [];
        this.trumpCards = []; // Use to destroy the cards of trump selection views
        this.subScores  = [0,0,0,0];
        this.mainScores = [0,0,0,0];

        this.playerID = this.facebook.playerID;
        this.playerName = this.facebook.playerName;
        this.playerPhoto = FBInstant.player.getPhoto();
        this.playerIndex = -1;
        this.rightPlayerIndex = 1;
        this.frontPlayerIndex = 2;
        this.leftPlayerIndex  = 3;
        this.isSpectator = true;
        this.tableID = -1;
        this.playTurn = -1;
        this.RoundNumber = 1;

        this.tableSuit = ''
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

        this.socket = io(this.socketURL);

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

        this.socket.on('quite', function () {
            console.log("quite received");
            FBInstant.quit();
        });

        this.socket.on('selectTrump', function (playTurn, dealCards) {
            self.playTurn = playTurn;
            console.log("Selecting trump: "+playTurn);

            if( !self.isSpectator && self.playTurn === self.playerIndex)
            {
                //self.dealer.dealCards(dealCards[self.playerIndex]);
                self.showTrumpSelectionView(dealCards[self.playerIndex]);
            }
        });

        this.socket.on('subRoundEnd', function (playTurn, subScores) {
            console.log("subRoundEnd received");
            console.log("subScores: "+subScores)

            self.subScores = subScores;
            self.subRoundFinalize();
            self.RoundNumber = 1+ (self.RoundNumber)%8;

            self.playTurn = playTurn;
            self.updateDealCardInterativity();
            
        });

        this.socket.on('mainRoundEnd', function (playTurn, mainScores, dealCards) {
            console.log("mainRoundEnd received");
            console.log("mainScores: "+mainScores);

            self.mainScores = mainScores;
            self.subScores  = [0, 0, 0, 0] 
            self.subRoundFinalize();
            self.RoundNumber = 1;
            self.playTurn = playTurn;

            console.log("Selecting trump: "+playTurn);
            if( !self.isSpectator && (self.playTurn === self.playerIndex ))
            {
                //self.dealer.dealCards(dealCards[self.playerIndex]);
                self.showTrumpSelectionView(dealCards[self.playerIndex]);
                //self.dealer.dealCards(dealCards[self.playerIndex]);
               // self.updateDealCardInterativity()
            }
        });

        this.socket.on('gameEnd', function (mainScores) {
            console.log("gameEnd received");
            console.log("mainScores: "+mainScores);

            self.mainScores = mainScores;
            self.subScores  = [0, 0, 0, 0] 
            self.subRoundFinalize();

            self.RoundNumber = 1;
        });
        

        this.socket.on('playerAdded', function (players, tabledCards, dealCards, playTurn, trump) {

            console.log("On Player Added");
            self.playTurn = playTurn;

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

                //if( /*players.length === 4*/true ) // for testing
                if( self.matchdata.players.length === 4 ) 
                {
                    self.playStarted = true;

                    if( (dealCards.length > 0 )|| (tabledCards.length > 0 ))
                    {
                        self.updateRoundTrump(trump);
                        if( !self.isSpectator && dealCards.length > 0  )
                        {
                            self.dealer.dealCards(dealCards[self.playerIndex]);
                            self.updateDealCardInterativity();
                        }

                        console.log("Rendering tabled cards");
                        for( var i = 0; i < tabledCards.length; i++ )
                        {
                            self.renderTabledCard( tabledCards[i].card, tabledCards[i].playerIndex );
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

        this.socket.on('dealCards', function (dealCards, playTurn, trump) {
            
            self.inviteText.disableInteractive();
            self.inviteText.setAlpha(0);
            self.playTurn = playTurn;

            console.log("Trump Selected: "+trump);
            self.updateRoundTrump(trump);

            if(!self.isSpectator)
            {
                self.dealer.dealCards(dealCards[self.playerIndex]);
                self.updateDealCardInterativity();
            }
        })

        this.socket.on('cardPlayed', function (gameObject, playerIndex, playTurn) {

            console.log("Rendering tabled card by :"+ playerIndex );
            self.renderTabledCard( gameObject, playerIndex );

            self.playTurn = playTurn;
            self.updateDealCardInterativity();
        })

        this.hQuitText = this.add.text(100*self.widthScale, 500*this.heightScale, ['HARD QUIT']).setFontSize(18*self.widthScale).setFontFamily('Trebuchet MS').setColor('#ffffff').setInteractive();
        
        this.quitText = this.add.text(125*self.widthScale, 475*this.heightScale, ['QUIT']).setFontSize(18*self.widthScale).setFontFamily('Trebuchet MS').setColor('#ffffff').setInteractive();
        
        this.inviteText = this.add.text(120*self.widthScale, 450*this.heightScale, ['INVITE']).setFontSize(18*self.widthScale).setFontFamily('Trebuchet MS').setColor('#ffffff').setInteractive();

        this.roundTrump = this.add.image(310*self.widthScale, 20*this.heightScale).setScale(0.030*this.widthScale, 0.030*this.heightScale).disableInteractive();
        this.roundTrump.setTexture('gray_back');

        //this.showTrumpSelectionView();

        this.hQuitText.on('pointerdown', function () {
            self.socket.emit('quite');
        })

        this.hQuitText.on('pointerover', function () {
            self.hQuitText.setColor('#ff69b4');
        })

        this.hQuitText.on('pointerout', function () {
            self.hQuitText.setColor('#ffffff');
        })

        this.quitText.on('pointerdown', function () {
            FBInstant.quit();
        })

        this.quitText.on('pointerover', function () {
            self.quitText.setColor('#ff69b4');
        })

        this.quitText.on('pointerout', function () {
            self.quitText.setColor('#ffffff');
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
            self.inviteText.setColor('#ffffff');
        })

        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        })

        this.input.on('dragstart', function (pointer, gameObject) {
            //console.log("dragStarted")
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
            console.log("game obj value: "+gameObject.extra.value)
            self.socket.emit('cardPlayed', gameObject, gameObject.extra.value, self.playerIndex);
            gameObject.destroy(); // Because dragend event hold the card at where it was last placed

        })
    }

    update() {

    }
}