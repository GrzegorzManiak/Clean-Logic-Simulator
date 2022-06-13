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
        id: string;
        size: ISize;
        color: string;
        snapToGrid: boolean;
    }
}

export namespace Constants {
    export type TVisualConstants = {
        arrowWidth: number;
        arrowHeight: number;
        fontSize: number;
        strokeWidth: number;
        strokeColor: string;
        blockWidth: number;
        blockHeight: number;

        strokeOutlineWidth: number;
        strokeOutlineColor: string;
    }

    export type TGridConstants = {
        gridSize: number;
        scaleBy: number;
        scrollSpeed: number;
        maxScale: number;
        minScale: number;
        gridColor: string;
        gridLineWidth: number;
        gridDashAmnt: number;
    }

    export type TThemeConstants = {
        backgroundColor: string;
        blockBarColor: string;
        blockBarPadding: number;
        blockColor: string;
        promptColor: string;
        blockBarBorderRadius: number;
        promptPadding: number;
        fontPrimarySize: number;
        fontSecondarySize: number;
        promptBorderRadius: number;
        fontFamily: string;
        fontColor: string;
    }
}