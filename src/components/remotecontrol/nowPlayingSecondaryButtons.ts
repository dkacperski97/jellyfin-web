import layoutManager from '../layoutManager';
import VolumeControl from './volumeControl';
import { playbackManager } from 'components/playback/playbackmanager';
import RepeatToggleButton from './repeatToggleButton';
import RemoteControlHelper from './remoteControlHelper';
import { PlayerPlugin } from 'types/player';
import SubtitlesButton from './subtitlesButton';
import AudioTracksButton from './audioTracksButton';
import NowPlayingPageUserDataButtons from './nowPlayingPageUserDataButtons';

export default class NowPlayingSecondaryButtons {
    audioTracksButton: AudioTracksButton;
    subtitlesButton: SubtitlesButton;
    nowPlayingPageUserDataButtons: NowPlayingPageUserDataButtons;
    // toggleFullscreenButton: ToggleFullscreenButton;
    // lyricsButton: LyricsButton;
    // videoShuffleQueueButton: ShuffleQueueButton;
    videoRepeatToggleButton?: RepeatToggleButton;

    constructor(context: HTMLElement) {
        this.nowPlayingPageUserDataButtons = new NowPlayingPageUserDataButtons();
        this.audioTracksButton = new AudioTracksButton(context);
        this.subtitlesButton = new SubtitlesButton(context);
        const videoRepeatToggleButtonContext = context.querySelector<HTMLButtonElement>('.nowPlayingSecondaryButtons .btnRepeat');
        if (videoRepeatToggleButtonContext) {
            this.videoRepeatToggleButton = new RepeatToggleButton(videoRepeatToggleButtonContext);
        }

        const volumeControlHtml = VolumeControl.getHtml();
        if (!layoutManager.mobile) {
            context.querySelector('.nowPlayingSecondaryButtons')?.insertAdjacentHTML('beforeend', volumeControlHtml);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updatePlayerState(player: PlayerPlugin|null, context: HTMLElement, state: any) {
        const item = state.NowPlayingItem;
        this.audioTracksButton.updatePlayerState(player, context, state);
        this.subtitlesButton.updatePlayerState(player, context, state);
        // const playerInfo = playbackManager.getPlayerInfo();
        // const supportedCommands = playerInfo?.supportedCommands;
        // RemoteControlHelper.buttonVisible(context.querySelector('.btnToggleFullscreen'), item && item.MediaType == 'Video' && supportedCommands.includes('ToggleFullscreen'));
        // RemoteControlHelper.buttonVisible(context.querySelector('.btnLyrics'), item?.Type === 'Audio' && !layoutManager.mobile);
        if (layoutManager.mobile) {
            const playingVideo = playbackManager.isPlayingVideo() && item !== null;
            // RemoteControlHelper.buttonVisible(context.querySelector('.nowPlayingSecondaryButtons .btnShuffleQueue'), playingVideo);
            RemoteControlHelper.buttonVisible(this.videoRepeatToggleButton?.button, playingVideo);
        }

        this.videoRepeatToggleButton?.updatePlayerState();
        this.nowPlayingPageUserDataButtons.updatePlayerState(context, state);
    }

    onPlayerChange(player: PlayerPlugin|null) {
        this.audioTracksButton.onPlayerChange(player);
        this.subtitlesButton.onPlayerChange(player);
        this.videoRepeatToggleButton?.onPlayerChange(player);
    }

    onShow(player: PlayerPlugin|null) {
        this.audioTracksButton.onShow(player);
        this.subtitlesButton.onShow(player);
        this.videoRepeatToggleButton?.onShow(player);
    }

    destroy() {
        this.audioTracksButton.destroy();
        this.subtitlesButton.destroy();
        this.videoRepeatToggleButton?.destroy();
    }
}
