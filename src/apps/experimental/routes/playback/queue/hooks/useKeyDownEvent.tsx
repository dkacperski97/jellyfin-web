import { useEffect, useState, useCallback } from 'react';
import { playbackManager } from 'components/playback/playbackmanager';

export function useKeyDownEvent() {
    const [currentPlayer, setCurrentPlayer] = useState<any>();

    const onKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.keyCode === 32 && e.target && (e.target as HTMLElement).tagName !== 'BUTTON') {
            playbackManager.playPause(currentPlayer);
            e.preventDefault();
            e.stopPropagation();
        }
    }, [currentPlayer]);

    const releaseCurrentPlayer = useCallback(() => {
        const player = currentPlayer;
        if (player) setCurrentPlayer(null);
    }, [currentPlayer]);

    const bindToPlayer = useCallback((player: any) => {
        if (player !== currentPlayer) {
            releaseCurrentPlayer();
            setCurrentPlayer(player);
        }
    }, [currentPlayer, releaseCurrentPlayer]);

    useEffect(() => {
        bindToPlayer(playbackManager.getCurrentPlayer());
        document.addEventListener('keydown', onKeyDown);

        return () => {
            document.removeEventListener('keydown', onKeyDown);
            releaseCurrentPlayer();
        };
    }, [bindToPlayer, onKeyDown, releaseCurrentPlayer]);

    return {
        currentPlayer, setCurrentPlayer
    };
}
