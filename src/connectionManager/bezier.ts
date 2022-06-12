import konva from 'konva';
import { VisualConstants } from '../consts';

function constructBezier(points: [number, number, number, number]): konva.Path {
    let [x1, y1, x2, y2] = points;

    const P1 = { x: x1, y: y1 },
        P2 = { x: x1 + (x2 - x1) / 2, y: y1 };

    const P3 = { x: x2 + (x1 - x2) / 2, y: y2 },
        P4 = { x: x2, y: y2 };

    const data: string = `M ${P1.x} ${P1.y} C ${P2.x} ${P2.y} ${P3.x} ${P3.y} ${P4.x} ${P4.y}`;

    // Create the bezier curve
    return new konva.Path({
        data: data,
        stroke: '#fff',
        strokeWidth: VisualConstants.strokeWidth,
        lineCap: 'round',
        lineJoin: 'round'
    });
}

export default constructBezier;