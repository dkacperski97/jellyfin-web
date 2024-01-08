import React, { FC, ReactElement, useCallback } from 'react';
import { playbackManager } from 'components/playback/playbackmanager';
import { IconButton } from '@mui/material';

interface CommandButtonProps {
    command: string;
    repeatToggle: boolean;
    currentPlayer: any;
    title: string;
    className?: string;
    children: ReactElement;
}

const CommandButton: FC<CommandButtonProps> = ({ currentPlayer, command, repeatToggle, title, className, children }) => {
    function toggleRepeat() {
        switch (playbackManager.getRepeatMode()) {
            case 'RepeatAll':
                playbackManager.setRepeatMode('RepeatOne');
                break;
            case 'RepeatOne':
                playbackManager.setRepeatMode('RepeatNone');
                break;
            case 'RepeatNone':
                playbackManager.setRepeatMode('RepeatAll');
        }
    }

    const onBtnCommandClick = useCallback(() => {
        if (currentPlayer) {
            if (repeatToggle) {
                toggleRepeat();
            } else {
                playbackManager.sendCommand(
                    {
                        Name: command
                    },
                    currentPlayer
                );
            }
        }
    }, [command, currentPlayer, repeatToggle]);

    return (
        <IconButton
            className={className}
            title={title}
            onClick={onBtnCommandClick}
        >
            {children}
        </IconButton>
    );
};

export default CommandButton;
