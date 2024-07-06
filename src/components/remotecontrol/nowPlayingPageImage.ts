import ServerConnections from '../ServerConnections';
import { getDefaultBackgroundClass } from '../cardbuilder/cardBuilderUtils';

export default class NowPlayingPageImage {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updatePlayerState(context: HTMLElement, state: any) {
        const item = state.NowPlayingItem;
        if (item) {
            const url = this.seriesImageUrl(item, {
                maxHeight: 300
            }) || this.imageUrl(item, {
                maxHeight: 300
            });
            this.setImageUrl(context, state, url);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private seriesImageUrl(item: any, options?: any) {
        if (item.Type !== 'Episode') {
            return null;
        }

        options = options || {};
        options.type = options.type || 'Primary';
        if (options.type === 'Primary' && item.SeriesPrimaryImageTag) {
            options.tag = item.SeriesPrimaryImageTag;
            return ServerConnections.getApiClient(item.ServerId).getScaledImageUrl(item.SeriesId, options);
        }

        if (options.type === 'Thumb') {
            if (item.SeriesThumbImageTag) {
                options.tag = item.SeriesThumbImageTag;
                return ServerConnections.getApiClient(item.ServerId).getScaledImageUrl(item.SeriesId, options);
            }

            if (item.ParentThumbImageTag) {
                options.tag = item.ParentThumbImageTag;
                return ServerConnections.getApiClient(item.ServerId).getScaledImageUrl(item.ParentThumbItemId, options);
            }
        }

        return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private imageUrl(item: any, options?: any) {
        options = options || {};
        options.type = options.type || 'Primary';

        if (item.ImageTags?.[options.type]) {
            options.tag = item.ImageTags[options.type];
            return ServerConnections.getApiClient(item.ServerId).getScaledImageUrl(item.PrimaryImageItemId || item.Id, options);
        }

        if (item.AlbumId && item.AlbumPrimaryImageTag) {
            options.tag = item.AlbumPrimaryImageTag;
            return ServerConnections.getApiClient(item.ServerId).getScaledImageUrl(item.AlbumId, options);
        }

        return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private setImageUrl(context: HTMLElement, state: any, url: string|null) {
        const item = state.NowPlayingItem;
        const imgContainer = context.querySelector('.nowPlayingPageImageContainer');

        if (imgContainer) {
            if (url) {
                imgContainer.innerHTML = '<img class="nowPlayingPageImage" src="' + url + '" />';

                context.querySelector('.nowPlayingPageImage')?.classList.toggle('nowPlayingPageImageAudio', item.Type === 'Audio');
                context.querySelector('.nowPlayingPageImage')?.classList.toggle('nowPlayingPageImagePoster', item.Type !== 'Audio');
            } else {
                imgContainer.innerHTML =
                    '<div class="nowPlayingPageImageContainerNoAlbum"><button data-action="link" class="cardImageContainer coveredImage '
                    + getDefaultBackgroundClass(item.Name)
                    + ' cardContent cardContent-shadow itemAction"><span class="cardImageIcon material-icons album" aria-hidden="true"></span></button></div>';
            }
        }
    }
}
