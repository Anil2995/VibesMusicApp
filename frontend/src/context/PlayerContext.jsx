import { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
    // Track state
    const [currentTrack, setCurrentTrack] = useState(null);
    const [playlist, setPlaylist] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Player state
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(0.7);
    const [isMuted, setIsMuted] = useState(false);
    const [isShuffled, setIsShuffled] = useState(false);
    const [repeatMode, setRepeatMode] = useState('none'); // 'none', 'all', 'one'
    const [isVideo, setIsVideo] = useState(false); // Track if current content is video

    // Media refs - set crossOrigin for CORS audio support
    const audioRef = useRef(null);
    const videoRef = useRef(null); // Will be set by VideoPlayer component

    // Initialize audio element on mount
    if (!audioRef.current) {
        audioRef.current = new Audio();
        audioRef.current.crossOrigin = 'anonymous';
    }

    // Get the active media element (audio or video)
    const getActiveMedia = useCallback(() => {
        if (isVideo && videoRef.current) {
            return videoRef.current;
        }
        return audioRef.current;
    }, [isVideo]);

    // Set video ref from VideoPlayer component
    const setVideoRef = useCallback((ref) => {
        videoRef.current = ref;
    }, []);

    // Update media source when track changes
    useEffect(() => {
        const hasVideo = currentTrack?.video_url;
        setIsVideo(!!hasVideo);

        // Only handle audio if not a video track
        if (!hasVideo && currentTrack?.audio_url) {
            const audio = audioRef.current;
            audio.src = currentTrack.audio_url;
            audio.load();
            if (isPlaying) {
                audio.play().catch(console.error);
            }
        }
    }, [currentTrack]);

    // Handle volume changes for audio
    useEffect(() => {
        audioRef.current.volume = isMuted ? 0 : volume;
        if (videoRef.current) {
            videoRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    // Sync video element when it's available
    useEffect(() => {
        if (isVideo && videoRef.current && currentTrack?.video_url) {
            videoRef.current.volume = isMuted ? 0 : volume;
        }
    }, [isVideo, currentTrack, volume, isMuted]);

    // Audio event listeners
    useEffect(() => {
        const audio = audioRef.current;

        const handleLoadedMetadata = () => {
            if (!isVideo) {
                setDuration(audio.duration);
            }
        };

        const handleTimeUpdate = () => {
            if (!isVideo) {
                setCurrentTime(audio.currentTime);
            }
        };

        const handleEnded = () => {
            if (!isVideo) {
                if (repeatMode === 'one') {
                    audio.currentTime = 0;
                    audio.play().catch(console.error);
                } else {
                    playNext();
                }
            }
        };

        const handlePlay = () => {
            if (!isVideo) setIsPlaying(true);
        };
        const handlePause = () => {
            if (!isVideo) setIsPlaying(false);
        };

        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);

        return () => {
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
        };
    }, [repeatMode, playlist, currentIndex, isVideo]);

    // Video event handlers - to be called from VideoPlayer component
    const handleVideoLoadedMetadata = useCallback((videoDuration) => {
        if (isVideo) {
            setDuration(videoDuration);
        }
    }, [isVideo]);

    const handleVideoTimeUpdate = useCallback((time) => {
        if (isVideo) {
            setCurrentTime(time);
        }
    }, [isVideo]);

    const handleVideoEnded = useCallback(() => {
        if (isVideo) {
            if (repeatMode === 'one' && videoRef.current) {
                videoRef.current.currentTime = 0;
                videoRef.current.play().catch(console.error);
            } else {
                playNext();
            }
        }
    }, [isVideo, repeatMode]);

    const handleVideoPlay = useCallback(() => {
        if (isVideo) setIsPlaying(true);
    }, [isVideo]);

    const handleVideoPause = useCallback(() => {
        if (isVideo) setIsPlaying(false);
    }, [isVideo]);

    // Play a specific track
    const playTrack = (track, tracks = []) => {
        // Pause current media before switching
        audioRef.current.pause();
        if (videoRef.current) {
            videoRef.current.pause();
        }

        if (tracks.length > 0) {
            setPlaylist(tracks);
            const index = tracks.findIndex(t => t.id === track.id);
            setCurrentIndex(index >= 0 ? index : 0);
        }
        setCurrentTrack(track);
        setIsPlaying(true);

        // Audio will auto-play in useEffect, video will be handled by VideoPlayer
        if (!track.video_url) {
            audioRef.current.play().catch(console.error);
        }
    };

    // Toggle play/pause
    const togglePlay = () => {
        const media = getActiveMedia();
        if (!media) return;

        if (isPlaying) {
            media.pause();
        } else {
            media.play().catch(console.error);
        }
    };

    // Play next track
    const playNext = () => {
        if (playlist.length === 0) return;

        let nextIndex;
        if (isShuffled) {
            nextIndex = Math.floor(Math.random() * playlist.length);
        } else {
            nextIndex = currentIndex + 1;
            if (nextIndex >= playlist.length) {
                if (repeatMode === 'all') {
                    nextIndex = 0;
                } else {
                    setIsPlaying(false);
                    return;
                }
            }
        }

        // Pause current media
        audioRef.current.pause();
        if (videoRef.current) {
            videoRef.current.pause();
        }

        setCurrentIndex(nextIndex);
        setCurrentTrack(playlist[nextIndex]);
        setIsPlaying(true);
    };

    // Play previous track
    const playPrevious = () => {
        if (playlist.length === 0) return;

        // If more than 3 seconds into the content, restart it
        if (currentTime > 3) {
            const media = getActiveMedia();
            if (media) {
                media.currentTime = 0;
            }
            return;
        }

        let prevIndex = currentIndex - 1;
        if (prevIndex < 0) {
            if (repeatMode === 'all') {
                prevIndex = playlist.length - 1;
            } else {
                prevIndex = 0;
            }
        }

        // Pause current media
        audioRef.current.pause();
        if (videoRef.current) {
            videoRef.current.pause();
        }

        setCurrentIndex(prevIndex);
        setCurrentTrack(playlist[prevIndex]);
        setIsPlaying(true);
    };

    // Seek to position
    const seekTo = (time) => {
        const media = getActiveMedia();
        if (media) {
            media.currentTime = time;
            setCurrentTime(time);
        }
    };

    // Toggle mute
    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    // Toggle shuffle
    const toggleShuffle = () => {
        setIsShuffled(!isShuffled);
    };

    // Cycle repeat mode
    const cycleRepeatMode = () => {
        const modes = ['none', 'all', 'one'];
        const currentModeIndex = modes.indexOf(repeatMode);
        const nextMode = modes[(currentModeIndex + 1) % modes.length];
        setRepeatMode(nextMode);
    };

    // Format time helper
    const formatTime = (time) => {
        if (isNaN(time)) return '0:00';
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const value = {
        // State
        currentTrack,
        playlist,
        currentIndex,
        isPlaying,
        duration,
        currentTime,
        volume,
        isMuted,
        isShuffled,
        repeatMode,
        isVideo,

        // Refs
        audioRef,
        videoRef,

        // Setters
        setVideoRef,
        setIsPlaying,

        // Video event handlers
        handleVideoLoadedMetadata,
        handleVideoTimeUpdate,
        handleVideoEnded,
        handleVideoPlay,
        handleVideoPause,

        // Actions
        playTrack,
        togglePlay,
        playNext,
        playPrevious,
        seekTo,
        setVolume,
        toggleMute,
        toggleShuffle,
        cycleRepeatMode,

        // Helpers
        formatTime,
    };

    return (
        <PlayerContext.Provider value={value}>
            {children}
        </PlayerContext.Provider>
    );
};

export const usePlayer = () => {
    const context = useContext(PlayerContext);
    if (!context) {
        throw new Error('usePlayer must be used within a PlayerProvider');
    }
    return context;
};
