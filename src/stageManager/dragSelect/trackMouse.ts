import Konva from 'Konva';

function trackMouse(stage: Konva.Stage, box: Konva.Rect, origin: { x: number, y: number }, getSize: () => [{ x: number, y: number }, { x: number, y: number }], setSize: (org: [{ x: number, y: number }, { x: number, y: number }]) => void) {

    // Get the mouse position
    const mousePos = stage.getPointerPosition() ?? { x: 0, y: 0};

    // Size
    const sizeX = mousePos.x - origin.x,
        sizeY = mousePos.y - origin.y;


    // X-
    if(sizeX < 0) {
        // Move the box to the mouse
        box.x(mousePos.x);

        // Distance from the original mouse position
        const distanceX = Math.abs(origin.x - mousePos.x);

        // Set the width to the distance
        box.width(distanceX);

        // Set the new offset cords
        const org = getSize();
        setSize([
            { x: mousePos.x, y: org[0].y }, 
            { x: distanceX, y: org[1].y }
        ]);

    } else { // X+
        // Reset X
        box.x(origin.x);

        // Change the width
        box.width(sizeX);

        // Change the size
        const org = getSize();
        setSize([
            { x: origin.x, y: org[0].y },
            { x: sizeX, y: org[1].y }
        ]);
    }


    // Y-
    if(sizeY < 0) {
        // Move the box to the mouse
        box.y(mousePos.y);
        
        // Distance from the original mouse position
        const distanceY = Math.abs(origin.y - mousePos.y);

        // Set the height to the distance
        box.height(distanceY);

        // Set the size
        const org = getSize();
        setSize([
            { x: org[0].x, y: mousePos.y },
            { x: org[1].x, y: distanceY }
        ]);

    } else { // Y+
        // Reset Y
        box.y(origin.y);

        // Change the height
        box.height(sizeY);

        // Set the size
        const org = getSize();
        setSize([
            { x: org[0].x, y: origin.y },
            { x: org[1].x, y: sizeY }
        ]);
    }
}

export default trackMouse;