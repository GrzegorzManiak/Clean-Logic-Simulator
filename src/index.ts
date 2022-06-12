import konva from 'konva';
import BaseBlock from './logic/baseBlock';
import ConnectionManager from './connectionManager/main';
import constructGrid from './stageManager/grid';
import scrollManager from './stageManager/scroll';

// first we need to create a stage
let stage = new konva.Stage({
    container: 'canvas',   // id of container <div>
    width: window.innerWidth,
    height: window.innerHeight,
});

let grid = constructGrid(stage);

stage.add(grid);
stage.draw();

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
stage.on('scrollManager', () => {
    grid.remove();
    grid = constructGrid(stage);
    grid.zIndex(0);

    stage.add(grid);
    stage.draw();
});

// Instantiate the connection manager
let cm: ConnectionManager = new ConnectionManager(stage);

// then create layer
let layer = new konva.Layer();
layer.zIndex(10);

// Manage scroll 
scrollManager(stage);

let block: BaseBlock = new BaseBlock(cm, stage, layer, {
    id: 'block1',
    type: 'AND',
    coordinates: {
        x: 100,
        y: 100
    },
    size: {
        width: 75,
        height: 75
    },
    color: '#e6e6e6',
    borderRadius: 10,
    borderWidth: 0,
    borderColor: '#292929',

    snapToGrid: true
});

block.startMove();


let block2: BaseBlock = new BaseBlock(cm, stage, layer, {
    id: 'block21',
    type: 'AND',
    coordinates: {
        x: 100,
        y: 100
    },
    size: {
        width: 75,
        height: 75
    },
    color: '#442226',
    borderRadius: 10,
    borderWidth: 0,
    borderColor: '#292929',

    snapToGrid: true
});

block2.startMove();



let block3: BaseBlock = new BaseBlock(cm, stage, layer, {
    id: 'block3',
    type: 'AND',
    coordinates: {
        x: 100,
        y: 100
    },
    size: {
        width: 75,
        height: 75
    },
    color: '#555556',
    borderRadius: 10,
    borderWidth: 0,
    borderColor: '#292929',

    snapToGrid: true
});

block3.startMove();
