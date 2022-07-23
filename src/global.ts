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
    public movingBlock: boolean = false;

    public selectionEnabled: boolean = true;       
}

export default Global;