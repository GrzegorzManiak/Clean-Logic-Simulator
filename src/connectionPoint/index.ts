import konva from 'konva';
import ConnectionManager from '../connectionManager';
import DragManager from '../stageManager/dragManager';
import Global from '../global';
import connectionPoint from '../connection/node'
import { GridConstants, VisualConstants } from '../options';
import { CanvasTypes, Basic } from '../types';

export interface ILineRef {
    block: intractableObject,
    removeConnection: () => void,
}

// TODO: Needs a refactor
class intractableObject {
    public block: konva.Rect;
    public ghost: konva.Rect;

    public selectionOffset: [number, number] = [0, 0];
    public dragOffset: Basic.ICords = { x: 0, y: 0 };
    
    readonly stage: konva.Stage;
    readonly layer: konva.Layer;
    readonly cm: ConnectionManager;
    readonly blockOpts: CanvasTypes.IBlock;
    readonly uuid: string;
    readonly dragMannager: DragManager;
    readonly canBeConnected: boolean = false;
    readonly canConntect: boolean = false;

    public static readonly Globals: Global = Global.getInstance();
    
    constructor(stage: konva.Stage, layer: konva.Layer, block: CanvasTypes.IBlock, cords: [number, number]) {
        this.stage = stage;
        this.layer = layer;
        this.blockOpts = block;
        this.drawBlock(block, cords);
        this.cm = ConnectionManager.getInstance(stage);
        this.cm.addBlock(this);
        this.snapToGrid();

        // Calculate the uuid, completely random string modified by microseconds
        // used to identify the block
        this.uuid = `${Math.random().toString(36).substring(2, 15)}-${Date.now()}-${block.id}`;
        this.dragMannager = new DragManager(this.block, this.stage);
        this.drag();
    }

    private dragChildren: Array<intractableObject> = [];
    public setDragChildren = (children: Array<intractableObject>) => { this.dragChildren = children };
    public resetDragSelection = (): void => { this.dragChildren = [] };
    public getDragChildren = (): Array<intractableObject> => this.dragChildren; 

    public dragEndHooks: Array<() => any> = [];

    private drag(): void { 
        // -- Start
        this.dragMannager.hookOnDragStart(() => {
            // Don nothing if no blocks are selected
            if(this.getDragChildren().length === 0)
                this.setDragChildren([this]);
            
            this.getDragChildren().forEach(elm => { 
                // Show the ghosted block
                elm.showGhost();

                // get the relative offset from the mouse
                elm.dragOffset = elm.block.getRelativePointerPosition();
            });

            // -- Global drag end state
            intractableObject.Globals.movingBlock = true;
        });

        // -- Dragging
        this.dragMannager.hookOnDrag(() => {
            // Get the current possition of the mouse
            const pos = this.layer.getRelativePointerPosition();

            this.getDragChildren().forEach(elm => {
                // Offset the position of the mouse and set the new pos
                elm.ghost.position({
                    x: pos.x - elm.dragOffset.x,
                    y: pos.y - elm.dragOffset.y
                });
            });
        });
        
        // -- End
        this.dragMannager.hookOnDragEnd(() => {
            this.getDragChildren().forEach(elm => {
                // Set the position of the block to that of 
                // where the ghost was
                elm.block.position(elm.ghost.position());

                // Hide the ghost as we dont need it anymore
                elm.hideGhost();

                // snap the block to the grid
                elm.snapToGrid();

                // Reset the selection
                elm.resetDragSelection();

                // Deselect the block
                elm.deselectBlock();

                // Force the connection manager to redraw the connections
                elm.block.fire('dragmove');
            });

            // -- Global drag end state
            intractableObject.Globals.movingBlock = false;
        });
    }

    public selectBlock(): void {
        this.block.shadowColor(this.blockOpts.color);
        this.block.shadowBlur(10);
        this.block.shadowOffset({ x: 0, y: 0 });
        this.block.shadowOpacity(0.5);
        this.block.stroke('rgba(0, 0, 0, 0.2)');
        this.block.strokeWidth(VisualConstants.strokeWidth);
        this.layer.batchDraw();
    }

    public deselectBlock(): void {
        this.block.shadowColor('rgba(0, 0, 0, 0)');
        this.block.shadowBlur(0);
        this.block.shadowOffset({ x: 0, y: 0 });
        this.block.shadowOpacity(0);
        this.block.stroke('rgba(0, 0, 0, 0)');
        this.block.strokeWidth(0);
        this.layer.batchDraw();
    }

    public drawBlock(block: CanvasTypes.IBlock, cords: [number, number]): void {
        this.block = new konva.Rect({
            cornerRadius: block.borderRadius,
            x: cords[0],
            y: cords[1],
            width: block.size.width,
            height: block.size.height,
            fill: block.color,
            stroke: 'rgba(0, 0, 0, 0.2)',
            strokeWidth: block.borderWidth,
        });

        this.ghost = this.block.clone();
        this.ghost.opacity(0.5);

        // Add the block to the layer
        this.layer.add(this.block);     
        this.layer.add(this.ghost);

        new connectionPoint({
            mode: 'input',
            maxConnections: 255,
            offSet: { x: 0, y: 0 },
            size: { width: 40, height: 40 },
            master: this.block,
        });

        // Hide the ghost
        this.hideGhost();
    }

    public showGhost(): void {
        this.ghost.show();
        this.ghost.moveToTop();

        const blockPos = this.block.position();
        this.ghost.position(blockPos);
    }

    public hideGhost(): void {
        this.ghost.hide();
    }

    // Array of blocks that are taking in
    // connections from this block. Block -> Child
    public child: Array<ILineRef> = [];
    public addChild(child: ILineRef): void { this.child.push(child); }
    public getChild(block: intractableObject): ILineRef {
        for (let i = 0; i < this.child.length; i++) {
            if (this.child[i].block.uuid === block.uuid)
                return this.child[i];
        }
    }
    public removeChild(child: ILineRef): void { this.child.splice(this.child.indexOf(child), 1); }

    // Array of blocks that are connected
    // to this block. Parent -> Block
    public parent: Array<ILineRef> = [];
    public addParent(parent: ILineRef): void { this.parent.push(parent); }
    public getParent(block: intractableObject): ILineRef {
        for (let i = 0; i < this.parent.length; i++) {
            if (this.parent[i].block.uuid === block.uuid)
                return this.parent[i];
        }
    }
    public removeParent(parent: ILineRef): void { this.parent.splice(this.parent.indexOf(parent), 1); }

    // This function checks if a block is a parent of the block
    // that is being passed in
    public isConnectedTo(block: intractableObject): boolean {
        const blockID = block.uuid;

        // Check if the block is a child of this block
        for (let i = 0; i < this.child.length; i++) {
            if (this.child[i].block.uuid === blockID)
                return true;
        }

        return false;
    }


    public snapToGrid(rect: konva.Rect = this.block): void {
        // Dose this block have snapToGrid enabled?
        if (this.blockOpts.snapToGrid === false)
            return;

        // Grid starts at 0,0
        const curX = rect.x(),
            curY = rect.y();

        const gridX = Math.round(curX / GridConstants.gridSize) * GridConstants.gridSize,
            gridY = Math.round(curY / GridConstants.gridSize) * GridConstants.gridSize;

        // Trigger the dragmove event
        rect.x(gridX);
        rect.y(gridY);
    }
}

export default intractableObject;
