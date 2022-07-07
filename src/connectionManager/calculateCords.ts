import { VisualConstants } from '../consts';
import { BlockTypes } from '../types';

function calculateDistance(a: BlockTypes.ICords, b: BlockTypes.ICords): number {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

function calculateConnections(block1: BlockTypes.IBlockInfo, block2: BlockTypes.IBlockInfo): BlockTypes.TConnection {

    const b1Left: BlockTypes.ICords = { x: block1.x, y: block1.y + block1.h / 2 },
        b1Right: BlockTypes.ICords = { x: block1.x + block1.w, y: block1.y + block1.h / 2 },
        b1Top: BlockTypes.ICords = { x: block1.x + block1.w / 2, y: block1.y },
        b1Bottom: BlockTypes.ICords = { x: block1.x + block1.w / 2, y: block1.y + block1.h };

    const b2Center = { x: block2.x + block2.w / 2, y: block2.y + block2.h / 2 };

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
            pos: [block1.x, block1.y + block1.h / 2, block2.x + block2.w, block2.y + block2.h / 2],
            dir: 1 // Left
        };

        case 2: return { 
            pos: [block1.x + block1.w, block1.y + block1.h / 2, block2.x, block2.y + block2.h / 2],
            dir: 2 // Right
        };

        case 3: return { 
            pos: [block1.x + block1.w / 2, block1.y, block2.x + block2.w / 2, block2.y + block2.h],
            dir: 3 // Top
        };

        case 4: return { 
            pos: [block1.x + block1.w / 2, block1.y + block1.h, block2.x + block2.w / 2, block2.y],
            dir: 4 // Bottom
        };

        default: return {
            pos: [block1.x + block1.w, block1.y + block1.h / 2, block2.x, block2.y + block2.h / 2],
            dir: 2 // Right
        }
    }
};

export default calculateConnections;