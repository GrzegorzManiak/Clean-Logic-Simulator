import Konva from "konva";
import { GridConstants, ThemeConstants } from "../consts";
import { getScale } from "./move";

function constructGrid(stage: Konva.Stage, controlLayer: Konva.Layer, subDivide: number = 1): Konva.Layer {
    const stepSize = GridConstants.gridSize / subDivide,
        gridLayer = new Konva.Layer(),
        scale = getScale();

    const scaledStepSize = stepSize * scale;

    // How many steps do we need to draw? we need to account for the scale
    const stepsX = Math.ceil((controlLayer.width() * scale) / stepSize),
        stepsY = Math.ceil((controlLayer.height() * scale) / stepSize);

    // draw vertical lines  
    for (let i = 0; i <= stepsX; i++) {
        gridLayer.add(
            new Konva.Line({
                x: i * scaledStepSize,
                points: [0, 0, 0, controlLayer.getHeight()],
                stroke: ThemeConstants.gridColor,
                strokeWidth: ThemeConstants.gridLineWidth,
            })
        );
    }

    //draw Horizontal lines
    for (let i = 0; i <= stepsY; i++) {
        gridLayer.add(
            new Konva.Line({
                y: i * scaledStepSize,
                points: [0, 0, controlLayer.getWidth(), 0],
                stroke: ThemeConstants.gridColor,
                strokeWidth: ThemeConstants.gridLineWidth,
            })
        );
    }

    return gridLayer;
}

export default constructGrid;