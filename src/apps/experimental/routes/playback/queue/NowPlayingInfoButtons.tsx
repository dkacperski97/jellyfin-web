import { IconButton } from '@mui/material';
import React, { FC } from 'react';
import globalize from 'scripts/globalize';
import CommandButton from './CommandButton';
import RepeatIcon from '@mui/icons-material/Repeat';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import Replay10Icon from '@mui/icons-material/Replay10';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled';
import StopIcon from '@mui/icons-material/Stop';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import Forward30Icon from '@mui/icons-material/Forward30';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import ClosedCaptionIcon from '@mui/icons-material/ClosedCaption';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import layoutManager from 'components/layoutManager';
import VolumeControl from './VolumeControl';

interface NowPlayingInfoButtonsProps {
    currentPlayer: any;
}

const NowPlayingInfoButtons: FC<NowPlayingInfoButtonsProps> = ({ currentPlayer }) => {
    const btnRepeat = (
        <CommandButton
            className='btnRepeat'
            command='SetRepeatMode'
            repeatToggle
            currentPlayer={currentPlayer}
            title={globalize.translate('Repeat')}
        >
            <RepeatIcon />
        </CommandButton>
    );

    const btnShuffleQueue = (
        <IconButton className='btnShuffleQueue' title={globalize.translate('Shuffle')}>
            <ShuffleIcon />
        </IconButton>
    );

    return (
        <div className='nowPlayingButtonsContainer focuscontainer-x justify-content-space-between'>
            <div className='nowPlayingInfoButtons' dir='ltr'>
                {btnRepeat}
                <IconButton className='btnRewind btnNowPlayingRewind' title={globalize.translate('Rewind')}>
                    <Replay10Icon />
                </IconButton>

                <IconButton className='btnPreviousTrack' title={globalize.translate('ButtonPreviousTrack')}>
                    <SkipPreviousIcon />
                </IconButton>

                <IconButton className='btnPlayPause' title={globalize.translate('ButtonPause')}>
                    <PauseCircleFilledIcon />
                </IconButton>

                <IconButton className='btnStop' title={globalize.translate('ButtonStop')}>
                    <StopIcon />
                </IconButton>

                <IconButton className='btnNextTrack' title={globalize.translate('ButtonNextTrack')}>
                    <SkipNextIcon />
                </IconButton>

                <IconButton
                    className='btnFastForward btnNowPlayingFastForward'
                    title={globalize.translate('FastForward')}
                >
                    <Forward30Icon />
                </IconButton>

                {btnShuffleQueue}
            </div>

            <div className='nowPlayingSecondaryButtons'>
                <IconButton
                    className='btnAudioTracks videoButton'
                    title={globalize.translate('ButtonAudioTracks')}
                    data-command='GoToSearch'
                >
                    <AudiotrackIcon />
                </IconButton>

                <IconButton
                    className='btnSubtitles videoButton'
                    title={globalize.translate('Subtitles')}
                    data-command='GoToSearch'
                >
                    <ClosedCaptionIcon />
                </IconButton>

                <div className='nowPlayingPageUserDataButtons'></div>

                <IconButton
                    className='btnToggleFullscreen videoButton'
                    title={globalize.translate('ButtonFullscreen')}
                    data-command='ToggleFullscreen'
                >
                    <FullscreenIcon />
                </IconButton>

                {btnShuffleQueue}
                {btnRepeat}
                {!layoutManager.mobile && <VolumeControl />}
            </div>
        </div>
    );
};

export default NowPlayingInfoButtons;
