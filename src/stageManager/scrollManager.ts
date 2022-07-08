import Konva from 'Konva';
import { GridConstants } from '../options';

let scale = 1,
    pos = { x: 0, y: 0 };

export function getScale(): number {
    return scale;
}

export function getPos(): { x: number, y: number } {
    return pos;
}

// https://Konvajs.org/docs/sandbox/Zooming_Relative_To_Pointer.html
function movementManager(stage: Konva.Stage, followers: Array<Konva.Layer>): void {
    // Scrolling
    stage.on('wheel', (e) => {
        // stop default scrolling
        e.evt.preventDefault();

        const oldScale = scale,
            pointer = stage.getPointerPosition();

        if(!pointer) return;

        const mousePointTo = {
            x: (pointer.x - followers[0].x()) / oldScale,
            y: (pointer.y - followers[0].y()) / oldScale,
        };

        // how to scale? Zoom in? Or zoom out?
        let direction = e.evt.deltaY > 0 ? 1 : -1;

        // when we zoom on trackpad, e.evt.ctrlKey is true
        // in that case lets revert direction
        if (e.evt.ctrlKey)
            direction = -direction;
    
        const newScale = direction > 0 ? oldScale * GridConstants.scaleBy : oldScale / GridConstants.scaleBy;

        const newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        };

        if (newScale > GridConstants.maxScale) return;
        if (newScale < GridConstants.minScale) return;
        
        // set new scale
        scale = newScale;

        // set new position
        pos = newPos;

        followers.forEach((follower) => {
            follower.scale({ x: newScale, y: newScale });
            follower.position(newPos);
        });

        stage.fire('movementManager');
    });

}

export default movementManager;