import SettingsClass from "..";
import { UIelements } from "../../../types";

const options: Array<UIelements.ISettings | undefined> = [
    {
        key: 'settings.scrap.mechanic.mode.self.wired.logic',
        type: 'toggle',
        default: true,
        value: () => SettingsClass.getLocalBoolean('settings.scrapMechanic.selfWiredLogic', true),
        onChange: (value: boolean) => {
            SettingsClass.setLocalBoolean('settings.scrapMechanic.selfWiredLogic', value);
        }
    },
]

function ScrapMechanic(Settings: SettingsClass) {
    Settings.addOptions(options, 'Scrap Mechanic');
}
 
export default ScrapMechanic;