import konva from 'konva';
import ConnectionManager from './connectionManager/main';
import constructGrid from './stageManager/grid';
import movementManager from './stageManager/scrollManager';
import BlockBar from './ui/blockBar';
import BlockRegistry from './PlaceableObject/register';
import addBoxSelection from './stageManager/dragSelect/main';
import Global from './global';
import Konva from 'konva';

// first we need to create a stage
let stage = new konva.Stage({
    container: 'canvas',   // id of container <div>
    width: window.innerWidth,
    height: window.innerHeight,
});

// initialize the grid
let grid = constructGrid(stage);
grid.listening(false);

// Instantiate the connection manager
let cm = new ConnectionManager(stage, new Global());
cm.connectionLayer.listening(false);

// then create the main layer
let layer = new konva.Layer();

stage.add(grid);
stage.add(cm.connectionLayer);
stage.add(layer);

const UIpromptLayer = new konva.Layer()

export const promptLayer = UIpromptLayer;

new addBoxSelection(stage, UIpromptLayer, cm.global, cm);
addBoxSelection.setCanSelect(true);

stage.add(UIpromptLayer); 

// Manage movement
movementManager(stage, [grid, cm.connectionLayer, layer]);

// Register 2 blocks    
BlockRegistry.registerBlock({
    id: 'AND',
    size: {
        width: 75,
        height: 75
    },
    color: '#2083fc',
    borderRadius: 10,
    borderWidth: 0,
    snapToGrid: true
});

BlockRegistry.registerBlock({
    id: 'XOR',
    size: {
        width: 75,
        height: 75
    },
    color: '#8320fc',
    borderRadius: 10,
    borderWidth: 0,
    snapToGrid: true
});

BlockRegistry.registerBlock({
    id: 'OR',
    size: {
        width: 75,
        height: 75
    },
    color: '#7bed9a',
    borderRadius: 10,
    borderWidth: 0,
    snapToGrid: true
});

BlockRegistry.registerBlock({
    id: 'NOT',
    size: {
        width: 75,
        height: 75
    },
    color: '#ff6b81',
    borderRadius: 10,
    borderWidth: 0,
    snapToGrid: true
});

// Create the UI 
const blockBar = new BlockBar(stage, cm, layer);

function reDraw() {
    grid.remove();
    grid = constructGrid(stage);
    grid.moveToBottom();

    blockBar.render();
    blockBar.blockLayer.moveToTop();
    stage.add(grid);

    stage.width(window.innerWidth);
    stage.height(window.innerHeight);
    
    stage.batchDraw();
}

// Add a window resize listener
window.addEventListener('resize', () => reDraw());

stage.on('movementManager', () => {
    grid.remove();
    grid = constructGrid(stage);
    stage.add(grid);

    blockBar.render();

    stage.batchDraw();
});

const targetFPS = 30,
    layers = [grid, cm.connectionLayer];

const pxrStep = 0.2;

// Async FPS counter based on the stage
new konva.Animation(frame => {

    if (frame.frameRate > targetFPS) {
        
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
}, [layer]).start(); 
