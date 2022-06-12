import BaseBlock from "../blocks/baseBlock";
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

    connections: Array<{
        parent: BaseBlock,
        child: BaseBlock
    }> = [];

    connectionLayer: konva.Layer;

    constructor(canvas: konva.Stage) {
        this.connectionLayer = new konva.Layer();
        canvas.add(this.connectionLayer);   

        this.canvas = canvas;
        this.canvas.setZIndex(5);
    }

    public getBlock(id: string): BaseBlock {
        return this.blocks.find(block => block.blockOpts.id === id);
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

    public selectedBlock1: BaseBlock;
    public selectedBlock2: BaseBlock;

    private clickHandler(block?: BaseBlock): void {
        if (this.selectedBlock1 === undefined) 
            this.selectedBlock1 = block;

        else if (this.selectedBlock2 === undefined) 
            this.selectedBlock2 = block;


        // Check if the blocks are the same
        if(this?.selectedBlock1?.blockOpts?.id === this?.selectedBlock2?.blockOpts?.id)
            return this.deselectAll();


        // check if Block 1 can have connections
        if(this.selectedBlock1.canConntect === false)
            return this.deselectAll();

        // Visualize the connection
        this.visualizeConnection();

        // check if Block 2 can have connections
        if(this.selectedBlock2.canBeConnected === false)
            return this.deselectAll();


        // If everything is good, visualize the connection
        // and add it to the connections array
        this.connections.push({
            parent: this.selectedBlock1,
            child: this.selectedBlock2
        });


        // Visualize the connection
        this.visualizeConnection();
    }

    private deselectAll(): void {
        if(this.selectedBlock1 !== undefined)
            this.unglow(this.selectedBlock1);

        if(this.selectedBlock2 !== undefined)
            this.unglow(this.selectedBlock2);

        this.selectedBlock1 = undefined;
        this.selectedBlock2 = undefined;
    }

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

    private visualizeConnection(): void {
        if (this.selectedBlock1 !== undefined)
            this.glow(this.selectedBlock1);

        if (this.selectedBlock2 !== undefined)
            this.glow(this.selectedBlock2);

        // If bothe blocks are selected, draw a line between them
        if (this.selectedBlock1 !== undefined && this.selectedBlock2 !== undefined) {
            // Draw a line between the two blocks
            this.drawConnection(this.selectedBlock1, this.selectedBlock2);

            // Unglow both blocks
            this.unglow(this.selectedBlock1);
            this.unglow(this.selectedBlock2);

            // Reset the selected blocks
            this.selectedBlock1 = undefined;
            this.selectedBlock2 = undefined;
        }
    }

    private drawConnection(block1: BaseBlock, block2: BaseBlock): void {
        let getCords = (): [number, number, number, number] => {
            // A rectangle has 4 sides, we want to draw a line from the
            // center of one of these sides to the center of the other
            // choose a side that is perpendicular to the other side

            // Get the coordinates of the two blocks
            const b1 = block1.block.getPosition(),
                b2 = block2.block.getPosition();

            const scale = this.canvas.scale();

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

        let [x1, y1, x2, y2] = getCords();

        let line = constructBezier([x1, y1, x2, y2]),
            arrow = constructArrow([x2, y2], 'right');

        const reRender = () => {
            [x1, y1, x2, y2] = getCords();

            line.remove();
            
            line = constructBezier([x1, y1, x2, y2]);

            this.connectionLayer.add(line);
            this.connectionLayer.draw();

            arrow.remove();
            arrow = constructArrow([x2, y2], 'right');

            this.connectionLayer.add(arrow);
            this.connectionLayer.draw();
        }   

        reRender();

        // Draw a line between the two blocks on  update
        block1.block.on('dragmove', reRender);
        block2.block.on('dragmove', reRender);
    }

    addBlock(block: BaseBlock): void {
        this.blocks.push(block);

        block.block.on('click', () => {
            this.clickHandler(block);
        });
    }
}

export default ConnectionManager;