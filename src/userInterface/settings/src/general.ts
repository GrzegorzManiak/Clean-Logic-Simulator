import SettingsClass from "..";
import Localization from "../../../localization";
import { UIelements } from "../../../types";

import { 
    getLocalBoolean, 
    getLocalNumber, 
    getLocalString, 
    setLocalBoolean, 
    setLocalNumber, 
    setLocalString 
} from "../../inputs";

const options: Array<UIelements.ISettings | undefined> = [
    {
        key: 'settings.general.font.scale',
        type: 'slider',
        value: () => getLocalNumber('settings.gen.fontScale', 100),
        default: 100,
        min: 50,
        max: 200,
        onChange: (value) => {
            if (value < 50) value = 50;
            if (value > 200) value = 200;
                setLocalNumber('settings.gen.fontScale', value);

            // Get the css root variable '--font-scale'
            document.documentElement.style.setProperty('--font-scale', `${value / 100}`);
        },
    },
    {
        key: 'settings.general.language',
        type: 'dropdown',
        position: 'right',
        value: () => getLocalString('settings.gen.language', 'English'),
        default: 'English', 
        options: Localization.getLanguages(),
        onChange: async(value) => {
            setLocalString('settings.gen.language', value);

            const langCode = Localization.suportedLanguages.find(lang => lang.name === value)?.language ?? 'en';
            
            Localization.determineLanguage(langCode);

            const local = Localization.getInstance();

            await local.loadLocalizationResource();

            local.executeHooks();
        }
    },
    {
        key: 'settings.general.darkmode',
        type: 'toggle',
        default: true,
        value: () => getLocalBoolean('settings.gen.darkmode', true),
        onChange: (value) => {
            setLocalBoolean('settings.gen.darkmode', value);
        },
    },
    undefined,
    {
        key: 'settings.general.scrap.mechanic.mode',
        type: 'toggle',
        default: true,
        value: () => getLocalBoolean('settings.gen.scrapMechanic', true),
        onChange: (value) => {
            setLocalBoolean('settings.gen.scrapMechanic', value);
            SettingsClass.getGroup('scrap mechanic')?.selectorVisability(value);
        }
    },
    undefined,
    {
        key: 'settings.general.experimental.features',
        type: 'toggle',
        default: false,
        value: () => getLocalBoolean('settings.gen.experimental', false),
        onChange: (value) => {
            setLocalBoolean('settings.gen.experimental', value);
            SettingsClass.getGroup('experimental')?.selectorVisability(value);
        },
    },
    {
        key: 'settings.general.developer.mode',
        type: 'toggle',
        default: false,
        value: () => getLocalBoolean('settings.gen.developer', false),
        onChange: (value) => {
            setLocalBoolean('settings.gen.developer', value);
            SettingsClass.getGroup('developer')?.selectorVisability(value);
        },
    },
    undefined,
    {

        key: 'settings.general.auto.save',
        type: 'toggle',
        default: true,
        value: () => getLocalBoolean('settings.gen.autosave', true),
        onChange: (value) => {
            setLocalBoolean('settings.gen.autosave', value);
        }
    },
    {
        key: 'settings.general.auto.save.interval',
        type: 'slider',
        value: () => getLocalNumber('settings.gen.autosaveInterval', 5),
        min: 1,
        max: 60,
        default: 5,
        onChange: (value) => {
            if (value < 1) value = 1;
            if (value > 60) value = 60;
            setLocalNumber('settings.gen.autosaveInterval', value);
        }
    }
]

function General(Settings: SettingsClass) {
    Settings.appendOptions(options, 'general');
}
 
export default General;