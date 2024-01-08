import React, { FunctionComponent, useState } from 'react';

// import globalize from 'scripts/globalize';
import Page from 'components/Page';
import NowPlayingInfo from './NowPlayingInfo';
import RemoteControl from './RemoteControl';
import Playlist from './Playlist';
import { useKeyDownEvent } from './hooks/useKeyDownEvent';
import classNames from 'classnames';
import layoutManager from 'components/layoutManager';

const NowPlayingPage: FunctionComponent = () => {
    const { currentPlayer, setCurrentPlayer } = useKeyDownEvent();
    return (
        <Page
            id='nowPlayingPage'
            className='libraryPage nowPlayingPage noSecondaryNavPage selfBackdropPage'
            title='-'
        >
            <div
                className={classNames('remoteControlContent', 'padded-left', 'padded-right', {
                    'padded-bottom': !layoutManager.mobile
                })}
            >
                <NowPlayingInfo currentPlayer={currentPlayer} />
                <RemoteControl />
                <Playlist />
            </div>
        </Page>
    );
};

export default NowPlayingPage;
