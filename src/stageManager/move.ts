import Konva from "konva";
import { GridConstants } from "../consts";

let scale = 1;

export function getScale(): number {
    return scale;
}

// https://konvajs.org/docs/sandbox/Zooming_Relative_To_Pointer.html
function movementManager(stage: Konva.Stage, cl: Konva.Layer, followers: Array<Konva.Layer>): void {
    followers = [cl, ...followers];

    // Scrolling
    stage.on('wheel', (e) => {
        // stop default scrolling
        e.evt.preventDefault();

        const oldScale = scale,
            pointer = stage.getPointerPosition();

        if(!pointer) return;

        const mousePointTo = {
            x: (pointer.x - cl.x()) / oldScale,
            y: (pointer.y - cl.y()) / oldScale,
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

        // set new scale
        scale = newScale;

        followers.forEach((follower) => {
            follower.scale({ x: newScale, y: newScale });
            follower.position(newPos);
        });

        stage.fire('movementManager');
    });

    // Panning
    // stage.on('mousedown', (e) => {
    //     if (e.evt.button !== 0) return;

    //     stage.startDrag();

    //     stage.fire('movementManager');
    // });
}

export default movementManager;