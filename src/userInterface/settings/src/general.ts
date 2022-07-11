import SettingsClass from "..";
import { UIelements } from "../../../types";

const options: Array<UIelements.ISettings | undefined> = [
    {
        name: 'Font Size',
        description: 'Change the size of the font.',
        type: 'slider',
        value: () => SettingsClass.getLocalNumber('settings.gen.fontSize', 50),
        default: 50,
        min: 1,
        max: 100,
        onChange: (value: number) => {
            if (value < 1) value = 1;
            if (value > 100) value = 100;
            SettingsClass.setLocalNumber('settings.gen.fontSize', value);
        },
    },
    {
        name: 'Dark Mode',
        description: 'Enable / Disables the dark mode.',
        type: 'toggle',
        default: true,
        value: () => SettingsClass.getLocalBoolean('settings.gen.darkmode', true),
        onChange: (value: boolean) => {
            SettingsClass.setLocalBoolean('settings.gen.darkmode', value);
        },
    },
    {
        name: 'Experimental Features',
        description: 'Enable / Disables the experimental features Panel.',
        type: 'toggle',
        default: false,
        value: () => SettingsClass.getLocalBoolean('settings.gen.experimental', false),
        onChange: (value: boolean) => {
            SettingsClass.setLocalBoolean('settings.gen.experimental', value);
        },
    },
    {
        name: 'Developer Mode',
        description: 'Enable / Disables the developer mode.',
        type: 'toggle',
        default: false,
        value: () => SettingsClass.getLocalBoolean('settings.gen.developer', false),
        onChange: (value: boolean) => {
            SettingsClass.setLocalBoolean('settings.gen.developer', value);
        },
    },
    {
        name: 'Test Number',
        description: 'Change the number of the test.',
        type: 'number',
        value: () => SettingsClass.getLocalNumber('settings.gen.testNumber', 0),
        default: 0,
        min: 0,
        max: 100,
        onChange: (value: number) => {
            if (value < 0) value = 0;
            if (value > 100) value = 100;
            SettingsClass.setLocalNumber('settings.gen.testNumber', value);
        }
    }
]

function General(Settings: SettingsClass) {
    const page = document.createElement('div');

    options.forEach(o => {
        // -- Create new elements -- //
        const option = document.createElement('div'),
            left = document.createElement('div'),
            right = document.createElement('div'),
            top = document.createElement('div'),
            bottom = document.createElement('div'),
            label = document.createElement('h2'),
            description = document.createElement('p');

        // -- Set the class of the main element
        option.className = 'settings-option-right flex-left';

        // -- Set the lable and description -- //
        label.innerHTML = o.name;
        description.innerHTML = o.description;

        // -- Append the elements to the main element
        left.appendChild(label);
        left.appendChild(description);
        
        
        // -- Append the left and right elements to the option element -- //
        top.appendChild(left);
        left.classList.add('left');

        top.appendChild(right);
        right.classList.add('right');

        // -- Append the top element to the option element -- //
        option.appendChild(top);
        top.classList.add('top');

        // -- Append the bottom element to the option element -- //
        option.appendChild(bottom);
        bottom.classList.add('bottom');


        // -- Generate an ID for the input element -- //
        option.id = 'gen-option-' + o.name.split(' ').join('-');

        switch (o.type) {
            case 'number': 
                const [number, input] = Settings.createNumberElement(o.min, o.max, o.value(), option.id, o.onChange);
                right.appendChild(number);
                right.appendChild(input);
                break;


            case 'toggle':
                // Create the input element
                const [toggleParent, toggle] =  
                    Settings.createToggleElement(o.value(), option.id, o.onChange); 

                // Append the elements to the option element
                right.appendChild(toggleParent);
                break;

            case 'slider':
                // -- Create the slider -- //
                const [sliderParent, slider] = 
                    Settings.createSliderElement(o.min, o.max, o.value(), option.id, o.onChange);

                // -- Create the input element -- //
                const [numberChild, numberInput] = 
                    Settings.createNumberElement(o.min, o.max, o.value(), option.id, o.onChange);
                

                // -- Add event listeners to the slider -- //
                slider.addEventListener('input', () => {
                    numberInput.value = slider.value;
                });

                // -- Add event listeners to the number input -- //
                numberInput.addEventListener('input', () => {
                    slider.value = numberInput.value;
                });


                // -- Append the elements to the option element -- //
                right.appendChild(numberChild);

                bottom.appendChild(sliderParent);
                break;
        }

        // -- Append the elements to the main element -- //
        page.appendChild(option);
    });

    // -- Append the page to the main document -- //
    Settings.rightPanel.appendChild(page);

    // -- Function to change the state of the settings -- //
    function hide(visability: boolean) {
        if (visability === true) page.classList.remove('invisible');
        else page.classList.add('invisible');
    }
    
    // -- Add the Settings to the list of elements -- //
    Settings.add('General', ['fal', 'icon', 'fa-gear'], true, hide);
}

export default General;