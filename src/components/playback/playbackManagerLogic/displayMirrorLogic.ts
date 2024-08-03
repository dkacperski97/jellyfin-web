import appSettings from '../../../scripts/settings/appSettings';

export default class DisplayMirrorLogic {
    toggleDisplayMirroring() {
        this.enableDisplayMirroring(!this.enableDisplayMirroring());
    }

    enableDisplayMirroring(enabled?: boolean) {
        if (enabled != null) {
            const val = enabled ? '1' : '0';
            appSettings.set('displaymirror', val);
            return;
        }

        return (appSettings.get('displaymirror') || '') !== '0';
    }
}
