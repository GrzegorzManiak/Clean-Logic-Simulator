import konva from 'konva';
import ConnectionManager from '../connectionManager/main';
import ButtonPrompt from '../ui/buttonPrompt';

import { GridConstants } from '../consts';
import { CanvasTypes } from '../index.d';
import { v4 as uuidv4 } from 'uuid';

export interface ILineRef {
    block: BaseBlock,
    removeConnection: () => void,
}

class BaseBlock {
    public stage: konva.Stage;
    public layer: konva.Layer;
    public block: konva.Rect;
    public cm: ConnectionManager;
    public blockOpts: CanvasTypes.IBlock;
    public uuid: string;

    public canBeConnected: boolean = true;
    public canConntect: boolean = true;

    public connectionFace: 0 | 1 | 2 | 3 | 4 = 0;
    
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

        // Add the prompt
        const prompt = new ButtonPrompt(this.block, () => {
            console.log('Prompt');


        }, {
            text: 'Use',
            // e key code
            keyCode: 69,
            key: 'E',
        });
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

        // Add the block to the layer
        this.layer.add(this.block);     

        // Draw the layer
        this.layer.draw();

        // Make the block snap to the grid
        // as soon as it is added to the layer
        this.block.on('dragend', () => {
            this.snapToGrid();
        });
    }


    // Array of blocks that are taking in
    // connections from this block. Block -> Child
    public child: Array<ILineRef> = [];
    public addChild(child: ILineRef): void { this.child.push(child); }
    public getChild(block: BaseBlock): ILineRef {
        for (let i = 0; i < this.child.length; i++) {
            if (this.child[i].block.uuid === block.uuid)
                return this.child[i];
        }
    }
    public removeChild(child: ILineRef): void { this.child.splice(this.child.indexOf(child), 1); }

    // Array of blocks that are connected
    // to this block. Parent -> Block
    public parent: Array<ILineRef> = [];
    public addParent(parent: ILineRef): void { this.parent.push(parent); }
    public getParent(block: BaseBlock): ILineRef {
        for (let i = 0; i < this.parent.length; i++) {
            if (this.parent[i].block.uuid === block.uuid)
                return this.parent[i];
        }
    }
    public removeParent(parent: ILineRef): void { this.parent.splice(this.parent.indexOf(parent), 1); }


    // This function checks if a block is a parent of the block
    // that is being passed in
    public isConnectedTo(block: BaseBlock): boolean {
        const blockID = block.uuid;

        // Check if the block is a child of this block
        for (let i = 0; i < this.child.length; i++) {
            if (this.child[i].block.uuid === blockID)
                return true;
        }

        return false;
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
