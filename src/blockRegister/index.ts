import BlockRegistry from '../connectionPoint/src/register';
import intractableObject from '../connectionPoint';
import ConnectionManager from '../connectionManager';
import konva from 'konva';

function register(stage: konva.Stage) { 
    const layer = ConnectionManager.getInstance(stage).layer;
    
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

    new intractableObject(stage, layer, BlockRegistry.getBlock('AND'), [50, 50]);   
    

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

    new intractableObject(stage, layer, BlockRegistry.getBlock('XOR'), [150, 50]);

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

    new intractableObject(stage, layer, BlockRegistry.getBlock('OR'), [250, 50]);

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

    new intractableObject(stage, layer, BlockRegistry.getBlock('NOT'), [350, 50]);
}

export default register;