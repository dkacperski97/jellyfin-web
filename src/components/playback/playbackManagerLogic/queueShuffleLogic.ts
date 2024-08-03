import type { PlayerPlugin } from 'types/plugin';
import type PlayQueueManager from '../playqueuemanager';
import Events from '../../../utils/events';
import { enableLocalPlaylistManagement } from '../playbackManagerHelper';

export default class QueueShuffleLogic {
    _currentPlayer?: PlayerPlugin | null;
    _playQueueManager: PlayQueueManager;

    constructor(_playQueueManager: PlayQueueManager) {
        this._playQueueManager = _playQueueManager;
    }

    setQueueShuffleMode(value: string, player = this._currentPlayer) {
        if (player && !enableLocalPlaylistManagement(player)) {
            return player.setQueueShuffleMode?.(value);
        }

        this._playQueueManager.setShuffleMode(value);
        Events.trigger(player, 'shufflequeuemodechange');
    }

    getQueueShuffleMode(player = this._currentPlayer) {
        if (player && !enableLocalPlaylistManagement(player)) {
            return player.getQueueShuffleMode?.();
        }

        return this._playQueueManager.getShuffleMode();
    }

    toggleQueueShuffleMode(player = this._currentPlayer) {
        if (player && !enableLocalPlaylistManagement(player)) {
            const currentValue = player.getQueueShuffleMode?.();
            switch (currentValue) {
                case 'Shuffle':
                    player.setQueueShuffleMode?.('Sorted');
                    break;
                case 'Sorted':
                    player.setQueueShuffleMode?.('Shuffle');
                    break;
                default:
                    throw new TypeError('current value for shufflequeue is invalid');
            }
        } else {
            this._playQueueManager.toggleShuffleMode();
        }
        Events.trigger(player, 'shufflequeuemodechange');
    }
}
