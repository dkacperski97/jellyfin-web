export default class RemoteControlHelper {
    static buttonVisible(btn: HTMLButtonElement|null|undefined, enabled: boolean) {
        if (btn) {
            if (enabled) {
                btn.classList.remove('hide');
            } else {
                btn.classList.add('hide');
            }
        }
    }
}
