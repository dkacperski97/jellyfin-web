import { PlayerPlugin } from 'types/player';
import VisibleButton from './visibleButton';
import { playbackManager } from 'components/playback/playbackmanager';

export default class AudioTracksButton extends VisibleButton {
    currentPlayer: PlayerPlugin|null = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    lastPlayerState: any|null;

    constructor(context: HTMLElement) {
        super();
        context.querySelector('.btnAudioTracks')?.addEventListener('click', (e) => {
            if (this.currentPlayer && this.lastPlayerState?.NowPlayingItem) {
                this.showAudioMenu(context, this.currentPlayer, e.target as HTMLButtonElement);
            }
        });
    }

    onShow(player: PlayerPlugin|null) {
        this.bindToPlayer(player);
    }

    destroy() {
        this.releaseCurrentPlayer();
        this.lastPlayerState = null;
    }

    onPlayerChange(player: PlayerPlugin|null) {
        this.bindToPlayer(player);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updatePlayerState(player: PlayerPlugin|null, context: HTMLElement, state: any) {
        this.lastPlayerState = state;
        const playerInfo = playbackManager.getPlayerInfo();
        const supportedCommands = playerInfo?.supportedCommands;

        this.buttonVisible(context.querySelector('.btnAudioTracks'), playbackManager.audioTracks(player).length > 1 && supportedCommands.indexOf('SetAudioStreamIndex') != -1);
    }

    private showAudioMenu(context: HTMLElement, player: PlayerPlugin|null, button: HTMLButtonElement) {
        const currentIndex = playbackManager.getAudioStreamIndex(player);
        const streams = playbackManager.audioTracks(player);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const menuItems = streams.map((s: any) => ({
            name: s.DisplayTitle,
            id: s.Index,
            selected: s.Index == currentIndex
        }));

        void import('../actionSheet/actionSheet').then((actionSheet) => {
            void actionSheet.show({
                items: menuItems,
                positionTo: button,
                callback: function (id) {
                    playbackManager.setAudioStreamIndex(parseInt(id, 10), player);
                }
            });
        });
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
