import { PlayerPlugin } from 'types/player';
import NowPlayingInfoButtons from './nowPlayingInfoButtons';
import NowPlayingInfoContainerMedia from './nowPlayingInfoContainerMedia';
import NowPlayingSecondaryButtons from './nowPlayingSecondaryButtons';
import ServerConnections from 'components/ServerConnections';
import NowPlayingPageUserDataButton from './nowPlayingPageUserDataButton';

export default class NowPlayingInfoControls {
    nowPlayingInfoContainerMedia: NowPlayingInfoContainerMedia;
    nowPlayingPageUserDataButtonsTitle?: NowPlayingPageUserDataButton;
    // sliderContainer: SliderContainer;
    nowPlayingInfoButtons: NowPlayingInfoButtons;
    nowPlayingSecondaryButtons: NowPlayingSecondaryButtons;

    constructor(context: HTMLElement) {
        this.nowPlayingInfoContainerMedia = new NowPlayingInfoContainerMedia();

        const nowPlayingPageUserDataButtonsTitleContext = context.querySelector<HTMLElement>('.nowPlayingPageUserDataButtonsTitle');
        if (nowPlayingPageUserDataButtonsTitleContext) {
            this.nowPlayingPageUserDataButtonsTitle = new NowPlayingPageUserDataButton(nowPlayingPageUserDataButtonsTitleContext);
        }

        this.nowPlayingInfoButtons = new NowPlayingInfoButtons(context);
        this.nowPlayingSecondaryButtons = new NowPlayingSecondaryButtons(context);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updatePlayerState(player: PlayerPlugin | null, context: HTMLElement, state: any) {
        const item = state.NowPlayingItem;
        if (item) {
            const apiClient = ServerConnections.getApiClient(item.ServerId);
            void apiClient.getItem(apiClient.getCurrentUserId(), item.Id).then((fullItem) => {
                this.nowPlayingPageUserDataButtonsTitle?.updatePlayerState(fullItem);
                this.nowPlayingSecondaryButtons.updatePlayerState(player, context, state, fullItem);
            });
        } else {
            this.nowPlayingPageUserDataButtonsTitle?.updatePlayerState(null);
            this.nowPlayingSecondaryButtons.updatePlayerState(player, context, state, null);
        }
        this.nowPlayingInfoButtons.updatePlayerState(state);
        this.nowPlayingInfoContainerMedia.updatePlayerState(context, state);
    }

    onPlayerChange(player: PlayerPlugin|null) {
        this.nowPlayingInfoButtons.onPlayerChange(player);
        this.nowPlayingSecondaryButtons.onPlayerChange(player);
    }

    onShow(player: PlayerPlugin|null) {
        this.nowPlayingInfoButtons.onShow(player);
        this.nowPlayingSecondaryButtons.onShow(player);
    }

    destroy() {
        this.nowPlayingInfoButtons.destroy();
        this.nowPlayingSecondaryButtons.destroy();
    }
}
