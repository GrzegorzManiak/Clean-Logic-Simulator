import BaseBlock, { ILineRef } from "../blocks/baseBlock";
import konva from 'konva';
import constructBezier from './bezier';
import constructArrow from './arrow';

import { VisualConstants } from "../consts";
import { TArrowDirection } from "../index.d";

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
        let cords = this.calculateConnections(block1, block2),
            [x1, y1, x2, y2] = cords.pos,
            direction = cords.dir;

        let line = constructBezier([x1, y1, x2, y2], true, block1),
            arrow = constructArrow([x2, y2], direction);


        const reRender = () => {
            let selected = false;

            // Check if the block is currently selected
            if(block1.uuid === this.selectedBlock1?.uuid || block1.uuid === this.selectedBlock2?.uuid)
                selected = true;

            if(block2.uuid === this.selectedBlock1?.uuid || block2.uuid === this.selectedBlock2?.uuid)
                selected = true;

            // Calculate the new coordinates
            cords = this.calculateConnections(block1, block2),
                [x1, y1, x2, y2] = cords.pos,
                direction = cords.dir;

            // Remove the old line
            line.remove();
            
            // Construct a new line
            line = constructBezier([x1, y1, x2, y2], selected, block1);

            // Add the new line back
            this.connectionLayer.add(line);

            // Remove the old arrow
            arrow.remove();

            // Construct a new arrow
            arrow = constructArrow([x2, y2], direction);

            // Add the new arrow back
            this.connectionLayer.add(arrow);

            // Re-render the canvas
            this.connectionLayer.draw();
        }   

        reRender();
        
        // Draw a line between the two blocks on  update
        block1.block.on('dragmove', reRender);
        block2.block.on('dragmove', reRender);

        
        // We cant directly just use 'block.off' as we need
        // that event lister for other things.
        let clickable = true;
        block2.block.on('click', () => clickable === true ? reRender() : null);

        // Return a function to remove the connection
        return () => {
            line.remove();
            arrow.remove();

            clickable = false;

            block1.block.off('dragmove', reRender);
            block2.block.off('dragmove', reRender);

            this.connectionLayer.draw();
        }
    }

    private calculateDistance(a: ICords, b: ICords): number {
        return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
    }

    private calculateConnections(block1: BaseBlock, block2: BaseBlock): { pos: [number, number, number, number], dir: 1 | 2 | 3 | 4 } {

        // Get the coordinates of the two blocks
        const b1: ICords = block1.block.getPosition(),
            b2: ICords = block2.block.getPosition();

        // Get the width and height of the two blocks
        const b1w: number = block1.block.width(),
            b1h: number = block1.block.height(),
            b2w: number = block2.block.width(),
            b2h: number  = block2.block.height();

        // Block 1 Face Left middle
        const b1Left: ICords = { x: b1.x, y: b1.y + b1h / 2 },
            b1Right: ICords = { x: b1.x + b1w, y: b1.y + b1h / 2 },
            b1Top: ICords = { x: b1.x + b1w / 2, y: b1.y },
            b1Bottom: ICords = { x: b1.x + b1w / 2, y: b1.y + b1h };

        const b1LeftDist: number = this.calculateDistance(b1Left, b2),
            b1RightDist: number = this.calculateDistance(b1Right, b2),
            b1TopDist: number = this.calculateDistance(b1Top, b2),
            b1BottomDist: number = this.calculateDistance(b1Bottom, b2);

        // Calculate the closest point to the block2
        const closest: number = Math.min(b1LeftDist, b1RightDist, b1TopDist, b1BottomDist),
            desiredFlow = VisualConstants.flowDirection;

        let face = 0;

        if(closest === b1LeftDist) face = 1;
        else if(closest === b1RightDist) face = 2;
        else if(closest === b1TopDist) face = 3;
        else if(closest === b1BottomDist) face = 4;
        
        // If flow 
        face = desiredFlow === 0 ? face : desiredFlow;

        switch(face) {
            case 1: return { 
                pos: [b1.x, b1.y + b1h / 2, b2.x + b2w, b2.y + b2h / 2], 
                dir: 1 // Left
            };
    
            case 2: return { 
                pos: [b1.x + b1w, b1.y + b1h / 2, b2.x, b2.y + b2h / 2],
                dir: 2 // Right
            };
    
            case 3: return { 
                pos: [b1.x + b1w / 2, b1.y, b2.x + b2w / 2, b2.y + b2h],
                dir: 3 // Top
            };
    
            case 4: return { 
                pos: [b1.x + b1w / 2, b1.y + b1h, b2.x + b2w / 2, b2.y],
                dir: 4 // Bottom
            };
        }
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