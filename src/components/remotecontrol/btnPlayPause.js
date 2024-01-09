import { playbackManager } from 'components/playback/playbackmanager';
import Events from '../../utils/events.ts';

function buttonVisible(btn, enabled) {
    if (enabled) {
        btn.classList.remove('hide');
    } else {
        btn.classList.add('hide');
    }
}

export default function () {
    function updatePlayerState(player, context, state) {
        const item = state.NowPlayingItem;
        const playState = state.PlayState || {};

        updatePlayPauseState(playState.IsPaused, item != null);
    }

    function updatePlayPauseState(isPaused, isActive) {
        const context = dlg;
        const btnPlayPause = context.querySelector('.btnPlayPause');
        const btnPlayPauseIcon = btnPlayPause.querySelector('.material-icons');

        btnPlayPauseIcon.classList.remove('play_circle_filled', 'pause_circle_filled');
        btnPlayPauseIcon.classList.add(isPaused ? 'play_circle_filled' : 'pause_circle_filled');

        const playlistIndicator = context.querySelector('.playlistIndexIndicatorImage');
        if (playlistIndicator) {
            playlistIndicator.classList.toggle('playlistIndexIndicatorPausedImage', isPaused);
        }

        buttonVisible(btnPlayPause, isActive);
    }

    function onPlaybackStart(e, state) {
        const player = this;
        onStateChanged.call(player, e, state);
    }

    function onPlaybackStopped(e, state) {
        const player = this;

        if (!state.NextMediaType) {
            updatePlayerState(player, dlg, {});
        }
    }

    function onPlayPauseStateChanged() {
        updatePlayPauseState(this.paused(), true);
    }

    function onStateChanged(event, state) {
        const player = this;
        updatePlayerState(player, dlg, state);
    }

    function releaseCurrentPlayer() {
        const player = currentPlayer;

        if (player) {
            Events.off(player, 'playbackstart', onPlaybackStart);
            Events.off(player, 'statechange', onStateChanged);
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
            Events.on(player, 'playbackstop', onPlaybackStopped);
            Events.on(player, 'pause', onPlayPauseStateChanged);
            Events.on(player, 'unpause', onPlayPauseStateChanged);
        }
    }

    function bindEvents(context) {
        context.querySelector('.btnPlayPause').addEventListener('click', function () {
            if (currentPlayer) {
                playbackManager.playPause(currentPlayer);
            }
        });
    }

    function onPlayerChange() {
        bindToPlayer(dlg, playbackManager.getCurrentPlayer());
    }

    function init(ownerView, context) {
        bindEvents(context);
        Events.on(playbackManager, 'playerchange', onPlayerChange);
    }

    function onDialogClosed() {
        releaseCurrentPlayer();
        Events.off(playbackManager, 'playerchange', onPlayerChange);
    }

    function onShow(context) {
        bindToPlayer(context, playbackManager.getCurrentPlayer());
    }

    let dlg;
    let currentPlayer;
    const self = this;

    self.init = function (ownerView, context) {
        dlg = context;
        init(ownerView, dlg);
    };

    self.onShow = function () {
        onShow(dlg);
    };

    self.destroy = function () {
        onDialogClosed();
    };
}
