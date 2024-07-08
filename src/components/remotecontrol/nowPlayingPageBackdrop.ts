import { clearBackdrop, setBackdrops } from '../backdrop/backdrop';

export default class NowPlayingPageBackdrop {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updatePlayerState(context: HTMLElement, state: any) {
        const item = state.NowPlayingItem;
        if (item) {
            setBackdrops([item]);
        } else {
            clearBackdrop();
        }
    }
}
