import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { usePlayer } from '../../context/PlayerContext';
import {
    Play,
    Pause,
    Volume2,
    VolumeX,
    Volume1,
    Maximize,
    Minimize,
    SkipBack,
    SkipForward,
    Settings
} from 'lucide-react';

const VideoPlayer = ({ videoUrl, poster, title, onClose }) => {
    const {
        isPlaying,
        duration,
        currentTime,
        volume,
        isMuted,
        togglePlay,
        seekTo,
        setVolume,
        toggleMute,
        formatTime,
        setVideoRef,
        handleVideoLoadedMetadata,
        handleVideoTimeUpdate,
        handleVideoEnded,
        handleVideoPlay,
        handleVideoPause,
        setIsPlaying,
        playNext,
        playPrevious
    } = usePlayer();

    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const [showControls, setShowControls] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isBuffering, setIsBuffering] = useState(false);
    const controlsTimeoutRef = useRef(null);

    // Register video ref with player context
    useEffect(() => {
        if (videoRef.current) {
            setVideoRef(videoRef.current);
        }
        return () => {
            setVideoRef(null);
        };
    }, [setVideoRef]);

    // Set up video event listeners
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const onLoadedMetadata = () => {
            handleVideoLoadedMetadata(video.duration);
        };

        const onTimeUpdate = () => {
            handleVideoTimeUpdate(video.currentTime);
        };

        const onEnded = () => {
            handleVideoEnded();
        };

        const onPlay = () => {
            handleVideoPlay();
        };

        const onPause = () => {
            handleVideoPause();
        };

        const onWaiting = () => {
            setIsBuffering(true);
        };

        const onCanPlay = () => {
            setIsBuffering(false);
        };

        video.addEventListener('loadedmetadata', onLoadedMetadata);
        video.addEventListener('timeupdate', onTimeUpdate);
        video.addEventListener('ended', onEnded);
        video.addEventListener('play', onPlay);
        video.addEventListener('pause', onPause);
        video.addEventListener('waiting', onWaiting);
        video.addEventListener('canplay', onCanPlay);

        return () => {
            video.removeEventListener('loadedmetadata', onLoadedMetadata);
            video.removeEventListener('timeupdate', onTimeUpdate);
            video.removeEventListener('ended', onEnded);
            video.removeEventListener('play', onPlay);
            video.removeEventListener('pause', onPause);
            video.removeEventListener('waiting', onWaiting);
            video.removeEventListener('canplay', onCanPlay);
        };
    }, [handleVideoLoadedMetadata, handleVideoTimeUpdate, handleVideoEnded, handleVideoPlay, handleVideoPause]);

    // Load and play video when URL changes
    useEffect(() => {
        const video = videoRef.current;
        if (!video || !videoUrl) return;

        video.src = videoUrl;
        video.load();

        // Auto-play when video loads
        video.play().catch(err => {
            console.log('Auto-play prevented:', err);
        });
    }, [videoUrl]);

    // Sync volume with player context
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    // Hide controls after inactivity
    useEffect(() => {
        const handleMouseMove = () => {
            setShowControls(true);
            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current);
            }
            if (isPlaying) {
                controlsTimeoutRef.current = setTimeout(() => {
                    setShowControls(false);
                }, 3000);
            }
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('mousemove', handleMouseMove);
        }

        return () => {
            if (container) {
                container.removeEventListener('mousemove', handleMouseMove);
            }
            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current);
            }
        };
    }, [isPlaying]);

    // Handle fullscreen changes
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    const toggleFullscreen = async () => {
        try {
            if (!document.fullscreenElement) {
                await containerRef.current?.requestFullscreen();
            } else {
                await document.exitFullscreen();
            }
        } catch (err) {
            console.error('Fullscreen error:', err);
        }
    };

    const handleProgressClick = (e) => {
        const bar = e.currentTarget;
        const rect = bar.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        seekTo(percent * duration);
    };

    const handleVolumeChange = (e) => {
        const bar = e.currentTarget;
        const rect = bar.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        setVolume(percent);
    };

    const getVolumeIcon = () => {
        if (isMuted || volume === 0) return <VolumeX className="w-5 h-5" />;
        if (volume < 0.5) return <Volume1 className="w-5 h-5" />;
        return <Volume2 className="w-5 h-5" />;
    };

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <div
            ref={containerRef}
            className={`relative bg-black rounded-2xl overflow-hidden group ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'aspect-video'}`}
            onClick={() => togglePlay()}
        >
            {/* Video Element */}
            <video
                ref={videoRef}
                className="w-full h-full object-contain"
                poster={poster}
                playsInline
            >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Buffering Indicator */}
            {isBuffering && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                </div>
            )}

            {/* Play/Pause Overlay */}
            {!isPlaying && !isBuffering && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/40"
                    onClick={(e) => {
                        e.stopPropagation();
                        togglePlay();
                    }}
                >
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-20 h-20 bg-white/90 backdrop-blur-xl rounded-full flex items-center justify-center shadow-2xl"
                    >
                        <Play className="w-10 h-10 text-gray-900 fill-gray-900 ml-1" />
                    </motion.button>
                </motion.div>
            )}

            {/* Controls Overlay */}
            <motion.div
                initial={false}
                animate={{ opacity: showControls ? 1 : 0 }}
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none"
            />

            {/* Top Bar */}
            <motion.div
                initial={false}
                animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : -20 }}
                className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-white font-semibold text-lg truncate max-w-[70%]">
                    {title}
                </h3>
                {onClose && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                        }}
                        className="p-2 text-white/80 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                    >
                        ✕
                    </button>
                )}
            </motion.div>

            {/* Bottom Controls */}
            <motion.div
                initial={false}
                animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : 20 }}
                className="absolute bottom-0 left-0 right-0 p-4 space-y-3"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Progress Bar */}
                <div
                    className="w-full h-1.5 bg-white/20 rounded-full cursor-pointer group/progress relative"
                    onClick={handleProgressClick}
                >
                    <div
                        className="h-full bg-teal-500 rounded-full relative transition-all"
                        style={{ width: `${progress}%` }}
                    >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover/progress:opacity-100 transition-opacity" />
                    </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                    {/* Left Controls */}
                    <div className="flex items-center gap-3">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                playPrevious();
                            }}
                            className="p-2 text-white/80 hover:text-white transition-colors"
                        >
                            <SkipBack className="w-5 h-5 fill-current" />
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                togglePlay();
                            }}
                            className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                        >
                            {isPlaying ? (
                                <Pause className="w-6 h-6 text-gray-900 fill-gray-900" />
                            ) : (
                                <Play className="w-6 h-6 text-gray-900 fill-gray-900 ml-0.5" />
                            )}
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                playNext();
                            }}
                            className="p-2 text-white/80 hover:text-white transition-colors"
                        >
                            <SkipForward className="w-5 h-5 fill-current" />
                        </motion.button>

                        <span className="text-white/80 text-sm ml-2">
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                    </div>

                    {/* Right Controls */}
                    <div className="flex items-center gap-3">
                        {/* Volume */}
                        <div className="flex items-center gap-2 group/volume">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleMute();
                                }}
                                className="p-2 text-white/80 hover:text-white transition-colors"
                            >
                                {getVolumeIcon()}
                            </motion.button>
                            <div
                                className="w-0 group-hover/volume:w-24 h-1.5 bg-white/20 rounded-full cursor-pointer overflow-hidden transition-all duration-300"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleVolumeChange(e);
                                }}
                            >
                                <div
                                    className="h-full bg-white rounded-full"
                                    style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* Fullscreen */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleFullscreen();
                            }}
                            className="p-2 text-white/80 hover:text-white transition-colors"
                        >
                            {isFullscreen ? (
                                <Minimize className="w-5 h-5" />
                            ) : (
                                <Maximize className="w-5 h-5" />
                            )}
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default VideoPlayer;
