import { BaseItemDto } from '@jellyfin/sdk/lib/generated-client';

export default class NowPlayingPageUserDataButton {
    context: HTMLElement;

    constructor(context: HTMLElement) {
        this.context = context;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updatePlayerState(fullItem: BaseItemDto|null) {
        let buttonHtml = '';
        if (fullItem) {
            const userData = fullItem.UserData || {};
            const likes = userData.Likes == null ? '' : userData.Likes;
            buttonHtml = '<button is="emby-ratingbutton" type="button" class="paper-icon-button-light" data-id="' + fullItem.Id + '" data-serverid="' + fullItem.ServerId + '" data-itemtype="' + fullItem.Type + '" data-likes="' + likes + '" data-isfavorite="' + userData.IsFavorite + '"><span class="material-icons favorite" aria-hidden="true"></span></button>';
        }

        this.context.innerHTML = buttonHtml;
    }
}
