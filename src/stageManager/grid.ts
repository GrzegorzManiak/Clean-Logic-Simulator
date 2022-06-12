import Konva from "konva";
import { GridConstants } from "../consts";

// Adapted from:
// https://longviewcoder.com/2021/12/08/konva-a-better-grid/
function constructGrid(stage: Konva.Stage, subDivide: number = 1): Konva.Layer {
    const stepSize = GridConstants.gridSize / subDivide,
        gridLayer = new Konva.Layer();

    let xSize= stage.width(), 
        ySize= stage.height();

    // Offset the xSize and Ysize by the stage scale
    xSize /= stage.scaleX();
    ySize /= stage.scaleY();
    
    const xSteps = Math.round(xSize / stepSize), 
        ySteps = Math.round(ySize / stepSize);
    
    // draw vertical lines
    for (let i = 0; i <= xSteps; i++) {
        gridLayer.add(
            new Konva.Line({
                x: i * stepSize,
                points: [0, 0, 0, ySize],
                stroke: 'rgba(0, 0, 0, 0.2)',
                strokeWidth: 1,
            })
        );
    }

    //draw Horizontal lines
    for (let i = 0; i <= ySteps; i++) {
        gridLayer.add(
            new Konva.Line({
                y: i * stepSize,
                points: [0, 0, xSize, 0],
                stroke: 'rgba(0, 0, 0, 0.2)',
                strokeWidth: 1,
            })
        );
    }
    
    return gridLayer;
}

export default constructGrid;