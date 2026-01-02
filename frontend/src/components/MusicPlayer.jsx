import { motion, AnimatePresence } from 'framer-motion';
import { usePlayer } from '../context/PlayerContext';
import {
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Volume2,
    VolumeX,
    Volume1,
    Repeat,
    Repeat1,
    Shuffle,
    ChevronUp,
    ChevronDown,
    Heart,
    ListMusic,
    Music2,
    Maximize2,
    Mic2,
    Radio,
    Video
} from 'lucide-react';
import { useState } from 'react';
import Waveform from './ui/Waveform';
import ShaderBackground from './ui/ShaderBackground';

const MusicPlayer = () => {
    const {
        currentTrack,
        playlist,
        isPlaying,
        duration,
        currentTime,
        volume,
        isMuted,
        isShuffled,
        repeatMode,
        isVideo,
        togglePlay,
        playNext,
        playPrevious,
        seekTo,
        setVolume,
        toggleMute,
        toggleShuffle,
        cycleRepeatMode,
        formatTime,
        playTrack,
        audioRef
    } = usePlayer();

    const [isExpanded, setIsExpanded] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [showQueue, setShowQueue] = useState(false);
    const [isDraggingProgress, setIsDraggingProgress] = useState(false);
    const [isDraggingVolume, setIsDraggingVolume] = useState(false);

    if (!currentTrack) return null;

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
    const isPodcast = currentTrack.isPodcast;
    const isVideoPodcast = currentTrack.isVideoPodcast || isVideo;
    const isRadio = currentTrack.isRadio || currentTrack.isLive;

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

    const getRepeatIcon = () => {
        if (repeatMode === 'one') return <Repeat1 className="w-4 h-4" />;
        return <Repeat className="w-4 h-4" />;
    };

    const getVolumeIcon = () => {
        if (isMuted || volume === 0) return <VolumeX className="w-5 h-5" />;
        if (volume < 0.5) return <Volume1 className="w-5 h-5" />;
        return <Volume2 className="w-5 h-5" />;
    };

    return (
        <>
            {/* Mini Player */}
            <AnimatePresence>
                {!isExpanded && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-0 left-0 right-0 z-50"
                    >
                        {/* Progress bar with mini waveform */}
                        <div className="relative">
                            {/* Mini waveform above progress bar when playing */}
                            {isPlaying && (
                                <div className="absolute -top-6 left-0 right-0 h-6 overflow-hidden opacity-60 pointer-events-none">
                                    <Waveform
                                        isPlaying={isPlaying}
                                        audioRef={audioRef}
                                        barCount={80}
                                        height={24}
                                        colorScheme="spotify"
                                    />
                                </div>
                            )}
                            <div
                                className="h-1 bg-[#4d4d4d] cursor-pointer group relative"
                                onClick={handleProgressClick}
                            >
                                <motion.div
                                    className="h-full bg-white group-hover:bg-[#1DB954] relative transition-colors"
                                    style={{ width: `${progress}%` }}
                                >
                                    {/* Progress handle */}
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg" />
                                </motion.div>
                            </div>
                        </div>

                        <div className="bg-[#181818] border-t border-[#282828]">
                            <div className="max-w-screen-2xl mx-auto px-4 py-3">
                                <div className="flex items-center justify-between gap-4">
                                    {/* Track Info */}
                                    <div className="flex items-center gap-4 flex-1 min-w-0 w-1/3">
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            className="relative flex-shrink-0 cursor-pointer"
                                            onClick={() => setIsExpanded(true)}
                                        >
                                            <img
                                                src={currentTrack.image_url || 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=100'}
                                                alt={currentTrack.title}
                                                className="w-14 h-14 rounded-lg object-cover shadow-lg"
                                            />
                                            {isPodcast && (
                                                <div className={`absolute -top-1 -right-1 w-5 h-5 ${isVideoPodcast ? 'bg-purple-500' : 'bg-teal-500'} rounded-full flex items-center justify-center`}>
                                                    {isVideoPodcast ? (
                                                        <Video className="w-3 h-3 text-white" />
                                                    ) : (
                                                        <Mic2 className="w-3 h-3 text-white" />
                                                    )}
                                                </div>
                                            )}
                                            {isRadio && (
                                                <div className="absolute -top-1 -right-1 flex items-center gap-0.5 px-1.5 py-0.5 bg-red-500 rounded-full">
                                                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                                                    <span className="text-[8px] font-bold text-white">LIVE</span>
                                                </div>
                                            )}
                                        </motion.div>
                                        <div className="min-w-0">
                                            <h4 className="font-semibold text-white truncate text-sm hover:underline cursor-pointer">
                                                {currentTrack.title}
                                            </h4>
                                            <p className="text-sm text-gray-400 truncate hover:text-white hover:underline cursor-pointer">
                                                {currentTrack.artist}
                                            </p>
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setIsLiked(!isLiked)}
                                            className="p-2 hidden sm:block flex-shrink-0"
                                        >
                                            <Heart
                                                className={`w-5 h-5 transition-colors ${isLiked
                                                    ? 'text-[#1DB954] fill-[#1DB954]'
                                                    : 'text-[#b3b3b3] hover:text-white'
                                                    }`}
                                            />
                                        </motion.button>
                                    </div>

                                    {/* Main Controls */}
                                    <div className="flex flex-col items-center gap-1 w-1/3">
                                        <div className="flex items-center gap-2 sm:gap-4">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={toggleShuffle}
                                                className={`p-2 transition-colors hidden sm:block ${isShuffled ? 'text-[#1DB954]' : 'text-[#b3b3b3] hover:text-white'
                                                    }`}
                                            >
                                                <Shuffle className="w-4 h-4" />
                                            </motion.button>

                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={playPrevious}
                                                className="p-2 text-[#b3b3b3] hover:text-white transition-colors"
                                            >
                                                <SkipBack className="w-5 h-5 fill-current" />
                                            </motion.button>

                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={togglePlay}
                                                className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                                            >
                                                {isPlaying ? (
                                                    <Pause className="w-5 h-5 text-black fill-black" />
                                                ) : (
                                                    <Play className="w-5 h-5 text-black fill-black ml-0.5" />
                                                )}
                                            </motion.button>

                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={playNext}
                                                className="p-2 text-[#b3b3b3] hover:text-white transition-colors"
                                            >
                                                <SkipForward className="w-5 h-5 fill-current" />
                                            </motion.button>

                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={cycleRepeatMode}
                                                className={`p-2 transition-colors hidden sm:block ${repeatMode !== 'none' ? 'text-[#1DB954]' : 'text-[#b3b3b3] hover:text-white'
                                                    }`}
                                            >
                                                {getRepeatIcon()}
                                            </motion.button>
                                        </div>

                                        <div className="hidden sm:flex items-center gap-2 text-xs text-[#b3b3b3]">
                                            <span className="w-10 text-right">{formatTime(currentTime)}</span>
                                            <div className="w-24 md:w-40 lg:w-64 h-1 bg-white/10 rounded-full opacity-0">
                                                {/* Hidden on mini, visible when needed */}
                                            </div>
                                            <span className="w-10">{formatTime(duration)}</span>
                                        </div>
                                    </div>

                                    {/* Right Controls */}
                                    <div className="flex items-center justify-end gap-2 sm:gap-3 flex-1 w-1/3">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setShowQueue(!showQueue)}
                                            className={`p-2 transition-colors hidden md:block ${showQueue ? 'text-[#1DB954]' : 'text-[#b3b3b3] hover:text-white'
                                                }`}
                                        >
                                            <ListMusic className="w-5 h-5" />
                                        </motion.button>

                                        {/* Volume Control */}
                                        <div className="hidden md:flex items-center gap-2">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={toggleMute}
                                                className="p-2 text-[#b3b3b3] hover:text-white transition-colors"
                                            >
                                                {getVolumeIcon()}
                                            </motion.button>
                                            <div
                                                className="w-24 h-1 bg-white/10 rounded-full cursor-pointer group relative"
                                                onClick={handleVolumeChange}
                                            >
                                                <div
                                                    className="h-full bg-white rounded-full relative group-hover:bg-[#1DB954] transition-colors"
                                                    style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                                                >
                                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Expand Button */}
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setIsExpanded(true)}
                                            className="p-2 text-[#b3b3b3] hover:text-white transition-colors"
                                        >
                                            <Maximize2 className="w-5 h-5" />
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Full Screen Player */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed inset-0 z-50 flex flex-col"
                    >
                        {/* Background with album art blur */}
                        <div className="absolute inset-0 overflow-hidden">
                            <img
                                src={currentTrack.image_url || 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=500'}
                                alt=""
                                className="w-full h-full object-cover opacity-30 blur-3xl scale-125"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-gray-950/90 to-gray-950" />
                        </div>

                        {/* Content */}
                        <div className="relative z-10 flex-1 flex flex-col max-w-2xl mx-auto w-full px-6">
                            {/* Header */}
                            <div className="flex items-center justify-between py-6">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setIsExpanded(false)}
                                    className="p-2 text-gray-400 hover:text-white transition-colors"
                                >
                                    <ChevronDown className="w-7 h-7" />
                                </motion.button>

                                <div className="text-center">
                                    <p className="text-xs text-gray-400 uppercase tracking-widest">
                                        {isPodcast ? 'Now Playing Podcast' : 'Now Playing'}
                                    </p>
                                    <p className="text-sm text-white font-medium mt-1">
                                        {currentTrack.album || currentTrack.genre || 'Music'}
                                    </p>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setShowQueue(!showQueue)}
                                    className="p-2 text-gray-400 hover:text-white transition-colors"
                                >
                                    <ListMusic className="w-6 h-6" />
                                </motion.button>
                            </div>

                            {/* Album Art */}
                            <div className="flex-1 flex flex-col items-center justify-center py-6">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="relative"
                                >
                                    <div className="w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-lg overflow-hidden shadow-2xl shadow-black/50">
                                        <img
                                            src={currentTrack.image_url || 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=500'}
                                            alt={currentTrack.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    {/* Playing indicator */}
                                    {isPlaying && (
                                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-end gap-1 h-6 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1">
                                            {[...Array(5)].map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    className="w-1 bg-[#1DB954] rounded-full"
                                                    animate={{ height: [8, 20, 8] }}
                                                    transition={{
                                                        duration: 0.5,
                                                        repeat: Infinity,
                                                        delay: i * 0.1,
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </motion.div>

                                {/* Waveform Visualization */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="w-full max-w-md mt-8 px-4"
                                >
                                    <Waveform
                                        isPlaying={isPlaying}
                                        audioRef={audioRef}
                                        barCount={50}
                                        height={80}
                                        colorScheme="spotify"
                                        className="opacity-90"
                                    />
                                </motion.div>
                            </div>

                            {/* Track Info */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="min-w-0 flex-1">
                                    <motion.h2
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        className="text-2xl sm:text-3xl font-bold text-white truncate"
                                    >
                                        {currentTrack.title}
                                    </motion.h2>
                                    <motion.p
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.05 }}
                                        className="text-lg text-gray-400"
                                    >
                                        {currentTrack.artist}
                                    </motion.p>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setIsLiked(!isLiked)}
                                    className="p-3"
                                >
                                    <Heart
                                        className={`w-7 h-7 transition-colors ${isLiked
                                            ? 'text-pink-500 fill-pink-500'
                                            : 'text-gray-400 hover:text-white'
                                            }`}
                                    />
                                </motion.button>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-6">
                                <div
                                    className="w-full h-1.5 bg-white/10 rounded-full cursor-pointer group"
                                    onClick={handleProgressClick}
                                >
                                    <div
                                        className="h-full bg-white rounded-full relative group-hover:bg-[#1DB954] transition-colors"
                                        style={{ width: `${progress}%` }}
                                    >
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </div>
                                <div className="flex justify-between mt-2 text-sm text-gray-400">
                                    <span>{formatTime(currentTime)}</span>
                                    <span>{formatTime(duration)}</span>
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="flex items-center justify-center gap-6 sm:gap-8 mb-8">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={toggleShuffle}
                                    className={`p-3 transition-colors ${isShuffled ? 'text-[#1DB954]' : 'text-[#b3b3b3] hover:text-white'
                                        }`}
                                >
                                    <Shuffle className="w-6 h-6" />
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={playPrevious}
                                    className="p-3 text-white hover:text-purple-400 transition-colors"
                                >
                                    <SkipBack className="w-8 h-8 fill-current" />
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={togglePlay}
                                    className="w-16 h-16 sm:w-18 sm:h-18 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-xl"
                                >
                                    {isPlaying ? (
                                        <Pause className="w-7 h-7 sm:w-8 sm:h-8 text-black fill-black" />
                                    ) : (
                                        <Play className="w-7 h-7 sm:w-8 sm:h-8 text-black fill-black ml-1" />
                                    )}
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={playNext}
                                    className="p-3 text-white hover:text-purple-400 transition-colors"
                                >
                                    <SkipForward className="w-8 h-8 fill-current" />
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={cycleRepeatMode}
                                    className={`p-3 transition-colors ${repeatMode !== 'none' ? 'text-[#1DB954]' : 'text-[#b3b3b3] hover:text-white'
                                        }`}
                                >
                                    {getRepeatIcon()}
                                </motion.button>
                            </div>

                            {/* Bottom Actions */}
                            <div className="flex items-center justify-between pb-8">
                                <div className="flex items-center gap-4">
                                    {isPodcast && (
                                        <div className={`flex items-center gap-2 ${isVideoPodcast ? 'text-purple-400' : 'text-teal-400'}`}>
                                            {isVideoPodcast ? (
                                                <>
                                                    <Video className="w-5 h-5" />
                                                    <span className="text-sm font-medium">Video Podcast</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Mic2 className="w-5 h-5" />
                                                    <span className="text-sm font-medium">Podcast</span>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Volume Control */}
                                <div className="flex items-center gap-3">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={toggleMute}
                                        className="p-2 text-gray-400 hover:text-white transition-colors"
                                    >
                                        {getVolumeIcon()}
                                    </motion.button>
                                    <div
                                        className="w-28 h-1.5 bg-white/10 rounded-full cursor-pointer group"
                                        onClick={handleVolumeChange}
                                    >
                                        <div
                                            className="h-full bg-white rounded-full relative group-hover:bg-[#1DB954] transition-colors"
                                            style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                                        >
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Queue Panel */}
                        <AnimatePresence>
                            {showQueue && (
                                <motion.div
                                    initial={{ x: '100%' }}
                                    animate={{ x: 0 }}
                                    exit={{ x: '100%' }}
                                    transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                                    className="absolute top-0 right-0 bottom-0 w-80 bg-gray-900/98 backdrop-blur-xl border-l border-white/10 overflow-y-auto z-20"
                                >
                                    <div className="sticky top-0 bg-gray-900/95 backdrop-blur-xl border-b border-white/10 p-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-bold text-white">Queue</h3>
                                            <button
                                                onClick={() => setShowQueue(false)}
                                                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-4 space-y-2">
                                        {playlist.map((track, index) => (
                                            <motion.div
                                                key={track.id}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.03 }}
                                                onClick={() => playTrack(track, playlist)}
                                                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${currentTrack?.id === track.id
                                                    ? 'bg-[#1DB954]/20 border border-[#1DB954]/30'
                                                    : 'hover:bg-white/5'
                                                    }`}
                                            >
                                                <img
                                                    src={track.image_url}
                                                    alt={track.title}
                                                    className="w-12 h-12 rounded object-cover"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm font-medium truncate ${currentTrack?.id === track.id ? 'text-[#1DB954]' : 'text-white'
                                                        }`}>
                                                        {track.title}
                                                    </p>
                                                    <p className="text-xs text-gray-400 truncate">{track.artist}</p>
                                                </div>
                                                {currentTrack?.id === track.id && isPlaying && (
                                                    <div className="flex items-end gap-0.5 h-4">
                                                        {[...Array(3)].map((_, i) => (
                                                            <motion.div
                                                                key={i}
                                                                className="w-0.5 bg-[#1DB954] rounded-full"
                                                                animate={{ height: ['40%', '100%', '40%'] }}
                                                                transition={{
                                                                    duration: 0.5,
                                                                    repeat: Infinity,
                                                                    delay: i * 0.1,
                                                                }}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence >
        </>
    );
};

export default MusicPlayer;
