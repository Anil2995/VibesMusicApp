import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Music2, Headphones, TrendingUp, LogOut, User, Search } from 'lucide-react';
import TrackCard from '../components/TrackCard';

const API_BASE_URL = 'http://localhost:5000/api';

const Home = () => {
    const { user, signOut } = useAuth();
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

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
        setCurrentTrack(currentTrack?.id === track.id ? null : track);
    };

    const filteredTracks = tracks.filter(track =>
        track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.artist.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const genres = [...new Set(tracks.map(t => t.genre).filter(Boolean))];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white overflow-hidden">
            {/* Animated Background Blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
            </div>

            {/* Navigation Header */}
            <header className="relative z-20 border-b border-white/10 backdrop-blur-xl bg-black/20">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3"
                        >
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                                <Music2 className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                                Vibes
                            </span>
                        </motion.div>

                        {/* Search Bar */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="flex-1 max-w-md mx-8"
                        >
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search songs, artists..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
                                />
                            </div>
                        </motion.div>

                        {/* User Section */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-4"
                        >
                            {user ? (
                                <>
                                    <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                                        <img
                                            src={user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user.email}&background=8b5cf6&color=fff`}
                                            alt="Profile"
                                            className="w-8 h-8 rounded-full border-2 border-purple-500/50"
                                        />
                                        <span className="text-sm font-medium hidden sm:block">
                                            {user.user_metadata?.username || user.email?.split('@')[0]}
                                        </span>
                                    </div>
                                    <button
                                        onClick={signOut}
                                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
                                        title="Logout"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </>
                            ) : (
                                <Link
                                    to="/login"
                                    className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-medium hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/25"
                                >
                                    Sign In
                                </Link>
                            )}
                        </motion.div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
                {/* Hero Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-white/10 backdrop-blur-xl p-8 md:p-12">
                        <div className="relative z-10">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                                Welcome to <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">Vibes</span>
                            </h1>
                            <p className="text-lg text-gray-300 mb-6 max-w-xl">
                                Discover amazing music, create playlists, and vibe to your favorite tracks. Your personal music journey starts here.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-semibold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-shadow"
                                >
                                    <Headphones className="w-5 h-5" />
                                    Start Listening
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 rounded-full font-semibold hover:bg-white/20 transition-colors"
                                >
                                    <TrendingUp className="w-5 h-5" />
                                    Trending Now
                                </motion.button>
                            </div>
                        </div>
                        {/* Decorative Elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-500/20 to-transparent rounded-full blur-3xl" />
                    </div>
                </motion.section>

                {/* Genre Pills */}
                {genres.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mb-8"
                    >
                        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                            <span className="text-sm text-gray-400 whitespace-nowrap">Browse by:</span>
                            <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-sm font-medium whitespace-nowrap">
                                All
                            </button>
                            {genres.map((genre) => (
                                <button
                                    key={genre}
                                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-medium whitespace-nowrap hover:bg-white/10 hover:border-purple-500/50 transition-all"
                                >
                                    {genre}
                                </button>
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* Tracks Section */}
                <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">
                            🎵 Featured Tracks
                        </h2>
                        <span className="text-sm text-gray-400">
                            {filteredTracks.length} songs
                        </span>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="aspect-square bg-white/5 rounded-2xl animate-pulse" />
                            ))}
                        </div>
                    ) : error ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12"
                        >
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-full mb-4">
                                <Music2 className="w-8 h-8 text-red-400" />
                            </div>
                            <p className="text-red-400 mb-4">{error}</p>
                            <button
                                onClick={fetchTracks}
                                className="px-6 py-2 bg-purple-500/20 text-purple-300 rounded-full hover:bg-purple-500/30 transition-colors"
                            >
                                Try Again
                            </button>
                        </motion.div>
                    ) : filteredTracks.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12"
                        >
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-500/10 rounded-full mb-4">
                                <Search className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-400">No tracks found matching "{searchQuery}"</p>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {filteredTracks.map((track, index) => (
                                <TrackCard
                                    key={track.id}
                                    track={track}
                                    index={index}
                                    onPlay={handlePlay}
                                    isPlaying={currentTrack?.id === track.id}
                                />
                            ))}
                        </div>
                    )}
                </motion.section>
            </main>

            {/* Mini Player (when track is selected) */}
            {currentTrack && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-t border-white/10"
                >
                    <div className="max-w-7xl mx-auto px-6 py-4">
                        <div className="flex items-center gap-4">
                            <img
                                src={currentTrack.image_url}
                                alt={currentTrack.title}
                                className="w-14 h-14 rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{currentTrack.title}</p>
                                <p className="text-sm text-gray-400 truncate">{currentTrack.artist}</p>
                            </div>
                            <audio
                                src={currentTrack.audio_url}
                                controls
                                autoPlay
                                className="flex-shrink-0"
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default Home;
