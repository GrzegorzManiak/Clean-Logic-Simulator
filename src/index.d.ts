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
        borderRadius: number;
        borderWidth: number;
        borderColor: string;

        id: string;
        type: BlockList.TBaseLogic | BlockList.TTemplateLogic; 
        coordinates: ICoordinates;
        size: ISize;
        color: string;

        snapToGrid: boolean;
    }
}

export namespace Constants {
    export type TVisualConstants = {
        arrowWidth: number;
        arrowHeight: number;

        strokeWidth: number;

        blockWidth: number;
        blockHeight: number;
    }

    export type TGridConstants = {
        gridSize: number;
        scaleBy: number;
        scrollSpeed: number;
    }
}