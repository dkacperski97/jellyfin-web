import { playbackManager } from 'components/playback/playbackmanager';
import { PlayerPlugin } from 'types/player';
import Events from '../../utils/events';

export default class RepeatToggleButton {
    currentPlayer: PlayerPlugin|null = null;
    repeatToggleButtons: NodeListOf<HTMLButtonElement>;

    constructor(context: HTMLElement) {
        this.repeatToggleButtons = context.querySelectorAll<HTMLButtonElement>('.repeatToggleButton');
        for (const repeatToggleButton of this.repeatToggleButtons) {
            repeatToggleButton.addEventListener('click', this.onRepeatToggleButtonClick);
        }
    }

    private onRepeatToggleButtonClick() {
        if (this.currentPlayer) {
            this.toggleRepeat();
        }
    }

    private toggleRepeat() {
        switch (playbackManager.getRepeatMode()) {
            case 'RepeatAll':
                playbackManager.setRepeatMode('RepeatOne');
                break;
            case 'RepeatOne':
                playbackManager.setRepeatMode('RepeatNone');
                break;
            case 'RepeatNone':
                playbackManager.setRepeatMode('RepeatAll');
        }
    }

    onShow(player: PlayerPlugin|null) {
        this.bindToPlayer(player);
    }

    destroy() {
        this.releaseCurrentPlayer();
    }

    onPlayerChange(player: PlayerPlugin|null) {
        this.bindToPlayer(player);
    }

    updatePlayerState() {
        this.updateRepeatModeDisplay(playbackManager.getRepeatMode());
    }

    private onRepeatModeChange() {
        this.updateRepeatModeDisplay(playbackManager.getRepeatMode());
    }

    private updateSupportedCommands(commands: string[]) {
        for (const repeatToggleButton of this.repeatToggleButtons) {
            const command = repeatToggleButton.getAttribute('data-command');
            const enableButton = command ? commands.indexOf(command) !== -1 : false;
            repeatToggleButton.disabled = !enableButton;
        }
    }

    private updateRepeatModeDisplay(repeatMode: string) {
        const cssClass = 'buttonActive';
        let innHtml = '<span class="material-icons repeat" aria-hidden="true"></span>';
        let repeatOn = true;

        switch (repeatMode) {
            case 'RepeatAll':
                break;
            case 'RepeatOne':
                innHtml = '<span class="material-icons repeat_one" aria-hidden="true"></span>';
                break;
            case 'RepeatNone':
            default:
                repeatOn = false;
                break;
        }

        for (const repeatToggleButton of this.repeatToggleButtons) {
            repeatToggleButton.classList.toggle(cssClass, repeatOn);
            repeatToggleButton.innerHTML = innHtml;
        }
    }

    private releaseCurrentPlayer() {
        const player = this.currentPlayer;

        if (player) {
            Events.off(player, 'repeatmodechange', this.onRepeatModeChange);
            this.currentPlayer = null;
        }
    }

    private bindToPlayer(player: PlayerPlugin|null) {
        this.releaseCurrentPlayer();
        this.currentPlayer = player;
        if (player) {
            Events.on(player, 'repeatmodechange', this.onRepeatModeChange);
            const playerInfo = playbackManager.getPlayerInfo();
            const supportedCommands = playerInfo?.supportedCommands || [];
            this.updateSupportedCommands(supportedCommands);
        }
    }
}
