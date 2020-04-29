class Card {
    constructor(scene) {
        this.extra = {value: 0};
        this.render = (x, y, sprite) => {
            //let card = scene.add.image(x, y, sprite).setScale(0.1*scene.widthScale, 0.1*scene.heightScale).setInteractive();
            let card = new ICard(scene, x, y, sprite, this.extra)
            card.setScale(0.1*scene.widthScale, 0.1*scene.heightScale).setInteractive();
            scene.input.setDraggable(card);
            return card;
        }
    }
}