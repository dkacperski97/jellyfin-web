import React, { FC } from 'react';
// import globalize from 'scripts/globalize';
import NowPlayingInfoButtons from './NowPlayingInfoButtons';

interface NowPlayingInfoProps {
    currentPlayer: any;
}

const NowPlayingInfo: FC<NowPlayingInfoProps> = ({ currentPlayer }) => {
    return (
        <div className='nowPlayingInfoContainer'>
            <div className='nowPlayingPageImageContainer'></div>
            <div className='nowPlayingInfoControls'>
                <div className='infoContainer flex'>
                    <div className='nowPlayingInfoContainerMedia'>
                        <h2 className='nowPlayingPageTitle'>TODO</h2>
                        <div
                            style={{ fontWeight: 'bold' }}
                            className='nowPlayingSongName nowPlayingEpisode'
                        ></div>
                        <div className='nowPlayingAlbum nowPlayingSeason'></div>
                        <div className='nowPlayingArtist nowPlayingSerie'></div>
                    </div>
                    <div className='nowPlayingPageUserDataButtonsTitle'></div>
                </div>

                {/* <div className='sliderContainer flex' dir='ltr'>
                    <div className='positionTime'></div>
                    <div className='nowPlayingPositionSliderContainer'>
                        <input
                            type='range'
                            is='emby-slider'
                            // pin
                            step='1'
                            min='0'
                            max='100'
                            value='0'
                            className='nowPlayingPositionSlider'
                            data-slider-keep-progress='true'
                        />
                    </div>
                    <div className='runtime'></div>
                </div> */}

                <NowPlayingInfoButtons currentPlayer={currentPlayer} />
            </div>
        </div>
    );
};

export default NowPlayingInfo;
