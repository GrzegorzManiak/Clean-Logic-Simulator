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


export namespace UIelements {
    export type TSettingsButton = {
        name: string;
        visability: (visable: boolean) => void;
        buttonVisability: (show: boolean) => void;
        button: HTMLDivElement;
        icon: HTMLElement;
        label: HTMLHeadElement;
        page: HTMLDivElement;
    }

    export type TInputType = 'toggle' | 'slider' | 'number';


    export type IBaseSetting = {
        name: string;
        description: string;
        type: TInputType;
    }

    // -- Toggle
    type Toggle = IBaseSetting & {
        type: 'toggle';
        value: () => boolean;
        default: boolean;
        onChange: (value: boolean) => void;
    }

    // -- Slider
    type Slider = IBaseSetting & {
        type: 'slider';
        value: () => number;
        min: number;
        max: number;
        default: number;
        onChange: (value: number) => void;
    }

    // -- Number
    type Number = IBaseSetting & {
        type: 'number';
        value: () => number;
        min: number;
        max: number;
        default: number;
        onChange: (value: number) => void;
    }

    export type ISettings = Slider | Toggle | Number;
}


/**
 * @name Character
 * 
 * @description A collection of types that help dealing with alphanumeric characters.
 */
export namespace Character {
    /**
     * @name TAlphaLower
     * 
     * @description List of all characters in the alphabet, lowercase.
     */
    export type TAlphaLower = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z';


    /**
     * @name TAlphaUpper
     * 
     * @description List of all characters in the alphabet, uppercase.
     */
    export type TAlphaUpper = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z';    


    /**
     * @name TAlpha
     * 
     * @description List of all characters in the alphabet.
     * @see TAlphaLower
     * @see TAlphaUpper
     */
    export type TAlpha = TAlphaLower | TAlphaUpper;


    /**
     * @name TNumericString
     * 
     * @description List of all numbers as strings.
     */
    export type TNumericString = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';


    /**
     * @name TNumeric
     * 
     * @description List of all numbers.
     */
    export type TNumeric = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;


    /**
     * @name TAlphaNumericString
     * 
     * @description List of all characters and numbers as strings.
     * @see TAlpha
     * @see TNumericString
     */
    export type TAlphaNumericString = TAlpha | TNumericString;


    /**
     * @name TAlphaNumeric
     * 
     * @description List of all characters and numbers.
     * @see TAlpha
     * @see TNumeric
     */
    export type TAlphaNumeric = TAlpha | TNumeric;
}



/**
 * @name LocalizationTypes
 * 
 * @description Types and interfaces used by the localization system.
 */
export namespace LocalizationTypes {
    /**
     * @name TLetterCode
     * 
     * @description type for two letter language / dialect code
     */
    export type TLetterCode = `${Character.TAlpha}${Character.TAlpha}`;


    /**
     * @name TSupported
     * 
     * @description A type for all supported languages (not including dialects).
     */
    export type TSupported = 'en';


    /**
     * @name TResource
     * 
     * @description A type for the localization class to store information about supported languages.
     */
    export type TResource = {
        language: TSupported;
        dialect?: Array<string>;
        resource: string;
    }


    /**
     * @name TKeyPair
     * 
     * @description A localization key and its corresponding value.
     */
    export type TKeyPair = {
        key: string;
        value: string;
    }

    /**
     * @name TLocalizationHook
     * 
     * @description A function that is called when a localization is loaded.
     */
    export type TLocalizationHook = (pair: TKeyPair) => void;


    /**
     * @name ILocalization
     * 
     * @description This is the interface for the localization object, loaded from a json file.
     * If a dialect is provided, it will use keys from the dialect, 
     * otherwise it will use the default keys
     */
    export interface ILocalization {
        name: string;
        code: string;
        dialects?: Array<{
            dialect: string;
            keys: Array<TKeyPair>;
        }>;
        keys: Array<TKeyPair>;
    }
}