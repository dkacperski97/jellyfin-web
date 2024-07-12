import layoutManager from '../layoutManager';
import VolumeControl from './volumeControl';
import { playbackManager } from 'components/playback/playbackmanager';
import RepeatToggleButton from './repeatToggleButton';
import RemoteControlHelper from './remoteControlHelper';
import { PlayerPlugin } from 'types/player';
import SubtitlesButton from './subtitlesButton';
import AudioTracksButton from './audioTracksButton';
import NowPlayingPageUserDataButtons from './nowPlayingPageUserDataButtons';
import { appRouter } from '../router/appRouter';
import ToggleFullscreenButton from './toggleFullscreenButton';
import ShuffleQueueButton from './shuffleQueueButton';

export default class NowPlayingSecondaryButtons {
    audioTracksButton: AudioTracksButton;
    subtitlesButton: SubtitlesButton;
    nowPlayingPageUserDataButtons: NowPlayingPageUserDataButtons;
    toggleFullscreenButton: ToggleFullscreenButton;
    videoShuffleQueueButton?: ShuffleQueueButton;
    videoRepeatToggleButton?: RepeatToggleButton;

    constructor(context: HTMLElement) {
        this.nowPlayingPageUserDataButtons = new NowPlayingPageUserDataButtons();
        this.audioTracksButton = new AudioTracksButton(context);
        this.subtitlesButton = new SubtitlesButton(context);
        this.toggleFullscreenButton = new ToggleFullscreenButton(context);
        const videoShuffleQueueButtonContext = context.querySelector<HTMLButtonElement>('.nowPlayingSecondaryButtons .btnShuffleQueue');
        if (videoShuffleQueueButtonContext) {
            this.videoShuffleQueueButton = new ShuffleQueueButton(videoShuffleQueueButtonContext);
        }
        const videoRepeatToggleButtonContext = context.querySelector<HTMLButtonElement>('.nowPlayingSecondaryButtons .btnRepeat');
        if (videoRepeatToggleButtonContext) {
            this.videoRepeatToggleButton = new RepeatToggleButton(videoRepeatToggleButtonContext);
        }

        const volumeControlHtml = VolumeControl.getHtml();
        if (!layoutManager.mobile) {
            context.querySelector('.nowPlayingSecondaryButtons')?.insertAdjacentHTML('beforeend', volumeControlHtml);
        }

        context.querySelector('.btnLyrics')?.addEventListener('click', function () {
            void appRouter.show('lyrics');
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updatePlayerState(player: PlayerPlugin|null, context: HTMLElement, state: any) {
        const item = state.NowPlayingItem;
        this.audioTracksButton.updatePlayerState(player, context, state);
        this.subtitlesButton.updatePlayerState(player, context, state);
        this.toggleFullscreenButton.updatePlayerState(context, state);

        RemoteControlHelper.buttonVisible(context.querySelector<HTMLButtonElement>('.btnLyrics'), item?.Type === 'Audio' && !layoutManager.mobile);
        if (layoutManager.mobile) {
            const playingVideo = playbackManager.isPlayingVideo() && item !== null;
            RemoteControlHelper.buttonVisible(this.videoShuffleQueueButton?.button, playingVideo);
            RemoteControlHelper.buttonVisible(this.videoRepeatToggleButton?.button, playingVideo);
        }

        this.videoShuffleQueueButton?.updatePlayerState();
        this.videoRepeatToggleButton?.updatePlayerState();
        this.nowPlayingPageUserDataButtons.updatePlayerState(context, state);
    }

    onPlayerChange(player: PlayerPlugin|null) {
        this.toggleFullscreenButton.onPlayerChange(player);
        this.audioTracksButton.onPlayerChange(player);
        this.subtitlesButton.onPlayerChange(player);
        this.videoShuffleQueueButton?.onPlayerChange(player);
        this.videoRepeatToggleButton?.onPlayerChange(player);
    }

    onShow(player: PlayerPlugin|null) {
        this.toggleFullscreenButton.onShow(player);
        this.audioTracksButton.onShow(player);
        this.subtitlesButton.onShow(player);
        this.videoShuffleQueueButton?.onShow(player);
        this.videoRepeatToggleButton?.onShow(player);
    }

    destroy() {
        this.toggleFullscreenButton.destroy();
        this.audioTracksButton.destroy();
        this.subtitlesButton.destroy();
        this.videoShuffleQueueButton?.destroy();
        this.videoRepeatToggleButton?.destroy();
    }
}
