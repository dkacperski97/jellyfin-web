import type { PlayerPlugin } from 'types/plugin';
import { appHost } from '../../apphost';

function supportsPhysicalVolumeControl(player: PlayerPlugin) {
    return player.isLocalPlayer && appHost.supports('physicalvolumecontrol');
}

export default class VolumeLogic {
    _currentPlayer?: PlayerPlugin | null;

    setVolume(value: number, player?: PlayerPlugin | null) {
        player = player || this._currentPlayer;

        if (player && !supportsPhysicalVolumeControl(player)) {
            player.setVolume?.(value);
        }
    }

    getVolume(player?: PlayerPlugin | null) {
        player = player || this._currentPlayer;

        if (player && !supportsPhysicalVolumeControl(player)) {
            return player.getVolume?.();
        }

        return 1;
    }

    volumeUp(player?: PlayerPlugin | null) {
        player = player || this._currentPlayer;

        if (player && !supportsPhysicalVolumeControl(player)) {
            player.volumeUp?.();
        }
    }

    volumeDown(player?: PlayerPlugin | null) {
        player = player || this._currentPlayer;

        if (player && !supportsPhysicalVolumeControl(player)) {
            player.volumeDown?.();
        }
    }
}
