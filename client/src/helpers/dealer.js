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
            for (let i = 0; i < deal.length; i++) 
            {
                let playerCard = new Card(scene);
                playerCard.extra.value = deal[i];
                console.log( "card value: "+ playerCard.extra.value )
                scene.dealCards.push(playerCard.render((65 + (i * 25))*scene.widthScale, 440*scene.heightScale, deal[i]));

               // let opponentCard = new Card(scene);
               // scene.opponentCards.push(opponentCard.render((50 + (i * 10))*scene.widthScale, 10*scene.heightScale, opponentSprite).disableInteractive());
            }

        }
    }
}