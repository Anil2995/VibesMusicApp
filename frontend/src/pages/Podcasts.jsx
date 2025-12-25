import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayer } from '../context/PlayerContext';
import {
    Mic2,
    Play,
    Clock,
    ChevronRight,
    Radio,
    Headphones,
    TrendingUp,
    Search,
    Filter,
    Sparkles
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

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

const Podcasts = () => {
    const navigate = useNavigate();
    const { playTrack } = usePlayer();
    const [podcasts, setPodcasts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchPodcasts();
        fetchCategories();
    }, []);

    const fetchPodcasts = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/podcasts`);
            if (!response.ok) throw new Error('Failed to fetch podcasts');
            const data = await response.json();
            setPodcasts(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/podcasts/categories`);
            if (!response.ok) throw new Error('Failed to fetch categories');
            const data = await response.json();
            setCategories(data);
        } catch (err) {
            console.error('Error fetching categories:', err);
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
        return `${mins}m`;
    };

    const filteredPodcasts = podcasts.filter(podcast => {
        const matchesSearch = podcast.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            podcast.host.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || podcast.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const featuredPodcasts = podcasts.slice(0, 3);

    // Loading skeleton
    const PodcastSkeleton = () => (
        <div className="animate-pulse">
            <div className="aspect-square bg-white/5 rounded-2xl mb-4" />
            <div className="h-4 bg-white/5 rounded w-3/4 mb-2" />
            <div className="h-3 bg-white/5 rounded w-1/2" />
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white pb-32">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-2000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000" />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-30 border-b border-white/10 backdrop-blur-xl bg-black/40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/25">
                                    <Mic2 className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold">Podcasts</h1>
                                    <p className="text-sm text-gray-400">Discover amazing shows</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Search */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="relative max-w-md w-full"
                        >
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search podcasts..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 transition-all"
                            />
                        </motion.div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {/* Category Filters */}
                {categories.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mb-10"
                    >
                        <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedCategory('All')}
                                className={`flex-shrink-0 px-6 py-2.5 rounded-full font-medium transition-all ${selectedCategory === 'All'
                                        ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/30'
                                        : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                                    }`}
                            >
                                All
                            </motion.button>
                            {categories.map((category, index) => (
                                <motion.button
                                    key={category}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 + index * 0.05 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`flex-shrink-0 px-6 py-2.5 rounded-full font-medium transition-all ${selectedCategory === category
                                            ? `bg-gradient-to-r ${getCategoryColor(category)} text-white shadow-lg`
                                            : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                                        }`}
                                >
                                    {category}
                                </motion.button>
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* Featured Podcasts */}
                {!searchQuery && selectedCategory === 'All' && featuredPodcasts.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mb-12"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <Sparkles className="w-6 h-6 text-teal-400" />
                                Featured Shows
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {featuredPodcasts.map((podcast, index) => (
                                <motion.div
                                    key={podcast.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + index * 0.1 }}
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => navigate(`/podcasts/${podcast.id}`)}
                                    className="relative overflow-hidden rounded-2xl cursor-pointer group"
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor(podcast.category)} opacity-80`} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                    <img
                                        src={podcast.image_url}
                                        alt={podcast.title}
                                        className="w-full aspect-[16/9] object-cover opacity-60 group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                        <span className="text-xs font-semibold text-white/80 uppercase tracking-wider mb-2">
                                            {podcast.category}
                                        </span>
                                        <h3 className="text-xl font-bold text-white mb-1">{podcast.title}</h3>
                                        <p className="text-sm text-white/70">by {podcast.host}</p>
                                    </div>
                                    <motion.div
                                        className="absolute bottom-4 right-4 w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all"
                                    >
                                        <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                                    </motion.div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* All Podcasts Grid */}
                <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Radio className="w-6 h-6 text-purple-400" />
                            {selectedCategory === 'All' ? 'All Shows' : selectedCategory}
                        </h2>
                        <span className="text-sm text-gray-400 bg-white/5 px-3 py-1 rounded-full">
                            {filteredPodcasts.length} shows
                        </span>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <PodcastSkeleton key={i} />
                            ))}
                        </div>
                    ) : error ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-16"
                        >
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/10 rounded-full mb-4">
                                <Mic2 className="w-10 h-10 text-red-400" />
                            </div>
                            <p className="text-red-400 mb-4 text-lg">{error}</p>
                            <button
                                onClick={fetchPodcasts}
                                className="px-8 py-3 bg-teal-500/20 text-teal-300 rounded-full hover:bg-teal-500/30 transition-colors font-medium"
                            >
                                Try Again
                            </button>
                        </motion.div>
                    ) : filteredPodcasts.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-16"
                        >
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-500/10 rounded-full mb-4">
                                <Search className="w-10 h-10 text-gray-400" />
                            </div>
                            <p className="text-gray-400 text-lg">No podcasts found</p>
                            <button
                                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                                className="mt-4 text-teal-400 hover:text-teal-300"
                            >
                                Clear filters
                            </button>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {filteredPodcasts.map((podcast, index) => (
                                <motion.div
                                    key={podcast.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ scale: 1.03 }}
                                    onClick={() => navigate(`/podcasts/${podcast.id}`)}
                                    className="group cursor-pointer"
                                >
                                    <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 shadow-lg">
                                        <img
                                            src={podcast.image_url}
                                            alt={podcast.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <motion.div
                                            className="absolute bottom-3 right-3 w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all"
                                        >
                                            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                                        </motion.div>
                                        <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getCategoryColor(podcast.category)} text-white`}>
                                            {podcast.category}
                                        </div>
                                    </div>
                                    <h3 className="font-semibold text-white truncate group-hover:text-teal-400 transition-colors">
                                        {podcast.title}
                                    </h3>
                                    <p className="text-sm text-gray-400 truncate">
                                        {podcast.host}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.section>
            </main>
        </div>
    );
};

export default Podcasts;
