import type { PlayerPlugin } from 'types/plugin';

export default class AirPlayLogic {
    _currentPlayer?: PlayerPlugin | null;

    toggleAirPlay(player?: PlayerPlugin | null) {
        player = player || this._currentPlayer;
        return player?.toggleAirPlay?.();
    }
}
