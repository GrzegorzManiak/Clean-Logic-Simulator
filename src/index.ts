import konva from 'konva';
import ConnectionManager from './connectionManager/main';
import constructGrid from './stageManager/grid';
import movementManager from './stageManager/scrollManager';
import DragSelect from './stageManager/dragSelect/main';
import Register from './blocks/register';

// first we need to create a stage
let stage = new konva.Stage({
    container: 'canvas',   // id of container <div>
    width: window.innerWidth,
    height: window.innerHeight,
});

// initialize the grid
let grid = constructGrid(stage);

// Instantiate the connection manager
const cm = ConnectionManager.getInstance(stage);

// then create the main layer
const layer = new konva.Layer();

DragSelect.getInstance(stage);
DragSelect.setCanSelect(true);

stage.add(layer);

// Manage movement
movementManager(stage, [grid, cm.connectionLayer, layer]);

Register(layer, stage);

function reDraw() {
    grid.remove();
    grid = constructGrid(stage);

    stage.width(window.innerWidth);
    stage.height(window.innerHeight);

    stage.draw();
}

stage.on('movementManager', () => {
    grid.remove();
    grid = constructGrid(stage);
});

// Add a window resize listener
window.addEventListener('resize', () => reDraw());