class Zone {
    constructor(scene) {
        this.renderZone = () => {
            let dropZone = scene.add.zone((700/1280)*window.innerWidth, 375*(window.innerHeight/780), 900*(window.innerWidth/1280), 250*(window.innerHeight/780)).setRectangleDropZone(900*(window.innerWidth/1280), 250*(window.innerHeight/780));
            dropZone.setData({ cards: 0 });
            return dropZone;
        };
        this.renderOutline = (dropZone) => {
            let dropZoneOutline = scene.add.graphics();
            dropZoneOutline.lineStyle(4, 0xff69b4);
            dropZoneOutline.strokeRect(dropZone.x - dropZone.input.hitArea.width / 2, dropZone.y - dropZone.input.hitArea.height / 2, dropZone.input.hitArea.width, dropZone.input.hitArea.height)
        }
    }
}