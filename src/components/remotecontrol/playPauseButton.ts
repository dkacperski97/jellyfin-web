import { PlayerPlugin } from 'types/player';
import { playbackManager } from 'components/playback/playbackmanager';
import RemoteControlHelper from './remoteControlHelper';
import Events from '../../utils/events';

export default class PlayPauseButton {
    currentPlayer: PlayerPlugin|null = null;
    button: HTMLButtonElement;

    constructor(context: HTMLButtonElement) {
        this.button = context;
        this.button.addEventListener('click', () => {
            if (this.currentPlayer) {
                playbackManager.playPause(this.currentPlayer);
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updatePlayerState(state: any) {
        const item = state.NowPlayingItem;
        const playState = state.PlayState || {};
        this.updatePlayPauseState(playState.IsPaused, item != null);
    }

    private onPlayPauseStateChanged() {
        this.updatePlayPauseState(playbackManager.paused(), true);
    }

    private updatePlayPauseState(isPaused: boolean, isActive: boolean) {
        const btnPlayPauseIcon = this.button.querySelector('.material-icons');

        btnPlayPauseIcon?.classList.remove('play_circle_filled', 'pause_circle_filled');
        btnPlayPauseIcon?.classList.add(isPaused ? 'play_circle_filled' : 'pause_circle_filled');
        RemoteControlHelper.buttonVisible(this.button, isActive);
    }

    private releaseCurrentPlayer() {
        const player = this.currentPlayer;

        if (player) {
            Events.off(player, 'pause', this.onPlayPauseStateChanged);
            Events.off(player, 'unpause', this.onPlayPauseStateChanged);
            this.currentPlayer = null;
        }
    }

    private bindToPlayer(player: PlayerPlugin|null) {
        this.releaseCurrentPlayer();
        this.currentPlayer = player;

        if (player) {
            Events.on(player, 'pause', this.onPlayPauseStateChanged);
            Events.on(player, 'unpause', this.onPlayPauseStateChanged);
        }
    }
}
