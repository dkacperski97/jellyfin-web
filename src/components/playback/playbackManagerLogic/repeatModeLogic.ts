import type { PlayerPlugin } from 'types/plugin';
import type PlayQueueManager from '../playqueuemanager';
import Events from '../../../utils/events';
import { enableLocalPlaylistManagement } from '../playbackManagerHelper';

export default class RepeatModeLogic {
    _currentPlayer?: PlayerPlugin | null;
    _playQueueManager?: PlayQueueManager;

    setRepeatMode(value: string, player = this._currentPlayer) {
        if (player && !enableLocalPlaylistManagement(player)) {
            return player.setRepeatMode?.(value);
        }

        this._playQueueManager?.setRepeatMode(value);
        Events.trigger(player, 'repeatmodechange');
    }

    getRepeatMode(player = this._currentPlayer) {
        if (player && !enableLocalPlaylistManagement(player)) {
            return player.getRepeatMode?.();
        }

        return this._playQueueManager?.getRepeatMode();
    }
}
