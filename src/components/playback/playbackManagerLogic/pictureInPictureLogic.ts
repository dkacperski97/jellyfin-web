import type { PlayerPlugin } from 'types/plugin';

export default class PictureInPictureLogic {
    _currentPlayer?: PlayerPlugin | null;

    togglePictureInPicture(player?: PlayerPlugin | null) {
        player = player || this._currentPlayer;
        return player?.togglePictureInPicture?.();
    }
}
