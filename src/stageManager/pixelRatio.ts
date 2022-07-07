import Konva from 'konva';

// Singelton class for managing the pixel ratio
export class PixelRatio {   
    private static instance: PixelRatio;
    readonly anim: Konva.Animation;

    readonly layers: Array<Konva.Layer>;
    pxrStep: number = 0.2;
    targetFPS: number = 30;

    private constructor(layers: Array<Konva.Layer>, pxrStep: number = 0.2, targetFPS: number = 30) {

        this.layers = layers;
        this.pxrStep = pxrStep;
        this.targetFPS = targetFPS;

        // Async FPS counter based on the stage
        this.anim = new Konva.Animation(frame => {
     
            if (frame && frame.frameRate > targetFPS) {
                
                // time for frame is too big, decrease quality
                layers.forEach(x => {
                    // Get the canvas element
                    const xCanvas = x.getCanvas(),
                        xPxRatio = xCanvas.getPixelRatio();
    
                    // Calculate the new pixel ratio
                    const newPxRatio = Math.max(10, xPxRatio + pxrStep);
    
                    // Set the new pixel ratio
                    xCanvas.setPixelRatio(newPxRatio);
                });
                
            } else {
    
                // time for frame is too small, increase quality
                layers.forEach(x => {
                    // Get the canvas element
                    const xCanvas = x.getCanvas(),
                        xPxRatio = xCanvas.getPixelRatio();
    
                    // Calculate the new pixel ratio
                    const newPxRatio = Math.min(10, xPxRatio - pxrStep);
    
                    // Set the new pixel ratio
                    xCanvas.setPixelRatio(newPxRatio);
                });
            }
        }, layers).start(); 
    }

    public static getInstance(layers: Array<Konva.Layer>, pxrStep: number = 0.2, targetFPS: number = 30): PixelRatio {      
        if (!PixelRatio.instance)
            PixelRatio.instance = new PixelRatio(layers, pxrStep, targetFPS);
        
        return PixelRatio.instance;
    }
}

export default PixelRatio;