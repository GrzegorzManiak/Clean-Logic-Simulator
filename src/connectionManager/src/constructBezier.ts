import Konva from 'Konva';
import intractableObject from '../../interactableObject';
import { VisualConstants } from '../../options';

function constructBezier(points: [number, number, number, number], selected: boolean, block: intractableObject, direction: 1 | 2 | 3 | 4): Konva.Group {
    const [x1, y1, x2, y2] = points;

    // Variable to store data for the bezier curve
    let data = '';

    // Left Rigth
    if(direction === 1 || direction === 2) {
        const P1 = { x: x1, y: y1 },
            P2 = { x: x1 + (x2 - x1) / 2, y: y1 },
            P3 = { x: x2 + (x1 - x2) / 2, y: y2 },
            P4 = { x: x2, y: y2 };

        data = `M ${P1.x} ${P1.y} C ${P2.x} ${P2.y} ${P3.x} ${P3.y} ${P4.x} ${P4.y}`;
    } 

    // Up Down
    if(direction === 3 || direction === 4) {
        const P1 = { x: x1, y: y1 },
            P2 = { x: x1, y: y1 + (y2 - y1) / 2 },
            P3 = { x: x2, y: y2 - (y2 - y1) / 2 },
            P4 = { x: x2, y: y2 };

        data = `M ${P1.x} ${P1.y} C ${P2.x} ${P2.y} ${P3.x} ${P3.y} ${P4.x} ${P4.y}`;
    }

    // group to hold all the elements
    const Group = new Konva.Group();

    // Create the stroke outline
    const StrokePath = new Konva.Path({
        data: data,
        stroke: VisualConstants.strokeOutlineColor,
        strokeWidth: VisualConstants.strokeWidth + VisualConstants.strokeOutlineWidth,
        lineCap: 'round',
        lineJoin: 'round'
    })

    // If there is a strokeOutlineWidth, create a stroke outline
    if (VisualConstants.strokeOutlineWidth > 0)
        Group.add(StrokePath);

    // Create the bezier curve
    const MainPath = new Konva.Path({
        data: data,
        stroke: selected ? block.blockOpts.color : VisualConstants.strokeColor,
        strokeWidth: VisualConstants.strokeWidth,
        lineCap: 'round',
        lineJoin: 'round'
    });

    Group.add(MainPath);

    return Group;
}

export default constructBezier;