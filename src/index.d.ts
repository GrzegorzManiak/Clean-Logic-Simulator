export namespace BlockList {
    export type TBaseLogic = 'AND' | 'OR' | 'XOR' | 'NAND' | 'NOR' | 'XNOR';
    export type TTemplateLogic = 'NOT';
}

export namespace CanvasTypes {
    export type ISize = {
        width: number;
        height: number;
    }

    export type ICoordinates = {
        x: number;
        y: number;
    }

    export type IBlock = {
        id: string;
        type: BlockList.TBaseLogic | BlockList.TTemplateLogic;
        coordinates: ICoordinates;
        size: ISize;
        color: string;
    }
}