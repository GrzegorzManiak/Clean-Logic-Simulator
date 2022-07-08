import BlockRegistry from '../PlaceableObject/register';
import PlaceableObject from '../placeableObject/main';
import Konva from 'Konva';

function register(layer: Konva.Layer, stage: Konva.Stage) { 
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

    new PlaceableObject(stage, layer, BlockRegistry.getBlock('AND'), [0, 0]);   
    

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

    new PlaceableObject(stage, layer, BlockRegistry.getBlock('XOR'), [100, 0]);

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

    new PlaceableObject(stage, layer, BlockRegistry.getBlock('OR'), [200, 0]);

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

    new PlaceableObject(stage, layer, BlockRegistry.getBlock('NOT'), [300, 0]);
}

export default register;