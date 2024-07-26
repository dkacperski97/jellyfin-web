import { PlayerPlugin } from 'types/player';
import * as userSettings from '../../scripts/settings/userSettings';
import datetime from '../../scripts/datetime';
import { playbackManager } from '../playback/playbackmanager';
import Events from '../../utils/events';
import layoutManager from '../layoutManager';

export default class SliderContainer {
    context: HTMLElement;
    currentPlayer: PlayerPlugin|null = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    lastPlayerState: any|null;
    lastUpdateTime = 0;
    currentRuntimeTicks = 0;

    constructor(context: HTMLElement) {
        this.context = context;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const positionSlider = context.querySelector<any>('.nowPlayingPositionSlider');
        if (positionSlider) {
            positionSlider.addEventListener('change', () => {
                const value = positionSlider.value;

                if (this.currentPlayer) {
                    const newPercent = parseFloat(value);
                    playbackManager.seekPercent(newPercent, this.currentPlayer);
                }
            });

            positionSlider.getBubbleText = (value: number) => {
                const state = this.lastPlayerState;

                if (!state?.NowPlayingItem || !this.currentRuntimeTicks) {
                    return '--:--';
                }

                let ticks = this.currentRuntimeTicks;
                ticks /= 100;
                ticks *= value;
                return datetime.getDisplayRunningTime(ticks);
            };

            if (layoutManager.tv) {
                positionSlider.classList.add('focusable');
                positionSlider.enableKeyboardDragging();
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updatePlayerState(player: PlayerPlugin | null, state: any) {
        this.lastPlayerState = state;
        const item = state.NowPlayingItem;
        const playState = state.PlayState || {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const positionSlider = this.context.querySelector<any>('.nowPlayingPositionSlider');

        if (positionSlider && item && item.RunTimeTicks) {
            positionSlider.setKeyboardSteps(userSettings.skipBackLength(undefined) * 1000000 / item.RunTimeTicks,
                userSettings.skipForwardLength(undefined) * 1000000 / item.RunTimeTicks);
        }

        if (positionSlider && !positionSlider.dragging) {
            positionSlider.disabled = !playState.CanSeek;
            const isProgressClear = state.MediaSource && state.MediaSource.RunTimeTicks == null;
            positionSlider.setIsClear(isProgressClear);
        }

        this.updateTimeDisplay(playState.PositionTicks, item ? item.RunTimeTicks : null);
    }

    private updateTimeDisplay(positionTicks: number, runtimeTicks: number) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const positionSlider = this.context.querySelector<any>('.nowPlayingPositionSlider');

        if (positionSlider && !positionSlider.dragging) {
            if (runtimeTicks) {
                let pct = positionTicks / runtimeTicks;
                pct *= 100;
                positionSlider.value = pct;
            } else {
                positionSlider.value = 0;
            }
        }

        const positionTime = this.context.querySelector('.positionTime');
        if (positionTime) {
            positionTime.innerHTML = Number.isFinite(positionTicks) ? datetime.getDisplayRunningTime(positionTicks) : '--:--';
        }
        const runtime = this.context.querySelector('.runtime');
        if (runtime) {
            runtime.innerHTML = Number.isFinite(runtimeTicks) ? datetime.getDisplayRunningTime(runtimeTicks) : '--:--';
        }
    }

    private onTimeUpdate() {
        const now = new Date().getTime();

        if (now - this.lastUpdateTime >= 700) {
            this.lastUpdateTime = now;
            this.currentRuntimeTicks = playbackManager.duration(this.currentPlayer);
            this.updateTimeDisplay(playbackManager.currentTime(this.currentPlayer) * 10000, this.currentRuntimeTicks);
        }
    }

    onPlayerChange(player: PlayerPlugin|null) {
        this.bindToPlayer(player);
    }

    onShow(player: PlayerPlugin|null) {
        this.bindToPlayer(player);
    }

    destroy() {
        this.releaseCurrentPlayer();
        this.lastPlayerState = null;
    }

    private releaseCurrentPlayer() {
        const player = this.currentPlayer;

        if (player) {
            Events.off(player, 'timeupdate', this.onTimeUpdate);
            this.currentPlayer = null;
        }
    }

    private bindToPlayer(player: PlayerPlugin|null) {
        this.releaseCurrentPlayer();
        this.currentPlayer = player;

        if (player) {
            Events.on(player, 'timeupdate', this.onTimeUpdate);
        }
    }
}
