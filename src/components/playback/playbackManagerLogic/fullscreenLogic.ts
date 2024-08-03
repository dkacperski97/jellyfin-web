import type { PlayerPlugin } from 'types/plugin';
import Screenfull from 'screenfull';

export default class FullscreenLogic {
    _currentPlayer?: PlayerPlugin | null;

    isFullscreen(player?: PlayerPlugin | null) {
        player = player || this._currentPlayer;
        if (player && (!player.isLocalPlayer || player.isFullscreen)) {
            return player.isFullscreen?.();
        }

        if (!Screenfull.isEnabled) {
            // iOS Safari
            return document.webkitIsFullScreen;
        }

        return Screenfull.isFullscreen;
    }

    toggleFullscreen(player?: PlayerPlugin | null) {
        player = player || this._currentPlayer;
        if (player && (!player.isLocalPlayer || player.toggleFullscreen)) {
            return player.toggleFullscreen?.();
        }

        if (Screenfull.isEnabled) {
            void Screenfull.toggle();
        } else if (document.webkitIsFullScreen && document.webkitCancelFullscreen) {
            // iOS Safari
            document.webkitCancelFullscreen();
        } else {
            const elem = document.querySelector('video');
            if (elem?.webkitEnterFullscreen) {
                elem.webkitEnterFullscreen();
            }
        }
    }
}
