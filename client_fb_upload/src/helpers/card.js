class Card {
    constructor(scene) {
        this.extra = {value: ""};
        this.render = (x, y, sprite) => {
            console.log("Renderd the card: " );
            //let card = scene.add.image(x, y, sprite).setScale(0.1*scene.widthScale, 0.1*scene.heightScale).setInteractive();
            let card = new ICard(scene, x, y, sprite, this.extra)
            card.setScale(0.075*scene.widthScale, 0.075*scene.heightScale).setInteractive();
            scene.input.setDraggable(card);
            return card;
        }
    }
}