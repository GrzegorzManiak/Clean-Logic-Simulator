import konva from 'konva';
import ConnectionManager from '../connectionManager/main';
import { GridConstants } from '../consts';
import { CanvasTypes } from '../index.d';

class BaseBlock {
    public stage: konva.Stage;
    public layer: konva.Layer;
    public block: konva.Rect;
    public cm: ConnectionManager;
    public blockOpts: CanvasTypes.IBlock;

    public canBeConnected: boolean = true;
    public canConntect: boolean = true;

    constructor(connectionManager: ConnectionManager, stage: konva.Stage, layer: konva.Layer, block: CanvasTypes.IBlock, cords: [number, number]) {
        this.stage = stage;
        this.layer = layer;
        this.blockOpts = block;
        this.drawBlock(block, cords);
        this.block.zIndex(10);
        this.cm = connectionManager;
        this.cm.addBlock(this);
        this.snapToGrid();
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
        this.stage.add(this.layer);
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

    // External functions, will remove later
    public removeBlock(): void {
        this.block.remove();
    }

    public moveBlock(x: number, y: number): void {
        this.block.x(x);
        this.block.y(y);
        this.layer.draw();
    }

    public resizeBlock(width: number, height: number): void {
        this.block.width(width);
        this.block.height(height);
        this.layer.draw();
    }

    public changeColor(color: string): void {
        this.block.fill(color);
        this.layer.draw();
    }

    public startMove(): void {
        this.block.draggable(true);
    }
}

export default BaseBlock;
