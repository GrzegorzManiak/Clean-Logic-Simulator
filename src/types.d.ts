import konva from "konva";
import intractableObject from "./connectionPoint";

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

    export interface ICursorkonva {
        top: konva.Image,
        bottom: konva.Image,
        left: konva.Image,
        right: konva.Image,
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



/**
 * @name UIelements
 * 
 * @description This namespace contains all the types that are used in the user interface.
 */
export namespace UIelements {
    /**
     * @name TSelectorButton
     * 
     * @description Main settings button usaly located on the left, used to select a group of settings.
     */
    export type TSelectorButton = {
        id: string;
        panelVisability: (visable: boolean) => void;
        selectorVisability: (show: boolean) => void;
        
        elements: {
            selector: HTMLDivElement;
            icon: HTMLElement;
            label: HTMLHeadElement;
            page: HTMLDivElement;
        }
    }

    /**
     * @name TInputType
     * 
     * @description Type of input used in settings.
     */
    export type TInputType = 'toggle' | 'slider' | 'number' | 'dropdown';

    /**
     * @name TPositioning
     * 
     * @description Positioning of the setting element, eg putting the dropdown below the main lable of the setting.
     */
    export type TPositioning = 'right' | 'bottom';

    type IBaseSetting = {
        key: string;
        type: TInputType;
    }

    /**
     * @name Dropdown
     * 
     * @description Used for defining a dropdown menu wihin the settings menu
     * 
     * @see IBaseSetting
     * @see TPositioning
     */
    export type Dropdown = IBaseSetting & {
        type: 'dropdown';
        position: TPositioning;
        value: () => string;
        options: string[];
        default: string;
        onChange: (value: string) => void | Promise<void>;
    }

    /**
     * @name Toggle
     * 
     * @description Used for defining a toggle button wihin the settings menu
     * 
     * @see IBaseSetting
     */
    export type Toggle = IBaseSetting & {
        type: 'toggle';
        value: () => boolean;
        default: boolean;
        onChange: (value: boolean) => void | Promise<void>;
    }
    
    /**
     * @name Slider
     * 
     * @description Used for defining a slider wihin the settings menu
     * 
     * @see IBaseSetting
     */
    export type Slider = IBaseSetting & {
        type: 'slider';
        value: () => number;
        min: number;
        max: number;
        default: number;
        onChange: (value: number) => void | Promise<void>;
    }
    
    /**
     * @name Number
     * 
     * @description Used for defining a number input wihin the settings menu
     * 
     * @see IBaseSetting
     */
    export type Number = IBaseSetting & {
        type: 'number';
        value: () => number;
        min: number;
        max: number;
        default: number;
        onChange: (value: number) => void | Promise<void>;
    }

    /**
     * @name ISettings
     * 
     * @description A union of all the settings types
     * 
     * @see Toggle
     * @see Slider
     * @see Number
     * @see Dropdown
     */
    export type ISettings = Slider | Toggle | Number | Dropdown;
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
 * @name Number
 * 
 * @description A collection of types that help dealing with numerical types not supported by the standard typescript library.
 */
export namespace Number {
    export type u_int_8 = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 | 50 | 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59 | 60 | 61 | 62 | 63 | 64 | 65 | 66 | 67 | 68 | 69 | 70 | 71 | 72 | 73 | 74 | 75 | 76 | 77 | 78 | 79 | 80 | 81 | 82 | 83 | 84 | 85 | 86 | 87 | 88 | 89 | 90 | 91 | 92 | 93 | 94 | 95 | 96 | 97 | 98 | 99 | 100 | 101 | 102 | 103 | 104 | 105 | 106 | 107 | 108 | 109 | 110 | 111 | 112 | 113 | 114 | 115 | 116 | 117 | 118 | 119 | 120 | 121 | 122 | 123 | 124 | 125 | 126 | 127 | 128 | 129 | 130 | 131 | 132 | 133 | 134 | 135 | 136 | 137 | 138 | 139 | 140 | 141 | 142 | 143 | 144 | 145 | 146 | 147 | 148 | 149 | 150 | 151 | 152 | 153 | 154 | 155 | 156 | 157 | 158 | 159 | 160 | 161 | 162 | 163 | 164 | 165 | 166 | 167 | 168 | 169 | 170 | 171 | 172 | 173 | 174 | 175 | 176 | 177 | 178 | 179 | 180 | 181 | 182 | 183 | 184 | 185 | 186 | 187 | 188 | 189 | 190 | 191 | 192 | 193 | 194 | 195 | 196 | 197 | 198 | 199 | 200 | 201 | 202 | 203 | 204 | 205 | 206 | 207 | 208 | 209 | 210 | 211 | 212 | 213 | 214 | 215 | 216 | 217 | 218 | 219 | 220 | 221 | 222 | 223 | 224 | 225 | 226 | 227 | 228 | 229 | 230 | 231 | 232 | 233 | 234 | 235 | 236 | 237 | 238 | 239 | 240 | 241 | 242 | 243 | 244 | 245 | 246 | 247 | 248 | 249 | 250 | 251 | 252 | 253 | 254 | 255;
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
    export type TSupported = 'en' | 'pl';


    /**
     * @name TResource
     * 
     * @description A type for the localization class to store information about supported languages.
     */
    export type TResource = {
        language: TSupported;
        name: string;
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



/**
 * @name Geometric
 * 
 * @description A collection of types that help dealing with position, scaling etc.
 */
export namespace Geometric {
    export type X = number;
    export type Y = number;

    /**
     * @name TPoint
     * 
     * @description A type for a coordinate pair.
     * @see X
     * @see Y
     */
    export type TPoint = {
        x: X;
        y: Y;
    }


    export type Width = number;
    export type Height = number;

    /**
     * @name Size
     * 
     * @description A type for a size.
     * @see Width
     * @see Height
     */
    export type TSize = {
        width: Width;
        height: Height;
    }
}



/**
 * @name Color
 * 
 * @description A collection of types that help dealing with colors.
 * @see https://www.w3schools.com/colors/colors_names.asp
 * @see https://www.w3schools.com/colors/colors_hex.asp
 * @see https://www.w3schools.com/colors/colors_rgb.asp
 */
export namespace Color {
    /**
     * @name Css
     * 
     * @description A type for a CSS's color string formating,
     * dont recommend as due to the nature of typescript its 
     * not possible to write a strong type for CSS color strings.
     */
    export namespace Css {
        /**
         * @name THex
         * 
         * @description A type for a hex color.
         */
        // NOTE: Id love to have a actual type for this, but typescript doesn't support it.
        export type THex = `#${string}`;


        /**
         * @name TRgb
         * 
         * @description A type for a rgb color.
         */
        export type TRgb = `rgb(${number}, ${number}, ${number})` | `rgb(${number},${number},${number},${number})`;


        /**
         * @name TRgba
         * 
         * @description A type for a rgba color.
         */
        export type TRgba = `rgba(${number}, ${number}, ${number}, ${number})` | `rgba(${number},${number},${number},${number})`;
    
        
        /**
         * @name TColor
         * 
         * @description A type for a color.
         * @see Css.THex
         * @see Css.TRgb
         * @see Css.TRgba
         */
        export type TColor = THex | TRgb | TRgba;
    }


    /**
     * @name THEXAlpah
     * 
     * @description A type for a segment of a hex color.
     */
    export type THEXAlpah = `${Character.TAlphaNumericString}${Character.TAlphaNumericString}`;


    /**
     * @name THex
     * 
     * @description A type for a hex color.
     * @see THEXAlpah
     */
    export type THex = {
        R: THEXAlpah
        G: THEXAlpah
        B: THEXAlpah
    }


    /**
     * @name TRgb
     * 
     * @description A type for a rgb color.
     * @see Number.u_int_8
     */
    export type TRgb = [Number.u_int_8, Number.u_int_8, Number.u_int_8];


    /**
     * @name TRgba
     * 
     * @description A type for a rgba color.
     * @see TRgb
     */
    export type TRgba =  TRgb & [Number.u_int_8];


    /**
     * @name TColor
     * 
     * @description A union type for all supported color types.
     * 
     * @see THex
     * @see TRgb
     * @see TRgba
     */
    export type TColor = THex | TRgb | TRgba;
}



/**
 * @name ConnectionNode
 * 
 * @description A collection of types that lays out how a connection is constructed.    
 */
export namespace ConnectionNode {
    /**
     * @name TMode
     * 
     * @input Node will act as a slave, only accepting connections from other nodes.
     * @output Node will act as a master, only allowing connections to other nodes.
     */
    export type TMode = 'input' | 'output';

    
    /**
     * @name TConfiguration
     * 
     * @description A type for a connection node's configuration.
     * 
     * @see TMode
     * @see Number.u_int_8
     * @see Geometric.TPoint
     * @see Geometric.TSize
     * @see konva.Node
     */
    export type TConfiguration = {
        mode: TMode,
        master: konva.Node,
        offSet: Geometric.TPoint,           
        size: Geometric.TSize,
        maxConnections: Number.u_int_8,
    }

    // TODO: Create a generic namespace
    export type INodeHook = <E>() => E | void;

    /**
     * @name INodeHooks
     * 
     * @description A type for a connection node's hooks that
     * are required to be implemented.
     */
    export type INodeHooks = {
        drag: (func: INodeHook) => void;
        dragEnd: (func: INodeHook) => void;
        dragStart: (func: INodeHook) => void;
    }

    /**
     * @name INodeInterface
     * 
     * @description Interface for an object that can be
     * passed into the connection manager to be used as a 
     * connection node.
     * 
     * @see INodeHooks
     * @see TMode
     * @see konva.Node
     * @see Number.u_int_8
     */
    interface INodeInterface {
        getMode: () => TMode;
        getMaster: () => konva.Node;
        getMaxConnections: () => Number.u_int_8;
        hooks: INodeHooks
    }
}