import { PlayerPlugin } from 'types/player';
import VisibleButton from './visibleButton';
import { playbackManager } from 'components/playback/playbackmanager';
import globalize from 'scripts/globalize';

export default class SubtitlesButton extends VisibleButton {
    currentPlayer: PlayerPlugin|null = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    lastPlayerState: any|null;

    constructor(context: HTMLElement) {
        super();
        context.querySelector('.btnSubtitles')?.addEventListener('click', (e) => {
            if (this.currentPlayer && this.lastPlayerState?.NowPlayingItem) {
                this.showSubtitleMenu(context, this.currentPlayer, e.target as HTMLButtonElement);
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

        this.buttonVisible(context.querySelector('.btnSubtitles'), playbackManager.subtitleTracks(player).length && supportedCommands.indexOf('SetSubtitleStreamIndex') != -1);
    }

    private showSubtitleMenu(context: HTMLElement, player: PlayerPlugin|null, button: HTMLButtonElement) {
        const currentIndex = playbackManager.getSubtitleStreamIndex(player);
        const streams = playbackManager.subtitleTracks(player);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const menuItems = streams.map((s: any) => ({
            name: s.DisplayTitle,
            id: s.Index,
            selected: s.Index == currentIndex
        }));
        menuItems.unshift({
            id: -1,
            name: globalize.translate('Off'),
            selected: currentIndex == null
        });

        void import('../actionSheet/actionSheet').then((actionSheet) => {
            void actionSheet.show({
                items: menuItems,
                positionTo: button,
                callback: function (id) {
                    playbackManager.setSubtitleStreamIndex(parseInt(id, 10), player);
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
