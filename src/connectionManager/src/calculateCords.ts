import { VisualConstants } from '../../options';
import { Basic } from '../../types';

function calculateDistance(a: Basic.ICords, b: Basic.ICords): number {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

function calculateConnections(block1: Basic.IBlockInfo, block2: Basic.IBlockInfo): Basic.TConnection {

    const b1Left: Basic.ICords = { x: block1.x, y: block1.y + block1.height / 2 },
        b1Right: Basic.ICords = { x: block1.x + block1.width, y: block1.y + block1.height / 2 },
        b1Top: Basic.ICords = { x: block1.x + block1.width / 2, y: block1.y },
        b1Bottom: Basic.ICords = { x: block1.x + block1.width / 2, y: block1.y + block1.height };

    const b2Center = { x: block2.x + block2.width / 2, y: block2.y + block2.height / 2 };

    const b1LeftDist: number = calculateDistance(b1Left, b2Center),
        b1RightDist: number = calculateDistance(b1Right, b2Center),
        b1TopDist: number = calculateDistance(b1Top, b2Center),
        b1BottomDist: number = calculateDistance(b1Bottom, b2Center);

    // Calculate the closest point to the block2
    const closest: number = Math.min(b1LeftDist, b1RightDist, b1TopDist, b1BottomDist),
        desiredFlow = VisualConstants.flowDirection;

    let face = 0;

    if(closest === b1LeftDist) face = 1;
    else if(closest === b1RightDist) face = 2;
    else if(closest === b1TopDist) face = 3;
    else if(closest === b1BottomDist) face = 4;
    
    // If flow 
    face = desiredFlow === 0 ? face : desiredFlow;

    switch(face) {
        case 1: return { 
            pos: [block1.x, block1.y + block1.height / 2, block2.x + block2.width, block2.y + block2.height / 2],
            dir: 1 // Left
        };

        case 2: return { 
            pos: [block1.x + block1.width, block1.y + block1.height / 2, block2.x, block2.y + block2.height / 2],
            dir: 2 // Right
        };

        case 3: return { 
            pos: [block1.x + block1.width / 2, block1.y, block2.x + block2.width / 2, block2.y + block2.height],
            dir: 3 // Top
        };

        case 4: return { 
            pos: [block1.x + block1.width / 2, block1.y + block1.height, block2.x + block2.width / 2, block2.y],
            dir: 4 // Bottom
        };

        default: return {
            pos: [block1.x + block1.width, block1.y + block1.height / 2, block2.x, block2.y + block2.height / 2],
            dir: 2 // Right
        }
    }
};

export default calculateConnections;