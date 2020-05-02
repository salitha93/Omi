class Zone {
    constructor(scene) {
        this.renderZone = () => {
            let dropZone = scene.add.zone(153*scene.widthScale, 250*scene.heightScale, 200*scene.widthScale, 200*scene.heightScale).setRectangleDropZone(200*scene.widthScale, 200*scene.heightScale);
            dropZone.setData({ cards: [] });
            return dropZone;
        };
        this.renderOutline = (dropZone) => {
            let dropZoneOutline = scene.add.graphics();
            dropZoneOutline.lineStyle(4, 0xffffff);
            dropZoneOutline.strokeRect(dropZone.x - dropZone.input.hitArea.width / 2, dropZone.y - dropZone.input.hitArea.height / 2, dropZone.input.hitArea.width, dropZone.input.hitArea.height)
        }
    }
}