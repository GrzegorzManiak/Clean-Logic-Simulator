import Konva from 'Konva';
import ConnectionManager from './connectionManager';
import constructGrid from './stageManager/gridManager';
import movementManager from './stageManager/scrollManager';
import DragSelect from './stageManager/selectionBox';
import Register from './blockRegister';
import Cursor from './stageManager/cursor';

import SettingUI from './userInterface/settings';
import Localization from './localization';

// first we need to create a stage
let stage = new Konva.Stage({
    container: 'canvas',   // id of container <div>
    width: window.innerWidth,
    height: window.innerHeight,
});


// 
// Functions that need to run after the localization is loaded
// 

// -- Load the settings UI
SettingUI.getInstance(stage);

// -- initialize the grid
let grid = constructGrid(stage);

// -- Instantiate the connection manager
const cm = ConnectionManager.getInstance(stage);

// -- Manage movement
movementManager(stage, [grid, cm.connectionLayer, cm.layer]);

// -- Register blocks
Register(stage);

// -- Cursor -- //
const scale = 0.06;

const horWidth = 205, horHeight = 127;
const verWidth = 127, verHeight = 205;

const horOffset = (verHeight * scale) / 4, 
    verOffset = (horHeight * scale) / 4;

// -- Instantiate the Cursor
Cursor.getInstance(stage, {
    top: {
        path: '../graphics/cursor/up.png',
        size: { width: horWidth, height: horHeight },
        offset: { x: 0, y: horOffset }
    },
    bottom: {
        path: '../graphics/cursor/down.png',
        size: { width: horWidth, height: horHeight },
        offset: { x: 0.5, y: horOffset - 1.5 }
    },
    left: {
        path: '../graphics/cursor/left.png',
        size: { width: verWidth, height: verHeight },
        offset: { x: verOffset + 1.5, y: 0 }
    },
    right: {
        path: '../graphics/cursor/right.png',
        size: { width: verWidth, height: verHeight },
        offset: { x: verOffset - 0.5, y: 0 }
    }
}, {
    scale, 
    rotation: 0,
    distance: 13,
    selectionDistance: 10,
    draggingDistance: 10,
    hoveringDistance: 15
});

DragSelect.getInstance(stage);
DragSelect.setCanSelect(true);

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
