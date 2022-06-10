import AndBlock from "./blocks/base/and.js";
// Initiate
// Get the canvas

const canvas: HTMLElement | null = document.getElementById('canvas');

if (!canvas) {
    alert('Canvas not found');
    throw new Error('Canvas not found');
}
 
export const mainCanvas = canvas;

// set the canvas to the dom 
Object.assign(document, {
    canvas: canvas
});
 
function summonBlock() {
    let block = new AndBlock();
}

summonBlock()

console.log('Hello World');
