import Konva from 'Konva';
import { VisualConstants } from '../../options';

function constructArrow(pos: [number, number], direction: 1 | 2 | 3 | 4): Konva.Group  {
    let [x, y] = pos,
        Group = new Konva.Group();

    let points: [number, number, number, number] = [0, 0, 0, 0];

    const arrowOutline = new Konva.Arrow({
        points: points,
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

    const arrow = new Konva.Arrow({
        points: points,
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

    switch(direction) {
        case 1:
            x = x + VisualConstants.arrowWidth;
            points = [x, y, x - VisualConstants.arrowWidth, y];
            break;

        case 2:
            x = x - VisualConstants.arrowWidth;
            points = [x, y, x + VisualConstants.arrowWidth, y];
            break;

        case 3:
            y = y + VisualConstants.arrowHeight;
            points = [x, y, x, y - VisualConstants.arrowHeight];
            break;

        case 4:
            y = y - VisualConstants.arrowHeight;
            points = [x, y, x, y + VisualConstants.arrowHeight];
            break;
    }

    arrow.points(points);
    arrowOutline.points(points);

    return Group;
}

export default constructArrow;