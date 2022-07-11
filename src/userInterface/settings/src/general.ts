import SettingsClass from "..";
import { UIelements } from "../../../types";

const options: Array<UIelements.ISettings> = [
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
    Settings.addOptions(options, 'general');
}
 
export default General;