import layoutManager from '../layoutManager';
import { playbackManager } from 'components/playback/playbackmanager';
import RepeatToggleButton from './repeatToggleButton';
import RemoteControlHelper from './remoteControlHelper';
import { PlayerPlugin } from 'types/player';

export default class NowPlayingInfoButtons {
    musicRepeatToggleButton?: RepeatToggleButton;
    // rewindButton: RewindButton;
    // previousTrackButton: PreviousTrackButton;
    // playPauseButton: PlayPauseButton;
    // stopButton: StopButton;
    // nextTrackButton: NextTrackButton;
    // fastForwardButton: FastForwardButton;
    // shuffleQueueButton: ShuffleQueueButton;

    constructor(context: HTMLElement) {
        const audioRepeatToggleButtonContext = context.querySelector<HTMLButtonElement>('.btnRepeat');
        if (audioRepeatToggleButtonContext) {
            this.musicRepeatToggleButton = new RepeatToggleButton(audioRepeatToggleButtonContext);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updatePlayerState(state: any) {
        const item = state.NowPlayingItem;
        if (layoutManager.mobile) {
            const playingAudio = !playbackManager.isPlayingVideo() && item !== null;
            const playingAudioBook = playingAudio && item.Type == 'AudioBook';
            RemoteControlHelper.buttonVisible(this.musicRepeatToggleButton?.button, playingAudio && !playingAudioBook);
        }

        this.musicRepeatToggleButton?.updatePlayerState();
    }

    onPlayerChange(player: PlayerPlugin|null) {
        this.musicRepeatToggleButton?.onPlayerChange(player);
    }

    onShow(player: PlayerPlugin|null) {
        this.musicRepeatToggleButton?.onShow(player);
    }

    destroy() {
        this.musicRepeatToggleButton?.destroy();
    }
}
