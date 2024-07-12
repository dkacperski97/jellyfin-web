import { PlayerPlugin } from 'types/player';
import { playbackManager } from 'components/playback/playbackmanager';
import RemoteControlHelper from './remoteControlHelper';

export default class ToggleFullscreenButton {
    currentPlayer: PlayerPlugin|null = null;

    constructor(context: HTMLElement) {
        context.querySelector('.btnToggleFullscreen')?.addEventListener('click', () => {
            if (this.currentPlayer) {
                playbackManager.toggleFullscreen(this.currentPlayer);
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
    updatePlayerState(context: HTMLElement, state: any) {
        const item = state.NowPlayingItem;
        const playerInfo = playbackManager.getPlayerInfo();
        const supportedCommands = playerInfo?.supportedCommands;
        RemoteControlHelper.buttonVisible(context.querySelector<HTMLButtonElement>('.btnToggleFullscreen'), item && item.MediaType == 'Video' && supportedCommands.includes('ToggleFullscreen'));
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
