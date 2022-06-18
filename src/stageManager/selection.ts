import Konva from "konva";
import ConnectionManager from '../connectionManager/main';
import { SelectionConstants } from '../consts';

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
    let allowSelect = true;

    // Create a rectangle
    let selectionBox: Konva.Rect = rect(0, 0, 0, 0),
        dragBox: Konva.Rect = rect(0, 0, 0, 0);

    dragBox.opacity(0);

    // Add the selection box to the layer
    uiLayer.add(selectionBox);

    // Add the drag box to the layer
    uiLayer.add(dragBox);

    // Stage on mouse down
    stage.on('mousedown', (e: Konva.KonvaEventObject<MouseEvent>) => {
        // If the user is hovering over a block
        // Do not allow the selection box to be created as 
        // that will disallow the user from clicking on the block
        if(connectionManager.global.hoveringOverBlock === true) return;

        // If the user is currently moving a group of blocks
        // Do not allow the selection box to be created as
        // that would create a new selection box
        if(connectionManager.global.movingBlockSelection === true) return;

        allowSelect = true;
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
        stage.on('mousemove', (e: Konva.KonvaEventObject<MouseEvent>) => {
            if(allowSelect === false) return;

            // Get the mouse position
            const mousePos = stage.getPointerPosition();

            // Size
            const sizeX = mousePos.x - orginalX,
                sizeY = mousePos.y - orginalY;

            // X
            if(sizeX < 0) {
                // Move the box to the mouse
                selectionBox.x(mousePos.x);

                // Distance from the original mouse position
                const distanceX = Math.abs(orginalX - mousePos.x);

                // Set the width to the distance
                selectionBox.width(distanceX);

            } else {
                // Reset X
                selectionBox.x(orginalX);

                // Change the width
                selectionBox.width(sizeX);
            }

            // Y
            if(sizeY < 0) {
                // Move the box to the mouse
                selectionBox.y(mousePos.y);
                
                // Distance from the original mouse position
                const distanceY = Math.abs(orginalY - mousePos.y);

                // Set the height to the distance
                selectionBox.height(distanceY);

            } else {
                // Reset Y
                selectionBox.y(orginalY);

                // Change the height
                selectionBox.height(sizeY);
            }


            // Redraw the layer
            uiLayer.draw();
        });
    });

    // Stage on mouse up
    stage.on('mouseup', (e: Konva.KonvaEventObject<MouseEvent>) => {    
        // Stop following the mouse
        allowSelect = false;

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
        
        // loop through the blocks
        blocks.forEach(block => 
            // Set the block to selected
            block.getter().selectBlock());


        dragBox.on('mousedown', () => {

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
                connectionManager.global.movingBlockSelection = true;

                // Get the mouse position
                const mousePos = stage.getPointerPosition();

                // Move all the selected blocks
                blocks.forEach(block => {
                    const baseBlock = block.getter();

                    block.getter().block.position({
                        x: mousePos.x + baseBlock.dragOffset[0],
                        y: mousePos.y + baseBlock.dragOffset[1]
                    });

                    baseBlock.block.fire('dragmove');
                });
            });
        });


        dragBox.on('dragend', () => {
            // Remove the drag box
            dragBox.draggable(false);

            blocks.forEach(block => {
                connectionManager.global.movingBlockSelection = false;

                const baseBlock = block.getter();

                // Set the block to not selected
                baseBlock.deselectBlock();

                // Snap the block to the grid
                baseBlock.snapToGrid();
            });
        });
    });
}

export default addBoxSelection;