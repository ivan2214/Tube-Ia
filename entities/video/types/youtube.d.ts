// Type definitions for YouTube IFrame API
interface Window {
  YT: {
    Player: new (
      elementId: string | HTMLElement,
      options: {
        videoId: string;
        height?: string | number;
        width?: string | number;
        playerVars?: {
          autoplay?: 0 | 1;
          controls?: 0 | 1;
          disablekb?: 0 | 1;
          enablejsapi?: 0 | 1;
          fs?: 0 | 1;
          iv_load_policy?: 1 | 3;
          modestbranding?: 0 | 1;
          playsinline?: 0 | 1;
          rel?: 0 | 1;
          showinfo?: 0 | 1;
          start?: number;
          end?: number;
        };
        events?: {
          onReady?: (event: { target: YT.Player }) => void;
          onStateChange?: (event: { data: number; target: YT.Player }) => void;
          onPlaybackQualityChange?: (event: {
            data: string;
            target: YT.Player;
          }) => void;
          onPlaybackRateChange?: (event: {
            data: number;
            target: YT.Player;
          }) => void;
          onError?: (event: { data: number; target: YT.Player }) => void;
          onApiChange?: (event: { target: YT.Player }) => void;
        };
      }
    ) => YT.Player;
    PlayerState: {
      UNSTARTED: -1;
      ENDED: 0;
      PLAYING: 1;
      PAUSED: 2;
      BUFFERING: 3;
      CUED: 5;
    };
  };
  onYouTubeIframeAPIReady: () => void;
}

declare namespace YT {
  interface Player {
    playVideo(): void;
    pauseVideo(): void;
    stopVideo(): void;
    seekTo(seconds: number, allowSeekAhead: boolean): void;
    getVideoLoadedFraction(): number;
    getCurrentTime(): number;
    getDuration(): number;
    getVideoUrl(): string;
    getVideoEmbedCode(): string;
    getPlayerState(): number;
    getPlaybackRate(): number;
    setPlaybackRate(suggestedRate: number): void;
    getAvailablePlaybackRates(): number[];
    getPlaybackQuality(): string;
    setPlaybackQuality(suggestedQuality: string): void;
    getAvailableQualityLevels(): string[];
    isMuted(): boolean;
    mute(): void;
    unMute(): void;
    getVolume(): number;
    setVolume(volume: number): void;
    destroy(): void;
  }
}
