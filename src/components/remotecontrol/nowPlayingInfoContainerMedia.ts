import escapeHtml from 'escape-html';
import nowPlayingHelper from '../playback/nowplayinghelper';

export default class NowPlayingInfoContainerMedia {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updatePlayerState(context: HTMLElement, state: any) {
        const item = state.NowPlayingItem;
        if (item) {
            const nowPlayingServerId = item.ServerId;
            const displayName = this.getNowPlayingNameHtml(item).replace('<br/>', ' - ');
            const nowPlayingPageTitle = context.querySelector('.nowPlayingPageTitle');

            if (item.Type == 'AudioBook' || item.Type == 'Audio' || item.MediaStreams[0].Type == 'Audio') {
                this.setAudioInfo(context, item, nowPlayingServerId);
            } else if (item.Type == 'Episode') {
                this.setEpisodeInfo(context, item, nowPlayingServerId);
            } else if (nowPlayingPageTitle) {
                nowPlayingPageTitle.innerHTML = displayName;
            }

            if (displayName.length > 0 && item.Type != 'Audio' && item.Type != 'Episode') {
                nowPlayingPageTitle?.classList.remove('hide');
            } else {
                nowPlayingPageTitle?.classList.add('hide');
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private setAudioInfo(context: HTMLElement, item: any, nowPlayingServerId: any) {
        const nowPlayingAlbum = context.querySelector('.nowPlayingAlbum');
        const nowPlayingArtist = context.querySelector('.nowPlayingArtist');
        const nowPlayingSongName = context.querySelector<HTMLDivElement>('.nowPlayingSongName');

        if (nowPlayingAlbum) {
            nowPlayingAlbum.innerHTML = this.getAlbumName(item, nowPlayingServerId);
        }
        if (nowPlayingArtist) {
            nowPlayingArtist.innerHTML = this.getArtistsSeries(item, nowPlayingServerId);
        }
        if (nowPlayingSongName) {
            nowPlayingSongName.innerText = item.Name;
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private setEpisodeInfo(context: HTMLElement, item: any, nowPlayingServerId: any) {
        const nowPlayingSeason = context.querySelector('.nowPlayingSeason');
        const nowPlayingSerie = context.querySelector<HTMLDivElement>('.nowPlayingSerie');
        const nowPlayingEpisode = context.querySelector<HTMLDivElement>('.nowPlayingEpisode');

        if (nowPlayingSeason && item.SeasonName != null) {
            const seasonName = item.SeasonName;
            nowPlayingSeason.innerHTML = '<a class="button-link emby-button" is="emby-linkbutton" href="#/details?id=' + item.SeasonId + `&serverId=${nowPlayingServerId}">${escapeHtml(seasonName)}</a>`;
        }
        if (nowPlayingSerie && item.SeriesName != null) {
            const seriesName = item.SeriesName;
            if (item.SeriesId != null) {
                nowPlayingSerie.innerHTML = '<a class="button-link emby-button" is="emby-linkbutton" href="#/details?id=' + item.SeriesId + `&serverId=${nowPlayingServerId}">${escapeHtml(seriesName)}</a>`;
            } else {
                nowPlayingSerie.innerText = seriesName;
            }
        }
        if (nowPlayingEpisode) {
            nowPlayingEpisode.innerText = item.Name;
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private getAlbumName(item: any, nowPlayingServerId: any) {
        let albumName = '';
        if (item.Album != null) {
            albumName = '<a class="button-link emby-button" is="emby-linkbutton" href="#/details?id=' + item.AlbumId + `&serverId=${nowPlayingServerId}">` + escapeHtml(item.Album) + '</a>';
        }
        return albumName;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private getArtistsSeries(item: any, nowPlayingServerId: any) {
        if (item.Artists != null) {
            if (item.ArtistItems != null) {
                return item.ArtistItems
                    .map((artist: any) => `<a class="button-link emby-button" is="emby-linkbutton" href="#/details?id=${artist.Id}&serverId=${nowPlayingServerId}">${escapeHtml(artist.Name)}</a>`)
                    .join(', ');
            } else if (item.Artists) {
                // For some reason, Chromecast Player doesn't return a item.ArtistItems object, so we need to fallback
                // to normal item.Artists item.
                // TODO: Normalise fields returned by all the players
                return item.Artists
                    .map((artist: any) => `<a>${escapeHtml(artist)}</a>`)
                    .join(', ');
            }
        }
        return '';
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private getNowPlayingNameHtml(nowPlayingItem: any) {
        return nowPlayingHelper.getNowPlayingNames(nowPlayingItem).map(function (i) {
            return escapeHtml(i.text);
        }).join('<br/>');
    }
}
