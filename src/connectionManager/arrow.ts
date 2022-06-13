import konva from 'konva';
import { VisualConstants } from '../consts';

function constructArrow(pos: [number, number], point: 'left' | 'right' | 'up' | 'down'): konva.Group  {
    const [x, y] = pos,
        Group = new konva.Group();

    const arrowOutline = new konva.Arrow({
        points: [x, y, x + (VisualConstants.arrowWidth / 2), y],
        pointerLength: VisualConstants.arrowWidth,
        pointerWidth: VisualConstants.arrowHeight,
        stroke: VisualConstants.strokeOutlineColor,
        strokeWidth: VisualConstants.strokeOutlineWidth + VisualConstants.strokeWidth,
        strokeScaleEnabled: true,
        lineCap: 'round',
        lineJoin: 'round',
    });

    // If there is a strokeOutlineWidth, create a stroke outline
    if(VisualConstants.strokeOutlineWidth > 0)
        Group.add(arrowOutline);

    const arrow = new konva.Arrow({
        points: [x, y, x + (VisualConstants.arrowWidth / 2), y],
        pointerLength: VisualConstants.arrowWidth,
        pointerWidth: VisualConstants.arrowHeight,
        stroke: VisualConstants.strokeColor,
        fill: VisualConstants.strokeColor,
        strokeWidth: VisualConstants.strokeWidth,
        strokeScaleEnabled: true,
        lineCap: 'round',
        lineJoin: 'round',
    });

    Group.add(arrow);

    return Group;
}

export default constructArrow;