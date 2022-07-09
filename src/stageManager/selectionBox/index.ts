import Konva from "Konva";
import Global from "../../global";
import trackMouse from './src/trackMouse';
import intractableObject from "../../interactableObject";
import ConnectionManager from '../../connectionManager';

import { SelectionConstants } from '../../options';

class Selection {
    private static instance: Selection;

    private readonly box: Konva.Rect;

    public readonly stage: Konva.Stage;
    public readonly layer: Konva.Layer = new Konva.Layer();
    public readonly globals: Global = Global.getInstance();
    public readonly connectionManager: ConnectionManager;

    // Boolean that determines if the box can be instantiated
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

    // { x, y }, { x, y }, Final size of the selection box
    private static selectionSize: [{ x: number, y: number }, { x: number, y: number }] = [{ x: 0, y: 0 }, { x: 0, y: 0 }];
    public static getSelectionSize = () => Selection.selectionSize;
    private static setSelectionSize = (value: [{ x: number, y: number }, { x: number, y: number }]) => Selection.selectionSize = value;

    // Array to store the blocks that are currently selected
    private static selectedBlocks: Array<intractableObject> = [];
    public static getSelectedBlocks = () => Selection.selectedBlocks;
    private static setSelectedBlocks = (value: Array<intractableObject>) => Selection.selectedBlocks = value;
    public static clearSelectedBlocks = () => { Selection.selectedBlocks = [] };

    private constructor(stage: Konva.Stage) { 
        this.stage = stage;
        this.connectionManager = ConnectionManager.getInstance(stage);
        this.box = this.createBox();
        this.layer.add(this.box);
        stage.add(this.layer);
        this.hookOntoMouse();
    }

    public static getInstance(stage: Konva.Stage): Selection {
        if(!Selection.instance) new Selection(stage);
        return Selection.instance;
    }

    private cancleSelection() {
        const selected = Selection.getSelectedBlocks();

        selected.forEach((object) => {
            object.deselectBlock();
            object.resetDragSelection();
        });

        Selection.clearSelectedBlocks();
    }

    private createBox(): Konva.Rect {
        return new Konva.Rect({
            fill: SelectionConstants.color,
            stroke: SelectionConstants.borderColor,
            strokeWidth: SelectionConstants.borderWidth,
            cornerRadius: SelectionConstants.borderRadius,
            x: 0, y: 0, width: 0, height: 0, opacity: 0
        });
    }

    private hookOntoMouse() {

        // This is when the user clicks on the stage
        this.stage.on('mousedown', () => {
            // -- If the user is not hovering over a block, and thers blocks selected,
            if (this.globals.hoveringOverBlock === false && Selection.getSelectedBlocks().length > 0)
                this.cancleSelection();
                
            if(Selection.canSelect === false || this.instantiateDrag() === false || this.globals.hoveringOverBlock === true)
                return this.resetSelection();

            // Set the visible boxes opacity to the global opacity
            this.box.opacity(SelectionConstants.transparency);

            // Allow the user to drag the visible box
            Selection.setMovingBlockSelection(true);
        });


        // this is when the users moves the mouse
        this.stage.on('mousemove', () => {
            if(Selection.canSelect === false)
                return this.resetSelection();

            if(Selection.getMovingBlockSelection() === true) return trackMouse(
                this.stage, 
                this.box, 

                Selection.getLastOrigin(), 

                Selection.getSelectionSize, 
                Selection.setSelectionSize
            );
        });


        // This is when the user releases the mouse
        this.stage.on('mouseup', () => {
            // get all the sellected objects
            const objects = this.instantiateMove();

            objects.forEach((object) => {
                object.setDragChildren(objects);
                object.selectBlock();
            });
        });
    }

    private instantiateMove(): Array<intractableObject> {

        Selection.setLastPoint(this.stage.getPointerPosition());
        
        // reset both boxes
        this.resetSelection();

        const currentSellection = this.connectionManager.findInCords(
            Selection.getLastOrigin(), 
            Selection.getLastPoint()
        );

        // Set the selected blocks to the current selection
        Selection.setSelectedBlocks(currentSellection);

        // return the current selection
        return currentSellection;
    }

    private instantiateDrag(): boolean {
        // Is the user hovering over a block?
        // or is the user moving the selection box?
        // or are we even allowed to select?
        if (this.globals.hoveringOverBlock === true
            || Selection.getMovingBlockSelection() === true
            || Selection.getCanSelect() === false) {

            // set both boxes to invisible
            this.resetSelection();

            // Quit the function
            return false;
        }

        // Get the mouse position
        const mousePos = this.stage.getPointerPosition();

        // Set the visible box to the mouse position
        // reset the width and height to 0
        this.box.position(mousePos);
        this.box.size({ width: 0, height: 0 });
        
        // Set the lastOrigin to the mouse position
        Selection.setLastOrigin(mousePos);

        // Tell the rest of that class that we can select
        return true;
    }

    private resetSelection() {
        this.box.position({ x: 0, y: 0 });
        this.box.size({ width: 0, height: 0 });
        this.box.opacity(0);

        Selection.setMovingBlockSelection(false);
    }
}

export default Selection;