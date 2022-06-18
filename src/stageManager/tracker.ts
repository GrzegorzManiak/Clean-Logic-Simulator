// This here class is responsible for keeping track of all current blocks positions.
import ConnectionManager from '../connectionManager/main';
import BaseBlock from "../blocks/baseBlock";

interface IPos {
    x: number,
    y: number,
    width: number,
    height: number,
    getter: () => BaseBlock
}

class Tracker {
    cm: ConnectionManager;
    blocks: BaseBlock[] = [];
    positions: IPos[] = [];

    constructor(connectionManager: ConnectionManager) {
        this.cm = connectionManager;
    }

    public findInSelection(x1: number, y1: number, x2: number, y2: number): IPos[] {
        // Get the blocks that are in the selection
        let blocks: BaseBlock[] = this.blocks.filter(block => {
            let pos: IPos = this.positions.find(pos => pos.getter() === block);

            return (pos.x >= x1 && pos.x <= x2 && pos.y >= y1 && pos.y <= y2);
        });

        // Return the blocks
        let positions: IPos[] = blocks.map(block => {
            return {
                x: block.block.x(),
                y: block.block.y(),
                width: block.block.width(),
                height: block.block.height(),
                getter: () => block
            }
        });

        return positions;
    }

    public trackBlock(block: BaseBlock): void {
        // Add the block to the list of tracked blocks
        this.blocks.push(block);

        let pos: IPos = {
            x: block.block.x(),
            y: block.block.y(),
            width: block.block.width(),
            height: block.block.height(),
            getter: () => block
        };

        // Add the block to the positions list
        this.positions.push(pos);

        // Add a listener to the block
        block.block.on('dragmove', () => {
            // Update the position of the block
            pos.x = block.block.x();
            pos.y = block.block.y();
        });
    }
}

export default Tracker;