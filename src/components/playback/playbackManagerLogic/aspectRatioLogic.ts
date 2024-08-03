import type { PlayerPlugin } from 'types/plugin';

export default class AspectRatioLogic {
    _currentPlayer?: PlayerPlugin | null;

    toggleAspectRatio(player?: PlayerPlugin | null) {
        player = player || this._currentPlayer;

        if (player) {
            const current = this.getAspectRatio(player);

            const supported = this.getSupportedAspectRatios(player);

            let index = -1;
            for (let i = 0, length = supported.length; i < length; i++) {
                if (supported[i].id === current) {
                    index = i;
                    break;
                }
            }

            index++;
            if (index >= supported.length) {
                index = 0;
            }

            this.setAspectRatio(supported[index].id, player);
        }
    }

    setAspectRatio(value: string, player?: PlayerPlugin | null) {
        player = player || this._currentPlayer;

        if (player?.setAspectRatio) {
            player.setAspectRatio(value);
        }
    }

    getSupportedAspectRatios(player?: PlayerPlugin | null) {
        player = player || this._currentPlayer;

        if (player?.getSupportedAspectRatios) {
            return player.getSupportedAspectRatios();
        }

        return [];
    }

    getAspectRatio(player?: PlayerPlugin | null) {
        player = player || this._currentPlayer;

        if (player?.getAspectRatio) {
            return player.getAspectRatio();
        }
    }
}
