import Konva from 'Konva';
import { UIelements } from '../../types';

// -- Settings pages
import General from './src/general';

class Settings {
    private static instance: Settings;
    public readonly stage: Konva.Stage;

    public readonly bluryDiv: HTMLDivElement = document.createElement('div');
    public readonly settingsDiv: HTMLDivElement = document.createElement('div'); 

    public readonly leftPanel: HTMLDivElement = document.createElement('div');
    public readonly leftPanelSettings: HTMLDivElement = document.createElement('div');

    public readonly rightPanel: HTMLDivElement = document.createElement('div');

    public elements: Array<UIelements.TSettingsButton> = [];

    private constructor(stage: Konva.Stage) {
        this.stage = stage;

        // -- Append to respective divs -- //
        this.bluryDiv.appendChild(this.settingsDiv);
        this.settingsDiv.appendChild(this.leftPanel);
        this.leftPanel.appendChild(this.leftPanelSettings);
        this.settingsDiv.appendChild(this.rightPanel);

        // -- Settings div -- //
        this.settingsDiv.id = 'settings';
        this.settingsDiv.className = 'full-panel';

        // -- Blurry div -- //
        this.bluryDiv.className = 'blur flex-center';

        // -- Left Panel -- //
        this.leftPanel.className = 'left-panel';
        this.leftPanelSettings.className = 'left-panel-settings';
        
        // -- Right Panel -- //
        this.rightPanel.className = 'right-panel';

        // -- Create the Title -- //
        const title = document.createElement('h1');

        title.innerHTML = 'SETTINGS';
        title.className = 'page-title';

        // -- Append as first child of the left panel
        this.leftPanel.insertBefore(title, this.leftPanel.firstChild);
        
        // -- Continue loading elements -- //
        this.appendOptions();

        // -- Append the main div to the stage
        this.stage.content.appendChild(this.bluryDiv);    
    }

    public static getInstance(stage: Konva.Stage): Settings {
        if (!Settings.instance) Settings.instance = new Settings(stage);
        return Settings.instance;
    }

    private stateManager(btn: UIelements.TSettingsButton) {
        // -- Deactivate any other buttons -- //
        this.elements.forEach(e => {
            e.button.classList.remove('active');
            e.visability(false);
        });

        // -- Activate the button -- //
        btn.button.classList.add('active');
        btn.visability(true);
    }

    public add(name: string, classes: Array<string>, active: boolean, callback: (visable: boolean) => void) {
        // -- Create a new div -- //
        const option = document.createElement('div'),
            fontAwesome = document.createElement('i'),
            label = document.createElement('h2');

        // -- Set the class names and id of the main element
        option.className = 'settings-option flex-left';
        option.id = 'option-' + name;

        // -- Add all the classes that were passed in
        classes.forEach(c => fontAwesome.classList.add(c));

        // -- Set the lable
        label.innerHTML = name;
        
        // -- Append the elements to the main element
        option.appendChild(fontAwesome);
        option.appendChild(label);

        // -- Append the main element to the left panel
        this.leftPanelSettings.appendChild(option);

        // -- Create a reference to the button -- //
        const group = {
            name: name,
            visability: callback,
            button: option,
            icon: fontAwesome,
            label: label,
        }

        // -- Add to the list of elements -- //
        this.elements.push(group);

        // -- Add the event listener -- //
        option.addEventListener('click', () => {
            this.stateManager(group);
        });

        if (active) this.stateManager(group);
    }

    private appendOptions() {
        General(this);
        
        this.OptConnections();
        this.OptColors();
        this.OptGrid();
        this.OptCursor();
        this.OptExport();
        this.OptDeveloper();
        this.OptExperimental();
    }

    bf = (a: boolean) => {};

    // -- All the different groupss of options -- //

    private OptConnections() {
        this.add('Conections', ['fal', 'icon', 'fa-code-branch'], false, this.bf);
    }     

    private OptColors() {
        this.add('Colors', ['fal', 'icon', 'fa-brush'], false, this.bf);
    }

    private OptGrid() {
        this.add('Grid', ['fal', 'icon', 'fa-grid-2'], false, this.bf);
    }

    private OptCursor() {
        this.add('Cursor', ['fal', 'icon', 'fa-mouse'], false, this.bf);
    }

    private OptExport() {
        this.add('Export', ['fal', 'icon', 'fa-upload'], false, this.bf);
    }

    private OptExperimental() {
        this.add('Experimental', ['fal', 'icon', 'fa-flask'], false, this.bf);
    }

    private OptDeveloper() {
        this.add('Developer', ['fal', 'icon', 'fa-code'], false, this.bf);
    }

    public createToggleElement(active: boolean, id: string, callback: (x: boolean) => void): [HTMLDivElement, HTMLInputElement] {
        const input = document.createElement('input'),
            label = document.createElement('label'),
            parent = document.createElement('div');

        // -- Set the Input -- //
        input.type = 'checkbox';
        input.id = id + '-toggle';
        input.classList.add('toggle');
        input.checked = active;

        // -- Add the event listener -- //
        input.addEventListener('change', () => {
            callback(input.checked);
        });

        // -- Set the label -- //
        label.setAttribute('for', input.id);
        label.classList.add('toggle');

        // -- Append the elements to the main element -- //
        parent.appendChild(input);
        parent.appendChild(label);

        // -- Return the main element -- //
        return [parent, input];
    }

    public createSliderElement(min: number, max: number, value: number, id: string, callback: (x: number) => void): [HTMLDivElement, HTMLInputElement] {
        const input = document.createElement('input'),
            label = document.createElement('label'),
            parent = document.createElement('div');

        // -- Set the Input -- //
        input.type = 'range';
        input.min = min.toString();
        input.max = max.toString();
        input.value = value.toString();
        input.id = id + '-slider';
        input.classList.add('slider');

        // -- Add the event listener -- //
        input.addEventListener('change', () => {
            callback(parseInt(input.value));
        });

        // -- Set the label -- //
        label.setAttribute('for', input.id);
        label.classList.add('slider');

        // -- Append the elements to the main element -- //
        parent.appendChild(input);
        parent.appendChild(label);

        // -- Return the main element -- //
        return [parent, input];
    }

    createNumberElement(min: number, max: number, value: number, id: string, callback: (x: number) => void): [HTMLDivElement, HTMLInputElement] {
        const input = document.createElement('input'),
            label = document.createElement('label'),
            parent = document.createElement('div');

        // -- Set the Input -- //
        input.type = 'tel'; // <- this is so we dont get an incramenter
        input.min = min.toString();
        input.max = max.toString();
        input.value = value.toString();
        input.id = id + '-number';
        input.classList.add('number');

        // -- Add the event listener -- //
        input.addEventListener('change', () => {
            const val = parseInt(input.value);

            if (val < min) input.value = min.toString();
            else if (val > max) input.value = max.toString();

            callback(val);
        });

        // -- Set the label -- //
        label.setAttribute('for', input.id);
        label.classList.add('number');

        // -- Append the elements to the main element -- //
        parent.appendChild(input);
        parent.appendChild(label);

        // -- Return the main element -- //
        return [parent, input];
    }

    public static getLocalBoolean(key: string, def: boolean): boolean {
        const value = localStorage.getItem(key);
        if (value === null) {
            localStorage.setItem(key, def.toString());
            return def;
        }
        return value === 'true';
    }

    public static setLocalBoolean(key: string, value: boolean) {
        localStorage.setItem(key, value.toString());
    }


    public static getLocalNumber(key: string, def: number): number {
        const value = localStorage.getItem(key);
        if (value === null) {
            localStorage.setItem(key, def.toString());
            return def;
        }
        return parseInt(value);
    }

    public static setLocalNumber(key: string, value: number) {
        localStorage.setItem(key, value.toString());
    }
}

export default Settings;