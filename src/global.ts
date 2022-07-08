class Global {
    private static instance: Global;

    private constructor() {}

    public static getInstance(): Global {
        if (!Global.instance)
            Global.instance = new Global();

        return Global.instance;
    }

    public hoveringOverBlock: boolean = false;
    public movingBlockSelection: boolean = false;
    public selectionDragged: boolean = false;
}

export default Global;