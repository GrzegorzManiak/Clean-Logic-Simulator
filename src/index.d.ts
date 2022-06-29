import PlaceableObject from "./placeableObject/main";
import ConnectionManager from "./connectionManager/main";

export namespace BlockList {
    export type TBaseLogic = 'AND' | 'OR' | 'XOR' | 'NAND' | 'NOR' | 'XNOR';
    export type TTemplateLogic = 'NOT';
}

export type TArrowDirection = 'left' | 'right' | 'up' | 'down';

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

        flowDirection: 0 | 1 | 2 | 3 | 4;
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

    export type TSelectionConstants = {
        borderRadius: number;
        borderWidth: number;
        color: string;
        borderColor: string;
        transparency: number;
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

export namespace BlockTypes {
    export type TPlaceableObjectRef = {
        get: () => PlaceableObject
    }

    export type TSelectedRef = TPlaceableObjectRef & {
        del: () => void;
    }

    export interface ICords {
        x: number;
        y: number;
    }

    export type IBlockInfo = ICords &{
        w: number; h: number;
    }

    export interface TConnection {
        pos: [number, number, number, number],
        dir: 1 | 2 | 3 | 4
    }
}