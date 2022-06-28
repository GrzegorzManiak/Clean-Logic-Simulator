import Konva from "konva";
import ConnectionManager from '../../connectionManager/main';
import trackMouse from './trackMouse';
import Global from "../../global";

import { SelectionConstants } from '../../consts';

//TODO: Split the addBoxSelection function into multiple different functions
//     to make it easier to read and understand

//     // Stage on mouse up
//     stage.on('mouseup', () => {    

//         // Make the selection box invisible
//         selectionBox.opacity(0);

//         // Create the drag box, this will be used
//         // to move the blocks around
//         dragBox.x(selectionBox.x());
//         dragBox.y(selectionBox.y());
//         dragBox.width(selectionBox.width());
//         dragBox.height(selectionBox.height());


//         // Get the blocks in the selection box
//         const blocks = connectionManager.bookKeeper.findInSelection(
//             selectionBox.x(),
//             selectionBox.y(),
//             selectionBox.width() + selectionBox.x(),  
//             selectionBox.height() + selectionBox.y()
//         );

//         // Do nothing if there are no blocks in the selection box
//         if(blocks.length < 1)
//             return;

//         // loop through the blocks
//         blocks.forEach(block => 
//             // Set the block to selected
//             block.getter().selectBlock());

//         // When the user engages the drag box
//         dragBox.on('mousedown', () => {
//             allreadySelected = true;

//             // Allow the draging of the selection box
//             dragBox.draggable(true);
            
//             // Get the mouse position
//             const mousePos = stage.getPointerPosition();

//             // loop through the blocks
//             blocks.forEach(block =>
//                 // Set the blocks selection offset
//                 block.getter().dragOffset = [block.x - mousePos.x, block.y - mousePos.y]);
  
//             // Move all the selected blocks to that of the selection box
//             dragBox.on('dragmove', () => {
//                 // Get the mouse position
//                 const mousePos = stage.getPointerPosition();

//                 // Set the global var that the user is moving the selection box
//                 connectionManager.global.movingBlockSelection = true;

//                 // Move all the selected blocks
//                 blocks.forEach(block => {

//                     // Get the block
//                     const baseBlock = block.getter();

//                     // Change the block position  
//                     baseBlock.block.position({
//                         x: mousePos.x + baseBlock.dragOffset[0],
//                         y: mousePos.y + baseBlock.dragOffset[1]
//                     });
//                 });
//             });


//             // When the user releases the drag box
//             dragBox.on('dragend', () => {
//                 allreadySelected = false;
                
//                 // Remove the drag box
//                 dragBox.draggable(false);

//                 // Set the global 
//                 connectionManager.global.movingBlockSelection = false;
                
//                 // Loop through the blocks
//                 blocks.forEach(block => {
                    
//                     // Get the block
//                     const baseBlock = block.getter();
    
//                     // Trigger renender of all 
//                     baseBlock.block.fire('dragmove');
    
//                     // Set the block to not selected
//                     baseBlock.deselectBlock();
    
//                     // Snap the block to the grid
//                     // (Snap to grid checks if the block wants to snap to the grid)
//                     baseBlock.snapToGrid();
//                 });

//                 // Remove the listeners  
//                 dragBox.off('dragend');
//                 dragBox.off('dragmove');
//                 dragBox.off('mousedown');
//             });
//         });
//     });
// }


class Selection {
    private static instance: Selection;

    private static visibleBox: Konva.Rect = Selection.createBox();
    private static draggableBox: Konva.Rect = Selection.createBox();


    public static stage: Konva.Stage;
    public static uiLayer: Konva.Layer;
    public static globals: Global;


    // Boolean that determines if the visibleBox can be instantiated
    private static canSelect: boolean = false;
    public static getCanSelect = () => Selection.canSelect;
    public static setCanSelect = (value: boolean) => Selection.canSelect = value;


    // Boolean that determines if the user is moving the draggableBox
    private static movingBlockSelection: boolean = false;
    public static getMovingBlockSelection = () => Selection.movingBlockSelection;
    private static setMovingBlockSelection = (value: boolean) => Selection.movingBlockSelection = value;


    // { x, y }, lastOrigin of the selection box in the stage
    private static lastOrigin: { x: number, y: number } = { x: 0, y: 0 };
    public static getLastOrigin = () => Selection.lastOrigin;
    private static setLastOrigin = (value: { x: number, y: number }) => Selection.lastOrigin = value;  

    // { x, y }, finalPoint of the selection box
    private static lastPoint: { x: number, y: number } = { x: 0, y: 0 };
    public static getLastPoint = () => Selection.lastPoint;
    private static setLastPoint = (value: { x: number, y: number }) => Selection.lastPoint = value;  


    public constructor(stage: Konva.Stage, uiLayer: Konva.Layer, globals: Global) { 
        if(Selection.instance)
            throw new Error('Selection class can only be instanciated once');
        
        Selection.instance = this;
        Selection.stage = stage;
        Selection.uiLayer = uiLayer;
        Selection.globals = globals;

        // Add the boxes to the stage
        uiLayer.add(Selection.visibleBox);
        uiLayer.add(Selection.draggableBox);

        Selection.hookOntoMouse();
    }

    private static createBox(): Konva.Rect {
        return new Konva.Rect({
            fill: SelectionConstants.color,
            stroke: SelectionConstants.borderColor,
            strokeWidth: SelectionConstants.borderWidth,
            cornerRadius: SelectionConstants.borderRadius,
            x: 0, y: 0, width: 0, height: 0, opacity: 0
        });
    }

    private static hookOntoMouse() {
        // This is when the user clicks on the stage
        Selection.stage.on('mousedown', () => {
            if(!Selection.canSelect || this.instantiateDrag() === false)
                return;

            // Set the visible boxes opacity to the global opacity
            Selection.visibleBox.opacity(SelectionConstants.transparency);

            // Allow the user to drag the visible box
            this.setMovingBlockSelection(true);
        });


        // this is when the users moves the mouse
        Selection.stage.on('mousemove', () => {
            if(this.getMovingBlockSelection() === true) 
                return trackMouse(this.stage, Selection.visibleBox, Selection.getLastOrigin());
        });


        // This is when the user releases the mouse
        Selection.stage.on('mouseup', () => {
            if(this.getMovingBlockSelection() === false)
                return;

            // set the last point to the current mouse position
            Selection.setLastPoint(this.stage.getPointerPosition());

            // reset both boxes
            this.resetSelection();

            // Console log orgin and point
            console.log(Selection.getLastOrigin(), Selection.getLastPoint());
        });
    }

    private static instantiateDrag(): boolean {
        // Is the user hovering over a block?
        // or is the user moving the selection box?
        // or are we even allowed to select?
        if (Selection.globals.hoveringOverBlock === true
            || this.getMovingBlockSelection() === true
            || this.getCanSelect() === false) {

            // set both boxes to invisible
            this.resetSelection();

            // Quit the function
            return false;
        }

        // Get the mouse position
        const mousePos = Selection.stage.getPointerPosition();

        // Set the visible box to the mouse position
        // reset the width and height to 0
        Selection.visibleBox.position(mousePos);
        Selection.visibleBox.size({ width: 0, height: 0 });
        
        // Set the lastOrigin to the mouse position
        Selection.setLastOrigin(mousePos);

        // Tell the rest of that class that we can select
        return true;
    }

    private static resetSelection() {
        Selection.visibleBox.position({ x: 0, y: 0 });
        Selection.visibleBox.size({ width: 0, height: 0 });
        Selection.visibleBox.opacity(0);

        Selection.draggableBox.position({ x: 0, y: 0 });
        Selection.draggableBox.size({ width: 0, height: 0 });
        Selection.draggableBox.opacity(0);

        Selection.setMovingBlockSelection(false);
    }
}

export default Selection;