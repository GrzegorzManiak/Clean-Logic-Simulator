import konva from 'konva';
import BaseBlock from '../blocks/baseBlock';
import { VisualConstants } from '../consts';

function constructBezier(points: [number, number, number, number], selected: boolean, block: BaseBlock): konva.Group {
    const [x1, y1, x2, y2] = points;

    const P1 = { x: x1, y: y1 },
        P2 = { x: x1 + (x2 - x1) / 2, y: y1 },
        P3 = { x: x2 + (x1 - x2) / 2, y: y2 },
        P4 = { x: x2, y: y2 };

    // SVG path data
    const data: string = `M ${P1.x} ${P1.y} C ${P2.x} ${P2.y} ${P3.x} ${P3.y} ${P4.x} ${P4.y}`;

    // group to hold all the elements
    const Group = new konva.Group();

    // Create the stroke outline
    const StrokePath = new konva.Path({
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
    const MainPath = new konva.Path({
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