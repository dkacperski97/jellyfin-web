export default class VisibleButton {
    buttonVisible(btn: HTMLButtonElement|null, enabled: boolean) {
        if (btn) {
            if (enabled) {
                btn.classList.remove('hide');
            } else {
                btn.classList.add('hide');
            }
        }
    }
}
