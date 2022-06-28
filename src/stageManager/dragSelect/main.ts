import Konva from "konva";
import ConnectionManager from '../../connectionManager/main';
import beginSelection from './selection';

import { SelectionConstants } from '../../consts';

//TODO: Split the addBoxSelection function into multiple different functions
//     to make it easier to read and understand

const rect = (x: number, y: number, width: number, height: number) => new Konva.Rect({
    x,
    y,
    width,
    height,
    stroke: SelectionConstants.borderColor,
    strokeWidth: SelectionConstants.borderWidth,
    fill: SelectionConstants.color,
    opacity: SelectionConstants.transparency,
    cornerRadius: SelectionConstants.borderRadius
});

function addBoxSelection(uiLayer: Konva.Layer, connectionManager: ConnectionManager, stage: Konva.Stage) {
    // Im aiming for a windows esk style selection box
    // when you click and drag to select files and folders
    let allreadySelected = false;

    // Create a rectangle
    let selectionBox: Konva.Rect = rect(0, 0, 0, 0),
        dragBox: Konva.Rect = rect(0, 0, 0, 0);

    dragBox.opacity(0);

    // Add the selection box to the layer
    uiLayer.add(selectionBox);

    // Add the drag box to the layer
    uiLayer.add(dragBox);

    // Stage on mouse down
    stage.on('mousedown', () => {
        // If the user is hovering over a block
        // Do not allow the selection box to be created as 
        // that will disallow the user from clicking on the block
        if(connectionManager.global.hoveringOverBlock === true 
            || connectionManager.global.movingBlockSelection === true
            || allreadySelected === true) { 

            // Make the selection box invisible
            selectionBox.opacity(0);

            // Make the drag box invisible
            dragBox.opacity(0);

            return;
        }

        selectionBox.opacity(SelectionConstants.transparency);

        // Get the mouse position
        const mousePos = stage.getPointerPosition();

        // Set the selection box to the mouse position
        selectionBox.x(mousePos.x);
        selectionBox.y(mousePos.y);

        // Set the width and height to 0
        selectionBox.width(0);
        selectionBox.height(0);

        const orginalX = mousePos.x,
            orginalY = mousePos.y;

        // Set the stage to follow the mouse
        stage.on('mousemove', () => beginSelection(
            stage,
            selectionBox,
            { x: orginalX, y: orginalY }
        ));
    });


    // Stage on mouse up
    stage.on('mouseup', () => {    

        // Make the selection box invisible
        selectionBox.opacity(0);

        // Create the drag box, this will be used
        // to move the blocks around
        dragBox.x(selectionBox.x());
        dragBox.y(selectionBox.y());
        dragBox.width(selectionBox.width());
        dragBox.height(selectionBox.height());


        // Get the blocks in the selection box
        const blocks = connectionManager.bookKeeper.findInSelection(
            selectionBox.x(),
            selectionBox.y(),
            selectionBox.width() + selectionBox.x(),  
            selectionBox.height() + selectionBox.y()
        );

        // Do nothing if there are no blocks in the selection box
        if(blocks.length < 1)
            return;

        // loop through the blocks
        blocks.forEach(block => 
            // Set the block to selected
            block.getter().selectBlock());

        // When the user engages the drag box
        dragBox.on('mousedown', () => {
            allreadySelected = true;

            // Allow the draging of the selection box
            dragBox.draggable(true);
            
            // Get the mouse position
            const mousePos = stage.getPointerPosition();

            // loop through the blocks
            blocks.forEach(block =>
                // Set the blocks selection offset
                block.getter().dragOffset = [block.x - mousePos.x, block.y - mousePos.y]);
  
            // Move all the selected blocks to that of the selection box
            dragBox.on('dragmove', () => {
                // Get the mouse position
                const mousePos = stage.getPointerPosition();

                // Set the global var that the user is moving the selection box
                connectionManager.global.movingBlockSelection = true;

                // Move all the selected blocks
                blocks.forEach(block => {

                    // Get the block
                    const baseBlock = block.getter();

                    // Change the block position  
                    baseBlock.block.position({
                        x: mousePos.x + baseBlock.dragOffset[0],
                        y: mousePos.y + baseBlock.dragOffset[1]
                    });
                });
            });


            // When the user releases the drag box
            dragBox.on('dragend', () => {
                allreadySelected = false;
                
                // Remove the drag box
                dragBox.draggable(false);

                // Set the global 
                connectionManager.global.movingBlockSelection = false;
                
                // Loop through the blocks
                blocks.forEach(block => {
                    
                    // Get the block
                    const baseBlock = block.getter();
    
                    // Trigger renender of all 
                    baseBlock.block.fire('dragmove');
    
                    // Set the block to not selected
                    baseBlock.deselectBlock();
    
                    // Snap the block to the grid
                    // (Snap to grid checks if the block wants to snap to the grid)
                    baseBlock.snapToGrid();
                });

                // Remove the listeners  
                dragBox.off('dragend');
                dragBox.off('dragmove');
                dragBox.off('mousedown');
            });
        });
    });
}

export default addBoxSelection;