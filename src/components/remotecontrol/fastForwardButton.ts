import { PlayerPlugin } from 'types/player';
import { playbackManager } from 'components/playback/playbackmanager';
import RemoteControlHelper from './remoteControlHelper';
import layoutManager from '../layoutManager';

export default class FastForwardButton {
    currentPlayer: PlayerPlugin|null = null;
    button: HTMLButtonElement;

    constructor(context: HTMLButtonElement) {
        this.button = context;
        this.button.addEventListener('click', () => {
            if (this.currentPlayer) {
                playbackManager.fastForward(this.currentPlayer);
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
        if (layoutManager.mobile) {
            const playingVideo = playbackManager.isPlayingVideo() && item !== null;
            const playingAudio = !playbackManager.isPlayingVideo() && item !== null;
            const playingAudioBook = playingAudio && item.Type == 'AudioBook';
            RemoteControlHelper.buttonVisible(this.button, playingVideo || playingAudioBook);
        } else {
            RemoteControlHelper.buttonVisible(this.button, item != null);
        }
    }

    private releaseCurrentPlayer() {
        const player = this.currentPlayer;

        if (player) {
            this.currentPlayer = null;
        }
    }

    private bindToPlayer(player: PlayerPlugin|null) {
        this.releaseCurrentPlayer();
        this.currentPlayer = player;
    }
}
