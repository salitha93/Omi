class ICard extends Phaser.GameObjects.Image {
    constructor(scene, x, y, sprite, myExtra) {
        super(scene, x, y, sprite);
        this.extra = myExtra;
        scene.add.existing(this);
    }

    preload()
    {

    }
    create()
    {

    }
    preUpdate (time, delta)
    {
      // do stuff with this.myExtra
    }

}