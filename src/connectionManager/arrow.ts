import konva from 'konva';
import { VisualConstants } from '../consts';

function constructArrow(pos: [number, number], point: 'left' | 'right' | 'up' | 'down'): konva.Arrow  {
    
    const [x, y] = pos;

    const arrow = new konva.Arrow({
        points: [x, y, x + (VisualConstants.arrowWidth / 2), y],
        pointerLength: VisualConstants.arrowWidth,
        pointerWidth: VisualConstants.arrowHeight,
        fill: '#fff',
        stroke: '#fff',
        strokeWidth: VisualConstants.strokeWidth,
        strokeScaleEnabled: false,
        lineCap: 'round',
        lineJoin: 'round',
    });

    return arrow;
}

export default constructArrow;