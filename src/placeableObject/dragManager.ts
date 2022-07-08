import Konva from "Konva";

// We need a custom drag manager as the 'draggable' functiionality provided
// by Konva does not provide the correct behaviour for our purposes.
// we need it for when 1 object is being dragged, another object is being
// moved while the first one stays still.
// This is used for the ghost block element.
class DragManager {
    private stage: Konva.Stage;
    readonly draggableObject: Konva.Rect;

    private listening: boolean = false;
    public setListening(listening: boolean): void { this.listening = listening; }
    public getListening(): boolean { return this.listening; }

    private mouseDown: boolean = false;
    public getMouseDown(): boolean { return this.mouseDown; }
    private setMouseDown(mouseDown: boolean): void { this.mouseDown = mouseDown; }

    private mouseOver: boolean = false;
    public getMouseOver(): boolean { return this.mouseOver; }
    private setMouseOver(mouseOver: boolean): void { this.mouseOver = mouseOver; }

    private dragging: boolean = false;
    public getDragging(): boolean { return this.dragging; }
    private setDragging(dragging: boolean): void { this.dragging = dragging; }

    public constructor(draggableObject: Konva.Rect) {
        this.stage = draggableObject.getStage();
        this.draggableObject = draggableObject;
        this.attatchHooks();
    }

    private attatchHooks(): void {
        // This checks if the mouse is clicked down on the object
        this.draggableObject.on('mousedown', () => this.setMouseDown(true));
        
        // This resets all the states once the mouse is released.
        this.stage.on('mouseup', () => {
            // -- Check if the user was previously
            //    Dragging an object
            if(this.getDragging() === true)
                this.execHooks(this.dragEndHooks);

            // reset all the states
            this.setMouseDown(false);
            this.setDragging(false);
            this.setMouseOver(false);
        });

        // Executed once when the mouse enters the object
        this.draggableObject.on('mouseenter', () => this.setMouseOver(true));

        this.stage.on('mousemove', () => {
            // If the mouse is down and the mouse is over the object
            if(this.getMouseDown() === false)
                return;

            if(this.getMouseOver() === false) 
                return;


            // -- Drag start
            if(this.getDragging() === false) {
                this.setDragging(true);
                this.execHooks(this.dragStartHooks);
            }

            // -- Currently dragging
            else this.execHooks(this.dragHooks);
        });
    }

    private execHooks(hooks: Array<() => any>): void {
        hooks.forEach(func => func());
    }

    private dragHooks: Array<() => any> = [];
    public hookOnDrag(func: () => any): void {
        this.dragHooks.push(func);
    }

    private dragEndHooks: Array<() => any> = [];
    public hookOnDragEnd(func: () => any): void {
        this.dragEndHooks.push(func);
    }
    
    private dragStartHooks: Array<() => any> = [];
    public hookOnDragStart(func: () => any): void {
        this.dragStartHooks.push(func);
    }
}

export default DragManager;