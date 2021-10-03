class Game extends Phaser.Scene {
    constructor() {
        super({
            key: 'Game'
        });

        this.profilePicScale = 0.1;
        this.widthScale  = window.innerWidth/335; //270
        this.heightScale = window.innerHeight/524; //480
        //this.socketURL = 'http://localhost:3021';
        this.socketURL = 'https://server-omi.herokuapp.com';
    }

    sleep(milliseconds)
    {
        console.log("Sleeping for(ms): "+milliseconds);
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }

    addCurrentPlayerPhoto (key)
    {
        this.add.image(160*this.widthScale, 380*this.heightScale, key).setScale(this.profilePicScale*this.widthScale).setInteractive();
    }
    
    addRightPlayerPhoto (key)
    {
        this.add.image(295*this.widthScale, 260*this.heightScale, key).setScale(this.profilePicScale*this.widthScale).setInteractive();
    }
    addFrontPlayerPhoto (key)
    {
        this.add.image(160*this.widthScale, 120*this.heightScale, key).setScale(this.profilePicScale*this.widthScale).setInteractive();
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
        return new Promise(function(resolve)
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
               this.dropZone.data.values.cards.push(card.render((this.dropZone.x + this.dropZone.input.hitArea.width/4 + 10 ), (this.dropZone.y), sprite).disableInteractive());
            }
            else if (playerIndex === this.frontPlayerIndex)
            {
                this.dropZone.data.values.cards.push(card.render((this.dropZone.x), (this.dropZone.y - this.dropZone.input.hitArea.height/4), sprite).disableInteractive());
            }
            else if (playerIndex === this.leftPlayerIndex)
            {
                this.dropZone.data.values.cards.push(card.render((this.dropZone.x - this.dropZone.input.hitArea.width/4 - 10), (this.dropZone.y), sprite).disableInteractive());
            }

            if (this.dropZone.data.values.cards.length === 1 )
            {
                this.tableSuit = sprite.substr(1,1);
                console.log("tableSuit: "+ this.tableSuit)
                resolve(false);
            }
            else if (this.dropZone.data.values.cards.length === 4 )
            {
                console.log("Sub Round: "+this.subRoundNumber+" End");
                this.socket.emit('subRoundEnd', this.subRoundNumber);
                resolve(true);
            }
            else
            {
                resolve(false);
            }

            

        }.bind(this));

        /*let sprite = gameObject.textureKey;
            let card = new Card(this);

            if ( (playerIndex === 0) && this.isSpectator ) {
                this.dropZone.data.values.cards.push(card.render((this.dropZone.x), (this.dropZone.y + this.dropZone.input.hitArea.height/4), sprite).disableInteractive());
            }
            else if(playerIndex === this.playerIndex)
            {
                
                this.dropZone.data.values.cards.push(card.render((this.dropZone.x), (this.dropZone.y + this.dropZone.input.hitArea.height/4), sprite).disableInteractive());
            }
            else if (playerIndex === this.rightPlayerIndex) {
               this.dropZone.data.values.cards.push(card.render((this.dropZone.x + this.dropZone.input.hitArea.width/4 + 10 ), (this.dropZone.y), sprite).disableInteractive());
            }
            else if (playerIndex === this.frontPlayerIndex)
            {
                this.dropZone.data.values.cards.push(card.render((this.dropZone.x), (this.dropZone.y - this.dropZone.input.hitArea.height/4), sprite).disableInteractive());
            }
            else if (playerIndex === this.leftPlayerIndex)
            {
                this.dropZone.data.values.cards.push(card.render((this.dropZone.x - this.dropZone.input.hitArea.width/4 - 10), (this.dropZone.y), sprite).disableInteractive());
            }

            if (this.dropZone.data.values.cards.length === 1 )
            {
                this.tableSuit = sprite.substr(1,1);
                console.log("tableSuit: "+ this.tableSuit)
            }
            else if (this.dropZone.data.values.cards.length === 4 )
            {
                console.log("Sub Round: "+this.subRoundNumber+" End");
                this.socket.emit("subRoundEnd", this.subRoundNumber);
            }*/
    }

    destroyTabledCard()
    {
        return new Promise(function(resolve)
        {
            console.log("tabled cards destroying")
            this.sleep(3000).then(function()
            {
                console.log("Cards on the drop zone"+this.dropZone.data.values.cards.length)
                while(this.dropZone.data.values.cards.length)
                {
                    this.dropZone.data.values.cards.shift().destroy();
                }
                console.log("Removed all the table cards");
                resolve();
            }.bind(this));
        }.bind(this));
    }

    disableAllDealCards()
    {
        return new Promise(function(resolve)
        {
            console.log( "On disableDealCards length: "+ this.dealCards.length );
            for(var i = 0; i < this.dealCards.length ; i++)
            {
                if(this.dealCards[i].scene) // skip the refferences to the objects that we destroy at on drop event
                {
                    this.dealCards[i].disableInteractive();
                }
            }
            resolve();
        }.bind(this));
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
                        //this.dropZone.setInteractive();
                        console.log("deal card: "+ this.dealCards[i].extra.value)
                        console.log("table suit: "+ this.tableSuit)
                        console.log("Cards on the dropZone: "+ this.dropZone.data.values.cards.length)
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
                        //this.dropZone.setInteractive();
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
        return new Promise(function(resolve)
        {
            console.log("Updating score boards");
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

            resolve();
        }.bind(this));
    }

    subRoundFinalize()
    {
        return new Promise(function(resolve)
        {
            this.destroyTabledCard().then(function()
            {
                this.updateScoreBoard().then(function()
                {
                    resolve();
                });
            }.bind(this));
        }.bind(this));
    }

    showTrumpSelectionView( dealCards )
    {
        console.log("Disable the drop zone");
        this.dropZone.disableInteractive();
        for (let i = 0; i < 4; i++) 
        {
            let trumpCard = new Card(this);
            trumpCard.extra.value = dealCards[i];
            let renderedTrumpCard = trumpCard.render((78 + (i * 55))*this.widthScale, 245*this.heightScale, dealCards[i])

            //renderedTrumpCard.setInteractive();
            renderedTrumpCard.on('pointerdown', function()
            {
                //this.disableInteractive();
                console.log("Seleceted trup: "+trumpCard.extra.value.substr(1,1))
                this.scene.socket.emit('trumpSelected',trumpCard.extra.value.substr(1,1));
                //this.scene.updateRoundTrump(trumpCard.extra.value.substr(1,1));
                //this.scene.discardTrumpSelectionView();
            })
            this.trumpCards.push(renderedTrumpCard);      
            // let opponentCard = new Card(scene);
            // scene.opponentCards.push(opponentCard.render((50 + (i * 10))*scene.widthScale, 10*scene.heightScale, opponentSprite).disableInteractive());
        }
    }

    discardTrumpSelectionView()
    {
        return new Promise(function(resolve)
        {
            console.log("discard the trump selection")
            while(this.trumpCards.length)
            {
                this.trumpCards.shift().destroy();
            }
            resolve();
        }.bind(this));
    }

    updateRoundTrump(trump)
    {
        this.roundTrump.setTexture(trump);

        if(trump === 'gray_back')
        {
            this.roundTrump.setAlpha(0);
        }
        else
        {
            this.roundTrump.setAlpha(1);
        }
    }

    enableTurnArrow()
    {
        this.imgTurn.setAlpha(1);
        if(this.isSpectator && (this.playTurn === 0))
        {
            this.imgTurn.setPosition(190*this.widthScale,380*this.heightScale);
        }
        else if(this.playTurn === this.playerIndex)
        {
            this.imgTurn.setPosition(190*this.widthScale,380*this.heightScale); 
        }
        else if(this.playTurn === this.rightPlayerIndex)
        {
            this.imgTurn.setPosition(295*this.widthScale,225*this.heightScale);
        }
        else if(this.playTurn === this.frontPlayerIndex)
        {
            this.imgTurn.setPosition(190*this.widthScale,120*this.heightScale); 
        }
        else if(this.playTurn === this.leftPlayerIndex)
        {
            this.imgTurn.setPosition(25*this.widthScale,225*this.heightScale)
        }
        else
        {
            this.imgTurn.setAlpha(0);
        }
    }

    disableTurnArrow()
    {
        this.imgTurn.setAlpha(0);
    }

    create() {

        console.log("The game has begun");

        let entryPointData = FBInstant.getEntryPointData();
        console.log(JSON.stringify(entryPointData));

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
        this.subRoundNumber = 1;
        this.mainRoundNumber = 1;

        this.tableSuit = ''
        this.playStarted = false;

        this.matchdata = {
            players: [],
        };

        this.zone = new Zone(this);
        this.dropZone = this.zone.renderZone();
        this.outline = this.zone.renderOutline(this.dropZone);

        this.dealer = new Dealer(this);

        this.add.text(110*this.widthScale, 10*this.heightScale).setText([
            'Omi' 
        ]).setFontSize(50*this.heightScale).setFontFamily('Trebuchet MS');

        this.oponentScore = this.add.text(185*this.widthScale, 80*this.heightScale).setText([
            'Opponent:  ',
            '  Match Points: '+ 0 ,
            '  Round Points: '+ 0, 
        ]).setFontSize(11*this.heightScale)

        this.myScore = this.add.text(10*this.widthScale, 80*this.heightScale).setText([
            'You:  ' ,
            '  Match Points: '+ 0 ,
            '  Round Points: '+ 0, 
        ]).setFontSize(11*this.heightScale)

        this.add.text(0*this.widthScale, 0*this.widthScale).setText([
            '  W: '+ window.innerWidth ,
            '  H: '+ window.innerHeight, 
        ]).setFontSize(10*this.heightScale);

        this.inviteText = this.add.text(131*this.widthScale, 450*this.heightScale, ['INVITE']).setFontSize(18*this.heightScale).setFontFamily('Trebuchet MS').setColor('#ffffff').setInteractive();
        //this.inviteText.setScale(this.widthScale,this.heightScale);

        //this.quitText = this.add.text(152*this.widthScale, 475*this.heightScale, ['QUIT']).setFontSize(18*this.widthScale).setFontFamily('Trebuchet MS').setColor('#ffffff').setInteractive();
        //this.quitText.setScale(this.widthScale,this.heightScale);

        this.hQuitText = this.add.text(112*this.widthScale, 490*this.heightScale, ['END MATCH']).setFontSize(18*this.heightScale).setFontFamily('Trebuchet MS').setColor('#ffffff').setInteractive();
        //this.hQuitText.setScale(this.widthScale,this.heightScale);


        this.roundTrump = this.add.image(160*this.widthScale, 80*this.heightScale).setScale(0.030*this.widthScale, 0.030*this.heightScale).disableInteractive();
        this.roundTrump.setTexture('gray_back');
        this.roundTrump.setAlpha(0);

        this.imgTurn = this.add.image(50*this.widthScale, 50*this.heightScale).setScale(0.010*this.widthScale, 0.010*this.heightScale).disableInteractive();
        this.imgTurn.setTexture('turn');
        this.imgTurn.setAlpha(0);

        if (entryPointData)
        {
           this.tableID = entryPointData.tableID;
        }

        let self = this;

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
            self.enableTurnArrow();
            
            console.log("Selecting trump: "+playTurn);

            if( !self.isSpectator && self.playTurn === self.playerIndex)
            {
                self.showTrumpSelectionView(dealCards[self.playerIndex]);
            }
        });

        this.socket.on('subRoundEnd', function (playTurn, subScores, subRoundNumber) {
            console.log("subRoundEnd received");
            console.log("subScores: "+subScores)
            self.playTurn = playTurn;
            self.subRoundNumber = subRoundNumber;

            self.subScores = subScores;
            self.subRoundFinalize().then(function(){
                self.updateDealCardInterativity();
                self.enableTurnArrow();
            }.bind(self));
        });

        this.socket.on('mainRoundEnd', function (playTurn, mainScores, dealCards, mainRoundNumber) {
            console.log("mainRoundEnd received");
            console.log("mainScores: "+mainScores);

            self.mainScores = mainScores;
            self.subScores  = [0, 0, 0, 0];
            self.subRoundNumber = 1;
            self.mainRoundNumber = mainRoundNumber;
            self.playTurn = playTurn;
            
            self.subRoundFinalize().then(function(){
                console.log("Selecting trump: "+playTurn);
                self.enableTurnArrow();
                self.updateRoundTrump('gray_back');
                if( !self.isSpectator && (self.playTurn === self.playerIndex ))
                {
                    self.showTrumpSelectionView(dealCards[self.playerIndex]);
                }
            }.bind(self));
        });

        this.socket.on('gameEnd', function (mainScores) {
            console.log("gameEnd received");
            console.log("mainScores: "+mainScores);
            self.subRoundNumber = 1;

            self.mainScores = mainScores;
            self.subScores  = [0, 0, 0, 0] 
            self.subRoundFinalize().then(function()
            {
                if( self.isSpectator )
                {
                    self.inviteText = self.add.text(100*self.widthScale, 250*thselfis.heightScale, ['Game Over']).setFontSize(18*self.widthScale).setFontFamily('Trebuchet MS').setColor('#ffffff').setInteractive();
                }
                else if(self.mainScores[self.playerIndex] === 10 )
                {
                    self.inviteText = self.add.text(100*self.widthScale, 250*thselfis.heightScale, ['You Won']).setFontSize(18*self.widthScale).setFontFamily('Trebuchet MS').setColor('#ffffff').setInteractive();
                }
                else
                {
                    self.inviteText = self.add.text(100*self.widthScale, 250*thselfis.heightScale, ['You Lost']).setFontSize(18*self.widthScale).setFontFamily('Trebuchet MS').setColor('#ffffff').setInteractive();
                }
            }.bind(self));
        });
        

        this.socket.on('playerAdded', function (players, tabledCards, dealCards, playTurn, trump, playStarted, subScores, mainScores, subRoundNumber, mainRoundNumber) {

            console.log("On Player Added");
            self.playTurn = playTurn;
            self.subRoundNumber = subRoundNumber;
            self.mainRoundNumber = mainRoundNumber;

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
                    self.mainScores = mainScores;
                    self.subScores = subScores;
                    self.inviteText.disableInteractive();
                    self.inviteText.setAlpha(0);
                    self.updateScoreBoard();
                    self.enableTurnArrow();

                    if(self.isSpectator)
                    {
                        self.hQuitText.disableInteractive();
                        self.hQuitText.setAlpha(0);
                    }

                    if(playStarted === true && (trump === "gray_back"))
                    {
                        console.log("Selecting trump: "+self.playTurn);

                        if( !self.isSpectator && (self.playTurn === self.playerIndex))
                        {
                            self.showTrumpSelectionView(dealCards[self.playerIndex]);
                        }
                    }
                    else if( (dealCards.length > 0 )|| (tabledCards.length > 0 ))
                    {
                        self.updateRoundTrump(trump);

                        console.log("Rendering tabled cards");
                        for( var i = 0; i < tabledCards.length; i++ )
                        {
                            self.renderTabledCard( tabledCards[i].card, tabledCards[i].playerIndex );
                        }

                        if( !self.isSpectator && dealCards.length > 0  )
                        {
                            self.dealer.dealCards(dealCards[self.playerIndex]).then(function()
                            {
                                self.updateDealCardInterativity();
                            }.bind(self));
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

            console.log("Dealing cards")
            
            self.inviteText.disableInteractive();
            self.inviteText.setAlpha(0);

            self.playTurn = playTurn;

            console.log("Trump Selected: "+trump);

            if(self.playTurn === self.playerIndex)
            {
                self.discardTrumpSelectionView().then(function()
                {
                    console.log("Enabele the drop zone");
                    self.dropZone.setInteractive();
                });
            }

            self.updateRoundTrump(trump);
            self.enableTurnArrow();

            if(!self.isSpectator)
            {
                self.dealer.dealCards(dealCards[self.playerIndex]).then(function()
                {
                    self.updateDealCardInterativity();
                }.bind(self));
            }
        })

        this.socket.on('cardPlayed', function (gameObject, playerIndex, playTurn) {

            console.log("Rendering tabled card by :"+ playerIndex );
            self.renderTabledCard( gameObject, playerIndex ).then(function(roundEnd)
            {
                if(!roundEnd)
                {
                    self.playTurn = playTurn;
                    self.updateDealCardInterativity();
                    self.enableTurnArrow();
                }
            }.bind(self));
        })

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

        /*this.quitText.on('pointerdown', function () {
            FBInstant.quit();
        })

        this.quitText.on('pointerover', function () {
            self.quitText.setColor('#ff69b4');
        })

        this.quitText.on('pointerout', function () {
            self.quitText.setColor('#ffffff');
        })*/

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
/*
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
            /*console.log("game obj value: "+gameObject.extra.value)
            self.socket.emit('cardPlayed', gameObject, gameObject.extra.value, self.playerIndex);
            gameObject.destroy(); // Because dragend event hold the card at where it was last placed(Later need to change to remove this card onece event recevied)

        })*/
    }

    update() {

    }
}