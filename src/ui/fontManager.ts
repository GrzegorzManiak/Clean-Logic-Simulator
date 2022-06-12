// https://konvajs.org/docs/sandbox/Custom_Font.html
import konva from 'konva';

function processText(konvaText: konva.Text) {
    let isFontLoaded = false,
        initialWidth = konvaText.getTextWidth();

    function whenFontIsLoaded(callback: Function, attemptCount?: number) {
        if (attemptCount === undefined)
            attemptCount = 0;
        
        if (attemptCount >= 20)
            return callback()
        
        if (isFontLoaded === true)
            return callback();
    
        const metrics = konvaText.getTextWidth(),
            width = metrics;
    
        if (width !== initialWidth) {
            isFontLoaded = true;
            callback();
        }
        
        else setTimeout(whenFontIsLoaded(callback, attemptCount + 1), 1000);
    }

    whenFontIsLoaded(() => konvaText.fontFamily('Nunito'));
}

export default processText;