class Dealer {
    constructor(scene) {
        this.dealCards = () => {
            let playerSprite;
            let opponentSprite;
            if (scene.isPlayerA) {
                playerSprite = 'cyanCardFront';
                opponentSprite = 'magentaCardBack';
            } else {
                playerSprite = 'magentaCardFront';
                opponentSprite = 'cyanCardBack';
            };
            for (let i = 0; i < 5; i++) {
                let playerCard = new Card(scene);
                playerCard.render((475 + (i * 100))*(window.innerWidth/1280), 650*(window.innerHeight/780), playerSprite);

                let opponentCard = new Card(scene);
                scene.opponentCards.push(opponentCard.render((475 + (i * 100))*(window.innerWidth/1280), 125*(window.innerHeight/780), opponentSprite).disableInteractive());
            }
        }
    }
}