import { GridConstants } from "../../consts";
import { getScale } from "../scrollManager";
import { IGridDetails } from "../grid";

import Konva from "konva";

function checker(gridLayer: Konva.Layer, gridDetails: IGridDetails) {
    // Only render the grid if we are zoomed in enough, otherwise
    // it will be too small to see, but we still need to render it
    // causing a performance hit.
    if(getScale() > 0.5) {

        // Add a checkerboard pattern to the gridLayer

        // -- Horizontal Lines --
        for (let i = 0; i < gridDetails.horizontalLines; i++) {

            // -- Vertical Lines --
            for (let j = 0; j < gridDetails.verticalLines; j++) {
                
                const point: number = (i * gridDetails.stepSize) + gridDetails.gridOffsetX,
                    startPoint: number = (j * gridDetails.stepSize) + gridDetails.gridOffsetY;

                // Only draw every other square
                if((i + j) % 2 === 0) {
                    const rect = new Konva.Rect({
                        x: point,
                        y: startPoint,
                        width: gridDetails.stepSize,
                        height: gridDetails.stepSize,
                        fill: GridConstants.gridColor,
                    });

                    gridLayer.add(rect);
                }
            }
        }
    }
}

export default checker;