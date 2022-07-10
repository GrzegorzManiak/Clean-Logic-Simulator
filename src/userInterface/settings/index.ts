import Konva from 'Konva';

class Settings {
    private static instance: Settings;
    public readonly stage: Konva.Stage;

    public readonly bluryDiv: HTMLDivElement = document.createElement('div');
    public readonly settingsDiv: HTMLDivElement = document.createElement('div'); 
    public readonly leftPanel: HTMLDivElement = document.createElement('div');
    public readonly rightPanel: HTMLDivElement = document.createElement('div');

    private constructor(stage: Konva.Stage) {
        this.stage = stage;
        this.init();
    }

    public static getInstance(stage: Konva.Stage): Settings {
        if (!Settings.instance) Settings.instance = new Settings(stage);
        return Settings.instance;
    }

    private init() {
        // -- Settings div -- //
        this.settingsDiv.id = 'settings';
        this.settingsDiv.className = 'full-panel';

        // -- Blurry div -- //
        this.bluryDiv.className = 'blur flex-center';

        // -- Left and right panels -- //
        this.leftPanel.className = 'left-panel';
        this.rightPanel.className = 'right-panel';

        // -- Append to respective divs -- //
        this.bluryDiv.appendChild(this.settingsDiv);
        this.settingsDiv.appendChild(this.leftPanel);
        this.settingsDiv.appendChild(this.rightPanel);
        
        // -- Add the options -- //
        this.appendOptions();

        // -- Append the main div to the stage
        this.stage.content.appendChild(this.bluryDiv);    
    }

    private appendOptions() {
        const add = (name: string, callback: () => void) => {
            // -- Create a new div -- //
            const option = document.createElement('div'),
                label = document.createElement('h2');

            option.className = 'settings-option flex-center';
            option.id = 'option-' + name;

            label.innerHTML = name;
            
            option.appendChild(label);
            this.leftPanel.appendChild(option);
        }
        
        add('General', this.OptGeneral);
        add('Colors', this.OptColors);
        add('Colors', this.OptColors);

        add('Colors', this.OptColors);

        add('Colors', this.OptColors);

        add('Colors', this.OptColors);

    }

    private OptGeneral() {}

    private OptColors() {}
}

export default Settings;