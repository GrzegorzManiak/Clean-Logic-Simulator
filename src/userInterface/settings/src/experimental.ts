import SettingsClass from "..";
import { UIelements } from "../../../types";

const options: Array<UIelements.ISettings | undefined> = [
    {
        key: 'settings.experimental.features.wasm.mode',
        type: 'toggle',
        default: false,
        value: () => SettingsClass.getLocalBoolean('settings.exp.wasm', false),
        onChange: (value: boolean) => {
            SettingsClass.setLocalBoolean('settings.exp.wasm', value);
        }
    },
    {
        key: 'settings.experimental.features.truthtable.export',
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