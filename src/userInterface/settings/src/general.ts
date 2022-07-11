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
    undefined,
    {
        name: 'Experimental Features',
        description: 'Enable / Disables the experimental features Panel.',
        type: 'toggle',
        default: false,
        value: () => SettingsClass.getLocalBoolean('settings.gen.experimental', false),
        onChange: (value: boolean) => {
            SettingsClass.setLocalBoolean('settings.gen.experimental', value);
            SettingsClass.getGroup('experimental')?.buttonVisability(value);
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
            SettingsClass.getGroup('developer')?.buttonVisability(value);
        },
    },
    undefined,
    {
        name: 'Auto Save',
        description: 'Enable / Disables the auto save.',
        type: 'toggle',
        default: true,
        value: () => SettingsClass.getLocalBoolean('settings.gen.autosave', true),
        onChange: (value: boolean) => {
            SettingsClass.setLocalBoolean('settings.gen.autosave', value);
        }
    },
    {
        name: 'Auto Save Interval',
        description: 'Change the auto save interval (In minutes).',
        type: 'slider',
        value: () => SettingsClass.getLocalNumber('settings.gen.autosaveInterval', 1000),
        min: 1,
        max: 60,
        default: 5,
        onChange: (value: number) => {
            if (value < 1) value = 1;
            if (value > 60) value = 60;
            SettingsClass.setLocalNumber('settings.gen.autosaveInterval', value);
        }
    }
]

function General(Settings: SettingsClass) {
    Settings.addOptions(options, 'general');
}
 
export default General;