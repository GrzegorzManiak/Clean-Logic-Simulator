import { Constants } from "./index.d";

export const VisualConstants: Constants.TVisualConstants = {
    arrowWidth: 10,
    arrowHeight: 10,
    fontSize: 30,
    strokeWidth: 3,
    blockWidth: 75,
    blockHeight: 75,
    strokeColor: '#ffffff',
    strokeOutlineWidth: 5,
    strokeOutlineColor: '#757575',
    flowDirection: 0,
}

export const GridConstants: Constants.TGridConstants = {
    gridSize: 75,
    scrollSpeed: 1,
    scaleBy: 1.1,
    maxScale: 3,
    minScale: 0.5,
    gridColor: 'rgba(0, 0, 0, 0.2)',
    gridLineWidth: 2,
    gridDashAmnt: 8
}

export const ThemeConstants: Constants.TThemeConstants = {
    backgroundColor: '#2b2b2b',

    blockBarBorderRadius: 10,
    blockBarColor: "#2b2b2b",
    blockBarPadding: 10,
    blockColor: '#2b2b2b',

    promptColor: '#2b2b2b',    
    fontPrimarySize: 20,
    fontSecondarySize: 15,
    promptPadding: 5,
    promptBorderRadius: 5,
    fontFamily: 'Arial',
    fontColor: '#ffffff'
}

export const SelectionConstants: Constants.TSelectionConstants = {
    borderRadius: 5,
    borderWidth: 4,
    color: '#03a1fc',
    borderColor: '#0088d6',
    transparency: 0.1
}