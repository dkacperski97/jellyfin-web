import React, { FunctionComponent } from 'react';
import { IconButton, Slider } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

import globalize from 'scripts/globalize';

const VolumeControl: FunctionComponent = () => {
    return (
        <div className='volumecontrol flex align-items-center flex-wrap-wrap justify-content-center'>
            <IconButton className='buttonMute' title={globalize.translate('Mute')}>
                <VolumeUpIcon />
            </IconButton>
            <div className='sliderContainer nowPlayingVolumeSliderContainer'>
                <Slider step={1} min={0} max={100} value={0} className='nowPlayingVolumeSlider' />
            </div>
        </div>
    );
};

export default VolumeControl;
