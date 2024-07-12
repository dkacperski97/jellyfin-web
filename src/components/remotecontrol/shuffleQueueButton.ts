import { PlayerPlugin } from 'types/player';
import { playbackManager } from 'components/playback/playbackmanager';
import Events from '../../utils/events';

export default class ShuffleQueueButton {
    currentPlayer: PlayerPlugin|null = null;
    button: HTMLButtonElement;

    constructor(context: HTMLButtonElement) {
        this.button = context;
        this.button.addEventListener('click', () => {
            if (this.currentPlayer) {
                playbackManager.toggleQueueShuffleMode(this.currentPlayer);
            }
        });
    }

    onShow(player: PlayerPlugin|null) {
        this.bindToPlayer(player);
    }

    destroy() {
        this.releaseCurrentPlayer();
    }

    onPlayerChange(player: PlayerPlugin|null) {
        this.bindToPlayer(player);
    }

    updatePlayerState() {
        this.onShuffleQueueModeChange();
    }

    private onShuffleQueueModeChange() {
        const shuffleMode = playbackManager.getQueueShuffleMode(this);
        const cssClass = 'buttonActive';

        switch (shuffleMode) {
            case 'Shuffle':
                this.button.classList.add(cssClass);
                break;
            case 'Sorted':
            default:
                this.button.classList.remove(cssClass);
                break;
        }
    }

    private releaseCurrentPlayer() {
        const player = this.currentPlayer;

        if (player) {
            Events.off(player, 'shufflequeuemodechange', this.onShuffleQueueModeChange);
            this.currentPlayer = null;
        }
    }

    private bindToPlayer(player: PlayerPlugin|null) {
        this.releaseCurrentPlayer();
        this.currentPlayer = player;

        if (player) {
            Events.on(player, 'shufflequeuemodechange', this.onShuffleQueueModeChange);
        }
    }
}
