import SettingsClass from "..";
import { UIelements } from "../../../types";

const options: Array<UIelements.ISettings | undefined> = [
    {
        name: 'WASM Mode',
        description: 'Enable / Disables the experimental WASM mode (Reload required).',
        type: 'toggle',
        default: false,
        value: () => SettingsClass.getLocalBoolean('settings.exp.wasm', false),
        onChange: (value: boolean) => {
            SettingsClass.setLocalBoolean('settings.exp.wasm', value);
        }
    },
    {
        name: 'Truthtable Export',
        description: 'Converts your circuit into a truthtable and exports possibly simplifing your circuit.',
        type: 'toggle',
        default: false,
        value: () => SettingsClass.getLocalBoolean('settings.exp.truthtable', false),
        onChange: (value: boolean) => {
            SettingsClass.setLocalBoolean('settings.exp.truthtable', value);
        }
    }
]

function Experimental(Settings: SettingsClass) {
    Settings.addOptions(options, 'experimental');
}
 
export default Experimental;