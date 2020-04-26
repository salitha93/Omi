class Card {
    constructor(scene) {
        this.render = (x, y, sprite) => {
            let card = scene.add.image(x, y, sprite).setScale(0.3*(window.innerWidth/1280), 0.3*(window.innerHeight/780)).setInteractive();
            scene.input.setDraggable(card);
            return card;
        }
    }
}