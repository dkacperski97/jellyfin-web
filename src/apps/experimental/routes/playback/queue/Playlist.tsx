import React, { FunctionComponent } from 'react';
import VolumeControl from './VolumeControl';
import layoutManager from 'components/layoutManager';
import classNames from 'classnames';
import { IconButton } from '@mui/material';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import SaveIcon from '@mui/icons-material/Save';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import globalize from 'scripts/globalize';

const Playlist: FunctionComponent = () => {
    return (
        <div className='playlistSection'>
            <div
                className={classNames(
                    'playlistSectionButton',
                    'flex',
                    {
                        'align-items-center': layoutManager.mobile,
                        playlistSectionButtonTransparent: layoutManager.mobile,
                        'align-items-right': !layoutManager.mobile,
                        'justify-content-flex-end': !layoutManager.mobile,
                        'justify-content-space-between': layoutManager.mobile
                    },
                    'focuscontainer-x'
                )}
            >
                <IconButton
                    id='togglePlaylist'
                    className='btnTogglePlaylist hide'
                    title={globalize.translate('ButtonTogglePlaylist')}
                >
                    <QueueMusicIcon />
                </IconButton>
                {layoutManager.mobile && <VolumeControl />}
                {!layoutManager.mobile && (
                    <IconButton className='btnSavePlaylist' title={globalize.translate('Save')}>
                        <SaveIcon />
                    </IconButton>
                )}
                <IconButton
                    id='toggleContextMenu'
                    className='btnToggleContextMenu'
                    title={globalize.translate('ButtonMore')}
                >
                    <MoreVertIcon />
                </IconButton>
            </div>
            {!layoutManager.mobile && (
                <div
                    id='playlist'
                    className='playlist itemsContainer vertical-list nowPlayingPlaylist'
                    // is='emby-itemscontainer'
                    // data-dragreorder='true'
                ></div>
            )}
        </div>
    );
};

export default Playlist;
