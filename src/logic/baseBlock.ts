import konva from 'konva';
import ConnectionManager from '../connectionManager/main';
import { GridConstants, VisualConstants } from '../consts';
import { CanvasTypes } from '../index.d';

class BaseBlock {
    public stage: konva.Stage;
    public layer: konva.Layer;
    public block: konva.Rect;
    public cm: ConnectionManager;
    public blockOpts: CanvasTypes.IBlock;

    public canBeConnected: boolean = true;
    public canConntect: boolean = true;

    constructor(connectionManager: ConnectionManager, stage: konva.Stage, layer: konva.Layer, block: CanvasTypes.IBlock) {
        this.stage = stage;
        this.layer = layer;

        this.blockOpts = block;

        this.drawBlock(block);

        this.block.zIndex(10);

        this.cm = connectionManager;

        this.cm.addBlock(this);

        this.snapToGrid();
    }

    private drawBlock(block: CanvasTypes.IBlock): void {
        this.block = new konva.Rect({
            cornerRadius: block.borderRadius,
            x: block.coordinates.x,
            y: block.coordinates.y,
            width: block.size.width,
            height: block.size.height,
            fill: block.color,
            stroke: block.borderColor,
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

    public onClick(callback: () => void): void {
        this.block.on('click', callback);
    }

    public onDragStart(callback: () => void): void {
        this.block.on('dragstart', callback);
    }

    public onDragEnd(callback: () => void): void {
        this.block.on('dragend', callback);
    }

    public onDragMove(callback: () => void): void {
        this.block.on('dragmove', callback);
    }

    public onMouseOver(callback: () => void): void {
        this.block.on('mouseover', callback);
    }

    public startMove(): void {
        this.block.draggable(true);
    }
}

export default BaseBlock;
