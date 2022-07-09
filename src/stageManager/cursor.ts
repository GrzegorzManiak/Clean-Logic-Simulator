import Konva from "Konva";
import Global from "../global";
import { Basic } from "../types";

class Cursor {
    private static instance: Cursor;
    public static readonly globals: Global = Global.getInstance();

    public readonly graphics: Basic.ICursorGraphics;
    private cursorImages: Basic.ICursorImages;
    public readonly cursorElm: HTMLSpanElement = document.createElement('span');
    public readonly rotationElm: HTMLSpanElement = document.createElement('span');
    public readonly options: Basic.ICursorOptions;
    public readonly stage: Konva.Stage;
    private offset: Basic.ICords;
    static readonly sides: Array<Basic.TSides> = ['top', 'right', 'bottom', 'left'];

    private constructor(stage: Konva.Stage, graphics: Basic.ICursorGraphics, options: Basic.ICursorOptions) {
        this.stage = stage;
        this.options = options;
        this.graphics = graphics;

        this.instantiateCursor();
    }

    public static getInstance(stage: Konva.Stage, graphics: Basic.ICursorGraphics, options: Basic.ICursorOptions): Cursor {
        if (!this.instance) new Cursor(stage, graphics, options);
        return this.instance;
    }

    private instantiateCursor(): void {
        let promises: Array<Promise<void>> = [],
            cursorImages: { [key: string]: HTMLImageElement } = {};

        let avgWidth: number = 0,
            avgHeight: number = 0;

        Object.keys(this.graphics).forEach((key: Basic.TSides) => {
            // Create a new promise for each image
            const cursorPromise: Promise<void> = new Promise((resolve, reject) => {
                
                // -- Get the image opts
                const imageOpts = this.graphics[key];   

                // -- Create a new image instance
                const image = new Image(imageOpts.size.width, imageOpts.size.height);

                // -- Add to the averages
                avgWidth += imageOpts.size.width;
                avgHeight += imageOpts.size.height;

                // -- Set the src of the image
                image.src = imageOpts.path;
                
                // -- Wait for the image to load
                image.onload = () => {
                    // -- Add the image to the cursorImages object
                    cursorImages[key] = image;

                    // -- Resolve the promise
                    return resolve();
                };
                
                // -- Reject the promise if the image fails to load
                image.onerror = () => reject(new Error("Image failed to load"));
            });

            // -- Add the promise to the promises array
            promises.push(cursorPromise);
        });

        // -- calculate the average width and height
        this.offset = {
            x: (avgWidth / 2) * this.options.scale,
            y: (avgHeight / 2) * this.options.scale
        }

        // -- Wait for all the promises to resolve
        Promise.all(promises).then(() => {

            // -- Set the cursorImages object (110% this is the correct way to do this)
            // TODO: Improve this
            this.cursorImages = cursorImages as unknown as Basic.ICursorImages;
            
            // -- Now that all the images are loaded, create the cursor
            return this.createCursor();

        }).catch(err => {
            console.error(err);
            // TODO: Fallback to a default cursor
        });
    }

    public setSegmentDistance(side: Basic.TSides, distance: number): void {
        const segment = this.cursorImages[side],
            options = this.graphics[side];

        switch (side) {
            case 'top': segment.style.transform = `translateY(${-distance + options.offset.y}px)`; break;
            case 'right': segment.style.transform = `translateX(${distance + options.offset.x}px)`; break;
            case 'bottom': segment.style.transform = `translateY(${distance + options.offset.y}px)`; break;
            case 'left': segment.style.transform = `translateX(${-distance + options.offset.x}px)`; break;
        }
    }

    public setDistance(distance: number): void {
        Cursor.sides.forEach((key: Basic.TSides) => {
            this.setSegmentDistance(key, distance);
        });
    }

    public hideRealCursor(): void {
        document.body.style.cursor = 'none';
    }   

    public showRealCursor(): void {
        document.body.style.cursor = 'default';
    }

    private createCursor(): any {
        // -- Set the cursorDiv id
        this.cursorElm.id = 'cursor';

        // -- For each side, create a new div and append it to the cursorDiv
        Object.keys(this.cursorImages).forEach((key: Basic.TSides) => {
            const segment = this.cursorImages[key],
                options = this.graphics[key];

                this.rotationElm.appendChild(segment);

            // -- Set the segment's distance
            this.setSegmentDistance(key, this.options.distance);

            segment.style.width = (options.size.width * this.options.scale) + 'px';
            segment.style.height = (options.size.height * this.options.scale) + 'px';
        });

        // -- Append the rotationElm to the cursorDiv
        this.cursorElm.appendChild(this.rotationElm);

        // -- Append the cursorDiv to the stage
        this.stage.content.appendChild(this.cursorElm);

        // -- hide the real cursor
        this.hideRealCursor();

        // -- Add a document listener to the cursorDiv
        document.addEventListener('mousemove', (e: MouseEvent) => this.updateCursor(e));
    }

    private updateCursor(e: MouseEvent): void {
        // -- Get the mouse position relative to the stage
        const mousePos = this.stage.getPointerPosition();

        // -- Calculate the new pos
        const x = mousePos.x - (this.offset.x / 4),
            y = mousePos.y - (this.offset.y / 4);

        // -- Set the cursorDiv's position
        let transform = `translate(${x}px, ${y}px)`,
            rotate = 0;


        // Different states that the cursor can be in //

        
        // -- Dragging blocks
        if(Cursor.globals.movingBlockSelection === true) {
            this.setDistance(this.options.draggingDistance);
            rotate = 45;
        }

        // -- Dragging block
        else if(Cursor.globals.movingBlock === true) {
            this.setDistance(this.options.draggingDistance);
            rotate = 0;
        }

        // -- Hovering over a block
        else if(Cursor.globals.hoveringOverBlock === true) {
            this.setDistance(this.options.hoveringDistance);
            rotate = 45;
        }
        
        // -- Default state
        else {
            this.setDistance(this.options.distance);
            rotate = 0;
        }


        // -- Set the cursorDiv's style
        this.cursorElm.style.transform = transform;
        this.rotationElm.style.transform = `rotate(${rotate}deg)`;
    }
}

export default Cursor;