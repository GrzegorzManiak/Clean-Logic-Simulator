import konva from 'konva';
import PlaceableObject from '../placeableObject/main';
import BlockRegister from '../PlaceableObject/register';
import ConnectionManager from '../connectionManager/main';

import { ThemeConstants, VisualConstants } from '../options';
import { CanvasTypes } from '../types';

export class BlockBar {
    private stage: konva.Stage;
    private layer: konva.Layer;

    public blocks: CanvasTypes.IBlock[] = [];
    public connectionManager: ConnectionManager;
    public blockLayer: konva.Layer;
    
    constructor(stage: konva.Stage, connectionManager: ConnectionManager, layer: konva.Layer) {
        this.connectionManager = connectionManager;
        this.blockLayer = layer;

        this.stage = stage;
        this.layer = new konva.Layer();
        this.stage.add(this.layer);
        
        // Make this layer immune to canvas scaling and moving

        layer.scaleX(stage.scaleX() * stage.width() / this.layer.getWidth());
        layer.scaleY(stage.scaleY() * stage.height() / this.layer.getHeight()); 

        // loop through all the blocks and add them to the block bar
        BlockRegister.getBlockList().forEach((block) => {
            this.addBlock(block.id);
        });
    }
    
    public render(): void {
        // Clear the layer
        this.layer.removeChildren();
        
        // Find the size of the stage
        const stageSize = this.stage.getSize();

        // Find the center of the stage
        const centerX = stageSize.width / 2;
        
        let sizeX = 0,
            sizeY = 0;

        // Find the size of the block bar
        this.blocks.forEach((block) => {
            sizeX += block.size.width + ThemeConstants.blockBarPadding;

            if(sizeY < block.size.height)
                sizeY = block.size.height;
        });
        
        // Expand the block bar by 25%
        sizeX += ThemeConstants.blockBarPadding;
        sizeY += ThemeConstants.blockBarPadding * 2;

        let posY = stageSize.height - sizeY,
            posX = centerX - sizeX / 2;

        // render the block bar
        this.layer.add(new konva.Rect({
            x: posX,
            y: posY - (posY * 0.01),
            width: sizeX,
            height: sizeY,
            fill: ThemeConstants.blockBarColor,
            stroke: 'rgba(0, 0, 0, 0.2)',
            cornerRadius: ThemeConstants.blockBarBorderRadius,
            strokeWidth: VisualConstants.strokeWidth,
        }));

        // Calculate the position of the blocks
        let OffsetX = posX + ThemeConstants.blockBarPadding,
            OffsetY = posY - (posY * 0.01) + ThemeConstants.blockBarPadding;

        this.blocks.forEach((block) => {
            const [x, y] = [OffsetX, OffsetY];

            const rec = new konva.Rect({
                x,
                y,
                width: block.size.width,
                height: block.size.height,
                fill: block.color,
                stroke: 'rgba(0, 0, 0, 0.2)',
                strokeWidth: block.borderWidth,
                cornerRadius: block.borderRadius,
            });

            // Allow the block to be draggable
            rec.draggable(true);

            // on drag start, set the block to the correct position
            rec.on('dragend', () => {
                this.onUIdrag(block.id, rec);
                rec.position({ x, y });
            });

            // Continue to offset the block bar
            OffsetX += block.size.width + ThemeConstants.blockBarPadding;
            
            // Add the block to the layer
            this.layer.add(rec);
        });

        this.layer.batchDraw();
    }

    public onUIdrag(blockID: string, rec: konva.Rect): void {
        // Try and fetch the block from the block manager
        const block = BlockRegister.getBlock(blockID);

        // If the block is not found, return
        if(block === undefined)
            return;

        // Spawn the block at the correct position
        new PlaceableObject(this.connectionManager, this.stage, this.blockLayer, block, [rec.x(), rec.y()]);
    }

    public addBlock(blockID: string): void {
        // Try and fetch the block from the block manager
        const block = BlockRegister.getBlock(blockID);

        // If the block is not found, return
        if(block === undefined)
            return;

        // Add the block to the block bar
        this.blocks.push(block);

        // Render the block bar
        this.render();
    }
}

export default BlockBar;