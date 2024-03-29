import konva from 'konva';

type unkFunc = <E>() => E | void;
type unkFuncArr = unkFunc[];

// We need a custom drag manager as the 'draggable' functiionality provided
// by konva does not provide the correct behaviour for our purposes.
// we need it for when 1 object is being dragged, another object is being
// moved while the first one stays still.
// This is used for the ghost block element.
class DragManager {
    private stage: konva.Stage;
    readonly draggableObject: konva.Node;

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

    public constructor(draggableObject: konva.Node, stage: konva.Stage) {
        this.stage = stage;
        this.draggableObject = draggableObject;
        this.attatchHooks();
    }

    /**
     * @name clearState
     * 
     * @description This function is used to clear all the states of the drag manager.  
     */
    public clearState(): void {
        this.setMouseDown(false);
        this.setDragging(false);
        this.setMouseOver(false);
    }
        

    private dragStartHooks: unkFuncArr = [];
    /**
     * @name hookOnDragStart
     * @description This function is used to hook onto when the user starts dragging the object.
     * @param func A function to be executed when the mouse is down on the object
     */
    public hookOnDragStart(func: unkFunc): void {
        this.dragStartHooks.push(func);
    }
    

    private dragEndHooks: unkFuncArr = [];
    /**
     * @name hookOnDragEnd
     * @description This function is used to hook onto when the user stops dragging the object.
     * @param func A function to be executed when the mouse is up on the object
     */
    public hookOnDragEnd(func: unkFunc): void {
        this.dragEndHooks.push(func);
    }


    private dragHooks: unkFuncArr = [];
    /**
     * @name hookOnDrag
     * @description This function is used to hook onto when the user is dragging the object.
     * @param func A function to be executed every time the mouse is moved while the object is being dragged
     */
    public hookOnDrag(func: unkFunc) : void {
        this.dragHooks.push(func);
    }


    private attatchHooks(): void {
        // -- Checks was the mouse over the object 
        // when the user pressed down on the mouse.
        this.draggableObject.on('mousedown', () => {
            if(this.getMouseOver() === true)
                this.setMouseDown(true);    

            else this.setMouseDown(false);
        });
        
        // This resets all the states once the mouse is released.
        this.stage.addEventListener('mouseup', () => {
            // -- Check if the user was previously
            //    Dragging an object
            if(this.getDragging() === true)
                this.execHooks(this.dragEndHooks);

            // reset all the states
            this.setMouseDown(false);
            this.setDragging(false);
        });


        // -- Executed once when the mouse enters the object
        this.draggableObject.addEventListener('mouseenter', () => this.setMouseOver(true));

        // -- Executed once when the mouse leaves the object
        this.draggableObject.addEventListener('mouseleave', () => this.setMouseOver(false));    


        // -- Main drag functionality   
        this.stage.addEventListener('mousemove', () => {
            // If the mouse is down and the mouse is over the object
            if(this.getMouseDown() === false)
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
}

export default DragManager;