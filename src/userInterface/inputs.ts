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
export function createNumberElement(min: number, max: number, value: number, id: string, callback: (x: number) => void): [HTMLDivElement, HTMLInputElement] {
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
export function createToggleElement(value: boolean, id: string, callback: (x: boolean) => void): [HTMLDivElement, HTMLInputElement] {
    const input = document.createElement('input'),
        label = document.createElement('label'),
        parent = document.createElement('div');

    // -- Set the Input -- //
    input.type = 'checkbox';
    input.id = id + '-toggle';
    input.classList.add('toggle');
    input.checked = value;

    // -- Add the event listener -- //
    input.addEventListener('change', () => 
        callback(input.checked));

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
export function createSliderElement(min: number, max: number, value: number, id: string, callback: (x: number) => void): [HTMLDivElement, HTMLInputElement] {
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
    input.addEventListener('change', () => 
        callback(parseInt(input.value)));

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
 * @name createDropdownElement
 * 
 * @description Creates a dropdown element
 * 
 * @param {Array<string>} options The options to display in the dropdown
 * @param {string} value The current value of the dropdown
 * @param {string} id The base of the id for the input elm
 * @param {(x: string) => void} callback The callback function to call when the value changes
 * 
 * @returns [HTMLDivElement, HTMLSelectElement] The paremt element and the input element
 */
export function createDropdownElement(options: Array<string>, value: string, id: string, callback: (x: string) => void): [HTMLDivElement, HTMLSelectElement] {
    const input = document.createElement('select'),
        label = document.createElement('label'),
        parent = document.createElement('div');

    // -- Set the Input -- //
    input.id = id + '-dropdown';
    input.classList.add('dropdown');

    // -- Add the options -- //
    options.forEach(option => {
        const optionElm = document.createElement('option');

        optionElm.value = option;
        optionElm.innerText = option;

        input.appendChild(optionElm);
    });

    // -- Set the label -- //
    label.setAttribute('for', input.id);
    label.classList.add('dropdown');

    // -- Add the event listener -- //
    input.addEventListener('change', () => 
        callback(input.value));

    // -- Set the active value -- //
    input.value = value;

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
 * @param {string} key The name of the item to get
 * @param {boolean} defaultValue The default value to return if the item is not found
 * @returns {boolean} The value of the item
 */
export function getLocalBoolean(key: string, defaultValue: boolean): boolean {
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
export function setLocalBoolean(key: string, value: boolean): void {
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
export function getLocalNumber(key: string, def: number): number {
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
export function setLocalNumber(key: string, value: number): void {
    localStorage.setItem(key, value.toString());
}



/**
 * @name getLocalString
 * 
 * @description This function will get the value of a local storage item and return it as a string
 * 
 * @param {string} name The name of the item to get
 * @param {string} defaultValue The default value to return if the item is not found
 * 
 * @returns {string} The value of the item
 */
export function getLocalString(key: string, def: string): string {
    const value = localStorage.getItem(key);
    if (value === null) {
        localStorage.setItem(key, def);
        return def;
    }
    return value;
}

/**
 * @name setLocalString
 * 
 * @description This function will set the value of a local storage item
 * 
 * @param {string} name The name of the item to set
 * @param {string} value The value to set the item to
 * 
 * @returns {void}  
 */

export function setLocalString(key: string, value: string): void {
    localStorage.setItem(key, value);
}