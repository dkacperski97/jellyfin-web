import RemoteControlHelper from './remoteControlHelper';
import { playbackManager } from '../playback/playbackmanager';
import { PlayerPlugin } from 'types/player';

export default class PreviousTrackButton {
    context: HTMLElement;
    currentPlayer: PlayerPlugin|null = null;

    constructor(context: HTMLElement) {
        this.context = context;

        this.context.querySelector<HTMLButtonElement>('.btnPreviousTrack')?.addEventListener('click', (e) => {
            if (this.currentPlayer) {
                if (playbackManager.isPlayingAudio(this.currentPlayer)) {
                    // Cancel this event if doubleclick is fired. The actual previousTrack will be processed by the 'dblclick' event
                    if (e.detail > 1 ) {
                        return;
                    }

                    // Return to start of track, unless we are already (almost) at the beginning. In the latter case, continue and move
                    // to the previous track, unless we are at the first track so no previous track exists.
                    // currentTime is in msec.

                    if (playbackManager.currentTime(this.currentPlayer) >= 5 * 1000 || playbackManager.getCurrentPlaylistIndex(this.currentPlayer) <= 0) {
                        playbackManager.seekPercent(0, this.currentPlayer);
                        // This is done automatically by playbackManager, however, setting this here gives instant visual feedback.
                        // TODO: Check why seekPercent doesn't reflect the changes immediately, so we can remove this workaround.
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const nowPlayingPositionSlider = this.context.querySelector<any>('.nowPlayingPositionSlider');
                        if (nowPlayingPositionSlider) {
                            nowPlayingPositionSlider.value = 0;
                        }
                        return;
                    }
                }
                playbackManager.previousTrack(this.currentPlayer);
            }
        });

        this.context.querySelector('.btnPreviousTrack')?.addEventListener('dblclick', () => {
            if (this.currentPlayer) {
                playbackManager.previousTrack(this.currentPlayer);
            }
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updatePlayerState(state: any) {
        const item = state.NowPlayingItem;

        RemoteControlHelper.buttonVisible(this.context.querySelector<HTMLButtonElement>('.btnPreviousTrack'), item != null);
    }

    onPlayerChange(player: PlayerPlugin|null) {
        this.bindToPlayer(player);
    }

    onShow(player: PlayerPlugin|null) {
        this.bindToPlayer(player);
    }

    destroy() {
        this.releaseCurrentPlayer();
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
