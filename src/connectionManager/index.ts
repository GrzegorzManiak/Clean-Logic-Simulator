import Konva from 'Konva';
import Global from '../global';
import constructArrow from './src/constructArrow';
import calculateCords from './src/calculateCords';
import constructBezier from './src/constructBezier';
import intractableObject from '../interactableObject';

import { Basic } from '../types';

class ConnectionManager {
    private static instance: ConnectionManager;

    public readonly stage: Konva.Stage;
    public readonly layer: Konva.Layer = new Konva.Layer();
    public readonly global: Global = Global.getInstance();
    public readonly connectionLayer: Konva.Layer = new Konva.Layer();


    // TODO: Refactor how connections are stored
    public conections: Map<string, { block1: intractableObject, block2: intractableObject, removeConnection: () => void }> = new Map();


    // -- All the block that are currently being managed 
    //    by the connection manager.
    private blocks: Array<intractableObject> = [];
    public getBlocks = (): Array<intractableObject> => this.blocks;


    // -- Block that is first selected by the user
    private selectedParent: intractableObject;
    public getSelectedParent = (): intractableObject | undefined => this.selectedParent;
    private setSelectedParent = (value: intractableObject): void => { this.selectedParent = value };

    // -- Block that is second selected by the user
    private selectedChild: intractableObject;
    public getSelectedChild = (): intractableObject | undefined => this.selectedChild;
    private setSelectedChild = (value: intractableObject): void => { this.selectedChild = value };


    public static getInstance(stage: Konva.Stage): ConnectionManager {
        if(!ConnectionManager.instance) ConnectionManager.instance = new ConnectionManager(stage);
        return ConnectionManager.instance;
    }

    private constructor(stage: Konva.Stage) {
        this.stage = stage;

        // Make sure the connection layer isint listening
        // as its so much faster with listening off
        this.connectionLayer.listening(false);  

        // Add the connection layer to the stage
        this.stage.add(this.connectionLayer);

        // Add the layer to the stage
        this.stage.add(this.layer);

        // -- Dom click event listener to clear the selection
        document.addEventListener('click', () => {
            // -- Check if the user is hovering over a block
            if(this.global.hoveringOverBlock === true) return;

            // -- Clear any ongoing selection
            this.clearSelection();
        });
    }


    /**
     * @name snapAllToGrid
     * 
     * Snaps all blocks that are manged by the connection manager
     * to the grid, each block can decide if it should snap to the grid
     * or not.
     * 
     * @param {boolean} force Optional, if true, all blocks will snap to the grid, no matter what the block decides.
     */
    public snapAllToGrid(force: boolean = true): void {
        this.blocks.forEach(block => {
            // If force is true, make sure the block
            // is allowed to snap to the grid
            if(force === true)
                block.blockOpts.snapToGrid = true;
            
            // Snap the block to the grid
            block.snapToGrid();
        });
    }


    /**
     * @name getBlock()
     * 
     * Returns the block with the given uuid.
     * 
     * @param {string} uuid The uuid of the block to return.
     */
    public getBlock(uuid: string): intractableObject {
        return this.blocks.find(block => block.uuid === uuid);
    }


    /**
     * @name clearSelection
     * 
     * Clears any ongoing selection, deselecting both the parent and child block (if any).
    */
    public clearSelection(): void {
        const parent: intractableObject = this.getSelectedParent(),
            child: intractableObject = this.getSelectedChild();

        // -- If blocks exist, deselect them
        if(parent) parent.deselectBlock();
        if(child) child.deselectBlock();

        // -- Reset the selected blocks
        this.setSelectedParent(undefined);
        this.setSelectedChild(undefined);
    }


    /**
     * @name addBlock
     * 
     * Adds a block to the connection manager, allowing the intractableObject to 
     * accept connections, connect to other blocks allowing.
     * 
     * @param {intractableObject} object The block to add to the connection manager.
     */
    public addBlock(object: intractableObject): void {
        // -- Add the block to the list of blocks
        // TODO: Refactor how connections are stored
        this.blocks.push(object);

        // -- Add a click handler to the block
        object.block.on('click', () => this.clickHandler(object));

        // -- Set a global varibale depending if its being hoverd over
        object.block.on('mouseover', () => { this.global.hoveringOverBlock = true });
        object.block.on('mouseout', () => { this.global.hoveringOverBlock = false });
    }

    /**
     * @name findInCords
     * 
     * Finds the block that is located within the given cords.
     * 
     * @param xy1 The first point of the rectangle
     * @param xy2 The second point of the rectangle
     * 
     * @returns Array<intractableObject> The blocks that are located within the given cords.
     */
    public findInCords(xy1: Basic.ICords, xy2: Basic.ICords): Array<intractableObject> {
        // -- variables to store the blocks that are found
        let blocks: Array<intractableObject> = [];

        // -- Loop through all the blocks and check if they are in the cords
        this.blocks.forEach(block => {

            // -- Basic collision detection
            if(block.block.position().x + block.block.width() >= xy1.x &&
                block.block.position().x <= xy2.x &&
                block.block.position().y + block.block.height() >= xy1.y &&
                block.block.position().y <= xy2.y)

            // -- if the block is in the cords, add it to the list
            blocks.push(block);
        });

        // -- Return the list of blocks
        return blocks;
    }
    
    
    private clickHandler(block: intractableObject): void {
        /**
         * This function is called when the user clicks on a block.
         * 
         * It checks if a user has previously selected a block, if so,
         * it will connect the two blocks, if the two blocks are already
         * connected, it will disconnect them.
         * 
         * It also checks if the blocks are compatible.
         */
        
        // -- First block is selected, remember it and return.
        if (this.getSelectedParent() === undefined) {
            // Set the first selected block
            this.setSelectedParent(block);
            
            // Visualize the connection
            return block.selectBlock();
        }

        // -- Second block is selected, proceed to connect.
        else if (this.getSelectedChild() === undefined) {
            // Set the second selected block
            this.setSelectedChild(block);
        }

        // Since we now know that both blocks are selected,
        // we can declare them here to make it easier to read.
        const parent: intractableObject = this.getSelectedParent(),
            child: intractableObject = this.getSelectedChild();


        // Make sure that the user has two unique blocks selected
        if(parent.uuid === child.uuid) return this.clearSelection();


        // Make sure that the both block actually intake connections
        if(parent.canConntect === false ?? child.canConntect === false)
            return this.clearSelection();


        // Check if the blocks are already connected
        // TODO: Refactor this (Will be done when time comes to emulate sm logic)
        const UUID_ParentChild = `${parent.uuid}${child.uuid}`,
            UUID_ChildParent = `${child.uuid}${parent.uuid}`;

            
        // -- Is the parent coneted to the child? If so, disconnect them.
        if(this.conections.has(UUID_ParentChild)) {
            this.conections.get(UUID_ParentChild)?.removeConnection();
            this.conections.delete(UUID_ParentChild);

            return this.clearSelection();
        }
            
        // -- Is the child coneted to the parent? If so, disconnect them.
        if(this.conections.has(UUID_ChildParent)) {
            this.conections.get(UUID_ChildParent)?.removeConnection();
            this.conections.delete(UUID_ChildParent);

            return this.clearSelection();
        }


        // Add the connection to the map
        // TODO: Refactor this (Will be done when time comes to emulate sm logic)
        this.conections.set(UUID_ParentChild, {
            block1: parent, block2: child,
            removeConnection: this.drawConnection(parent, child).remove
        });


        // Remove the selected blocks
        this.clearSelection();
    }


    private getBlockInfo(block: intractableObject): Basic.IBlockInfo {
        return { x: block.block.position().x, y: block.block.position().y, width: block.block.width(), height: block.block.height() };
    }


    private drawConnection(block1: intractableObject, block2: intractableObject): Basic.TVisualConnectionInfo {
        /**
         * This function is responsible for drawing the connection between two blocks.
         * It calculates the connection points and draws the line between them + the arrow.
         * 
         * This function is only resonsible for drawing the connection, it does not 
         * handle any logic.
         */

        let cords = calculateCords(this.getBlockInfo(block1), this.getBlockInfo(block2)),
            direction = cords.dir;

        let line = constructBezier(cords.pos, true, block1, direction),
            arrow = constructArrow([cords.pos[2], cords.pos[3]], direction);

        const reRender = () => {
            let selected = false;
            
            const parent = this.getSelectedParent(),
                child = this.getSelectedChild();
                
            // -- Check if the block being selected is the current parent or child
            if(block1.uuid === parent?.uuid || block1.uuid === child?.uuid) selected = true;
            if(block2.uuid === parent?.uuid || block2.uuid === child?.uuid) selected = true;
            
            // -- Calculate the new coordinates for the block, and what face should be connected to
            cords = calculateCords(this.getBlockInfo(block1), this.getBlockInfo(block2)),
                direction = cords.dir;

            // -- Remove the old line, calculate the new line and add it back
            line.remove();
            line = constructBezier(cords.pos, selected, block1, direction);
            this.connectionLayer.add(line);

            // -- Remove the old arrow, calculate the new arrow and add it back
            arrow.remove();
            arrow = constructArrow([cords.pos[2], cords.pos[3]], direction);
            this.connectionLayer.add(arrow);

            // -- Update the connection layer
            this.connectionLayer.batchDraw();
        }   

        reRender();

        block1.block.on('dragmove', reRender);
        block2.block.on('dragmove', reRender);
        
        // We cant directly just use 'block.off' as we need
        // that event lister for other things.
        let clickable = true;


        block2.block.on('click', () => {
            if(clickable === true) reRender();
        });

        
        // -- Finally, return.
        return {
            remove: (): void => {
                // -- Remove the line and the arrow
                line.remove();
                arrow.remove();

                // -- Disable the click event
                clickable = false;

                // -- Stop listening for drag events
                block1.block.off('dragmove', reRender);
                block2.block.off('dragmove', reRender);

                // -- Remove the connection from the map
                this.conections.delete(`${block1.uuid}${block2.uuid}`);

                // -- Redraw the connection layer
                this.connectionLayer.batchDraw();
            },

            reRender,
            parent: block1,
            child: block2
        };
    }
}

export default ConnectionManager;