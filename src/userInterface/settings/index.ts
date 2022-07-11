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

    private add(name: string, classes: Array<string>, active: boolean) {
        // -- Create a new div -- //
        const option = document.createElement('div'),
            page = document.createElement('div'),
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

        // -- Function to change the visability of the page -- //
        const visable = (visability: boolean) => {
            if (visability === true) page.classList.remove('invisible');
            else page.classList.add('invisible');
        }

        // -- Append the page to the right panel
        this.rightPanel.appendChild(page);

        // -- Create a reference to the button -- //
        const group = {
            name: name,
            visability: visable,
            button: option,
            icon: fontAwesome,
            label: label,
            page: page
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
        // -- General settings
        this.add('General', ['fal', 'icon', 'fa-gear'], true);
        General(this);
        
        // -- Conections menu
        this.add('Connections', ['fal', 'icon', 'fa-link'], false);

        // -- Color settings
        this.add('Color', ['fal', 'icon', 'fa-paint-brush'], false);

        // -- Grid settings
        this.add('Grid', ['fal', 'icon', 'fa-grid-2'], false);

        // -- Cursor settings
        this.add('Cursor', ['fal', 'icon', 'fa-mouse-pointer'], false);
        
        // -- Export settings
        this.add('Export', ['fal', 'icon', 'fa-file-export'], false);

        // -- Developer settings
        this.add('Developer', ['fal', 'icon', 'fa-code'], false);

        // -- Experimental settings
        this.add('Experimental', ['fal', 'icon', 'fa-flask'], false);
    }


    public addOptions(optionList: Array<UIelements.ISettings>, category: string) {
        // -- Try and find the category -- //
        const parent = this.elements.find(f => f.name.toLowerCase() === category.toLowerCase());

        if(!parent)
            throw new Error('Could not find the parent category');

        optionList.forEach(e => {

            // -- Main div of the option
            const option: HTMLDivElement = document.createElement('div');
            option.className = 'option flex-left';

            // -- Left, Right, top and Bottom areas -- //
            const left: HTMLDivElement = document.createElement('div'),
                right: HTMLDivElement = document.createElement('div'),
                top: HTMLDivElement = document.createElement('div'),
                bottom: HTMLDivElement = document.createElement('div');

            left.className = 'left';
            right.className = 'right';
            top.className = 'top';
            bottom.className = 'bottom';

            // -- Add the lable and description -- //
            const label: HTMLHeadingElement = document.createElement('h2'),
                description: HTMLParagraphElement = document.createElement('p');

            label.innerHTML = e.name;
            description.innerHTML = e.description;

            // -- Append the elements to the main div -- //
            top.appendChild(left);
            top.appendChild(right);

            option.appendChild(top);
            option.appendChild(bottom);

            // The options is structured as follows:
            // -- Left -- // -- Right -- // < -- Top Ellement
            // ------- Bottom ---------- // < -- Bottom Element

            // -- Append the text elements to the left-- //
            left.appendChild(label);
            left.appendChild(description);

            // -- Generate an ID for the option with math -- //
            const ID = 'option-' + Math.floor(Math.random() * 1000000).toString();
       
            // -- Set the ID of the option -- //
            option.id = ID;

            // -- Set the input method of the option -- //
            switch(e.type) {

                // -- Checkbox -- //
                case 'toggle':
                    // -- Create the input element
                    const [toggleParent] =  
                        this.createToggleElement(e.value(), option.id, e.onChange); 

                    // -- Append the elements to the option element
                    right.appendChild(toggleParent);
                break;


                // -- Number -- //
                case 'number': 
                    // -- Create the input element 
                    const [number] = 
                        this.createNumberElement(e.min, e.max, e.value(), option.id, e.onChange);
                    
                    // -- Append the elements to the option element
                    right.appendChild(number);
                break;


                // -- Slider -- //
                case 'slider':
                    // -- Create the input Elements
                    const [slider, sliderInput] =
                        this.createSliderElement(e.min, e.max, e.value(), option.id, e.onChange);

                    const [num, numInput] = 
                        this.createNumberElement(e.min, e.max, e.value(), option.id, e.onChange);

                    // -- Append the elements to the option element
                    bottom.appendChild(slider);
                    right.appendChild(num);

                    // -- Add a listener to both so that they update together -- //
                    slider.addEventListener('input', 
                        () => { numInput.value = sliderInput.value; });

                    num.addEventListener('input',
                        () => { sliderInput.value = numInput.value; });
                break;
            }

            // -- Append the option to the parent -- //
            parent.page.appendChild(option);
        });
    }

    /**
     * @name createNumberElement
     * 
     * @description Creates a number input element
     * 
     * @param min The minimum value of the number
     * @param max The maximum value of the number
     * @param value The current value of the number
     * @param id The base of the id for the input elm
     * @param callback The callback function to call when the value changes
     * @returns [HTMLDivElement, HTMLInputElement] The paremt element and the input element
     */
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


    /**
     * @name createToggleElement
     * 
     * @description Creates a toggle element
     * 
     * @param value If the element is active or not
     * @param id The base of the id for the input elm
     * @param callback The callback function to call when the value changes
     * @returns [HTMLDivElement, HTMLInputElement] The paremt element and the input element
     */
    public createToggleElement(value: boolean, id: string, callback: (x: boolean) => void): [HTMLDivElement, HTMLInputElement] {
        const input = document.createElement('input'),
            label = document.createElement('label'),
            parent = document.createElement('div');

        // -- Set the Input -- //
        input.type = 'checkbox';
        input.id = id + '-toggle';
        input.classList.add('toggle');
        input.checked = value;

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


    /**
     * @name createSliderElement
     * 
     * @description Creates a slider element
     * 
     * @param min The minimum value of the slider
     * @param max The maximum value of the slider
     * @param value The current value of the slider
     * @param id The base of the id for the input elm
     * @param callback The callback function to call when the value changes
     * @returns [HTMLDivElement, HTMLInputElement] The paremt element and the input element
     */
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


    /**
     * @name getLocalBoolean 
     * 
     * @description This function will get the value of a local storage item and return it as a boolean
     * 
     * @param {string} name The name of the item to get
     * @param {boolean} defaultValue The default value to return if the item is not found
     * @returns {boolean} The value of the item
     */
    public static getLocalBoolean(key: string, defaultValue: boolean): boolean {
        const value = localStorage.getItem(key);
        if (value === null) {
            localStorage.setItem(key, defaultValue.toString());
            return defaultValue;
        }
        return value === 'true';
    }

    /**
     * @name setLocalBoolean
     * 
     * @description This function will set the value of a local storage item
     * 
     * @param {string} name The name of the item to set
     * @param {boolean} value The value to set the item to
     * @returns {void}
     */
    public static setLocalBoolean(key: string, value: boolean): void {
        localStorage.setItem(key, value.toString());
    }


    /**
     * @name getLocalNumber
     * 
     * @description This function will get the value of a local storage item and return it as a number
     * 
     * @param {string} name The name of the item to get
     * @param {number} defaultValue The default value to return if the item is not found
     * @returns {number} The value of the item
     */
    public static getLocalNumber(key: string, def: number): number {
        const value = localStorage.getItem(key);
        if (value === null) {
            localStorage.setItem(key, def.toString());
            return def;
        }
        return parseInt(value);
    }

    /**
     * @name setLocalNumber
     * 
     * @description This function will set the value of a local storage item
     * 
     * @param {string} name The name of the item to set
     * @param {number} value The value to set the item to
     * @returns {void}
     */
    public static setLocalNumber(key: string, value: number): void {
        localStorage.setItem(key, value.toString());
    }
}

export default Settings;