import Konva from "konva";
import { GridConstants } from "../consts";

// https://konvajs.org/docs/sandbox/Zooming_Relative_To_Pointer.html
function scrollManager(stage: Konva.Stage): void {
    stage.on('wheel', (e) => {
        // stop default scrolling
        e.evt.preventDefault();

        const oldScale = stage.scaleX(),
            pointer = stage.getPointerPosition();

        if(!pointer) return;

        const mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
        };

        // how to scale? Zoom in? Or zoom out?
        let direction = e.evt.deltaY > 0 ? 1 : -1;

        // when we zoom on trackpad, e.evt.ctrlKey is true
        // in that case lets revert direction
        if (e.evt.ctrlKey)
            direction = -direction;
    
        const newScale = direction > 0 ? oldScale * GridConstants.scaleBy : oldScale / GridConstants.scaleBy;

        stage.scale({ x: newScale, y: newScale });

        const newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        };

        stage.position(newPos);

        stage.fire('scrollManager');
    });
}

export default scrollManager;