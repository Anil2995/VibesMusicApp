import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Music2,
    Headphones,
    TrendingUp,
    LogOut,
    Search,
    Play,
    Pause,
    Clock,
    Disc3,
    Sparkles,
    ChevronRight,
    Flame,
    Star,
    Zap,
    Mic2,
    Heart,
    MoreHorizontal,
    Radio,
    Library,
    User
} from 'lucide-react';
import TrackCard from '../components/TrackCard';

const API_BASE_URL = 'http://localhost:5000/api';

// Genre color mapping for visual variety
const genreColors = {
    'Pop': 'from-pink-500 to-rose-500',
    'Electronic': 'from-cyan-500 to-blue-500',
    'Classical': 'from-amber-500 to-orange-500',
    'Jazz': 'from-violet-500 to-purple-500',
    'Hip-Hop': 'from-red-500 to-orange-500',
    'Rock': 'from-slate-500 to-zinc-600',
    'Acoustic': 'from-green-500 to-emerald-500',
    'Lo-Fi': 'from-indigo-500 to-violet-500',
    'EDM': 'from-fuchsia-500 to-pink-500',
    'Ambient': 'from-teal-500 to-cyan-500',
    'default': 'from-purple-500 to-pink-500'
};

// Genre icons
const genreIcons = {
    'Pop': '🎤',
    'Electronic': '🎹',
    'Classical': '🎻',
    'Jazz': '🎷',
    'Hip-Hop': '🎧',
    'Rock': '🎸',
    'Acoustic': '🪕',
    'Lo-Fi': '☕',
    'EDM': '🎛️',
    'Ambient': '🌊',
};

const Home = () => {
    const { user, signOut } = useAuth();
    const { playTrack, currentTrack, isPlaying, togglePlay } = usePlayer();
    const navigate = useNavigate();
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('All');
    const [showUserMenu, setShowUserMenu] = useState(false);

    useEffect(() => {
        fetchTracks();
    }, []);

    const fetchTracks = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/tracks`);
            if (!response.ok) throw new Error('Failed to fetch tracks');
            const data = await response.json();
            setTracks(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePlay = (track) => {
        playTrack(track, tracks);
    };

    // Memoized computed values
    const genres = useMemo(() => [...new Set(tracks.map(t => t.genre).filter(Boolean))], [tracks]);

    const filteredTracks = useMemo(() => tracks.filter(track => {
        const matchesSearch = track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            track.artist.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesGenre = selectedGenre === 'All' || track.genre === selectedGenre;
        return matchesSearch && matchesGenre;
    }), [tracks, searchQuery, selectedGenre]);

    // Featured tracks (first 4)
    const featuredTracks = useMemo(() => tracks.slice(0, 4), [tracks]);

    // Trending tracks (shuffled selection)
    const trendingTracks = useMemo(() => {
        return [...tracks].sort(() => Math.random() - 0.5).slice(0, 8);
    }, [tracks]);

    // Recently added (last 4)
    const recentlyAdded = useMemo(() => tracks.slice(-4).reverse(), [tracks]);

    const getGenreColor = (genre) => genreColors[genre] || genreColors.default;
    const getGenreIcon = (genre) => genreIcons[genre] || '🎵';

    // Get greeting based on time
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    // Skeleton component
    const TrackSkeleton = () => (
        <div className="animate-pulse">
            <div className="aspect-square bg-white/5 rounded-2xl mb-4" />
            <div className="h-4 bg-white/5 rounded w-3/4 mb-2" />
            <div className="h-3 bg-white/5 rounded w-1/2" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#121212] text-white overflow-x-hidden pb-32">
            {/* Animated Background - Spotify Style */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-[#1DB954] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
                <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-[#1ed760] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-8 animate-blob animation-delay-4000" />
            </div>

            {/* Navigation Header */}
            <header className="sticky top-0 z-40 border-b border-white/5 backdrop-blur-2xl bg-black/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between gap-4">
                        {/* Logo */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3 flex-shrink-0"
                        >
                            <div className="w-11 h-11 bg-[#1DB954] rounded-full flex items-center justify-center shadow-lg shadow-[#1DB954]/30">
                                <Music2 className="w-6 h-6 text-black" />
                            </div>
                            <div className="hidden sm:block">
                                <span className="text-2xl font-bold text-white">
                                    Vibes
                                </span>
                                <p className="text-xs text-[#b3b3b3] -mt-1">Music Player</p>
                            </div>
                        </motion.div>

                        {/* Search Bar */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="flex-1 max-w-xl"
                        >
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#b3b3b3] group-focus-within:text-white transition-colors" />
                                <input
                                    type="text"
                                    placeholder="What do you want to listen to?"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-[#242424] border-none rounded-full text-white placeholder-[#b3b3b3] focus:outline-none focus:ring-2 focus:ring-white/20 transition-all text-sm"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        </motion.div>

                        {/* User Section */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3 flex-shrink-0"
                        >
                            {user ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setShowUserMenu(!showUserMenu)}
                                        className="flex items-center gap-3 px-3 py-2 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
                                    >
                                        <img
                                            src={user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user.email}&background=8b5cf6&color=fff`}
                                            alt="Profile"
                                            className="w-8 h-8 rounded-full border-2 border-purple-500/50"
                                        />
                                        <span className="text-sm font-medium hidden md:block">
                                            {user.user_metadata?.username || user.email?.split('@')[0]}
                                        </span>
                                    </button>

                                    {/* Dropdown Menu */}
                                    <AnimatePresence>
                                        {showUserMenu && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute top-full right-0 mt-2 w-48 py-2 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl"
                                            >
                                                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                                                    <User className="w-4 h-4" />
                                                    Profile
                                                </button>
                                                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                                                    <Library className="w-4 h-4" />
                                                    Your Library
                                                </button>
                                                <div className="border-t border-white/5 my-1" />
                                                <button
                                                    onClick={signOut}
                                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    Log out
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Link
                                        to="/signup"
                                        className="px-5 py-2.5 text-gray-300 hover:text-white font-medium transition-colors hidden sm:block"
                                    >
                                        Sign up
                                    </Link>
                                    <Link
                                        to="/login"
                                        className="px-8 py-3 bg-[#1DB954] text-black rounded-full font-bold hover:bg-[#1ed760] hover:scale-[1.04] transition-all"
                                    >
                                        Log in
                                    </Link>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {/* Greeting Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                        {getGreeting()}{user ? `, ${user.user_metadata?.username || user.email?.split('@')[0]}` : ''}
                    </h1>
                    <p className="text-gray-400">What would you like to listen to today?</p>
                </motion.section>

                {/* Quick Access Cards */}
                {!searchQuery && selectedGenre === 'All' && (
                    <motion.section
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="mb-10"
                    >
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {/* Podcasts Card */}
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                onClick={() => navigate('/podcasts')}
                                className="flex items-center gap-4 p-4 bg-gradient-to-r from-teal-500/20 to-cyan-500/10 hover:from-teal-500/30 hover:to-cyan-500/20 rounded-xl cursor-pointer border border-teal-500/20 transition-all group"
                            >
                                <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                                    <Mic2 className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold group-hover:text-teal-400 transition-colors">Podcasts</h3>
                                    <p className="text-xs text-gray-400">Discover shows</p>
                                </div>
                            </motion.div>

                            {/* Liked Songs Card */}
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="flex items-center gap-4 p-4 bg-gradient-to-r from-pink-500/20 to-rose-500/10 hover:from-pink-500/30 hover:to-rose-500/20 rounded-xl cursor-pointer border border-pink-500/20 transition-all group"
                            >
                                <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center shadow-lg">
                                    <Heart className="w-7 h-7 text-white fill-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold group-hover:text-pink-400 transition-colors">Liked Songs</h3>
                                    <p className="text-xs text-gray-400">Your favorites</p>
                                </div>
                            </motion.div>

                            {/* Radio Card */}
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-500/20 to-violet-500/10 hover:from-purple-500/30 hover:to-violet-500/20 rounded-xl cursor-pointer border border-purple-500/20 transition-all group"
                            >
                                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-500 rounded-lg flex items-center justify-center shadow-lg">
                                    <Radio className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold group-hover:text-purple-400 transition-colors">Radio</h3>
                                    <p className="text-xs text-gray-400">Live stations</p>
                                </div>
                            </motion.div>

                            {/* Recently Played Card */}
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="flex items-center gap-4 p-4 bg-gradient-to-r from-amber-500/20 to-orange-500/10 hover:from-amber-500/30 hover:to-orange-500/20 rounded-xl cursor-pointer border border-amber-500/20 transition-all group"
                            >
                                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center shadow-lg">
                                    <Clock className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold group-hover:text-amber-400 transition-colors">Recently Played</h3>
                                    <p className="text-xs text-gray-400">Jump back in</p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.section>
                )}

                {/* Genre Cards */}
                {genres.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mb-10"
                    >
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Flame className="w-5 h-5 text-orange-400" />
                                Browse Genres
                            </h2>
                        </div>
                        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedGenre('All')}
                                className={`flex-shrink-0 px-6 py-2.5 rounded-full font-medium transition-all ${selectedGenre === 'All'
                                    ? 'bg-white text-black'
                                    : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/10'
                                    }`}
                            >
                                All
                            </motion.button>
                            {genres.map((genre, index) => (
                                <motion.button
                                    key={genre}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.05 + index * 0.03 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedGenre(genre)}
                                    className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all ${selectedGenre === genre
                                        ? `bg-gradient-to-r ${getGenreColor(genre)} text-white shadow-lg`
                                        : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/10'
                                        }`}
                                >
                                    <span>{getGenreIcon(genre)}</span>
                                    {genre}
                                </motion.button>
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* Now Playing Banner */}
                <AnimatePresence>
                    {currentTrack && !searchQuery && selectedGenre === 'All' && (
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-10"
                        >
                            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600/30 via-pink-600/20 to-purple-600/30 border border-white/10 backdrop-blur-xl p-5">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-pink-500/5 animate-pulse" />
                                <div className="relative flex items-center gap-5">
                                    <div className="relative">
                                        <img
                                            src={currentTrack.image_url}
                                            alt={currentTrack.title}
                                            className="w-20 h-20 rounded-xl object-cover shadow-xl"
                                        />
                                        {isPlaying && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl">
                                                <div className="flex items-end gap-0.5 h-5">
                                                    {[...Array(4)].map((_, i) => (
                                                        <motion.div
                                                            key={i}
                                                            className="w-1 bg-white rounded-full"
                                                            animate={{ height: ['30%', '100%', '30%'] }}
                                                            transition={{
                                                                duration: 0.5,
                                                                repeat: Infinity,
                                                                delay: i * 0.1,
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-purple-400 font-semibold uppercase tracking-wider mb-1">Now Playing</p>
                                        <p className="font-bold text-lg truncate">{currentTrack.title}</p>
                                        <p className="text-sm text-gray-400 truncate">{currentTrack.artist}</p>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={togglePlay}
                                        className="w-14 h-14 bg-[#1DB954] rounded-full flex items-center justify-center shadow-xl hover:bg-[#1ed760] transition-colors"
                                    >
                                        {isPlaying ? (
                                            <Pause className="w-6 h-6 text-black fill-black" />
                                        ) : (
                                            <Play className="w-6 h-6 text-black fill-black ml-0.5" />
                                        )}
                                    </motion.button>
                                </div>
                            </div>
                        </motion.section>
                    )}
                </AnimatePresence>

                {/* Trending Section */}
                {!searchQuery && selectedGenre === 'All' && trendingTracks.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mb-10"
                    >
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-green-400" />
                                Trending Now
                            </h2>
                            <button className="text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-colors">
                                See all <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
                            {trendingTracks.map((track, index) => (
                                <motion.div
                                    key={track.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ scale: 1.03 }}
                                    onClick={() => handlePlay(track)}
                                    className="flex-shrink-0 w-44 cursor-pointer group"
                                >
                                    <div className="relative aspect-square rounded-xl overflow-hidden mb-3 shadow-lg">
                                        <img
                                            src={track.image_url}
                                            alt={track.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <motion.div
                                            className="absolute bottom-3 right-3 w-12 h-12 bg-[#1DB954] rounded-full flex items-center justify-center shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all hover:scale-[1.06] hover:bg-[#1ed760]"
                                        >
                                            {currentTrack?.id === track.id && isPlaying ? (
                                                <Pause className="w-5 h-5 text-black fill-black" />
                                            ) : (
                                                <Play className="w-5 h-5 text-black fill-black ml-0.5" />
                                            )}
                                        </motion.div>
                                        <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full flex items-center gap-1">
                                            <Flame className="w-3 h-3 text-orange-400" />
                                            <span className="text-xs font-bold">#{index + 1}</span>
                                        </div>
                                    </div>
                                    <h3 className="font-semibold text-sm truncate group-hover:text-white transition-colors">{track.title}</h3>
                                    <p className="text-xs text-[#b3b3b3] truncate">{track.artist}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* Recently Added */}
                {!searchQuery && selectedGenre === 'All' && recentlyAdded.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mb-10"
                    >
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Clock className="w-5 h-5 text-blue-400" />
                                Recently Added
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {recentlyAdded.map((track, index) => (
                                <motion.div
                                    key={track.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + index * 0.05 }}
                                    whileHover={{ scale: 1.01 }}
                                    onClick={() => handlePlay(track)}
                                    className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all group ${currentTrack?.id === track.id
                                        ? 'bg-purple-500/20 border border-purple-500/30'
                                        : 'bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10'
                                        }`}
                                >
                                    <div className="relative w-14 h-14 flex-shrink-0">
                                        <img
                                            src={track.image_url}
                                            alt={track.title}
                                            className="w-full h-full rounded-lg object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Play className="w-5 h-5 text-white fill-white" />
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className={`font-semibold text-sm truncate transition-colors ${currentTrack?.id === track.id ? 'text-purple-400' : 'group-hover:text-purple-400'
                                            }`}>{track.title}</h3>
                                        <p className="text-xs text-gray-400 truncate">{track.artist}</p>
                                    </div>
                                    <span className={`text-xs px-2.5 py-1 rounded-full bg-gradient-to-r ${getGenreColor(track.genre)} text-white font-medium`}>
                                        {track.genre}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* All Tracks Grid */}
                <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            🎵 {selectedGenre === 'All' ? 'All Tracks' : selectedGenre}
                        </h2>
                        <span className="text-sm text-gray-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                            {filteredTracks.length} songs
                        </span>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                                <TrackSkeleton key={i} />
                            ))}
                        </div>
                    ) : error ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20"
                        >
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/10 rounded-full mb-4">
                                <Music2 className="w-10 h-10 text-red-400" />
                            </div>
                            <p className="text-red-400 mb-4 text-lg">{error}</p>
                            <button
                                onClick={fetchTracks}
                                className="px-8 py-3 bg-purple-500/20 text-purple-300 rounded-full hover:bg-purple-500/30 transition-colors font-medium border border-purple-500/30"
                            >
                                Try Again
                            </button>
                        </motion.div>
                    ) : filteredTracks.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20"
                        >
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-500/10 rounded-full mb-4">
                                <Search className="w-10 h-10 text-gray-400" />
                            </div>
                            <p className="text-gray-400 text-lg mb-2">No tracks found</p>
                            <p className="text-sm text-gray-500 mb-4">Try searching for something else</p>
                            <button
                                onClick={() => { setSearchQuery(''); setSelectedGenre('All'); }}
                                className="text-purple-400 hover:text-purple-300 font-medium"
                            >
                                Clear filters
                            </button>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                            {filteredTracks.map((track, index) => (
                                <TrackCard
                                    key={track.id}
                                    track={track}
                                    index={index}
                                    onPlay={handlePlay}
                                    isPlaying={currentTrack?.id === track.id && isPlaying}
                                />
                            ))}
                        </div>
                    )}
                </motion.section>
            </main>

            {/* Click outside to close user menu */}
            {showUserMenu && (
                <div
                    className="fixed inset-0 z-30"
                    onClick={() => setShowUserMenu(false)}
                />
            )}
        </div>
    );
};

export default Home;
