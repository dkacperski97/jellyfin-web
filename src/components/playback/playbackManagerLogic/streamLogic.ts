import type { PlayerPlugin } from 'types/plugin';

export default class StreamLogic {
    _currentPlayer?: PlayerPlugin | null;

    changeStream(player: PlayerPlugin | null, ticks, params) {
        if (canPlayerSeek(player) && params == null) {
            player.currentTime(parseInt(ticks / 10000, 10));
            return;
        }

        params = params || {};

        const liveStreamId = getPlayerData(player).streamInfo.liveStreamId;
        const lastMediaInfoQuery = getPlayerData(player).streamInfo.lastMediaInfoQuery;

        const playSessionId = self.playSessionId(player);

        const currentItem = self.currentItem(player);

        player.getDeviceProfile(currentItem, {
            isRetry: params.EnableDirectPlay === false
        }).then(function (deviceProfile) {
            const audioStreamIndex = params.AudioStreamIndex == null ? getPlayerData(player).audioStreamIndex : params.AudioStreamIndex;
            const subtitleStreamIndex = params.SubtitleStreamIndex == null ? getPlayerData(player).subtitleStreamIndex : params.SubtitleStreamIndex;
            const secondarySubtitleStreamIndex = params.SecondarySubtitleStreamIndex == null ? getPlayerData(player).secondarySubtitleStreamIndex : params.SecondarySubtitleStreamIndex;

            let currentMediaSource = self.currentMediaSource(player);
            const apiClient = ServerConnections.getApiClient(currentItem.ServerId);

            if (ticks) {
                ticks = parseInt(ticks, 10);
            }

            const maxBitrate = params.MaxStreamingBitrate || self.getMaxStreamingBitrate(player);

            const currentPlayOptions = currentItem.playOptions || getDefaultPlayOptions();

            const options = {
                maxBitrate,
                startPosition: ticks,
                isPlayback: true,
                audioStreamIndex,
                subtitleStreamIndex,
                enableDirectPlay: params.EnableDirectPlay,
                enableDirectStream: params.EnableDirectStream,
                allowVideoStreamCopy: params.AllowVideoStreamCopy,
                allowAudioStreamCopy: params.AllowAudioStreamCopy
            };

            getPlaybackInfo(player, apiClient, currentItem, deviceProfile, currentMediaSource.Id, liveStreamId, options).then(function (result) {
                if (validatePlaybackInfoResult(self, result)) {
                    currentMediaSource = result.MediaSources[0];

                    const streamInfo = createStreamInfo(apiClient, currentItem.MediaType, currentItem, currentMediaSource, ticks, player);
                    streamInfo.fullscreen = currentPlayOptions.fullscreen;
                    streamInfo.lastMediaInfoQuery = lastMediaInfoQuery;
                    streamInfo.resetSubtitleOffset = false;

                    if (!streamInfo.url) {
                        cancelPlayback();
                        showPlaybackInfoErrorMessage(self, `PlaybackError.${MediaError.NO_MEDIA_ERROR}`);
                        return;
                    }

                    getPlayerData(player).subtitleStreamIndex = subtitleStreamIndex;
                    getPlayerData(player).secondarySubtitleStreamIndex = secondarySubtitleStreamIndex;
                    getPlayerData(player).audioStreamIndex = audioStreamIndex;
                    getPlayerData(player).maxStreamingBitrate = maxBitrate;

                    changeStreamToUrl(apiClient, player, playSessionId, streamInfo);
                }
            });
        });
    }
}
