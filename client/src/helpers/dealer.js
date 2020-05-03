class Dealer {
    constructor(scene) {
        this.dealCards = (deal) => {
            //deal = ["2C","2D","2H","2S"];
            let playerSprite;
            let opponentSprite;
            if (scene.isPlayerA) {
                playerSprite = 'cyanCardFront';
                opponentSprite = 'magentaCardBack';
            } else {
                playerSprite = 'magentaCardFront';
                opponentSprite = 'cyanCardBack';
            };

           /* for (let i = 0; i < 8; i++) {
                let playerCard = new Card(scene);
                scene.dealCards.push(playerCard.render((50 + (i * 25))*scene.widthScale, 380*scene.heightScale, playerSprite));

                //let opponentCard = new Card(scene);
               // scene.opponentCards.push(opponentCard.render((50 + (i * 10))*scene.widthScale, 10*scene.heightScale, opponentSprite).disableInteractive());
            }*/
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
                    /*dropZone.data.values.cards.push(gameObject);
                    console.log("gameObject: "+ dropZone.data.values)
                    gameObject.x = dropZone.x;
                    gameObject.y = dropZone.y + dropZone.input.hitArea.height/4 ;
                    gameObject.disableInteractive();
                    self.children.bringToTop(gameObject);
                    //console.log("game obj value: "+gameObject.extra.value)*/
                    console.log("game obj value: "+this.extra.value)
                    this.scene.socket.emit('cardPlayed', this, this.extra.value, this.scene.playerIndex);
                    this.destroy(); // Because dragend event hold the card at where it was last placed(Later need to change to remove this card onece event recevied)
        
                })

                scene.dealCards.push(dealCard);

               // let opponentCard = new Card(scene);
               // scene.opponentCards.push(opponentCard.render((50 + (i * 10))*scene.widthScale, 10*scene.heightScale, opponentSprite).disableInteractive());
            }

        }
    }
}