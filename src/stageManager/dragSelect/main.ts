import Konva from "konva";
import Global from "../../global";
import trackMouse from './trackMouse';
import PlaceableObject from "../../placeableObject/main";
import ConnectionManager from '../../connectionManager/main';

import { SelectionConstants } from '../../options';

class Selection {
    private static instance: Selection;

    private static visibleBox: Konva.Rect = Selection.createBox();
    private static draggableBox: Konva.Rect = Selection.createBox();

    public static stage: Konva.Stage;
    public static layer: Konva.Layer;
    public static globals: Global;
    public static connectionManager: ConnectionManager;

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

    // { x, y }, { x, y }, Final size of the selection box
    private static selectionSize: [{ x: number, y: number }, { x: number, y: number }] = [{ x: 0, y: 0 }, { x: 0, y: 0 }];
    public static getSelectionSize = () => Selection.selectionSize;
    private static setSelectionSize = (value: [{ x: number, y: number }, { x: number, y: number }]) => Selection.selectionSize = value;

    // Array to store the blocks that are currently selected
    private static selectedBlocks: Array<PlaceableObject> = [];
    public static getSelectedBlocks = () => Selection.selectedBlocks;
    private static setSelectedBlocks = (value: Array<PlaceableObject>) => Selection.selectedBlocks = value;
    public static clearSelectedBlocks = () => { Selection.selectedBlocks = [] };

    private constructor(stage: Konva.Stage) { 
        
        Selection.instance = this;
        Selection.stage = stage;
        Selection.layer = new Konva.Layer();
        Selection.globals = Global.getInstance();
        Selection.connectionManager = ConnectionManager.getInstance(stage);

        // Add the boxes to the stage
        Selection.layer.add(Selection.visibleBox);
        Selection.layer.add(Selection.draggableBox);

        stage.add(Selection.layer);

        Selection.hookOntoMouse();
    }

    public static getInstance(stage: Konva.Stage) {
        if(!Selection.instance) new Selection(stage);
        return Selection.instance;
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
            if(Selection.canSelect === false || this.instantiateDrag() === false || this.globals.hoveringOverBlock === true)
                return this.resetSelection();

            // Set the visible boxes opacity to the global opacity
            Selection.visibleBox.opacity(SelectionConstants.transparency);

            // Allow the user to drag the visible box
            this.setMovingBlockSelection(true);
        });


        // this is when the users moves the mouse
        Selection.stage.on('mousemove', () => {
            console.log(this.globals)
            if(Selection.canSelect === false)
                return this.resetSelection();

            if(this.getMovingBlockSelection() === true) return trackMouse(
                this.stage, 
                Selection.visibleBox, 
                Selection.getLastOrigin(), 
                Selection.getSelectionSize, 
                Selection.setSelectionSize
            );
        });


        // This is when the user releases the mouse
        Selection.stage.on('mouseup', () => {
            // get all the sellected objects
            const objects = this.instantiateMove();

            objects.forEach((object) => {
                object.setDragChildren(objects);
                object.selectBlock();
            });
        });
    }

    private static instantiateMove(): Array<PlaceableObject> {

        Selection.setLastPoint(this.stage.getPointerPosition());
        
        // reset both boxes
        this.resetSelection();

        const currentSellection = Selection.connectionManager.findInCords(
            Selection.getLastOrigin(), 
            Selection.getLastPoint()
        );

        // Set the selected blocks to the current selection
        Selection.setSelectedBlocks(currentSellection);

        // return the current selection
        return currentSellection;
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

        Selection.draggableBox.draggable(false);

        Selection.setMovingBlockSelection(false);
    }
}

export default Selection;