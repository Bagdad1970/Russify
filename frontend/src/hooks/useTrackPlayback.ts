import { useEffect, useState } from 'react';
import { FileManager } from '../api/FileManager';
import type { Track } from '../types/Track';

type TrackIdentifier = number | bigint | null;

interface PlaybackState {
    currentTrack: Track | null;
    currentTrackId: TrackIdentifier;
    isPlaying: boolean;
    loadingTrackId: TrackIdentifier;
    currentTime: number;
    duration: number;
    queue: Track[];
    queueIndex: number;
    isShuffle: boolean;
    isRepeat: boolean;
}

interface PlayTrackOptions {
    queue?: Track[];
}

const fileManager = new FileManager();
const listeners = new Set<(state: PlaybackState) => void>();

let playbackState: PlaybackState = {
    currentTrack: null,
    currentTrackId: null,
    isPlaying: false,
    loadingTrackId: null,
    currentTime: 0,
    duration: 0,
    queue: [],
    queueIndex: -1,
    isShuffle: false,
    isRepeat: false,
};

let sharedAudio: HTMLAudioElement | null = null;

const emitPlaybackState = () => {
    const snapshot = {
        ...playbackState,
        queue: [...playbackState.queue],
    };

    listeners.forEach((listener) => listener(snapshot));
};

const updatePlaybackState = (patch: Partial<PlaybackState>) => {
    playbackState = {
        ...playbackState,
        ...patch,
    };
    emitPlaybackState();
};

const subscribe = (listener: (state: PlaybackState) => void) => {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
};

const isPlayableTrack = (track?: Track | null): track is Track => {
    return Boolean(track && track.id !== undefined && track.id !== null && track.audioHash);
};

const getQueueIndexByTrackId = (queue: Track[], trackId: TrackIdentifier) => {
    if (trackId === null) {
        return -1;
    }

    return queue.findIndex((item) => item.id === trackId);
};

const cleanupAudio = () => {
    if (!sharedAudio) {
        return;
    }

    sharedAudio.pause();
    sharedAudio.src = '';
    sharedAudio.load();
    sharedAudio = null;
};

const getSequentialQueueIndex = (direction: 1 | -1) => {
    if (playbackState.queue.length === 0 || playbackState.queueIndex < 0) {
        return null;
    }

    let candidateIndex = playbackState.queueIndex + direction;

    while (candidateIndex >= 0 && candidateIndex < playbackState.queue.length) {
        if (isPlayableTrack(playbackState.queue[candidateIndex])) {
            return candidateIndex;
        }
        candidateIndex += direction;
    }

    return null;
};

const getRandomQueueIndex = () => {
    const playableIndices = playbackState.queue
        .map((track, index) => (isPlayableTrack(track) ? index : -1))
        .filter((index) => index !== -1 && index !== playbackState.queueIndex);

    if (playableIndices.length === 0) {
        return playbackState.queueIndex >= 0 ? playbackState.queueIndex : null;
    }

    const randomIndex = Math.floor(Math.random() * playableIndices.length);
    return playableIndices[randomIndex];
};

const getNextQueueIndex = (direction: 1 | -1) => {
    if (playbackState.isShuffle && direction === 1) {
        return getRandomQueueIndex();
    }

    return getSequentialQueueIndex(direction);
};

const loadTrackIntoAudio = async (track: Track, queue: Track[], queueIndex: number): Promise<boolean> => {
    if (!isPlayableTrack(track)) {
        return false;
    }

    const requestedTrackId = track.id;

    cleanupAudio();

    updatePlaybackState({
        currentTrack: track,
        currentTrackId: requestedTrackId,
        queue,
        queueIndex,
        currentTime: 0,
        duration: track.duration ?? 0,
        isPlaying: false,
        loadingTrackId: requestedTrackId,
    });

    try {
        const audioUrl = await fileManager.getFileUrl('music', track.audioHash);
        const nextAudio = new Audio(audioUrl);

        nextAudio.addEventListener('loadedmetadata', () => {
            if (sharedAudio === nextAudio) {
                updatePlaybackState({
                    duration: Number.isFinite(nextAudio.duration) ? nextAudio.duration : (track.duration ?? 0),
                });
            }
        });

        nextAudio.addEventListener('timeupdate', () => {
            if (sharedAudio === nextAudio) {
                updatePlaybackState({
                    currentTime: nextAudio.currentTime,
                    duration: Number.isFinite(nextAudio.duration) ? nextAudio.duration : (track.duration ?? 0),
                });
            }
        });

        nextAudio.addEventListener('play', () => {
            if (sharedAudio === nextAudio) {
                updatePlaybackState({ isPlaying: true });
            }
        });

        nextAudio.addEventListener('pause', () => {
            if (sharedAudio === nextAudio) {
                updatePlaybackState({ isPlaying: false });
            }
        });

        nextAudio.addEventListener('ended', () => {
            if (sharedAudio !== nextAudio) {
                return;
            }

            if (playbackState.isRepeat) {
                nextAudio.currentTime = 0;
                void nextAudio.play();
                return;
            }

            void playNext();
        });

        sharedAudio = nextAudio;
        await nextAudio.play();
        return true;
    } catch (error) {
        cleanupAudio();
        updatePlaybackState({
            currentTrack: null,
            currentTrackId: null,
            currentTime: 0,
            duration: 0,
            isPlaying: false,
        });
        throw error;
    } finally {
        if (playbackState.loadingTrackId === requestedTrackId) {
            updatePlaybackState({ loadingTrackId: null });
        }
    }
};

const playTrack = async (track: Track, options?: PlayTrackOptions): Promise<boolean> => {
    if (!isPlayableTrack(track)) {
        return false;
    }

    const requestedTrackId = track.id;
    const queue = options?.queue?.length
        ? options.queue.filter((item) => item.id !== undefined && item.id !== null)
        : [track];

    const queueIndex = (() => {
        const candidateIndex = getQueueIndexByTrackId(queue, requestedTrackId);
        return candidateIndex >= 0 ? candidateIndex : 0;
    })();

    if (sharedAudio && playbackState.currentTrackId === requestedTrackId) {
        if (options?.queue?.length) {
            updatePlaybackState({
                queue,
                queueIndex,
                currentTrack: track,
            });
        }

        if (sharedAudio.paused) {
            await sharedAudio.play();
            updatePlaybackState({ isPlaying: true });
        } else {
            sharedAudio.pause();
            updatePlaybackState({ isPlaying: false });
        }

        return true;
    }

    return loadTrackIntoAudio(track, queue, queueIndex);
};

const togglePlayback = async (): Promise<boolean> => {
    if (!sharedAudio || !playbackState.currentTrack) {
        return false;
    }

    if (sharedAudio.paused) {
        await sharedAudio.play();
        updatePlaybackState({ isPlaying: true });
    } else {
        sharedAudio.pause();
        updatePlaybackState({ isPlaying: false });
    }

    return true;
};

const seekTo = (nextTime: number) => {
    if (!sharedAudio) {
        return;
    }

    const boundedTime = Math.min(Math.max(nextTime, 0), playbackState.duration || sharedAudio.duration || 0);
    sharedAudio.currentTime = boundedTime;
    updatePlaybackState({ currentTime: boundedTime });
};

const playNext = async (): Promise<boolean> => {
    const nextIndex = getNextQueueIndex(1);

    if (nextIndex === null || nextIndex < 0 || nextIndex >= playbackState.queue.length) {
        cleanupAudio();
        updatePlaybackState({
            currentTrack: null,
            currentTrackId: null,
            currentTime: 0,
            duration: 0,
            isPlaying: false,
            loadingTrackId: null,
        });
        return false;
    }

    const nextTrack = playbackState.queue[nextIndex];
    if (!isPlayableTrack(nextTrack)) {
        return false;
    }

    return loadTrackIntoAudio(nextTrack, playbackState.queue, nextIndex);
};

const playPrevious = async (): Promise<boolean> => {
    if (sharedAudio && playbackState.currentTime > 5) {
        seekTo(0);
        return true;
    }

    const previousIndex = getNextQueueIndex(-1);

    if (previousIndex === null || previousIndex < 0 || previousIndex >= playbackState.queue.length) {
        if (playbackState.currentTrack) {
            seekTo(0);
            return true;
        }
        return false;
    }

    const previousTrack = playbackState.queue[previousIndex];
    if (!isPlayableTrack(previousTrack)) {
        return false;
    }

    return loadTrackIntoAudio(previousTrack, playbackState.queue, previousIndex);
};

const toggleShuffle = () => {
    updatePlaybackState({ isShuffle: !playbackState.isShuffle });
};

const toggleRepeat = () => {
    updatePlaybackState({ isRepeat: !playbackState.isRepeat });
};

const stopPlayback = () => {
    cleanupAudio();
    updatePlaybackState({
        currentTrack: null,
        currentTrackId: null,
        isPlaying: false,
        loadingTrackId: null,
        currentTime: 0,
        duration: 0,
        queue: [],
        queueIndex: -1,
    });
};

export const useTrackPlayback = () => {
    const [state, setState] = useState<PlaybackState>({
        ...playbackState,
        queue: [...playbackState.queue],
    });

    useEffect(() => {
        return subscribe((nextState) => {
            setState(nextState);
        });
    }, []);

    return {
        currentTrack: state.currentTrack,
        currentTrackId: state.currentTrackId,
        isPlaying: state.isPlaying,
        loadingTrackId: state.loadingTrackId,
        currentTime: state.currentTime,
        duration: state.duration,
        queue: state.queue,
        queueIndex: state.queueIndex,
        isShuffle: state.isShuffle,
        isRepeat: state.isRepeat,
        playTrack,
        togglePlayback,
        stopPlayback,
        seekTo,
        playNext,
        playPrevious,
        toggleShuffle,
        toggleRepeat,
        isTrackPlaying: (trackId?: number | bigint | null) => trackId !== undefined && trackId !== null && state.currentTrackId === trackId && state.isPlaying,
        isTrackLoading: (trackId?: number | bigint | null) => trackId !== undefined && trackId !== null && state.loadingTrackId === trackId,
    };
};
