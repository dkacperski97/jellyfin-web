import datetime from '../../scripts/datetime';
import listView from '../listview/listview';
import imageLoader from '../images/imageLoader';
import { playbackManager } from '../playback/playbackmanager';
import Events from '../../utils/events.ts';
import globalize from '../../scripts/globalize';
import layoutManager from '../layoutManager';
import * as userSettings from '../../scripts/settings/userSettings';
import '../cardbuilder/card.scss';
import '../../elements/emby-button/emby-button';
import '../../elements/emby-button/paper-icon-button-light';
import '../../elements/emby-itemscontainer/emby-itemscontainer';
import './remotecontrol.scss';
import '../../elements/emby-ratingbutton/emby-ratingbutton';
import '../../elements/emby-slider/emby-slider';
import { appRouter } from '../router/appRouter';
import VolumeControl from './volumeControl';
import RemoteControlSection from './remoteControlSection';
import NowPlayingPageImage from './nowPlayingPageImage';
import ToggleContextMenuButton from './toggleContextMenuButton';
import NowPlayingInfoContainerMedia from './nowPlayingInfoContainerMedia';
import NowPlayingPageBackdrop from './nowPlayingPageBackdrop';
import NowPlayingInfoButtons from './nowPlayingInfoButtons';
import NowPlayingSecondaryButtons from './nowPlayingSecondaryButtons';

function buttonVisible(btn, enabled) {
    if (enabled) {
        btn.classList.remove('hide');
    } else {
        btn.classList.add('hide');
    }
}

export default function () {
    function updatePlayerState(player, context, state) {
        lastPlayerState = state;
        const item = state.NowPlayingItem;
        const playerInfo = playbackManager.getPlayerInfo();
        const supportedCommands = playerInfo.supportedCommands;
        const playState = state.PlayState || {};

        remoteControlSection.updatePlayerState(context, supportedCommands, currentPlayer);

        buttonVisible(context.querySelector('.btnNextTrack'), item != null);
        buttonVisible(context.querySelector('.btnPreviousTrack'), item != null);
        if (layoutManager.mobile) {
            const playingVideo = playbackManager.isPlayingVideo() && item !== null;
            const playingAudio = !playbackManager.isPlayingVideo() && item !== null;
            const playingAudioBook = playingAudio && item.Type == 'AudioBook';
            buttonVisible(context.querySelector('.btnRewind'), playingVideo || playingAudioBook);
            buttonVisible(context.querySelector('.btnFastForward'), playingVideo || playingAudioBook);
        } else {
            buttonVisible(context.querySelector('.btnRewind'), item != null);
            buttonVisible(context.querySelector('.btnFastForward'), item != null);
        }
        const positionSlider = context.querySelector('.nowPlayingPositionSlider');

        if (positionSlider && item && item.RunTimeTicks) {
            positionSlider.setKeyboardSteps(userSettings.skipBackLength() * 1000000 / item.RunTimeTicks,
                userSettings.skipForwardLength() * 1000000 / item.RunTimeTicks);
        }

        if (positionSlider && !positionSlider.dragging) {
            positionSlider.disabled = !playState.CanSeek;
            const isProgressClear = state.MediaSource && state.MediaSource.RunTimeTicks == null;
            positionSlider.setIsClear(isProgressClear);
        }

        updatePlayPauseState(playState.IsPaused);
        updateTimeDisplay(playState.PositionTicks, item ? item.RunTimeTicks : null);

        volumeControl.updatePlayerState(context, state);

        if (item && item.MediaType == 'Video') {
            context.classList.remove('hideVideoButtons');
        } else {
            context.classList.add('hideVideoButtons');
        }

        nowPlayingInfoButtons.updatePlayerState(state);
        nowPlayingSecondaryButtons.updatePlayerState(player, context, state);
        onShuffleQueueModeChange(false);
        nowPlayingInfoContainerMedia.updatePlayerState(context, state);
        nowPlayingPageImage.updatePlayerState(context, state);
        toggleContextMenuButton.updatePlayerState(context, state);
        nowPlayingPageBackdrop.updatePlayerState(context, state);
    }

    function updatePlayPauseState(isPaused) {
        const context = dlg;
        const playlistIndicator = context.querySelector('.playlistIndexIndicatorImage');
        if (playlistIndicator) {
            playlistIndicator.classList.toggle('playlistIndexIndicatorPausedImage', isPaused);
        }
    }

    function updateTimeDisplay(positionTicks, runtimeTicks) {
        const context = dlg;
        const positionSlider = context.querySelector('.nowPlayingPositionSlider');

        if (positionSlider && !positionSlider.dragging) {
            if (runtimeTicks) {
                let pct = positionTicks / runtimeTicks;
                pct *= 100;
                positionSlider.value = pct;
            } else {
                positionSlider.value = 0;
            }
        }

        context.querySelector('.positionTime').innerHTML = Number.isFinite(positionTicks) ? datetime.getDisplayRunningTime(positionTicks) : '--:--';
        context.querySelector('.runtime').innerHTML = Number.isFinite(runtimeTicks) ? datetime.getDisplayRunningTime(runtimeTicks) : '--:--';
    }

    function getPlaylistItems(player) {
        return playbackManager.getPlaylist(player);
    }

    function loadPlaylist(context, player) {
        getPlaylistItems(player).then(function (items) {
            let html = '';
            let favoritesEnabled = true;
            if (layoutManager.mobile) {
                if (items.length > 0) {
                    context.querySelector('.btnTogglePlaylist').classList.remove('hide');
                } else {
                    context.querySelector('.btnTogglePlaylist').classList.add('hide');
                }
                favoritesEnabled = false;
            }

            html += listView.getListViewHtml({
                items: items,
                smallIcon: true,
                action: 'setplaylistindex',
                enableUserDataButtons: favoritesEnabled,
                rightButtons: [{
                    icon: 'remove_circle_outline',
                    title: globalize.translate('ButtonRemove'),
                    id: 'remove'
                }],
                dragHandle: true
            });

            const itemsContainer = context.querySelector('.playlist');
            let focusedItemPlaylistId = itemsContainer.querySelector('button:focus');
            itemsContainer.innerHTML = html;
            if (focusedItemPlaylistId !== null) {
                focusedItemPlaylistId = focusedItemPlaylistId.getAttribute('data-playlistitemid');
                const newFocusedItem = itemsContainer.querySelector(`button[data-playlistitemid="${focusedItemPlaylistId}"]`);
                if (newFocusedItem !== null) {
                    newFocusedItem.focus();
                }
            }

            const playlistItemId = playbackManager.getCurrentPlaylistItemId(player);

            if (playlistItemId) {
                const img = itemsContainer.querySelector(`.listItem[data-playlistItemId="${playlistItemId}"] .listItemImage`);

                if (img) {
                    img.classList.remove('lazy');
                    img.classList.add('playlistIndexIndicatorImage');
                    img.classList.toggle('playlistIndexIndicatorPausedImage', playbackManager.paused());
                }
            }

            imageLoader.lazyChildren(itemsContainer);
        });
    }

    function onPlaybackStart(e, state) {
        console.debug('remotecontrol event: ' + e.type);
        const player = this;
        onStateChanged.call(player, e, state);
    }

    function onShuffleQueueModeChange(updateView = true) {
        if (updateView) {
            onPlaylistUpdate();
        }
    }

    function onPlaylistUpdate() {
        loadPlaylist(dlg, this);
    }

    function onPlaylistItemRemoved(e, info) {
        const context = dlg;
        if (info !== undefined) {
            const playlistItemIds = info.playlistItemIds;

            for (let i = 0, length = playlistItemIds.length; i < length; i++) {
                const listItem = context.querySelector('.listItem[data-playlistItemId="' + playlistItemIds[i] + '"]');

                if (listItem) {
                    listItem.parentNode.removeChild(listItem);
                }
            }
        } else {
            onPlaylistUpdate();
        }
    }

    function onPlaybackStopped(e, state) {
        console.debug('remotecontrol event: ' + e.type);
        const player = this;

        if (!state.NextMediaType) {
            updatePlayerState(player, dlg, {});
            appRouter.back();
        }
    }

    function onPlayPauseStateChanged() {
        updatePlayPauseState(this.paused());
    }

    function onStateChanged(event, state) {
        const player = this;
        updatePlayerState(player, dlg, state);
        onPlaylistUpdate();
    }

    function onTimeUpdate() {
        const now = new Date().getTime();

        if (now - lastUpdateTime >= 700) {
            lastUpdateTime = now;
            const player = this;
            currentRuntimeTicks = playbackManager.duration(player);
            updateTimeDisplay(playbackManager.currentTime(player) * 10000, currentRuntimeTicks);
        }
    }

    function releaseCurrentPlayer() {
        const player = currentPlayer;

        if (player) {
            Events.off(player, 'playbackstart', onPlaybackStart);
            Events.off(player, 'statechange', onStateChanged);
            Events.off(player, 'shufflequeuemodechange', onShuffleQueueModeChange);
            Events.off(player, 'playlistitemremove', onPlaylistItemRemoved);
            Events.off(player, 'playlistitemmove', onPlaylistUpdate);
            Events.off(player, 'playlistitemadd', onPlaylistUpdate);
            Events.off(player, 'playbackstop', onPlaybackStopped);
            Events.off(player, 'pause', onPlayPauseStateChanged);
            Events.off(player, 'unpause', onPlayPauseStateChanged);
            Events.off(player, 'timeupdate', onTimeUpdate);
            currentPlayer = null;
        }
    }

    function bindToPlayer(context, player) {
        releaseCurrentPlayer();
        currentPlayer = player;

        if (player) {
            const state = playbackManager.getPlayerState(player);
            onStateChanged.call(player, {
                type: 'init'
            }, state);
            Events.on(player, 'playbackstart', onPlaybackStart);
            Events.on(player, 'statechange', onStateChanged);
            Events.on(player, 'shufflequeuemodechange', onShuffleQueueModeChange);
            Events.on(player, 'playlistitemremove', onPlaylistItemRemoved);
            Events.on(player, 'playlistitemmove', onPlaylistUpdate);
            Events.on(player, 'playlistitemadd', onPlaylistUpdate);
            Events.on(player, 'playbackstop', onPlaybackStopped);
            Events.on(player, 'pause', onPlayPauseStateChanged);
            Events.on(player, 'unpause', onPlayPauseStateChanged);
            Events.on(player, 'timeupdate', onTimeUpdate);
        }
    }

    function getSaveablePlaylistItems() {
        return getPlaylistItems(currentPlayer).then(function (items) {
            return items.filter(function (i) {
                return i.Id && i.ServerId;
            });
        });
    }

    function savePlaylist() {
        import('../playlisteditor/playlisteditor').then(({ default: PlaylistEditor }) => {
            getSaveablePlaylistItems().then(function (items) {
                const serverId = items.length ? items[0].ServerId : ApiClient.serverId();
                const playlistEditor = new PlaylistEditor();
                playlistEditor.show({
                    items: items.map(function (i) {
                        return i.Id;
                    }),
                    serverId: serverId,
                    enableAddToPlayQueue: false,
                    defaultValue: 'new'
                }).catch(() => {
                    // Dialog closed
                });
            });
        }).catch(err => {
            console.error('[savePlaylist] failed to load playlist editor', err);
        });
    }

    function bindEvents(context) {
        const positionSlider = context.querySelector('.nowPlayingPositionSlider');

        context.querySelector('.btnNextTrack').addEventListener('click', function () {
            if (currentPlayer) {
                playbackManager.nextTrack(currentPlayer);
            }
        });
        context.querySelector('.btnRewind').addEventListener('click', function () {
            if (currentPlayer) {
                playbackManager.rewind(currentPlayer);
            }
        });
        context.querySelector('.btnFastForward').addEventListener('click', function () {
            if (currentPlayer) {
                playbackManager.fastForward(currentPlayer);
            }
        });

        context.querySelector('.btnPreviousTrack').addEventListener('click', function (e) {
            if (currentPlayer) {
                if (playbackManager.isPlayingAudio(currentPlayer)) {
                    // Cancel this event if doubleclick is fired. The actual previousTrack will be processed by the 'dblclick' event
                    if (e.detail > 1 ) {
                        return;
                    }

                    // Return to start of track, unless we are already (almost) at the beginning. In the latter case, continue and move
                    // to the previous track, unless we are at the first track so no previous track exists.
                    // currentTime is in msec.

                    if (playbackManager.currentTime(currentPlayer) >= 5 * 1000 || playbackManager.getCurrentPlaylistIndex(currentPlayer) <= 0) {
                        playbackManager.seekPercent(0, currentPlayer);
                        // This is done automatically by playbackManager, however, setting this here gives instant visual feedback.
                        // TODO: Check why seekPercent doesn't reflect the changes inmmediately, so we can remove this workaround.
                        positionSlider.value = 0;
                        return;
                    }
                }
                playbackManager.previousTrack(currentPlayer);
            }
        });

        context.querySelector('.btnPreviousTrack').addEventListener('dblclick', function () {
            if (currentPlayer) {
                playbackManager.previousTrack(currentPlayer);
            }
        });
        positionSlider.addEventListener('change', function () {
            const value = this.value;

            if (currentPlayer) {
                const newPercent = parseFloat(value);
                playbackManager.seekPercent(newPercent, currentPlayer);
            }
        });

        positionSlider.getBubbleText = function (value) {
            const state = lastPlayerState;

            if (!state?.NowPlayingItem || !currentRuntimeTicks) {
                return '--:--';
            }

            let ticks = currentRuntimeTicks;
            ticks /= 100;
            ticks *= value;
            return datetime.getDisplayRunningTime(ticks);
        };

        const playlistContainer = context.querySelector('.playlist');
        playlistContainer.addEventListener('action-remove', function (e) {
            playbackManager.removeFromPlaylist([e.detail.playlistItemId], currentPlayer);
        });
        playlistContainer.addEventListener('itemdrop', function (e) {
            const newIndex = e.detail.newIndex;
            const playlistItemId = e.detail.playlistItemId;
            playbackManager.movePlaylistItem(playlistItemId, newIndex, currentPlayer);
        });
        context.querySelector('.btnSavePlaylist').addEventListener('click', savePlaylist);
        context.querySelector('.btnTogglePlaylist').addEventListener('click', function () {
            if (context.querySelector('.playlist').classList.contains('hide')) {
                context.querySelector('.playlist').classList.remove('hide');
                context.querySelector('.btnSavePlaylist').classList.remove('hide');
                context.querySelector('.volumeControlContainer').classList.add('hide');
                if (layoutManager.mobile) {
                    context.querySelector('.playlistSectionButton').classList.remove('playlistSectionButtonTransparent');
                }
            } else {
                context.querySelector('.playlist').classList.add('hide');
                context.querySelector('.btnSavePlaylist').classList.add('hide');
                context.querySelector('.volumeControlContainer').classList.remove('hide');
                if (layoutManager.mobile) {
                    context.querySelector('.playlistSectionButton').classList.add('playlistSectionButtonTransparent');
                }
            }
        });
    }

    function onPlayerChange() {
        const player = playbackManager.getCurrentPlayer();
        bindToPlayer(dlg, player);
        volumeControl.onPlayerChange(player);
        remoteControlSection.onPlayerChange(player);
        nowPlayingInfoButtons.onPlayerChange(player);
        nowPlayingSecondaryButtons.onPlayerChange(player);
    }

    function init(ownerView, context) {
        const volumecontrolHtml = VolumeControl.getHtml();
        const optionsSection = context.querySelector('.playlistSectionButton');
        if (!layoutManager.mobile) {
            optionsSection.classList.remove('align-items-center', 'justify-content-center');
            optionsSection.classList.add('align-items-right', 'justify-content-flex-end');
            context.querySelector('.playlist').classList.remove('hide');
            context.querySelector('.btnSavePlaylist').classList.remove('hide');
            context.classList.add('padded-bottom');
        } else {
            optionsSection.querySelector('.volumeControlContainer').innerHTML = volumecontrolHtml;
            optionsSection.classList.add('playlistSectionButtonTransparent');
            context.querySelector('.btnTogglePlaylist').classList.remove('hide');
            context.querySelector('.playlistSectionButton').classList.remove('justify-content-center');
            context.querySelector('.playlistSectionButton').classList.add('justify-content-space-between');
        }

        bindEvents(context);
        Events.on(playbackManager, 'playerchange', onPlayerChange);

        if (layoutManager.tv) {
            const positionSlider = context.querySelector('.nowPlayingPositionSlider');
            positionSlider.classList.add('focusable');
            positionSlider.enableKeyboardDragging();
        }
    }

    function onDialogClosed() {
        releaseCurrentPlayer();
        Events.off(playbackManager, 'playerchange', onPlayerChange);
        lastPlayerState = null;
    }

    function onShow(context, player) {
        bindToPlayer(context, player);
    }

    let dlg;
    let currentPlayer;
    let lastPlayerState;
    let lastUpdateTime = 0;
    let currentRuntimeTicks = 0;

    let volumeControl;
    let remoteControlSection;
    let nowPlayingPageImage;
    let toggleContextMenuButton;
    let nowPlayingInfoContainerMedia;
    let nowPlayingPageBackdrop;
    let nowPlayingInfoButtons;
    let nowPlayingSecondaryButtons;

    const self = this;

    self.init = function (ownerView, context) {
        dlg = context;
        init(ownerView, dlg);
        volumeControl = new VolumeControl(dlg);
        remoteControlSection = new RemoteControlSection(dlg);
        nowPlayingPageImage = new NowPlayingPageImage();
        toggleContextMenuButton = new ToggleContextMenuButton();
        nowPlayingInfoContainerMedia = new NowPlayingInfoContainerMedia();
        nowPlayingPageBackdrop = new NowPlayingPageBackdrop();
        nowPlayingInfoButtons = new NowPlayingInfoButtons(dlg);
        nowPlayingSecondaryButtons = new NowPlayingSecondaryButtons(dlg);
    };

    self.onShow = function () {
        const player = playbackManager.getCurrentPlayer();
        volumeControl.onShow(player);
        remoteControlSection.onShow(player);
        nowPlayingInfoButtons.onShow(player);
        nowPlayingSecondaryButtons.onShow(player);
        onShow(dlg, player);
    };

    self.destroy = function () {
        volumeControl.destroy();
        remoteControlSection.destroy();
        nowPlayingInfoButtons.destroy();
        nowPlayingSecondaryButtons.destroy();
        onDialogClosed();
    };
}
