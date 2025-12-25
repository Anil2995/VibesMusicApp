import { createContext, useContext, useState, useRef, useEffect } from 'react';

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

    // Audio ref
    const audioRef = useRef(new Audio());

    // Update audio source when track changes
    useEffect(() => {
        const audio = audioRef.current;
        if (currentTrack?.audio_url) {
            audio.src = currentTrack.audio_url;
            audio.load();
            if (isPlaying) {
                audio.play().catch(console.error);
            }
        }
    }, [currentTrack]);

    // Handle volume changes
    useEffect(() => {
        audioRef.current.volume = isMuted ? 0 : volume;
    }, [volume, isMuted]);

    // Audio event listeners
    useEffect(() => {
        const audio = audioRef.current;

        const handleLoadedMetadata = () => {
            setDuration(audio.duration);
        };

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
        };

        const handleEnded = () => {
            if (repeatMode === 'one') {
                audio.currentTime = 0;
                audio.play().catch(console.error);
            } else {
                playNext();
            }
        };

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);

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
    }, [repeatMode, playlist, currentIndex]);

    // Play a specific track
    const playTrack = (track, tracks = []) => {
        if (tracks.length > 0) {
            setPlaylist(tracks);
            const index = tracks.findIndex(t => t.id === track.id);
            setCurrentIndex(index >= 0 ? index : 0);
        }
        setCurrentTrack(track);
        setIsPlaying(true);
        audioRef.current.play().catch(console.error);
    };

    // Toggle play/pause
    const togglePlay = () => {
        const audio = audioRef.current;
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play().catch(console.error);
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

        setCurrentIndex(nextIndex);
        setCurrentTrack(playlist[nextIndex]);
        audioRef.current.play().catch(console.error);
    };

    // Play previous track
    const playPrevious = () => {
        if (playlist.length === 0) return;

        // If more than 3 seconds into the song, restart it
        if (currentTime > 3) {
            audioRef.current.currentTime = 0;
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

        setCurrentIndex(prevIndex);
        setCurrentTrack(playlist[prevIndex]);
        audioRef.current.play().catch(console.error);
    };

    // Seek to position
    const seekTo = (time) => {
        audioRef.current.currentTime = time;
        setCurrentTime(time);
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
