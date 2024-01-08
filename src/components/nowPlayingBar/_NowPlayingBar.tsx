import React, { FunctionComponent, useState, useCallback, useEffect } from 'react';
import layoutManager from '../layoutManager';
import { playbackManager } from '../playback/playbackmanager';
import Events from 'utils/events';
import './nowPlayingBar.scss';

// import globalize from 'scripts/globalize';

const NowPlayingBar: FunctionComponent = () => {
    const [currentPlayer, setCurrentPlayer] = useState();
    const [isEnabled, setIsEnabled] = useState<boolean>();

    // function slideDown() {
    //     // trigger reflow
    //     void elem.offsetWidth;

    //     elem.classList.add('nowPlayingBar-hidden');

    //     dom.addEventListener(elem, dom.whichTransitionEvent(), onSlideDownComplete, {
    //         once: true
    //     });
    // }

    // function slideUp() {
    //     dom.removeEventListener(elem, dom.whichTransitionEvent(), onSlideDownComplete, {
    //         once: true
    //     });

    //     elem.classList.remove('hide');

    //     // trigger reflow
    //     void elem.offsetWidth;

    //     elem.classList.remove('nowPlayingBar-hidden');
    // }

    function hideNowPlayingBar() {
        setIsEnabled(false);

        // Use a timeout to prevent the bar from hiding and showing quickly
        // in the event of a stop->play command

        // Don't call getNowPlayingBar here because we don't want to end up creating it just to hide it
        // slideDown();
    }

    const bindToPlayer = useCallback((player: any) => {
        if (player === currentPlayer) {
            return;
        }

        // releaseCurrentPlayer();

        setCurrentPlayer(player);

        if (!player) {
            return;
        }

        // refreshFromPlayer(player, 'init');

        // Events.on(player, 'playbackstart', onPlaybackStart);
        // Events.on(player, 'statechange', onPlaybackStart);
        // Events.on(player, 'repeatmodechange', onRepeatModeChange);
        // Events.on(player, 'shufflequeuemodechange', onQueueShuffleModeChange);
        // Events.on(player, 'playbackstop', onPlaybackStopped);
        // Events.on(player, 'volumechange', onVolumeChanged);
        // Events.on(player, 'pause', onPlayPauseStateChanged);
        // Events.on(player, 'unpause', onPlayPauseStateChanged);
        // Events.on(player, 'timeupdate', onTimeUpdate);
    }, [currentPlayer]);

    useEffect(() => {
        Events.on(playbackManager, 'playerchange', function () {
            bindToPlayer(playbackManager.getCurrentPlayer());
        });

        bindToPlayer(playbackManager.getCurrentPlayer());
    }, [bindToPlayer]);

    document.addEventListener('viewbeforeshow', function (e) {
        // if (!e.detail.options.enableMediaControl) {
        //     if (isVisibilityAllowed) {
        //         isVisibilityAllowed = false;
        //         hideNowPlayingBar();
        //     }
        // } else if (!isVisibilityAllowed) {
        //     isVisibilityAllowed = true;
        //     if (currentPlayer) {
        //         refreshFromPlayer(currentPlayer, 'refresh');
        //     } else {
        //         hideNowPlayingBar();
        //     }
        // }
        console.debug(e);
        hideNowPlayingBar();
    });

    return (
        <div className={`nowPlayingBar ${!isEnabled && 'hide nowPlayingBar-hidden'}`}>
            <div className='nowPlayingBarTop'>
                <div className='nowPlayingBarPositionContainer sliderContainer' dir='ltr'>
                    <input
                        type='range'
                        is='emby-slider'
                        // pin
                        step='.01'
                        min='0'
                        max='100'
                        value='0'
                        className='slider-medium-thumb nowPlayingBarPositionSlider'
                        data-slider-keep-progress='true'
                    />
                </div>

                <div className='nowPlayingBarInfoContainer'>
                    <div className='nowPlayingImage'></div>
                    <div className='nowPlayingBarText'></div>
                </div>

                {/* // The onclicks are needed due to the return false above */}
                <div className='nowPlayingBarCenter' dir='ltr'>
                    <button is='paper-icon-button-light' className='previousTrackButton mediaButton'>
                        <span className='material-icons skip_previous' aria-hidden='true'></span>
                    </button>

                    <button is='paper-icon-button-light' className='playPauseButton mediaButton'>
                        <span className='material-icons pause' aria-hidden='true'></span>
                    </button>

                    <button is='paper-icon-button-light' className='stopButton mediaButton'>
                        <span className='material-icons stop' aria-hidden='true'></span>
                    </button>
                    {!layoutManager.mobile && (
                        <button is='paper-icon-button-light' className='nextTrackButton mediaButton'>
                            <span className='material-icons skip_next' aria-hidden='true'></span>
                        </button>
                    )}

                    <div className='nowPlayingBarCurrentTime'></div>
                </div>

                <div className='nowPlayingBarRight'>
                    <button is='paper-icon-button-light' className='muteButton mediaButton'>
                        <span className='material-icons volume_up' aria-hidden='true'></span>
                    </button>

                    <div
                        className='sliderContainer nowPlayingBarVolumeSliderContainer hide'
                        style={{ width: '9em', verticalAlign: 'middle', display: 'inline-flex' }}
                    >
                        <input
                            type='range'
                            is='emby-slider'
                            // pin
                            step='1'
                            min='0'
                            max='100'
                            value='0'
                            className='slider-medium-thumb nowPlayingBarVolumeSlider'
                        />
                    </div>

                    <button is='paper-icon-button-light' className='btnAirPlay mediaButton'>
                        <span className='material-icons airplay' aria-hidden='true'></span>
                    </button>

                    <button is='paper-icon-button-light' className='toggleRepeatButton mediaButton'>
                        <span className='material-icons repeat' aria-hidden='true'></span>
                    </button>
                    <button is='paper-icon-button-light' className='btnShuffleQueue mediaButton'>
                        <span className='material-icons shuffle' aria-hidden='true'></span>
                    </button>

                    <div className='nowPlayingBarUserDataButtons'></div>

                    <button is='paper-icon-button-light' className='playPauseButton mediaButton'>
                        <span className='material-icons pause' aria-hidden='true'></span>
                    </button>

                    {layoutManager.mobile ? (
                        <button is='paper-icon-button-light' className='nextTrackButton mediaButton'>
                            <span className='material-icons skip_next' aria-hidden='true'></span>
                        </button>
                    ) : (
                        <button is='paper-icon-button-light' className='btnToggleContextMenu mediaButton'>
                            <span className='material-icons more_vert' aria-hidden='true'></span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NowPlayingBar;
