import Konva from "konva";
import { GridConstants, ThemeConstants } from "../consts";
import { getPos, getScale } from "./scrollManager";

function constructGrid(stage: Konva.Stage): Konva.Layer {
    const stepSize = GridConstants.gridSize * getScale(),
        gridLayer = new Konva.Layer();

    // How many horizontal lines?
    const horizontalLines = Math.ceil((stage.height() / getScale()) / stepSize) * 2;

    // How many vertical lines?
    const verticalLines = Math.ceil((stage.width() / getScale()) / stepSize) * 2;

    // Make sure to account for the fact that the grid has to align
    // with the edges of the blocks
    const gridWidth = (verticalLines * stepSize);
    const gridHeight = (horizontalLines * stepSize);

    // Currently the grid starts at 0,0, but thats incorrect
    // when the stage is zoomed into or moved.
    // So we need to offset the grid to account for this.
    const gridOffsetX = getPos().x;
    const gridOffsetY = getPos().y;

    if(getScale() > 0.5) {
        // Create the grid
        for (let i = 0; i < horizontalLines; i++) {
            const point: number = (i * stepSize ) + gridOffsetY,
                startPoint: number = gridOffsetX;     

            const line = new Konva.Line({
                points: [startPoint, point, gridWidth, point],
                stroke: GridConstants.gridColor,
                strokeWidth: GridConstants.gridLineWidth,
                lineCap: 'round',
                lineJoin: 'round',  
                dash: [GridConstants.gridDashAmnt, GridConstants.gridDashAmnt],
                dashOffset: 0,
            });
            
            gridLayer.add(line);
        }

        for (let i = 0; i < verticalLines; i++) {
            const point: number = (i * stepSize) + gridOffsetX,
                startPoint: number = gridOffsetY;

            const line = new Konva.Line({
                points: [point, startPoint, point, gridHeight],
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

    gridLayer.draw();

    return gridLayer;
}

export default constructGrid;