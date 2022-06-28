import Konva from 'konva';

function trackMouse(stage: Konva.Stage, box: Konva.Rect, origin: { x: number, y: number }) {

    // Get the mouse position
    const mousePos = stage.getPointerPosition() ?? { x: 0, y: 0};

    // Size
    const sizeX = mousePos.x - origin.x,
        sizeY = mousePos.y - origin.y;


    // X, going left to right
    if(sizeX < 0) {
        // Move the box to the mouse
        box.x(mousePos.x);

        // Distance from the original mouse position
        const distanceX = Math.abs(origin.x - mousePos.x);

        // Set the width to the distance
        box.width(distanceX);

    } else { // X, going right to left
        // Reset X
        box.x(origin.x);

        // Change the width
        box.width(sizeX);
    }


    // Y, going up to down
    if(sizeY < 0) {
        // Move the box to the mouse
        box.y(mousePos.y);
        
        // Distance from the original mouse position
        const distanceY = Math.abs(origin.y - mousePos.y);

        // Set the height to the distance
        box.height(distanceY);

    } else { // Y, going down to up
        // Reset Y
        box.y(origin.y);

        // Change the height
        box.height(sizeY);
    }
}

export default trackMouse;