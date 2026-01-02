import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayer } from '../context/PlayerContext';
import VideoPlayer from '../components/ui/VideoPlayer';
import {
    ArrowLeft,
    Play,
    Pause,
    Clock,
    Calendar,
    Share2,
    Heart,
    MoreHorizontal,
    Headphones,
    ListMusic,
    ChevronDown,
    ChevronUp,
    Video,
    Mic2
} from 'lucide-react';
import { API_BASE_URL } from '../config/api';

// Category colors
const categoryColors = {
    'Technology': 'from-blue-500 to-cyan-500',
    'Wellness': 'from-green-500 to-emerald-500',
    'Business': 'from-amber-500 to-orange-500',
    'Music': 'from-purple-500 to-pink-500',
    'Comedy': 'from-yellow-500 to-amber-500',
    'True Crime': 'from-red-500 to-rose-500',
    'default': 'from-violet-500 to-purple-500'
};

const PodcastDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { playTrack, currentTrack, isPlaying, togglePlay, isVideo } = usePlayer();
    const [podcast, setPodcast] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const [showAllEpisodes, setShowAllEpisodes] = useState(false);
    const [showVideoPlayer, setShowVideoPlayer] = useState(false);
    const [currentVideoEpisode, setCurrentVideoEpisode] = useState(null);

    useEffect(() => {
        fetchPodcast();
    }, [id]);

    const fetchPodcast = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/podcasts/${id}`);
            if (!response.ok) throw new Error('Failed to fetch podcast');
            const data = await response.json();
            setPodcast(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getCategoryColor = (category) => categoryColors[category] || categoryColors.default;

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        if (mins >= 60) {
            const hours = Math.floor(mins / 60);
            const remainingMins = mins % 60;
            return `${hours}h ${remainingMins}m`;
        }
        return `${mins} min`;
    };

    const handlePlayEpisode = (episode) => {
        // Check if this episode has a video
        if (episode.video_url) {
            setCurrentVideoEpisode(episode);
            setShowVideoPlayer(true);
        }

        const track = {
            id: episode.id,
            title: episode.title,
            artist: podcast.host,
            album: podcast.title,
            genre: podcast.category,
            duration: episode.duration,
            audio_url: episode.audio_url,
            video_url: episode.video_url || null,
            thumbnail_url: episode.thumbnail_url || null,
            image_url: episode.thumbnail_url || podcast.image_url,
            isPodcast: true,
            isVideoPodcast: !!episode.video_url
        };

        playTrack(track, podcast.episodes.map(ep => ({
            ...ep,
            id: ep.id,
            title: ep.title,
            artist: podcast.host,
            album: podcast.title,
            genre: podcast.category,
            audio_url: ep.audio_url,
            video_url: ep.video_url || null,
            thumbnail_url: ep.thumbnail_url || null,
            image_url: ep.thumbnail_url || podcast.image_url,
            isPodcast: true,
            isVideoPodcast: !!ep.video_url
        })));
    };

    const isEpisodePlaying = (episodeId) => {
        return currentTrack?.id === episodeId && isPlaying;
    };

    const isEpisodeActive = (episodeId) => {
        return currentTrack?.id === episodeId;
    };

    const displayedEpisodes = showAllEpisodes ? podcast?.episodes : podcast?.episodes?.slice(0, 5);

    // Close video player
    const handleCloseVideoPlayer = () => {
        setShowVideoPlayer(false);
        setCurrentVideoEpisode(null);
    };

    // Loading skeleton
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white pb-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                    <div className="animate-pulse">
                        <div className="h-8 w-32 bg-white/5 rounded-lg mb-8" />
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="w-64 h-64 bg-white/5 rounded-2xl" />
                            <div className="flex-1 space-y-4">
                                <div className="h-8 bg-white/5 rounded w-3/4" />
                                <div className="h-4 bg-white/5 rounded w-1/2" />
                                <div className="h-20 bg-white/5 rounded" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !podcast) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-400 mb-4">{error || 'Podcast not found'}</p>
                    <button
                        onClick={() => navigate('/podcasts')}
                        className="px-6 py-2 bg-teal-500/20 text-teal-300 rounded-full hover:bg-teal-500/30"
                    >
                        Back to Podcasts
                    </button>
                </div>
            </div>
        );
    }

    // Check if podcast has any video episodes
    const hasVideoEpisodes = podcast.episodes?.some(ep => ep.video_url);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white pb-32">
            {/* Background gradient based on category */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br ${getCategoryColor(podcast.category)} rounded-full mix-blend-multiply filter blur-3xl opacity-20`} />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10" />
            </div>

            {/* Video Player Modal */}
            <AnimatePresence>
                {showVideoPlayer && currentVideoEpisode && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-5xl"
                        >
                            <VideoPlayer
                                videoUrl={currentVideoEpisode.video_url}
                                poster={currentVideoEpisode.thumbnail_url || podcast.image_url}
                                title={`${podcast.title} - ${currentVideoEpisode.title}`}
                                onClose={handleCloseVideoPlayer}
                            />

                            {/* Episode info below video */}
                            <div className="mt-6 bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                                <div className="flex items-start gap-4">
                                    <div className="flex-1">
                                        <span className="text-sm text-teal-400 font-medium">Episode {currentVideoEpisode.episode_number}</span>
                                        <h3 className="text-xl font-bold text-white mt-1">{currentVideoEpisode.title}</h3>
                                        <p className="text-gray-400 mt-2">{currentVideoEpisode.description}</p>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <Clock className="w-4 h-4" />
                                        <span>{formatDuration(currentVideoEpisode.duration)}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header with back button */}
            <header className="sticky top-0 z-30 border-b border-white/10 backdrop-blur-xl bg-black/40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/podcasts')}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back to Podcasts</span>
                    </motion.button>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {/* Podcast Header */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row gap-8 mb-12"
                >
                    {/* Cover Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex-shrink-0"
                    >
                        <div className="w-64 h-64 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 relative">
                            <img
                                src={podcast.image_url}
                                alt={podcast.title}
                                className="w-full h-full object-cover"
                            />
                            {hasVideoEpisodes && (
                                <div className="absolute top-3 right-3 bg-teal-500 text-white px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-semibold">
                                    <Video className="w-3 h-3" />
                                    VIDEO
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Podcast Info */}
                    <div className="flex-1 flex flex-col justify-end">
                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r ${getCategoryColor(podcast.category)} text-white w-fit mb-4`}
                        >
                            {podcast.category}
                        </motion.span>

                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="text-4xl md:text-5xl font-bold mb-2"
                        >
                            {podcast.title}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-gray-400 mb-4"
                        >
                            by {podcast.host}
                        </motion.p>

                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                            className="text-gray-300 mb-6 max-w-2xl"
                        >
                            {podcast.description}
                        </motion.p>

                        {/* Action Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex items-center gap-4"
                        >
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => podcast.episodes?.length > 0 && handlePlayEpisode(podcast.episodes[0])}
                                className={`flex items-center gap-2 px-8 py-4 bg-gradient-to-r ${getCategoryColor(podcast.category)} rounded-full font-semibold shadow-lg hover:shadow-xl transition-all`}
                            >
                                <Play className="w-5 h-5 fill-white" />
                                Play Latest Episode
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsLiked(!isLiked)}
                                className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${isLiked
                                    ? 'bg-pink-500/20 border-pink-500 text-pink-500'
                                    : 'border-white/20 text-gray-400 hover:text-white hover:border-white/40'
                                    }`}
                            >
                                <Heart className={`w-5 h-5 ${isLiked ? 'fill-pink-500' : ''}`} />
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="w-12 h-12 rounded-full flex items-center justify-center border border-white/20 text-gray-400 hover:text-white hover:border-white/40 transition-all"
                            >
                                <Share2 className="w-5 h-5" />
                            </motion.button>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.35 }}
                            className="flex items-center gap-6 mt-6 text-sm text-gray-400"
                        >
                            <div className="flex items-center gap-2">
                                <ListMusic className="w-4 h-4" />
                                <span>{podcast.episodes?.length || 0} Episodes</span>
                            </div>
                            {hasVideoEpisodes && (
                                <div className="flex items-center gap-2 text-teal-400">
                                    <Video className="w-4 h-4" />
                                    <span>Video Available</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <Headphones className="w-4 h-4" />
                                <span>Free to listen</span>
                            </div>
                        </motion.div>
                    </div>
                </motion.section>

                {/* Episodes Section */}
                <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <ListMusic className="w-6 h-6 text-teal-400" />
                        All Episodes
                    </h2>

                    <div className="space-y-3">
                        <AnimatePresence>
                            {displayedEpisodes?.map((episode, index) => (
                                <motion.div
                                    key={episode.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ scale: 1.01 }}
                                    className={`group flex items-center gap-4 p-4 rounded-2xl transition-all cursor-pointer ${isEpisodeActive(episode.id)
                                        ? 'bg-gradient-to-r from-teal-500/20 to-cyan-500/10 border border-teal-500/30'
                                        : 'bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10'
                                        }`}
                                    onClick={() => handlePlayEpisode(episode)}
                                >
                                    {/* Episode Thumbnail or Number */}
                                    <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all overflow-hidden ${isEpisodeActive(episode.id)
                                        ? 'bg-teal-500 text-white'
                                        : 'bg-white/10 text-gray-400 group-hover:bg-teal-500 group-hover:text-white'
                                        }`}>
                                        {episode.video_url && episode.thumbnail_url ? (
                                            <img
                                                src={episode.thumbnail_url}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        ) : isEpisodePlaying(episode.id) ? (
                                            <Pause className="w-5 h-5 fill-white" />
                                        ) : (
                                            <>
                                                <span className="font-bold group-hover:hidden">{episode.episode_number}</span>
                                                <Play className="w-5 h-5 fill-white hidden group-hover:block" />
                                            </>
                                        )}

                                        {/* Video badge */}
                                        {episode.video_url && (
                                            <div className="absolute bottom-0 right-0 bg-teal-500 p-0.5 rounded-tl">
                                                <Video className="w-2.5 h-2.5 text-white" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Episode Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h3 className={`font-semibold truncate transition-colors ${isEpisodeActive(episode.id) ? 'text-teal-400' : 'group-hover:text-teal-400'
                                                }`}>
                                                {episode.title}
                                            </h3>
                                            {episode.video_url && (
                                                <span className="flex-shrink-0 text-[10px] font-bold bg-teal-500/20 text-teal-400 px-1.5 py-0.5 rounded">
                                                    VIDEO
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-400 truncate">
                                            {episode.description}
                                        </p>
                                    </div>

                                    {/* Duration */}
                                    <div className="flex items-center gap-2 text-sm text-gray-400 flex-shrink-0">
                                        <Clock className="w-4 h-4" />
                                        <span>{formatDuration(episode.duration)}</span>
                                    </div>

                                    {/* Playing indicator */}
                                    {isEpisodePlaying(episode.id) && (
                                        <div className="flex items-end gap-0.5 h-4">
                                            {[...Array(3)].map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    className="w-1 bg-teal-400 rounded-full"
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
                        </AnimatePresence>
                    </div>

                    {/* Show More/Less Button */}
                    {podcast.episodes?.length > 5 && (
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowAllEpisodes(!showAllEpisodes)}
                            className="w-full mt-4 py-4 text-center text-gray-400 hover:text-white border border-white/10 hover:border-white/20 rounded-2xl transition-all flex items-center justify-center gap-2"
                        >
                            {showAllEpisodes ? (
                                <>
                                    Show Less <ChevronUp className="w-4 h-4" />
                                </>
                            ) : (
                                <>
                                    Show All {podcast.episodes.length} Episodes <ChevronDown className="w-4 h-4" />
                                </>
                            )}
                        </motion.button>
                    )}
                </motion.section>
            </main>
        </div>
    );
};

export default PodcastDetail;
