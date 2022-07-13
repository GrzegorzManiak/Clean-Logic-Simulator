import SettingsClass from "..";
import { UIelements } from "../../../types";

const options: Array<UIelements.ISettings | undefined> = [
    {
        name: 'Self Wired Logic',
        description: 'Enable / Disables self wireing of logic (If false, self wired logic will be represented as two blocks).',
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