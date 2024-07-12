import layoutManager from '../layoutManager';
import { playbackManager } from 'components/playback/playbackmanager';
import RepeatToggleButton from './repeatToggleButton';
import RemoteControlHelper from './remoteControlHelper';
import { PlayerPlugin } from 'types/player';
import ShuffleQueueButton from './shuffleQueueButton';

export default class NowPlayingInfoButtons {
    audioRepeatToggleButton?: RepeatToggleButton;
    // rewindButton: RewindButton;
    // previousTrackButton: PreviousTrackButton;
    // playPauseButton: PlayPauseButton;
    // stopButton: StopButton;
    // nextTrackButton: NextTrackButton;
    // fastForwardButton: FastForwardButton;
    audioShuffleQueueButton?: ShuffleQueueButton;

    constructor(context: HTMLElement) {
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

        this.audioShuffleQueueButton?.updatePlayerState();
        this.audioRepeatToggleButton?.updatePlayerState();
    }

    onPlayerChange(player: PlayerPlugin|null) {
        this.audioShuffleQueueButton?.onPlayerChange(player);
        this.audioRepeatToggleButton?.onPlayerChange(player);
    }

    onShow(player: PlayerPlugin|null) {
        this.audioShuffleQueueButton?.onShow(player);
        this.audioRepeatToggleButton?.onShow(player);
    }

    destroy() {
        this.audioShuffleQueueButton?.destroy();
        this.audioRepeatToggleButton?.destroy();
    }
}
