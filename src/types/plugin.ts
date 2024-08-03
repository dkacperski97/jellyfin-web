import type { UserDto } from '@jellyfin/sdk/lib/generated-client';

export enum PluginType {
    MediaPlayer = 'mediaplayer',
    PreplayIntercept = 'preplayintercept',
    Screensaver = 'screensaver',
    SyncPlay = 'syncplay'
}

export interface Plugin {
    name: string
    id: string
    type: PluginType | string
    priority?: number
}

export interface PlayerPlugin extends Plugin {
    play: (options: unknown) => void;
    canPlayMediaType: (mediaType?: string) => boolean;
    isLocalPlayer?: boolean;
    isMuted?: () => boolean;
    getVolume?: () => number;

    getPlaylist?: () => unknown[];
    getTargets?: () => Promise<PlayerTarget[]>;
    duration: () => number | undefined;
    useServerPlaybackInfoForAudio?: unknown;
    enableMediaProbe?: (item: unknown) => unknown;
    supportsPlayMethod?: (playMethod: string, item: unknown) => unknown;
    getDirectPlayProtocols?: () => unknown;
    getQueueShuffleMode?: () => unknown;
    setQueueShuffleMode?: (value: string) => void;
    getRepeatMode?: () => unknown;
    setRepeatMode?: (value: string) => void;
    setVolume?: (value: number) => void;
    volumeUp?: () => void;
    volumeDown?: () => void;
    setMute?: (mute: boolean) => void;
    toggleMute?: () => void;
    setAspectRatio?: (value: string) => void;
    getSupportedAspectRatios?: () => AspectRatio[];
    getAspectRatio?: () => string;
    getSupportedPlaybackRates?: () => PlaybackRate[];
    setPlaybackRate?: (value: number) => void;
    getPlaybackRate?: () => number;
    setBrightness?: (value: number) => void;
    getBrightness?: () => number;
    toggleFullscreen?: () => void;
    isFullscreen?: () => boolean | undefined;
    togglePictureInPicture?: () => void;
    toggleAirPlay?: () => void;
}

export interface AspectRatio {
    id: string;
    name: string;
}

export interface PlaybackRate {
    id: number;
    name: string;
}

export interface PlayerTarget {
    name: string;
    id: string;
    playerName: string;
    playableMediaTypes: boolean[];
    isLocalPlayer?: boolean;
    supportedCommands: string[];
    user?: UserDto;
}
