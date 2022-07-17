import SettingsClass from "..";
import { UIelements } from "../../../types";
import { getLocalBoolean, setLocalBoolean } from "../../inputs";

const options: Array<UIelements.ISettings | undefined> = [
    {
        key: 'settings.scrap.mechanic.mode.self.wired.logic',
        type: 'toggle',
        default: true,
        value: () => getLocalBoolean('settings.scrapMechanic.selfWiredLogic', true),
        onChange: (value: boolean) => {
            setLocalBoolean('settings.scrapMechanic.selfWiredLogic', value);
        }
    },
]

function ScrapMechanic(Settings: SettingsClass) {
    Settings.appendOptions(options, 'Scrap Mechanic');
}
 
export default ScrapMechanic;