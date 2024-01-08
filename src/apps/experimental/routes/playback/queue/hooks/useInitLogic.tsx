import { useEffect, useState } from 'react';
import libraryMenu from 'scripts/libraryMenu';

export function useInitLogic() {
    const [currentPlayer, setCurrentPlayer] = useState<any>();

    useEffect(() => {
        libraryMenu.setTransparentMenu(true);

        remoteControl.onShow();

        return () => {
            libraryMenu.setTransparentMenu(false);

            remoteControl.destroy();
        };
    }, []);

    return {
        currentPlayer, setCurrentPlayer
    };
}
