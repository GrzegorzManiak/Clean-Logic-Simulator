import { CanvasTypes } from "../index.d";

class BlockRegister {
    private static _blockList: { [key: string]: CanvasTypes.IBlock } = {};

    public static registerBlock(block: CanvasTypes.IBlock): void {
        this._blockList[block.id] = block;
    }

    public static getBlock(id: string): CanvasTypes.IBlock {
        return this._blockList[id];
    }

    public static getBlockList(): CanvasTypes.IBlock[] {
        return Object.values(this._blockList);
    }
}

export default BlockRegister;