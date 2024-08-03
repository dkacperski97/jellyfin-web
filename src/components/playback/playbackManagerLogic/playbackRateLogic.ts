import type { PlayerPlugin } from 'types/plugin';

export default class PlaybackRateLogic {
    _currentPlayer?: PlayerPlugin | null;

    increasePlaybackRate(player?: PlayerPlugin | null) {
        player = player || this._currentPlayer;
        if (player) {
            const current = this.getPlaybackRate(player);
            const supported = this.getSupportedPlaybackRates(player);

            let index = -1;
            for (let i = 0, length = supported.length; i < length; i++) {
                if (supported[i].id === current) {
                    index = i;
                    break;
                }
            }

            index = Math.min(index + 1, supported.length - 1);
            this.setPlaybackRate(supported[index].id, player);
        }
    }

    decreasePlaybackRate(player?: PlayerPlugin | null) {
        player = player || this._currentPlayer;
        if (player) {
            const current = this.getPlaybackRate(player);
            const supported = this.getSupportedPlaybackRates(player);

            let index = -1;
            for (let i = 0, length = supported.length; i < length; i++) {
                if (supported[i].id === current) {
                    index = i;
                    break;
                }
            }

            index = Math.max(index - 1, 0);
            this.setPlaybackRate(supported[index].id, player);
        }
    }

    getSupportedPlaybackRates(player?: PlayerPlugin | null) {
        player = player || this._currentPlayer;
        if (player?.getSupportedPlaybackRates) {
            return player.getSupportedPlaybackRates();
        }
        return [];
    }

    setPlaybackRate(value: number, player = this._currentPlayer) {
        if (player?.setPlaybackRate) {
            player.setPlaybackRate(value);

            // Save the new playback rate in the browser session, to restore when playing a new video.
            sessionStorage.setItem('playbackRateSpeed', value.toString());
        }
    }

    getPlaybackRate(player = this._currentPlayer) {
        if (player?.getPlaybackRate) {
            return player.getPlaybackRate();
        }

        return null;
    }
}
