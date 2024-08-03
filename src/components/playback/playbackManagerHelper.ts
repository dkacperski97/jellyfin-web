import Events from '../../utils/events';
// import itemHelper from '../itemHelper';
// import * as userSettings from '../../scripts/settings/userSettings';
import globalize from '../../scripts/globalize';
// import { appHost } from '../apphost';
import Screenfull from 'screenfull';
// import ServerConnections from '../ServerConnections';
import alert from '../alert';
// import { getItems } from '../../utils/jellyfin-apiclient/getItems';
// import merge from 'lodash-es/merge';
import { PlayerPlugin, PlayerTarget } from 'types/plugin';
import { playbackManager } from './playbackmanager';
// import type { ApiClient } from 'jellyfin-apiclient';
import {
    // type BaseItemDto,
    // type MediaSourceInfo,
    PlaybackErrorCode,
    type PlaybackInfoResponse
} from '@jellyfin/sdk/lib/generated-client';

export const UNLIMITED_ITEMS = -1;

export function enableLocalPlaylistManagement(player: PlayerPlugin) {
    if (player.getPlaylist) {
        return false;
    }

    return player.isLocalPlayer;
}

export function bindToFullscreenChange(player: PlayerPlugin) {
    if (Screenfull.isEnabled) {
        Screenfull.on('change', function () {
            Events.trigger(player, 'fullscreenchange');
        });
    } else {
        // iOS Safari
        document.addEventListener('webkitfullscreenchange', function () {
            Events.trigger(player, 'fullscreenchange');
        }, false);
    }
}

export function triggerPlayerChange(
    playbackManagerInstance: typeof playbackManager,
    newPlayer: PlayerPlugin,
    newTarget: PlayerTarget,
    previousPlayer: PlayerPlugin,
    previousTargetInfo: PlayerTarget
) {
    if (!newPlayer && !previousPlayer) {
        return;
    }

    if (newTarget && previousTargetInfo && newTarget.id === previousTargetInfo.id) {
        return;
    }

    Events.trigger(playbackManagerInstance, 'playerchange', [newPlayer, newTarget, previousPlayer]);
}

// export function reportPlayback(
//     playbackManagerInstance: typeof playbackManager,
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     state: any, // TODO
//     player: PlayerPlugin,
//     reportPlaylist: boolean,
//     serverId: string | undefined,
//     method: 'reportPlaybackStart' | 'reportPlaybackStopped' | 'reportPlaybackProgress',
//     progressEventName?: string // TODO
// ) {
//     if (!serverId) {
//         // Not a server item
//         // We can expand on this later and possibly report them
//         Events.trigger(playbackManagerInstance, 'reportplayback', [false]);
//         return;
//     }

//     const info = Object.assign({}, state.PlayState);
//     info.ItemId = state.NowPlayingItem.Id;

//     if (progressEventName) {
//         info.EventName = progressEventName;
//     }

//     if (reportPlaylist) {
//         addPlaylistToPlaybackReport(playbackManagerInstance, info, player, serverId);
//     }

//     const apiClient = ServerConnections.getApiClient(serverId);
//     const reportPlaybackPromise = apiClient[method](info);
//     // Notify that report has been sent
//     void reportPlaybackPromise.then(() => {
//         Events.trigger(playbackManagerInstance, 'reportplayback', [true]);
//     });
// }

// export function getPlaylistSync(
//     playbackManagerInstance: typeof playbackManager,
//     player: PlayerPlugin
// ) {
//     player = player || playbackManagerInstance._currentPlayer;
//     if (player && !enableLocalPlaylistManagement(player)) {
//         return player.getPlaylistSync();
//     }

//     return playbackManagerInstance._playQueueManager.getPlaylist();
// }

// export function addPlaylistToPlaybackReport(
//     playbackManagerInstance: typeof playbackManager,
//     info,
//     player: PlayerPlugin,
//     serverId: string
// ) {
//     info.NowPlayingQueue = getPlaylistSync(playbackManagerInstance, player).map(function (i) {
//         const itemInfo = {
//             Id: i.Id,
//             PlaylistItemId: i.PlaylistItemId
//         };

//         if (i.ServerId !== serverId) {
//             itemInfo.ServerId = i.ServerId;
//         }

//         return itemInfo;
//     });
// }

export function normalizeName(t: string) {
    return t.toLowerCase().replace(' ', '');
}

// export function getItemsForPlayback(serverId: string, query) {
//     const apiClient = ServerConnections.getApiClient(serverId);

//     if (query.Ids && query.Ids.split(',').length === 1) {
//         const itemId = query.Ids.split(',');

//         return apiClient.getItem(apiClient.getCurrentUserId(), itemId).then(function (item) {
//             return {
//                 Items: [item],
//                 TotalRecordCount: 1
//             };
//         });
//     } else {
//         if (query.Limit === UNLIMITED_ITEMS) {
//             delete query.Limit;
//         } else {
//             query.Limit = query.Limit || 300;
//         }
//         query.Fields = ['Chapters', 'Trickplay'];
//         query.ExcludeLocationTypes = 'Virtual';
//         query.EnableTotalRecordCount = false;
//         query.CollapseBoxSetItems = false;

//         return getItems(apiClient, apiClient.getCurrentUserId(), query);
//     }
// }

// export function createStreamInfoFromUrlItem(item) {
//     // Check item.Path for games
//     return {
//         url: item.Url || item.Path,
//         playMethod: 'DirectPlay',
//         item: item,
//         textTracks: [],
//         mediaType: item.MediaType
//     };
// }

// export function mergePlaybackQueries(obj1, obj2) {
//     const query = merge({}, obj1, obj2);

//     const filters = query.Filters ? query.Filters.split(',') : [];
//     if (filters.indexOf('IsNotFolder') === -1) {
//         filters.push('IsNotFolder');
//     }
//     query.Filters = filters.join(',');
//     return query;
// }

export function getMimeType(type: string, container?: string) {
    container = (container || '').toLowerCase();

    const mimeTypes: Record<string, Record<string, string | undefined> | undefined> = {
        'audio': {
            'opus': 'audio/ogg',
            'webma': 'audio/webm',
            'm4a': 'audio/mp4'
        },
        'video': {
            'mkv': 'video/x-matroska',
            'm4v': 'video/mp4',
            'mov': 'video/quicktime',
            'mpg': 'video/mpeg',
            'flv': 'video/x-flv'
        }
    };

    return mimeTypes[type]?.[container] ?? type + '/' + container;
}

export function getParam(name: string, url: string) {
    name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
    const regexS = '[\\?&]' + name + '=([^&#]*)';
    const regex = new RegExp(regexS, 'i');

    const results = regex.exec(url);
    if (results == null) {
        return '';
    } else {
        return decodeURIComponent(results[1].replace(/\+/g, ' '));
    }
}

export function isAutomaticPlayer(player: PlayerPlugin) {
    return player.isLocalPlayer;
}

// export function getAutomaticPlayers(instance: typeof playbackManager, forceLocalPlayer?: boolean) {
//     if (!forceLocalPlayer) {
//         const player = instance._currentPlayer;
//         if (player && !isAutomaticPlayer(player)) {
//             return [player];
//         }
//     }

//     return instance.getPlayers().filter(isAutomaticPlayer);
// }

// export function isServerItem(item) {
//     return !!item.Id;
// }

// export function enableIntros(item) {
//     if (item.MediaType !== 'Video') {
//         return false;
//     }
//     if (item.Type === 'TvChannel') {
//         return false;
//     }
//     // disable for in-progress recordings
//     if (item.Status === 'InProgress') {
//         return false;
//     }

//     return isServerItem(item);
// }

// export function getIntros(firstItem, apiClient: ApiClient, options) {
//     if (options.startPositionTicks || options.startIndex || options.fullscreen === false || !enableIntros(firstItem) || !userSettings.enableCinemaMode(undefined)) {
//         return Promise.resolve({
//             Items: []
//         });
//     }

//     return apiClient.getIntros(firstItem.Id).then(function (result) {
//         return result;
//     }, function () {
//         return Promise.resolve({
//             Items: []
//         });
//     });
// }

// export function getAudioMaxValues(deviceProfile) {
//     // TODO - this could vary per codec and should be done on the server using the entire profile
//     let maxAudioSampleRate = null;
//     let maxAudioBitDepth = null;
//     let maxAudioBitrate = null;

//     deviceProfile.CodecProfiles.forEach(codecProfile => {
//         if (codecProfile.Type === 'Audio') {
//             (codecProfile.Conditions || []).forEach(condition => {
//                 if (condition.Condition === 'LessThanEqual' && condition.Property === 'AudioBitDepth') {
//                     maxAudioBitDepth = condition.Value;
//                 } else if (condition.Condition === 'LessThanEqual' && condition.Property === 'AudioSampleRate') {
//                     maxAudioSampleRate = condition.Value;
//                 } else if (condition.Condition === 'LessThanEqual' && condition.Property === 'AudioBitrate') {
//                     maxAudioBitrate = condition.Value;
//                 }
//             });
//         }
//     });

//     return {
//         maxAudioSampleRate: maxAudioSampleRate,
//         maxAudioBitDepth: maxAudioBitDepth,
//         maxAudioBitrate: maxAudioBitrate
//     };
// }

// let startingPlaySession = new Date().getTime();
// export function getAudioStreamUrl(item, transcodingProfile, directPlayContainers: string, apiClient: ApiClient, startPosition?: number, maxValues) {
//     const url = 'Audio/' + item.Id + '/universal';

//     startingPlaySession++;
//     return apiClient.getUrl(url, {
//         UserId: apiClient.getCurrentUserId(),
//         DeviceId: apiClient.deviceId(),
//         MaxStreamingBitrate: maxValues.maxAudioBitrate || maxValues.maxBitrate,
//         Container: directPlayContainers,
//         TranscodingContainer: transcodingProfile.Container || null,
//         TranscodingProtocol: transcodingProfile.Protocol || null,
//         AudioCodec: transcodingProfile.AudioCodec,
//         MaxAudioSampleRate: maxValues.maxAudioSampleRate,
//         MaxAudioBitDepth: maxValues.maxAudioBitDepth,
//         api_key: apiClient.accessToken(),
//         PlaySessionId: startingPlaySession,
//         StartTimeTicks: startPosition || 0,
//         EnableRedirection: true,
//         EnableRemoteMedia: appHost.supports('remoteaudio')
//     });
// }

// export function getAudioStreamUrlFromDeviceProfile(item, deviceProfile, maxBitrate, apiClient: ApiClient, startPosition?: number) {
//     const transcodingProfile = deviceProfile.TranscodingProfiles.filter(function (p) {
//         return p.Type === 'Audio' && p.Context === 'Streaming';
//     })[0];

//     let directPlayContainers = '';

//     deviceProfile.DirectPlayProfiles.forEach(p => {
//         if (p.Type === 'Audio') {
//             if (directPlayContainers) {
//                 directPlayContainers += ',' + p.Container;
//             } else {
//                 directPlayContainers = p.Container;
//             }

//             if (p.AudioCodec) {
//                 directPlayContainers += '|' + p.AudioCodec;
//             }
//         }
//     });

//     const maxValues = getAudioMaxValues(deviceProfile);

//     return getAudioStreamUrl(item, transcodingProfile, directPlayContainers, apiClient, startPosition, { maxBitrate, ...maxValues });
// }

// export function getStreamUrls(items, deviceProfile, maxBitrate, apiClient: ApiClient, startPosition?: number) {
//     const audioTranscodingProfile = deviceProfile.TranscodingProfiles.filter(function (p) {
//         return p.Type === 'Audio' && p.Context === 'Streaming';
//     })[0];

//     let audioDirectPlayContainers = '';

//     deviceProfile.DirectPlayProfiles.forEach(p => {
//         if (p.Type === 'Audio') {
//             if (audioDirectPlayContainers) {
//                 audioDirectPlayContainers += ',' + p.Container;
//             } else {
//                 audioDirectPlayContainers = p.Container;
//             }

//             if (p.AudioCodec) {
//                 audioDirectPlayContainers += '|' + p.AudioCodec;
//             }
//         }
//     });

//     const maxValues = getAudioMaxValues(deviceProfile);

//     const streamUrls = [];

//     for (let i = 0, length = items.length; i < length; i++) {
//         const item = items[i];
//         let streamUrl;

//         if (item.MediaType === 'Audio' && !itemHelper.isLocalItem(item)) {
//             streamUrl = getAudioStreamUrl(item, audioTranscodingProfile, audioDirectPlayContainers, apiClient, startPosition, { maxBitrate, ...maxValues });
//         }

//         streamUrls.push(streamUrl || '');

//         if (i === 0) {
//             startPosition = 0;
//         }
//     }

//     return Promise.resolve(streamUrls);
// }

// export function setStreamUrls(items, deviceProfile, maxBitrate, apiClient: ApiClient, startPosition?: number) {
//     return getStreamUrls(items, deviceProfile, maxBitrate, apiClient, startPosition).then(function (streamUrls) {
//         for (let i = 0, length = items.length; i < length; i++) {
//             const item = items[i];
//             const streamUrl = streamUrls[i];

//             if (streamUrl) {
//                 item.PresetMediaSource = {
//                     StreamUrl: streamUrl,
//                     Id: item.Id,
//                     MediaStreams: [],
//                     RunTimeTicks: item.RunTimeTicks
//                 };
//             }
//         }
//     });
// }

// export function getPlaybackInfo(player: PlayerPlugin, apiClient: ApiClient, item, deviceProfile, mediaSourceId, liveStreamId, options) {
//     if (!itemHelper.isLocalItem(item) && item.MediaType === 'Audio' && !player.useServerPlaybackInfoForAudio) {
//         return Promise.resolve({
//             MediaSources: [
//                 {
//                     StreamUrl: getAudioStreamUrlFromDeviceProfile(item, deviceProfile, options.maxBitrate, apiClient, options.startPosition),
//                     Id: item.Id,
//                     MediaStreams: [],
//                     RunTimeTicks: item.RunTimeTicks
//                 }]
//         });
//     }

//     if (item.PresetMediaSource) {
//         return Promise.resolve({
//             MediaSources: [item.PresetMediaSource]
//         });
//     }

//     const itemId = item.Id;

//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const query: any = {
//         UserId: apiClient.getCurrentUserId(),
//         StartTimeTicks: options.startPosition || 0
//     };

//     if (options.isPlayback) {
//         query.IsPlayback = true;
//         query.AutoOpenLiveStream = true;
//     } else {
//         query.IsPlayback = false;
//         query.AutoOpenLiveStream = false;
//     }

//     if (options.audioStreamIndex != null) {
//         query.AudioStreamIndex = options.audioStreamIndex;
//     }
//     if (options.subtitleStreamIndex != null) {
//         query.SubtitleStreamIndex = options.subtitleStreamIndex;
//     }
//     if (options.secondarySubtitleStreamIndex != null) {
//         query.SecondarySubtitleStreamIndex = options.secondarySubtitleStreamIndex;
//     }
//     if (options.enableDirectPlay != null) {
//         query.EnableDirectPlay = options.enableDirectPlay;
//     }
//     if (options.enableDirectStream != null) {
//         query.EnableDirectStream = options.enableDirectStream;
//     }
//     if (options.allowVideoStreamCopy != null) {
//         query.AllowVideoStreamCopy = options.allowVideoStreamCopy;
//     }
//     if (options.allowAudioStreamCopy != null) {
//         query.AllowAudioStreamCopy = options.allowAudioStreamCopy;
//     }
//     if (mediaSourceId) {
//         query.MediaSourceId = mediaSourceId;
//     }
//     if (liveStreamId) {
//         query.LiveStreamId = liveStreamId;
//     }
//     if (options.maxBitrate) {
//         query.MaxStreamingBitrate = options.maxBitrate;
//     }
//     if (player.enableMediaProbe && !player.enableMediaProbe(item)) {
//         query.EnableMediaProbe = false;
//     }

//     // lastly, enforce player overrides for special situations
//     if (query.EnableDirectStream !== false
//         && player.supportsPlayMethod && !player.supportsPlayMethod('DirectStream', item)
//     ) {
//         query.EnableDirectStream = false;
//     }

//     if (player.getDirectPlayProtocols) {
//         query.DirectPlayProtocols = player.getDirectPlayProtocols();
//     }

//     return apiClient.getPlaybackInfo(itemId, query, deviceProfile);
// }

// export function getOptimalMediaSource(apiClient: ApiClient, item: BaseItemDto, versions: PlaybackInfoResponse['MediaSources']) {
//     if (!versions) {
//         return Promise.reject();
//     }

//     const promises = versions.map(function (v) {
//         return supportsDirectPlay(apiClient, item, v);
//     });

//     if (!promises.length) {
//         return Promise.reject();
//     }

//     return Promise.all(promises).then(function (results) {
//         for (let i = 0, length = versions.length; i < length; i++) {
//             versions[i].enableDirectPlay = results[i] || false;
//         }
//         let optimalVersion = versions.filter(function (v) {
//             return v.enableDirectPlay;
//         })[0];

//         if (!optimalVersion) {
//             optimalVersion = versions.filter(function (v) {
//                 return v.SupportsDirectStream;
//             })[0];
//         }

//         optimalVersion = optimalVersion || versions.filter(function (s) {
//             return s.SupportsTranscoding;
//         })[0];

//         return optimalVersion || versions[0];
//     });
// }

// export function getLiveStream(
//     player: PlayerPlugin,
//     apiClient: ApiClient,
//     item,
//     playSessionId: PlaybackInfoResponse['PlaySessionId'],
//     deviceProfile,
//     mediaSource,
//     options
// ) {
//     const postData = {
//         DeviceProfile: deviceProfile,
//         OpenToken: mediaSource.OpenToken
//     };

//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const query: any = {
//         UserId: apiClient.getCurrentUserId(),
//         StartTimeTicks: options.startPosition || 0,
//         ItemId: item.Id,
//         PlaySessionId: playSessionId
//     };

//     if (options.maxBitrate) {
//         query.MaxStreamingBitrate = options.maxBitrate;
//     }
//     if (options.audioStreamIndex != null) {
//         query.AudioStreamIndex = options.audioStreamIndex;
//     }
//     if (options.subtitleStreamIndex != null) {
//         query.SubtitleStreamIndex = options.subtitleStreamIndex;
//     }

//     // lastly, enforce player overrides for special situations
//     if (query.EnableDirectStream !== false
//         && player.supportsPlayMethod && !player.supportsPlayMethod('DirectStream', item)
//     ) {
//         query.EnableDirectStream = false;
//     }

//     return apiClient.ajax({
//         url: apiClient.getUrl('LiveStreams/Open', query),
//         type: 'POST',
//         data: JSON.stringify(postData),
//         contentType: 'application/json',
//         dataType: 'json'

//     });
// }

// export function isHostReachable(mediaSource, apiClient: ApiClient) {
//     if (mediaSource.IsRemote) {
//         return Promise.resolve(true);
//     }

//     return apiClient.getEndpointInfo().then(function (endpointInfo) {
//         if (endpointInfo.IsInNetwork) {
//             if (!endpointInfo.IsLocal) {
//                 const path = (mediaSource.Path || '').toLowerCase();
//                 if (path.indexOf('localhost') !== -1 || path.indexOf('127.0.0.1') !== -1) {
//                     // This will only work if the app is on the same machine as the server
//                     return Promise.resolve(false);
//                 }
//             }

//             return Promise.resolve(true);
//         }

//         // media source is in network, but connection is out of network
//         return Promise.resolve(false);
//     });
// }

// export function supportsDirectPlay(apiClient: ApiClient, item: BaseItemDto, mediaSource: MediaSourceInfo) {
//     // folder rip hacks due to not yet being supported by the stream building engine
//     const isFolderRip = mediaSource.VideoType === 'BluRay' || mediaSource.VideoType === 'Dvd' || mediaSource.VideoType === 'HdDvd';

//     if (mediaSource.SupportsDirectPlay || isFolderRip) {
//         if (mediaSource.IsRemote && !appHost.supports('remotevideo')) {
//             return Promise.resolve(false);
//         }

//         if (mediaSource.Protocol === 'Http' && !mediaSource.RequiredHttpHeaders?.length) {
//             // If this is the only way it can be played, then allow it
//             if (!mediaSource.SupportsDirectStream && !mediaSource.SupportsTranscoding) {
//                 return Promise.resolve(true);
//             } else {
//                 return isHostReachable(mediaSource, apiClient);
//             }
//         }
//     }

//     return Promise.resolve(false);
// }

export function validatePlaybackInfoResult(instance: typeof playbackManager, result: PlaybackInfoResponse): boolean {
    if (result.ErrorCode) {
        // NOTE: To avoid needing to retranslate the "NoCompatibleStream" message,
        // we need to keep the key in the same format.
        const errMessage = result.ErrorCode === PlaybackErrorCode.NoCompatibleStream ?
            'PlaybackErrorNoCompatibleStream' : `PlaybackError.${result.ErrorCode}`;
        showPlaybackInfoErrorMessage(instance, errMessage);
        return false;
    }

    return true;
}

export function showPlaybackInfoErrorMessage(instance: typeof playbackManager, errorCode: string) {
    void alert({
        text: globalize.translate(errorCode),
        title: globalize.translate('HeaderPlaybackError')
    });
}

// export function normalizePlayOptions(playOptions) {
//     playOptions.fullscreen = playOptions.fullscreen !== false;
// }

// export function truncatePlayOptions(playOptions) {
//     return {
//         fullscreen: playOptions.fullscreen,
//         mediaSourceId: playOptions.mediaSourceId,
//         audioStreamIndex: playOptions.audioStreamIndex,
//         subtitleStreamIndex: playOptions.subtitleStreamIndex,
//         startPositionTicks: playOptions.startPositionTicks
//     };
// }

// export function getNowPlayingItemForReporting(player: PlayerPlugin, item, mediaSource) {
//     const nowPlayingItem = Object.assign({}, item);

//     if (mediaSource) {
//         nowPlayingItem.RunTimeTicks = mediaSource.RunTimeTicks;
//         nowPlayingItem.MediaStreams = mediaSource.MediaStreams;

//         // not needed
//         nowPlayingItem.MediaSources = null;
//     }

//     nowPlayingItem.RunTimeTicks = nowPlayingItem.RunTimeTicks || player.duration() * 10000;

//     return nowPlayingItem;
// }

export function displayPlayerIndividually(player: PlayerPlugin) {
    return !player.isLocalPlayer;
}

export function createTarget(instance: typeof playbackManager, player: PlayerPlugin): PlayerTarget {
    return {
        name: player.name,
        id: player.id,
        playerName: player.name,
        playableMediaTypes: ['Audio', 'Video', 'Photo', 'Book'].map(player.canPlayMediaType),
        isLocalPlayer: player.isLocalPlayer,
        supportedCommands: instance.getSupportedCommands(player)
    };
}

export function getPlayerTargets(instance: typeof playbackManager, player: PlayerPlugin) {
    if (player.getTargets) {
        return player.getTargets();
    }

    return Promise.resolve([createTarget(instance, player)]);
}

export function sortPlayerTargets(a: PlayerTarget, b: PlayerTarget) {
    const aVal = a.isLocalPlayer ? 0 : 1;
    const bVal = b.isLocalPlayer ? 0 : 1;

    const aValString = aVal.toString() + a.name;
    const bValString = bVal.toString() + b.name;

    return aValString.localeCompare(bValString);
}

// export function getSupportedCommands(player: PlayerPlugin) {
//     player = player || this._currentPlayer || { isLocalPlayer: true };

//     if (player.isLocalPlayer) {
//         const list = [
//             'GoHome',
//             'GoToSettings',
//             'VolumeUp',
//             'VolumeDown',
//             'Mute',
//             'Unmute',
//             'ToggleMute',
//             'SetVolume',
//             'SetAudioStreamIndex',
//             'SetSubtitleStreamIndex',
//             'SetMaxStreamingBitrate',
//             'DisplayContent',
//             'GoToSearch',
//             'DisplayMessage',
//             'SetRepeatMode',
//             'SetShuffleQueue',
//             'PlayMediaSource',
//             'PlayTrailers'
//         ];

//         if (appHost.supports('fullscreenchange')) {
//             list.push('ToggleFullscreen');
//         }

//         if (player.supports) {
//             [
//                 'PictureInPicture',
//                 'AirPlay',
//                 'SetBrightness',
//                 'SetAspectRatio',
//                 'PlaybackRate'
//             ].forEach(command => {
//                 if (player.supports(command)) {
//                     list.push(command);
//                 }
//             });
//         }

//         return list;
//     }

//     const info = this.getPlayerInfo();
//     return info ? info.supportedCommands : [];
// }
