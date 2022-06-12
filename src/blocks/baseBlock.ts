import konva from 'konva';
import ConnectionManager from '../connectionManager/main';
import processText from '../ui/fontManager';

import { GridConstants, VisualConstants } from '../consts';
import { CanvasTypes } from '../index.d';
import { v4 as uuidv4 } from 'uuid';

class BaseBlock {
    public stage: konva.Stage;
    public layer: konva.Layer;
    public block: konva.Rect;

    public cm: ConnectionManager;
    public blockOpts: CanvasTypes.IBlock;

    public uuid: string;

    public canBeConnected: boolean = true;
    public canConntect: boolean = true;

    public text: konva.Text;

    constructor(connectionManager: ConnectionManager, stage: konva.Stage, layer: konva.Layer, block: CanvasTypes.IBlock, cords: [number, number]) {
        this.stage = stage;
        this.layer = layer;
        this.blockOpts = block;
        this.drawBlock(block, cords);
        this.cm = connectionManager;
        this.cm.addBlock(this);
        this.snapToGrid();

        // Calculate the uuid
        this.uuid = uuidv4().toString();
    }

    public drawBlock(block: CanvasTypes.IBlock, cords: [number, number]): void {
        this.block = new konva.Rect({
            cornerRadius: block.borderRadius,
            x: cords[0],
            y: cords[1],
            width: block.size.width,
            height: block.size.height,
            fill: block.color,
            stroke: 'rgba(0, 0, 0, 0.2)',
            strokeWidth: block.borderWidth,
        });

        this.layer.add(this.block);     

        this.layer.draw();

        this.block.on('dragend', () => {
            this.snapToGrid();
        });
    }

    public snapToGrid(): void {
        // Dose this block have snapToGrid enabled?
        if (this.blockOpts.snapToGrid === false)
            return;

        // Grid starts at 0,0
        const curX = this.block.x(),
            curY = this.block.y();

        const gridX = Math.round(curX / GridConstants.gridSize) * GridConstants.gridSize,
            gridY = Math.round(curY / GridConstants.gridSize) * GridConstants.gridSize;

        // Trigger the dragmove event
        this.block.x(gridX);
        this.block.y(gridY);

        // Trigger the dragmove event
        this.block.fire('dragmove');
    }

    public startMove(): void {
        this.block.draggable(true);
    }
}

export default BaseBlock;
