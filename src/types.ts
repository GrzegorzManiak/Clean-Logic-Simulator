import Konva from "Konva";
import intractableObject from "./interactableObject";

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
        gridAccentColor: string;
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

export namespace Basic {
    export type TintractableObjectRef = {
        get: () => intractableObject
    }

    export type TSelectedRef = TintractableObjectRef & {
        del: () => void;
    }

    export interface ISize {
        width: number;
        height: number;
    }

    export interface ICords {
        x: number;
        y: number;
    }

    export type IBlockInfo = ICords & ISize;

    export interface TConnection {
        pos: [number, number, number, number],
        dir: 1 | 2 | 3 | 4
    }

    export interface TVisualConnectionInfo {
        reRender: () => void;
        remove: () => void;
        parent: intractableObject;
        child: intractableObject;
    }

    export type TCursorSegment = { 
        size: ISize, 
        offset: ICords,
        path: string 
    }

    export interface ICursorGraphics {
        top: TCursorSegment
        bottom: TCursorSegment
        left: TCursorSegment
        right: TCursorSegment
    }

    export interface ICursorImages { 
        top: HTMLImageElement,
        bottom: HTMLImageElement,
        left: HTMLImageElement,
        right: HTMLImageElement,
    }

    export interface ICursorKonva {
        top: Konva.Image,
        bottom: Konva.Image,
        left: Konva.Image,
        right: Konva.Image,
    }

    export interface ICursorOptions {
        scale: number;
        rotation: number;

        distance: number;
        selectionDistance: number;
        draggingDistance: number;
        hoveringDistance: number;
    }

    export type TSides = 'top' | 'bottom' | 'left' | 'right';
}