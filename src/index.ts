import konva from 'konva';
import BaseBlock from './blocks/baseBlock';
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

let grid = constructGrid(stage);

stage.add(grid);
stage.draw();

// Instantiate the connection manager
let cm: ConnectionManager = new ConnectionManager(stage);

// then create layer
let layer = new konva.Layer();

stage.add(layer);

// Manage movement
movementManager(stage);

// Register 2 blocks    
BlockRegistry.registerBlock({
    id: 'AND',
    size: {
        width: 75,
        height: 75
    },
    color: '#e6e6e6',
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

// Create the UI 
const blockBar = new BlockBar(stage, cm, layer);

function reDraw() {
    grid.remove();
    grid = constructGrid(stage);
    grid.zIndex(0);

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
    grid.zIndex(0);
    blockBar.render();
    stage.add(grid);
    stage.draw();
});