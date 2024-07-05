import { Plugin } from './plugin';

export interface PlayerPlugin extends Plugin {
    play: (options: unknown) => void;
    canPlayMediaType: (mediaType?: string) => boolean;
    isLocalPlayer?: boolean;
    isMuted?: () => boolean;
    getVolume?: () => number;
}
