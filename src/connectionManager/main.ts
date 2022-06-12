import BaseBlock, { ILineRef } from "../blocks/baseBlock";
import konva from 'konva';
import constructBezier from './bezier';
import constructArrow from './arrow';

import { VisualConstants } from "../consts";

interface ICords {
    x: number;
    y: number;
}

interface ISize {
    width: number;
    height: number;
}

interface IInfo {
    size: ISize;
    position: ICords;
}

class ConnectionManager {
    dragSelect: boolean = true;
    clickSelect: boolean = true;
    canvas: konva.Stage;
    blocks: BaseBlock[] = [];
    connectionLayer: konva.Layer;

    conections: Map<string, {
        block1: BaseBlock,
        block2: BaseBlock,
        removeConnection: () => void
    }> = new Map();

    public selectedBlock1: BaseBlock;
    public selectedBlock2: BaseBlock;

    constructor(canvas: konva.Stage) {
        this.connectionLayer = new konva.Layer();
        this.canvas = canvas;
    }

    public getBlock(uuid: string): BaseBlock {
        return this.blocks.find(block => block.uuid === uuid);
    }

    public snapToGrid(force: boolean = true): void {
        this.blocks.forEach(block => {
            // If force is true, make sure the block
            // is allowed to snap to the grid
            if(force === true)
                block.blockOpts.snapToGrid = true;
            
            // Snap the block to the grid
            block.snapToGrid();
        });
    }

    private clickHandler(block: BaseBlock): void {
        if (this.selectedBlock1 === undefined) {
            // Set the first selected block
            this.selectedBlock1 = block;
            
            // Visualize the connection
            return this.glow(block);
        }

        else if (this.selectedBlock2 === undefined)
            // Set the second selected block
            this.selectedBlock2 = block;


        // Check if the blocks are the same
        if(this.selectedBlock1.uuid === this.selectedBlock2.uuid)
            return this.deselectAll();



        // check if Block 1 can have connections
        if(this.selectedBlock1.canConntect === false)
            return this.deselectAll();

        // check if Block 2 can have connections
        if(this.selectedBlock2.canBeConnected === false)
            return this.deselectAll();



        // Check if the blocks are already connected
        const UUID_12 = this.selectedBlock1.uuid + this.selectedBlock2.uuid,
            UUID_21 = this.selectedBlock2.uuid + this.selectedBlock1.uuid;

        if(this.conections.has(UUID_12)) {
            this.conections.get(UUID_12).removeConnection();
            this.conections.delete(UUID_12);
            return this.deselectAll();
        }
            
        else if(this.conections.has(UUID_21)) {
            this.conections.get(UUID_21).removeConnection();
            this.conections.delete(UUID_21);
            return this.deselectAll();
        }


        // Create a new connection
        const removeConnection 
            = this.drawConnection(this.selectedBlock1, this.selectedBlock2);


        // Add the connection to the map
        this.conections.set(UUID_12, {
            block1: this.selectedBlock1,
            block2: this.selectedBlock2,
            removeConnection
        });


        // Remove the selected blocks
        this.deselectAll();
    }

    private deselectAll(): void {
        if(this.selectedBlock1 !== undefined)
            this.unglow(this.selectedBlock1);

        if(this.selectedBlock2 !== undefined)
            this.unglow(this.selectedBlock2);

        this.selectedBlock1 = undefined;
        this.selectedBlock2 = undefined;
    }

    private drawConnection(block1: BaseBlock, block2: BaseBlock): () => void {

        let [x1, y1, x2, y2] = this.calculateConnections(block1, block2),
            line = constructBezier([x1, y1, x2, y2]),
            arrow = constructArrow([x2, y2], 'right');


        const reRender = () => {
            // Calculate the new coordinates
            const [x1, y1, x2, y2] = this.calculateConnections(block1, block2);

            // Remove the old line
            line.remove();
            
            // Construct a new line
            line = constructBezier([x1, y1, x2, y2]);

            // Add the new line back
            this.connectionLayer.add(line);

            // Remove the old arrow
            arrow.remove();

            // Construct a new arrow
            arrow = constructArrow([x2, y2], 'right');

            // Add the new arrow back
            this.connectionLayer.add(arrow);

            // Re-render the canvas
            this.connectionLayer.draw();
        }   

        reRender();
        
        // Draw a line between the two blocks on  update
        block1.block.on('dragmove', reRender);
        block2.block.on('dragmove', reRender);

        // Return a function to remove the connection
        return () => {
            line.remove();
            arrow.remove();

            block1.block.off('dragmove', reRender);
            block2.block.off('dragmove', reRender);

            this.connectionLayer.draw();
        }
    }

    private calculateConnections(block1: BaseBlock, block2: BaseBlock): [number, number, number, number] {
        // A rectangle has 4 sid    es, we want to draw a line from the
        // center of one of these sides to the center of the other
        // choose a side that is perpendicular to the other side

        // Get the coordinates of the two blocks
        const b1 = block1.block.getPosition(),
            b2 = block2.block.getPosition();


        // Get the width and height of the two blocks
        const b1w = block1.block.width(),
            b1h = block1.block.height(),

            b2w = block2.block.width(),
            b2h = block2.block.height();
            
        
        // Get the center of the two blocks
        const b1c = {
            x: (b1.x + b1w / 2) + (b1w / 2),
            y: b1.y + b1h / 2
        };


        const b2c = {
            x: (b2.x + b2w / 2) - (b2w / 2) - (VisualConstants.arrowWidth / 2),
            y: b2.y + b2h / 2
        };


        // return the cords
        return [b1c.x, b1c.y, b2c.x, b2c.y];
    };

    private glow(block: BaseBlock) {
        block.block.shadowColor(block.blockOpts.color);
        block.block.shadowBlur(10);
        block.block.shadowOffset({ x: 0, y: 0 });
        block.block.shadowOpacity(0.5);

        block.block.stroke('rgba(0, 0, 0, 0.2)');
        block.block.strokeWidth(VisualConstants.strokeWidth);

        block.layer.draw();
    }

    private unglow(block: BaseBlock) {
        block.block.shadowColor('#ffffff');
        block.block.shadowBlur(0);
        block.block.shadowOffset({ x: 0, y: 0 });
        block.block.shadowOpacity(0);

        block.block.stroke('#ffffff');
        block.block.strokeWidth(0);

        block.layer.draw();
    }

    addBlock(block: BaseBlock): void {
        this.blocks.push(block);

        block.block.on('click', () => {
            this.clickHandler(block);
        });
    }
}

export default ConnectionManager;