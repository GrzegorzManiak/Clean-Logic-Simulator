import Konva from 'Konva';
import Localization from '../../localization';
import { UIelements } from '../../types';

// -- Inputs
import {
    createNumberElement,
    createDropdownElement,
    createToggleElement,
    createSliderElement,
} from '../inputs'

// -- Pages
import General from './src/general';
import Experimental from './src/experimental';
import ScrapMechanic from './src/scrapMechanic';

class Settings {
    private static instance: Settings;
    public static elements: Array<UIelements.TSelectorButton> = [];

    public readonly local = Localization.getInstance();
    public readonly stage: Konva.Stage;

    // -- Main elements that are used to construct the settings menu
    public readonly bluryDiv: HTMLDivElement =          document.createElement('div');
    public readonly settingsDiv: HTMLDivElement =       document.createElement('div'); 
    public readonly leftPanel: HTMLDivElement =         document.createElement('div');
    public readonly leftPanelSettings: HTMLDivElement = document.createElement('div');
    public readonly rightPanel: HTMLDivElement =        document.createElement('div');


    /**
     * @name getActiveButton
     * 
     * @description Returns the active button
     * 
     * @returns {TSelectorButton} The active button
     */
    public getActiveButton = () => this.activeButton;
    private activeButton: UIelements.TSelectorButton;


    private constructor(stage: Konva.Stage) {
        this.stage = stage;

        // -- Append to respective divs 
        this.bluryDiv.appendChild(this.settingsDiv);
        this.settingsDiv.appendChild(this.leftPanel);
        this.leftPanel.appendChild(this.leftPanelSettings);
        this.settingsDiv.appendChild(this.rightPanel);

        // -- Settings div 
        this.settingsDiv.id = 'settings';
        this.settingsDiv.className = 'full-panel';

        // -- Blurry div 
        this.bluryDiv.className = 'blur flex-center';

        // -- Left Panel 
        this.leftPanel.className = 'left-panel';
        this.leftPanelSettings.className = 'left-panel-settings';
        
        // -- Right Panel 
        this.rightPanel.className = 'right-panel';

        // -- Create the Title 
        const title = document.createElement('h1');

        this.local.appendHook('settings.title', (pair) => {
            title.innerHTML = pair.value;
        });
        
        title.className = 'page-title';

        // -- Append as first child of the left panel
        this.leftPanel.insertBefore(title, this.leftPanel.firstChild);
        
        // -- Continue loading elements 
        this.loadDefOpts();

        // -- Append the main div to the stage
        this.stage.content.appendChild(this.bluryDiv);    

        // -- Open and close the settings 
        this.openClose();
    }


    public static getInstance(stage: Konva.Stage): Settings {
        if (!Settings.instance) Settings.instance = new Settings(stage);
        return Settings.instance;
    }


    public static getGroup(id: string): UIelements.TSelectorButton | undefined {
        return Settings.elements.find(e => e.id.toLowerCase() === id.toLowerCase());
    }


    // -- START -- Crude way to toggle the settings panel 
    public open: boolean = false;

    private openClose() {
        // Quick and dirty way to open and close the settings
        // This will be replaced with a proper escape menu later
        
        // add a event listner to the document to see when the user
        // presses esc
        document.addEventListener('keydown', (e) => {
            // if the user presses esc, close the settings
            if (e.keyCode === 27) {
                if(this.open === true) this.open = false;
                else this.open = true;

                this.bluryDiv.classList.toggle('invisible');
                this.settingsDiv.classList.toggle('invisible');
            }
        });
    }
    // -- END 


    private loadDefOpts() {
        // -- General settings
        this.addPageSelector('General', 'settings.general', ['fal', 'icon', 'fa-gear'], true);
        
        // -- Conections menu
        this.addPageSelector('Connections', 'settings.connections', ['fal', 'icon', 'fa-link']);

        // -- Color settings
        this.addPageSelector('Color', 'settings.color', ['fal', 'icon', 'fa-paint-brush']);

        // -- Grid settings
        this.addPageSelector('Grid', 'settings.grid', ['fal', 'icon', 'fa-grid-2']);

        // -- Cursor settings
        this.addPageSelector('Cursor', 'settings.cursor', ['fal', 'icon', 'fa-mouse-pointer']);
        
        // -- Export settings
        this.addPageSelector('Export', 'settings.export', ['fal', 'icon', 'fa-file-export']);

        // -- Developer settings
        this.addPageSelector('Developer', 'settings.developer', ['fal', 'icon', 'fa-code']);

        // -- Scrap Mechanic
        this.addPageSelector('Scrap Mechanic', 'settings.sm', ['fal', 'icon', 'fa-circle-dot']);

        // -- Experimental settings
        this.addPageSelector('Experimental', 'settings.experimental', ['fal', 'icon', 'fa-flask']);


        // -- load in the options
        General(this);
        Experimental(this);
        ScrapMechanic(this);
    }



    /**
     * @name setActive
     * 
     * @description Sets the active page
     * 
     * @param btn The button to set as the currently active page
     */
    public setActive(btn: UIelements.TSelectorButton) {

        // -- If the button is already active, do nothing
        if (this.activeButton === btn) return;

        // -- If the button is not active, set it as active
        else if(this.activeButton) {
            // -- Get the active button
            const active = this.activeButton;

            // -- If the button is active, set it as inactive
            active.panelVisability(false);

            // -- Remove the active class
            active.elements.selector.classList.remove('active');

            // -- Change the icon to a thin variant
            const svg = active.elements.selector.getElementsByTagName('svg')[0];
            if(svg.classList) svg.classList.add('fa-thin');
        }


        // -- Activate the button 
        btn.elements.selector?.classList?.add('active');

        // -- Set the active button
        this.activeButton = btn;

        // -- Change the icon to a solid variant
        const svg = btn.elements.selector?.getElementsByTagName('svg');
        if(svg.length > 0) svg[0].classList?.add('fa-solid');

        // -- Change the visibility of the right panel
        btn.panelVisability(true);
    }



    /**
     * @name addPageSelector
     * 
     * @description Appends the page selector to the left panel of the settings
     * 
     * @param id The id of the element
     * @param localKey Localization key
     * @param iconClasses The classes to append to the element
     * @param active Should the element curently selected
     * 
     * @returns {TSelectorButton} The element that was created
     */
    public addPageSelector(id: string, localKey: string, iconClasses: Array<string>, active = false): UIelements.TSelectorButton {
        // -- Create a new div 
        const selector = document.createElement('div'),
            page = document.createElement('div'),
            icon = document.createElement('i'),
            label = document.createElement('h2');

        // -- Set the class names and id of the main element
        selector.className = 'settings-option flex-left';
        selector.id = 'selector-' + id;

        // -- Add all the classes that were passed in
        iconClasses.forEach(c => icon.classList.add(c));
        
        // -- Append the elements to the main element
        selector.appendChild(icon);
        selector.appendChild(label);

        // -- Append to respective panels
        this.leftPanelSettings.appendChild(selector);
        this.rightPanel.appendChild(page);

        // -- (Localization hook) Set the lable
        this.local.appendHook(localKey, (pair) => {
            label.innerHTML = pair.value;
        });

        // -- Create a reference to the button 
        const group = {
            id: id,
            panelVisability: (visability: boolean) => {
                if (visability === true) page.classList.remove('invisible');
                else page.classList.add('invisible');
            },
            selectorVisability: (visability: boolean) => {
                if (visability === false) selector.classList.add('invisible');
                else selector.classList.remove('invisible');
            },
            elements: { selector, icon, label, page }
        }


        // -- push to the list of elements 
        Settings.elements.push(group);

        // -- Add the click event listener 
        selector.addEventListener('click', () => 
            this.setActive(group));


        // -- If the element should be active, set it as active
        if (active === true) {
            // -- Set the group as active
            this.setActive(group);

            // -- Change the class of the icon to a solid variant
            icon.classList.add('fa-solid');

        } else group.panelVisability(false);

        
        // -- Return the group
        return group;
    }



    /**
     * @name appendOptions
     * 
     * @description Appends the options to the settings panel
     * 
     * @param optionList The list of options to add
     * @param category The category of the options to add to
     * 
     * @return {void}
     */
    public appendOptions(optionList: Array<UIelements.ISettings | undefined>, category: string) {
        // -- Try and find the category 
        const parent = Settings.getGroup(category);

        if(!parent)
            throw new Error('Could not find the parent category');

        optionList.forEach(e => {

            // e === undefined is a visual separator    
            if(e === undefined) {
                const separator = document.createElement('hr');
                separator.className = 'settings-separator';
                parent.elements.page.appendChild(separator);
                return;
            }


            // -- Main div of the option
            const option: HTMLDivElement = document.createElement('div');
            option.className = 'option flex-left';


            // -- Left, Right, top and Bottom areas 
            const left: HTMLDivElement = document.createElement('div'),
                right: HTMLDivElement = document.createElement('div'),
                top: HTMLDivElement = document.createElement('div'),
                bottom: HTMLDivElement = document.createElement('div');


            left.className = 'left';
            right.className = 'right';
            top.className = 'top';
            bottom.className = 'bottom';


            // -- Add the lable and description 
            const label: HTMLHeadingElement = document.createElement('h2'),
                description: HTMLParagraphElement = document.createElement('p');


            // -- Append hooks to the lable and description 
            this.local.appendHook(e.key, (pair) => {
                label.innerHTML = pair.value });

            this.local.appendHook(e.key + '.description', (pair) => {
                description.innerHTML = pair.value });


            // -- Append the elements to the main div 
            top.appendChild(left);
            top.appendChild(right);
            option.appendChild(top);
            option.appendChild(bottom);


            // The options is structured as follows:
            // -- Left  -- Right  < -- Top Element
            // ------- Bottom -------- < -- Bottom Element

            // -- Append the text elements to the left
            left.appendChild(label);
            left.appendChild(description);


            // -- Generate an ID for the option with math 
            const ID = 'option-' + Math.floor(Math.random() * 1000000).toString();
       
            // -- Set the ID of the option 
            option.id = ID;

            // -- Set the input method of the option 
            switch(e.type) {

                // -- Checkbox 
                case 'toggle':
                    // -- Create the input element
                    const [toggleParent] =  
                        createToggleElement(e.value(), option.id, e.onChange); 

                    // -- Append the elements to the option element
                    right.appendChild(toggleParent);

                    // -- Fire the onChange event
                    e.onChange(e.value());
                break;


                // -- Number 
                case 'number': 
                    // -- Create the input element 
                    const [number] = 
                        createNumberElement(e.min, e.max, e.value(), option.id, e.onChange);
                    
                    // -- Append the elements to the option element
                    right.appendChild(number);

                    // Fire the onChange event
                    e.onChange(e.value());
                break;


                // -- Slider 
                case 'slider':
                    // -- Create the input Elements
                    const [slider, sliderInput] =
                        createSliderElement(e.min, e.max, e.value(), option.id, e.onChange);

                    const [num, numInput] = 
                        createNumberElement(e.min, e.max, e.value(), option.id, e.onChange);

                    // -- Append the elements to the option element
                    bottom.appendChild(slider);
                    right.appendChild(num);

                    // -- Add a listener to both so that they update together 
                    slider.addEventListener('input', 
                        () => { numInput.value = sliderInput.value; });

                    num.addEventListener('input',
                        () => { sliderInput.value = numInput.value; });

                    // Fire onChange
                    e.onChange(e.value());
                break;


                // -- Dropdown 
                case 'dropdown':
                    // -- Create the input element
                    const [dropdown] =
                        createDropdownElement(e.options, e.value(), option.id, e.onChange);

                    // -- Append the elements to the option element
                    right.appendChild(dropdown);

                    // -- Fire the onChange event
                    e.onChange(e.value());
                break;

            }

            // -- Append the option to the parent 
            parent.elements.page.appendChild(option);
        });
    }
}

export default Settings;