import SettingsClass from "..";
import { UIelements } from "../../../types";

const options: Array<UIelements.ISettings | undefined> = [
    {
        name: 'WASM Mode',
        description: 'Enable / Disables the experimental WASM mode (Reload required).',
        type: 'toggle',
        default: false,
        value: () => SettingsClass.getLocalBoolean('settings.gen.wasm', false),
        onChange: (value: boolean) => {
            SettingsClass.setLocalBoolean('settings.gen.wasm', value);
        }
    }
]

function Experimental(Settings: SettingsClass) {
    Settings.addOptions(options, 'experimental');
}
 
export default Experimental;