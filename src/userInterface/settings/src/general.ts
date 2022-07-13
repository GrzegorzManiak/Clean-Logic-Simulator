import SettingsClass from "..";
import { UIelements } from "../../../types";

const options: Array<UIelements.ISettings | undefined> = [
    {
        name: 'Font Scale',
        description: 'Change the Scale of the font.',
        type: 'slider',
        value: () => SettingsClass.getLocalNumber('settings.gen.fontScale', 100),
        default: 100,
        min: 50,
        max: 200,
        onChange: (value: number) => {
            if (value < 50) value = 50;
            if (value > 200) value = 200;
            SettingsClass.setLocalNumber('settings.gen.fontScale', value);

            // Get the css root variable '--font-scale'
            document.documentElement.style.setProperty('--font-scale', `${value / 100}`);
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
        name: 'Scrap Mechanic Mode',
        description: 'Enable / Disables the scrap mechanic mode.',
        type: 'toggle',
        default: true,
        value: () => SettingsClass.getLocalBoolean('settings.gen.scrapMechanic', true),
        onChange: (value: boolean) => {
            SettingsClass.setLocalBoolean('settings.gen.scrapMechanic', value);
            SettingsClass.getGroup('scrap mechanic')?.buttonVisability(value);
        }
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
        value: () => SettingsClass.getLocalNumber('settings.gen.autosaveInterval', 5),
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