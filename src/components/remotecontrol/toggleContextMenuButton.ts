import ServerConnections from '../ServerConnections';
import itemContextMenu from '../itemContextMenu';
import layoutManager from '../layoutManager';

export default class ToggleContextMenuButton {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updatePlayerState(context: HTMLElement, state: any) {
        const item = state.NowPlayingItem;
        if (item) {
            let contextButton = context.querySelector<HTMLButtonElement>('.btnToggleContextMenu');
            if (contextButton?.parentNode) {
                // We remove the previous event listener by replacing the item in each update event
                const autoFocusContextButton = document.activeElement === contextButton;
                const contextButtonClone = contextButton.cloneNode(true);
                contextButton.parentNode.replaceChild(contextButtonClone, contextButton);
                contextButton = context.querySelector<HTMLButtonElement>('.btnToggleContextMenu');
                if (autoFocusContextButton) {
                    contextButton?.focus();
                }
                const options = {
                    play: false,
                    queue: false,
                    stopPlayback: true,
                    clearQueue: true,
                    openAlbum: false,
                    positionTo: contextButton
                };
                const apiClient = ServerConnections.getApiClient(item.ServerId);
                void apiClient.getItem(apiClient.getCurrentUserId(), item.Id).then(function (fullItem) {
                    void apiClient.getCurrentUser().then(function (user) {
                        contextButton?.addEventListener('click', function () {
                            itemContextMenu.show(Object.assign({
                                item: fullItem,
                                user: user,
                                isMobile: layoutManager.mobile
                            }, options))
                                .catch(() => { /* no-op */ });
                        });
                    });
                });
            }
        }
    }
}
