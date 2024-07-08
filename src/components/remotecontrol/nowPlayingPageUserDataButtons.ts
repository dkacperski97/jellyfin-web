import ServerConnections from '../ServerConnections';

export default class NowPlayingPageUserDataButtons {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updatePlayerState(context: HTMLElement, state: any) {
        const item = state.NowPlayingItem;
        if (item) {
            const apiClient = ServerConnections.getApiClient(item.ServerId);
            void apiClient.getItem(apiClient.getCurrentUserId(), item.Id).then(function (fullItem) {
                const userData = fullItem.UserData || {};
                const likes = userData.Likes == null ? '' : userData.Likes;
                const nowPlayingPageUserDataButtonsTitle = context.querySelector('.nowPlayingPageUserDataButtonsTitle');
                if (nowPlayingPageUserDataButtonsTitle) {
                    nowPlayingPageUserDataButtonsTitle.innerHTML = '<button is="emby-ratingbutton" type="button" class="paper-icon-button-light" data-id="' + fullItem.Id + '" data-serverid="' + fullItem.ServerId + '" data-itemtype="' + fullItem.Type + '" data-likes="' + likes + '" data-isfavorite="' + userData.IsFavorite + '"><span class="material-icons favorite" aria-hidden="true"></span></button>';
                }
                const nowPlayingPageUserDataButtons = context.querySelector('.nowPlayingPageUserDataButtons');
                if (nowPlayingPageUserDataButtons) {
                    nowPlayingPageUserDataButtons.innerHTML = '<button is="emby-ratingbutton" type="button" class="paper-icon-button-light" data-id="' + fullItem.Id + '" data-serverid="' + fullItem.ServerId + '" data-itemtype="' + fullItem.Type + '" data-likes="' + likes + '" data-isfavorite="' + userData.IsFavorite + '"><span class="material-icons favorite" aria-hidden="true"></span></button>';
                }
            });
        } else {
            const nowPlayingPageUserDataButtons = context.querySelector('.nowPlayingPageUserDataButtons');
            if (nowPlayingPageUserDataButtons) {
                nowPlayingPageUserDataButtons.innerHTML = '';
            }
        }
    }
}
