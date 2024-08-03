import type { PlayerPlugin } from 'types/plugin';

export default class BrightnessLogic {
    _currentPlayer?: PlayerPlugin | null;
    brightnessOsdLoaded?: boolean;

    setBrightness(value: number, player?: PlayerPlugin | null) {
        player = player || this._currentPlayer;

        if (player) {
            if (!this.brightnessOsdLoaded) {
                this.brightnessOsdLoaded = true;
                // TODO: Have this trigger an event instead to get the osd out of here
                void import('../brightnessosd').then();
            }
            player.setBrightness?.(value);
        }
    }

    getBrightness(player?: PlayerPlugin | null) {
        player = player || this._currentPlayer;

        if (player) {
            return player.getBrightness?.();
        }
    }
}
