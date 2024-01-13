import { playbackManager } from 'components/playback/playbackmanager';
import { Player } from 'types/player';

export default class SliderContainer {
    static getHtml() {
        return '<div class="sliderContainer nowPlayingVolumeSliderContainer"><input is="emby-slider" type="range" step="1" min="0" max="100" value="0" class="nowPlayingVolumeSlider"/></div>';
    }

    currentPlayer: Player|null = null;

    constructor(context: HTMLElement) {
        context.querySelector('.nowPlayingVolumeSlider')?.addEventListener('input', (e) => {
            if (e.target) {
                playbackManager.setVolume((e.target as HTMLInputElement).value, this.currentPlayer);
            }
        });
    }

    onShow(player: Player|null) {
        this.bindToPlayer(player);
    }

    destroy() {
        this.releaseCurrentPlayer();
    }

    onPlayerChange(player: Player|null) {
        this.bindToPlayer(player);
    }

    updatePlayerVolumeState(context: HTMLElement, showMuteButton: boolean, showVolumeSlider: boolean, volumeLevel?: number) {
        if (showMuteButton || showVolumeSlider) {
            const nowPlayingVolumeSlider = context.querySelector('.nowPlayingVolumeSlider') as HTMLInputElement;
            const nowPlayingVolumeSliderContainer = context.querySelector('.nowPlayingVolumeSliderContainer');

            if (nowPlayingVolumeSlider) {
                nowPlayingVolumeSliderContainer?.classList.toggle('hide', !showVolumeSlider);

                // EmbySlider
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if (!(nowPlayingVolumeSlider as any).dragging) {
                    nowPlayingVolumeSlider.value = (volumeLevel || 0).toString();
                }
            }
        }
    }

    private releaseCurrentPlayer() {
        const player = this.currentPlayer;

        if (player) {
            this.currentPlayer = null;
        }
    }

    private bindToPlayer(player: Player|null) {
        this.releaseCurrentPlayer();
        this.currentPlayer = player;
    }
}
