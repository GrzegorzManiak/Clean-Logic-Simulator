import konva from 'konva';
import ConnectionManager from './connectionManager/main';
import constructGrid from './stageManager/grid';
import movementManager from './stageManager/move';
import BlockBar from './ui/blockBar';
import BlockRegistry from './blocks/register';

// first we need to create a stage
let stage = new konva.Stage({
    container: 'canvas',   // id of container <div>
    width: window.innerWidth,
    height: window.innerHeight,
});



// Instantiate the connection manager
let cm: ConnectionManager = new ConnectionManager(stage);
cm.connectionLayer.listening(false);

// initialize the grid
let grid = constructGrid(stage);
grid.listening(false);

// then create the main layer
let layer = new konva.Layer();

stage.add(grid);
stage.add(cm.connectionLayer);
stage.add(layer);

const UIpromptLayer = new konva.Layer()

export const promptLayer = UIpromptLayer;
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
    
    stage.draw();
}

// Add a window resize listener
window.addEventListener('resize', () => reDraw());

stage.on('movementManager', () => {
    grid.remove();
    grid = constructGrid(stage);

    blockBar.render();

    stage.add(grid);
    stage.draw();
});