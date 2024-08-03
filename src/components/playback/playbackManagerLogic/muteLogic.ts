import type { PlayerPlugin } from 'types/plugin';

export default class MuteLogic {
    _currentPlayer?: PlayerPlugin | null;

    isMuted(player = this._currentPlayer) {
        if (player) {
            return player.isMuted?.();
        }

        return false;
    }

    setMute(mute: boolean, player = this._currentPlayer) {
        if (player) {
            player.setMute?.(mute);
        }
    }

    toggleMute(mute: boolean, player = this._currentPlayer) {
        if (player) {
            if (player.toggleMute) {
                player.toggleMute();
            } else {
                player.setMute?.(!player.isMuted?.());
            }
        }
    }
}
