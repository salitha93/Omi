class Dealer {
    constructor(scene) {
        this.dealCards = (deal) => 
        {   
            let self =this; // Resove is become not a function when bind this to the callback function

            return new Promise(function(resolve)
            {
                let playerSprite;
                let opponentSprite;
                if (scene.isPlayerA) {
                    playerSprite = 'cyanCardFront';
                    opponentSprite = 'magentaCardBack';
                } else {
                    playerSprite = 'magentaCardFront';
                    opponentSprite = 'cyanCardBack';
                };

                scene.dealCards = [];
                deal.sort(function(a, b){return b.charCodeAt(1) - a.charCodeAt(1)});
                for (let i = 0; i < deal.length; i++) 
                {
                    let playerCard = new Card(scene);
                    playerCard.extra.value = deal[i];
                    console.log( "card value: "+ playerCard.extra.value );

                    let dealCard = playerCard.render((75 + (i * 25))*scene.widthScale, 440*scene.heightScale, deal[i]);

                    dealCard
                    dealCard.on('drag', function (pointer, dragX, dragY) {
                        this.x = dragX;
                        this.y = dragY;
                    })
            
                    dealCard.on('dragstart', function (pointer)
                    {
                        this.setTint(0xff69b4);
                    })
            
                    dealCard.on('dragend', function (pointer) 
                    {
                        this.setTint();

                        //When dropped the object this event would not triggered
                        this.x = this.input.dragStartX;
                        this.y = this.input.dragStartY;
                    })
            
                    dealCard.on('drop', function (pointer, dropZone) 
                    {
                        console.log("game obj value: "+this.extra.value);
                        this.scene.disableAllDealCards().then(function()
                        {
                            this.scene.socket.emit('cardPlayed', this, this.extra.value, this.scene.playerIndex);
                            this.destroy(); // Because dragend event hold the card at where it was last placed(Later need to change to remove this card onece event recevied)
                        }.bind(this));
                    })

                    scene.dealCards.push(dealCard);

                // let opponentCard = new Card(scene);
                // scene.opponentCards.push(opponentCard.render((50 + (i * 10))*scene.widthScale, 10*scene.heightScale, opponentSprite).disableInteractive());
                }
                Promise.resolve();
            }.bind(this, scene));

            /*let playerSprite;
            let opponentSprite;
            if (scene.isPlayerA) {
                playerSprite = 'cyanCardFront';
                opponentSprite = 'magentaCardBack';
            } else {
                playerSprite = 'magentaCardFront';
                opponentSprite = 'cyanCardBack';
            };

           
            scene.dealCards = [];
            deal.sort(function(a, b){return b.charCodeAt(1) - a.charCodeAt(1)});
            for (let i = 0; i < deal.length; i++) 
            {
                let playerCard = new Card(scene);
                playerCard.extra.value = deal[i];
                console.log( "card value: "+ playerCard.extra.value );

                let dealCard = playerCard.render((75 + (i * 25))*scene.widthScale, 440*scene.heightScale, deal[i]);

                dealCard
                dealCard.on('drag', function (pointer, dragX, dragY) {
                    this.x = dragX;
                    this.y = dragY;
                })
        
                dealCard.on('dragstart', function (pointer) {
                    //console.log("dragStarted")
                    this.setTint(0xff69b4);
                    //self.children.bringToTop(gameObject);
                })
        
                dealCard.on('dragend', function (pointer) {
                    this.setTint();

                    //When dropped the object this event would not triggered
                    this.x = this.input.dragStartX;
                    this.y = this.input.dragStartY;
                })
        
                dealCard.on('drop', function (pointer, dropZone) {
                    console.log("game obj value: "+this.extra.value);
                    this.scene.disableAllDealCards().then(function()
                    {
                        this.scene.socket.emit('cardPlayed', this, this.extra.value, this.scene.playerIndex);
                        this.destroy(); // Because dragend event hold the card at where it was last placed(Later need to change to remove this card onece event recevied)
                    }.bind(this));
        
                })

                scene.dealCards.push(dealCard);

               // let opponentCard = new Card(scene);
               // scene.opponentCards.push(opponentCard.render((50 + (i * 10))*scene.widthScale, 10*scene.heightScale, opponentSprite).disableInteractive());
            }*/

        }
    }
}