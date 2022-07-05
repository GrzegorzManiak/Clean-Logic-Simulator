import konva from 'konva';
import { promptLayer } from '../';
import { ThemeConstants, VisualConstants } from '../consts';

export interface IButtonPrompt {
    key: string;
    keyCode: number;
    text: string;
}

class ButtonPrompt {
    callback: () => void;
    prompt: IButtonPrompt;
    item: konva.Group | konva.Rect;

    constructor(item: konva.Group | konva.Rect, callback: () => void, input: IButtonPrompt) {
        this.callback = callback;
        this.item = item;
        this.prompt = input;

        this.enabled = true;

        this.render();
    }

    public disablePrompt: () => void;
    public enablePrompt: () => void;

    private enabled: boolean = false;
    
    private render(): void {
        // Create a rectangle
        const rectFunc = () => new konva.Rect({
            fill: ThemeConstants.promptColor,
            stroke: 'rgba(0, 0, 0, 0.2)',

            strokeWidth: VisualConstants.strokeWidth, 
            cornerRadius: ThemeConstants.promptBorderRadius,
        });

        // Create the key text
        const buttonKeyFunc = () => new konva.Text({
            text: this.prompt.key,
            fontStyle: 'bold',
            fill: ThemeConstants.fontColor,
            fontSize: ThemeConstants.fontPrimarySize,
            fontFamily: ThemeConstants.fontFamily,
        });

        // Create the text
        const buttonTextFunc = () => new konva.Text({
            text: this.prompt.text,
            fill: ThemeConstants.fontColor,
            fontSize: ThemeConstants.fontSecondarySize,
            fontFamily: ThemeConstants.fontFamily,
        });


        let key = buttonKeyFunc(),
            rect = rectFunc(),
            text = buttonTextFunc();

        this.disablePrompt = (): void => {
            rect.destroy();
            text.destroy();
            key.destroy();

            this.item.off('mousemove');

            promptLayer.batchDraw();
        }

        this.enablePrompt = (): void => {
            this.enabled = true;
        }
        
        this.item.on('mouseover', () => {
            key = buttonKeyFunc();
            rect = rectFunc();
            text = buttonTextFunc();

            const setXY = () => {
                // Position the rectangle right beneath the cursor
                // Get the cursor position
                const cursorPos = promptLayer.getStage().getPointerPosition();

                const x = cursorPos.x,
                    y = cursorPos.y;

                rect.x(x - (rect.width() / 2));
                rect.y(y + (rect.height() - ThemeConstants.promptPadding));

                // Adjust the size of the rectangle to
                // fit the text + 25% padding
                rect.width(key.width() + (ThemeConstants.promptPadding * 2));
                rect.height(key.height() + (ThemeConstants.promptPadding * 2));

                // Center the text in the rectangle
                // Account for the width of the text
                key.x(rect.position().x + (rect.width() / 2) - (key.width() / 2));
                key.y(rect.position().y + (rect.height() / 2) - (key.height() / 2));

                // center the text below the rectangle
                text.x(rect.position().x + (rect.width() / 2) - (text.width() / 2));
                text.y(rect.position().y + rect.height() + (ThemeConstants.promptPadding));
            }

            setXY();

            // Add the text and rectangle to the layer
            promptLayer.add(rect);
            promptLayer.add(text);
            promptLayer.add(key);

            // Track mouse movement
            document.addEventListener('mousemove', () => setXY());

            // Add the button listeners
            document.addEventListener('keydown', (e) => {
                if (e.keyCode === this.prompt.keyCode && this.enabled === true) {
                    this.enabled = false;
                    this.disablePrompt();
                    this.callback();
                }
            });

            // Draw the layer
            if(this.enabled === true) 
                promptLayer.batchDraw();
            
            else this.disablePrompt();
        });

        this.item.on('mouseout', () => this.disablePrompt());
    }
}

export default ButtonPrompt;