import SettingsClass from "..";
import { UIelements } from "../../../types";

import { 
    getLocalBoolean, 
    setLocalBoolean, 
} from "../../inputs";

const options: Array<UIelements.ISettings | undefined> = [
    {
        key: 'settings.experimental.features.wasm.mode',
        type: 'toggle',
        default: false,
        value: () => getLocalBoolean('settings.exp.wasm', false),
        onChange: (value) => {
            setLocalBoolean('settings.exp.wasm', value);
        }
    },
    {
        key: 'settings.experimental.features.truthtable.export',
        type: 'toggle',
        default: false,
        value: () => getLocalBoolean('settings.exp.truthtable', false),
        onChange: (value) => {
            setLocalBoolean('settings.exp.truthtable', value);
        }
    }
]

function Experimental(Settings: SettingsClass) {
    Settings.appendOptions(options, 'experimental');
}
 
export default Experimental;