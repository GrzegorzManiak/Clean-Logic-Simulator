import { GridConstants } from "../../consts";
import { getScale } from "../scrollManager";
import { IGridDetails } from "../grid";

import Konva from "konva";

function lines(gridLayer: Konva.Layer, gridDetails: IGridDetails) {
    // Only render the grid if we are zoomed in enough, otherwise
    // it will be too small to see, but we still need to render it
    // causing a performance hit.
    if(getScale() > 0.5) {

        // -- Horizontal Lines --
        for (let i = 0; i < gridDetails.horizontalLines; i++) {

            const point: number = (i * gridDetails.stepSize ) + gridDetails.gridOffsetY,
                startPoint: number = gridDetails.gridOffsetX;     

            const line = new Konva.Line({
                points: [startPoint, point, gridDetails.gridWidth, point],
                stroke: GridConstants.gridColor,
                strokeWidth: GridConstants.gridLineWidth,
                lineCap: 'round',
                lineJoin: 'round',  
                dash: [GridConstants.gridDashAmnt, GridConstants.gridDashAmnt],
                dashOffset: 0,
            });
            
            gridLayer.add(line);
        }

        // -- Vertical Lines --
        for (let i = 0; i < gridDetails.verticalLines; i++) {

            const point: number = (i * gridDetails.stepSize) + gridDetails.gridOffsetX,
                startPoint: number = gridDetails.gridOffsetY;

            const line = new Konva.Line({
                points: [point, startPoint, point, gridDetails.gridHeight],
                stroke: GridConstants.gridColor,
                strokeWidth: GridConstants.gridLineWidth,
                lineCap: 'round',
                lineJoin: 'round',
                dash: [GridConstants.gridDashAmnt, GridConstants.gridDashAmnt],
                dashOffset: 0,
            });
            
            gridLayer.add(line);
        }
    }
}

export default lines;