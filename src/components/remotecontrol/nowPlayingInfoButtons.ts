import layoutManager from '../layoutManager';
import { playbackManager } from 'components/playback/playbackmanager';
import RepeatToggleButton from './repeatToggleButton';
import RemoteControlHelper from './remoteControlHelper';
import { PlayerPlugin } from 'types/player';
import ShuffleQueueButton from './shuffleQueueButton';
import PlayPauseButton from './playPauseButton';
import StopButton from './stopButton';
import NextTrackButton from './nextTrackButton';

export default class NowPlayingInfoButtons {
    audioRepeatToggleButton?: RepeatToggleButton;
    // rewindButton: RewindButton;
    // previousTrackButton: PreviousTrackButton;
    playPauseButton?: PlayPauseButton;
    stopButton?: StopButton;
    nextTrackButton?: NextTrackButton;
    // fastForwardButton: FastForwardButton;
    audioShuffleQueueButton?: ShuffleQueueButton;

    constructor(context: HTMLElement) {
        const playPauseButtonContext = context.querySelector<HTMLButtonElement>('.btnPlayPause');
        if (playPauseButtonContext) {
            this.playPauseButton = new PlayPauseButton(playPauseButtonContext);
        }
        const stopButtonContext = context.querySelector<HTMLButtonElement>('.btnStop');
        if (stopButtonContext) {
            this.stopButton = new StopButton(stopButtonContext);
        }
        const nextTrackButtonContext = context.querySelector<HTMLButtonElement>('.btnNextTrack');
        if (nextTrackButtonContext) {
            this.nextTrackButton = new NextTrackButton(nextTrackButtonContext);
        }
        const audioShuffleQueueButtonContext = context.querySelector<HTMLButtonElement>('.btnShuffleQueue');
        if (audioShuffleQueueButtonContext) {
            this.audioShuffleQueueButton = new ShuffleQueueButton(audioShuffleQueueButtonContext);
        }
        const audioRepeatToggleButtonContext = context.querySelector<HTMLButtonElement>('.btnRepeat');
        if (audioRepeatToggleButtonContext) {
            this.audioRepeatToggleButton = new RepeatToggleButton(audioRepeatToggleButtonContext);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updatePlayerState(state: any) {
        const item = state.NowPlayingItem;
        if (layoutManager.mobile) {
            const playingAudio = !playbackManager.isPlayingVideo() && item !== null;
            const playingAudioBook = playingAudio && item.Type == 'AudioBook';
            RemoteControlHelper.buttonVisible(this.audioShuffleQueueButton?.button, playingAudio && !playingAudioBook);
            RemoteControlHelper.buttonVisible(this.audioRepeatToggleButton?.button, playingAudio && !playingAudioBook);
        }

        this.playPauseButton?.updatePlayerState(state);
        this.stopButton?.updatePlayerState(state);
        this.nextTrackButton?.updatePlayerState(state);
        this.audioShuffleQueueButton?.updatePlayerState();
        this.audioRepeatToggleButton?.updatePlayerState();
    }

    onPlayerChange(player: PlayerPlugin|null) {
        this.playPauseButton?.onPlayerChange(player);
        this.stopButton?.onPlayerChange(player);
        this.nextTrackButton?.onPlayerChange(player);
        this.audioShuffleQueueButton?.onPlayerChange(player);
        this.audioRepeatToggleButton?.onPlayerChange(player);
    }

    onShow(player: PlayerPlugin|null) {
        this.playPauseButton?.onShow(player);
        this.stopButton?.onShow(player);
        this.nextTrackButton?.onShow(player);
        this.audioShuffleQueueButton?.onShow(player);
        this.audioRepeatToggleButton?.onShow(player);
    }

    destroy() {
        this.playPauseButton?.destroy();
        this.stopButton?.destroy();
        this.nextTrackButton?.destroy();
        this.audioShuffleQueueButton?.destroy();
        this.audioRepeatToggleButton?.destroy();
    }
}
