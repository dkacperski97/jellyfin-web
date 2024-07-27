import listView from '../listview/listview';
import imageLoader from '../images/imageLoader';
import { playbackManager } from '../playback/playbackmanager';
import Events from '../../utils/events.ts';
import globalize from '../../scripts/globalize';
import layoutManager from '../layoutManager';
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
import NowPlayingPageBackdrop from './nowPlayingPageBackdrop';
import NowPlayingInfoControls from './nowPlayingInfoControls';

export default function () {
    function updatePlayerState(player, context, state) {
        const item = state.NowPlayingItem;
        const playerInfo = playbackManager.getPlayerInfo();
        const supportedCommands = playerInfo.supportedCommands;
        const playState = state.PlayState || {};

        remoteControlSection.updatePlayerState(context, supportedCommands, currentPlayer);

        updatePlayPauseState(playState.IsPaused);

        volumeControl.updatePlayerState(context, state);

        if (item && item.MediaType == 'Video') {
            context.classList.remove('hideVideoButtons');
        } else {
            context.classList.add('hideVideoButtons');
        }

        nowPlayingInfoControls.updatePlayerState(player, context, state);
        onShuffleQueueModeChange(false);
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
        nowPlayingInfoControls.onPlayerChange(player);
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
    }

    function onDialogClosed() {
        releaseCurrentPlayer();
        Events.off(playbackManager, 'playerchange', onPlayerChange);
    }

    function onShow(context, player) {
        bindToPlayer(context, player);
    }

    let dlg;
    let currentPlayer;

    let volumeControl;
    let remoteControlSection;
    let nowPlayingPageImage;
    let toggleContextMenuButton;
    let nowPlayingPageBackdrop;
    let nowPlayingInfoControls;

    const self = this;

    self.init = function (ownerView, context) {
        dlg = context;
        init(ownerView, dlg);
        volumeControl = new VolumeControl(dlg);
        remoteControlSection = new RemoteControlSection(dlg);
        nowPlayingPageImage = new NowPlayingPageImage();
        toggleContextMenuButton = new ToggleContextMenuButton();
        nowPlayingPageBackdrop = new NowPlayingPageBackdrop();
        nowPlayingInfoControls = new NowPlayingInfoControls(dlg);
    };

    self.onShow = function () {
        const player = playbackManager.getCurrentPlayer();
        volumeControl.onShow(player);
        remoteControlSection.onShow(player);
        nowPlayingInfoControls.onShow(player);
        onShow(dlg, player);
    };

    self.destroy = function () {
        volumeControl.destroy();
        remoteControlSection.destroy();
        nowPlayingInfoControls.destroy();
        onDialogClosed();
    };
}
