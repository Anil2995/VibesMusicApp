import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayer } from '../context/PlayerContext';
import { useNavigate } from 'react-router-dom';
import {
    Search as SearchIcon,
    X,
    Music2,
    Mic2,
    Play,
    Pause,
    Clock,
    TrendingUp,
    Sparkles,
    ArrowRight
} from 'lucide-react';
import { API_BASE_URL } from '../config/api';

// Debounce hook
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
};

const Search = () => {
    const { playTrack, currentTrack, isPlaying } = usePlayer();
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState({ tracks: [], podcasts: [], episodes: [] });
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeCategory, setActiveCategory] = useState('all');
    const [recentSearches, setRecentSearches] = useState([]);
    const [trendingSearches] = useState([
        'Lofi Beats', 'Workout Mix', 'Jazz Classics', 'Pop Hits', 'Chill Vibes'
    ]);

    const debouncedQuery = useDebounce(query, 300);

    // Load recent searches from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('recentSearches');
        if (saved) {
            setRecentSearches(JSON.parse(saved));
        }
    }, []);

    // Search when debounced query changes
    useEffect(() => {
        if (debouncedQuery.trim().length >= 2) {
            performSearch(debouncedQuery);
            fetchSuggestions(debouncedQuery);
        } else {
            setResults({ tracks: [], podcasts: [], episodes: [] });
            setSuggestions([]);
        }
    }, [debouncedQuery]);

    const performSearch = async (searchQuery) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(searchQuery)}&limit=15`);
            if (response.ok) {
                const data = await response.json();
                setResults(data);
            }
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSuggestions = async (q) => {
        try {
            const response = await fetch(`${API_BASE_URL}/search/suggestions?q=${encodeURIComponent(q)}`);
            if (response.ok) {
                const data = await response.json();
                setSuggestions(data);
            }
        } catch (error) {
            console.error('Suggestions error:', error);
        }
    };

    const handleSearch = (searchTerm) => {
        setQuery(searchTerm);
        // Save to recent searches
        const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem('recentSearches', JSON.stringify(updated));
    };

    const clearRecentSearches = () => {
        setRecentSearches([]);
        localStorage.removeItem('recentSearches');
    };

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const totalResults = results.tracks.length + results.podcasts.length + results.episodes.length;

    const filteredResults = {
        tracks: activeCategory === 'all' || activeCategory === 'tracks' ? results.tracks : [],
        podcasts: activeCategory === 'all' || activeCategory === 'podcasts' ? results.podcasts : [],
        episodes: activeCategory === 'all' || activeCategory === 'episodes' ? results.episodes : []
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white pb-32">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-2000" />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-30 border-b border-white/10 backdrop-blur-xl bg-black/40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
                            <SearchIcon className="w-8 h-8 text-blue-400" />
                            Search
                        </h1>

                        {/* Search Input */}
                        <div className="relative">
                            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="What do you want to listen to?"
                                className="w-full pl-14 pr-12 py-4 bg-white/10 border border-white/10 rounded-2xl text-white text-lg placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                autoFocus
                            />
                            {query && (
                                <button
                                    onClick={() => setQuery('')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full"
                                >
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            )}
                        </div>

                        {/* Suggestions */}
                        <AnimatePresence>
                            {suggestions.length > 0 && query && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute left-0 right-0 mt-2 mx-4 sm:mx-6 bg-gray-900/98 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden z-50 max-w-7xl"
                                >
                                    {suggestions.map((suggestion, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleSearch(suggestion)}
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-left transition-colors"
                                        >
                                            <SearchIcon className="w-4 h-4 text-gray-400" />
                                            <span>{suggestion}</span>
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </header>

            {/* Content */}
            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {/* Show when no search */}
                {!query && (
                    <div className="space-y-10">
                        {/* Recent Searches */}
                        {recentSearches.length > 0 && (
                            <motion.section
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-gray-400" />
                                        Recent Searches
                                    </h2>
                                    <button
                                        onClick={clearRecentSearches}
                                        className="text-sm text-gray-400 hover:text-white"
                                    >
                                        Clear all
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {recentSearches.map((search, index) => (
                                        <motion.button
                                            key={index}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.05 }}
                                            whileHover={{ scale: 1.05 }}
                                            onClick={() => handleSearch(search)}
                                            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm transition-colors"
                                        >
                                            {search}
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        {/* Trending Searches */}
                        <motion.section
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                        >
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-green-400" />
                                Trending Searches
                            </h2>
                            <div className="flex flex-wrap gap-3">
                                {trendingSearches.map((search, index) => (
                                    <motion.button
                                        key={search}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 + index * 0.05 }}
                                        whileHover={{ scale: 1.05 }}
                                        onClick={() => handleSearch(search)}
                                        className="px-5 py-2.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-500/20 rounded-full text-sm font-medium transition-all"
                                    >
                                        {search}
                                    </motion.button>
                                ))}
                            </div>
                        </motion.section>

                        {/* Browse Categories */}
                        <motion.section
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-yellow-400" />
                                Browse All
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {[
                                    { name: 'Pop', color: 'from-pink-500 to-rose-500', emoji: '🎤' },
                                    { name: 'Electronic', color: 'from-cyan-500 to-blue-500', emoji: '🎹' },
                                    { name: 'Hip-Hop', color: 'from-red-500 to-orange-500', emoji: '🎧' },
                                    { name: 'Jazz', color: 'from-violet-500 to-purple-500', emoji: '🎷' },
                                    { name: 'Classical', color: 'from-amber-500 to-orange-500', emoji: '🎻' },
                                    { name: 'Rock', color: 'from-slate-500 to-zinc-600', emoji: '🎸' },
                                    { name: 'Podcasts', color: 'from-teal-500 to-cyan-500', emoji: '🎙️' },
                                    { name: 'Lo-Fi', color: 'from-indigo-500 to-violet-500', emoji: '☕' }
                                ].map((category, index) => (
                                    <motion.button
                                        key={category.name}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 + index * 0.05 }}
                                        whileHover={{ scale: 1.03 }}
                                        onClick={() => handleSearch(category.name)}
                                        className={`relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br ${category.color} text-left group`}
                                    >
                                        <span className="text-3xl mb-2 block">{category.emoji}</span>
                                        <span className="font-bold text-lg">{category.name}</span>
                                        <ArrowRight className="absolute bottom-4 right-4 w-5 h-5 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                    </motion.button>
                                ))}
                            </div>
                        </motion.section>
                    </div>
                )}

                {/* Search Results */}
                {query && (
                    <div>
                        {/* Category Tabs */}
                        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                            {['all', 'tracks', 'podcasts'].map((cat) => (
                                <motion.button
                                    key={cat}
                                    whileHover={{ scale: 1.05 }}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-5 py-2 rounded-full font-medium capitalize whitespace-nowrap transition-all ${activeCategory === cat
                                        ? 'bg-white text-black'
                                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                        }`}
                                >
                                    {cat}
                                </motion.button>
                            ))}
                        </div>

                        {loading ? (
                            <div className="space-y-4">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="animate-pulse flex items-center gap-4 p-3">
                                        <div className="w-14 h-14 bg-white/5 rounded-lg" />
                                        <div className="flex-1">
                                            <div className="h-4 bg-white/5 rounded w-1/3 mb-2" />
                                            <div className="h-3 bg-white/5 rounded w-1/4" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : totalResults === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-16"
                            >
                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <SearchIcon className="w-10 h-10 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">No results found</h3>
                                <p className="text-gray-400">Try different keywords or check spelling</p>
                            </motion.div>
                        ) : (
                            <div className="space-y-8">
                                {/* Tracks */}
                                {filteredResults.tracks.length > 0 && (
                                    <section>
                                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                            <Music2 className="w-5 h-5 text-purple-400" />
                                            Songs
                                        </h3>
                                        <div className="space-y-2">
                                            {filteredResults.tracks.map((track, index) => (
                                                <motion.div
                                                    key={track.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.03 }}
                                                    whileHover={{ scale: 1.01 }}
                                                    onClick={() => playTrack(track, filteredResults.tracks)}
                                                    className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all group ${currentTrack?.id === track.id
                                                        ? 'bg-purple-500/20 border border-purple-500/30'
                                                        : 'bg-white/5 hover:bg-white/10'
                                                        }`}
                                                >
                                                    <div className="relative w-14 h-14 flex-shrink-0">
                                                        <img
                                                            src={track.image_url}
                                                            alt={track.title}
                                                            className="w-full h-full rounded-lg object-cover"
                                                        />
                                                        <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            {currentTrack?.id === track.id && isPlaying ? (
                                                                <Pause className="w-5 h-5 text-white fill-white" />
                                                            ) : (
                                                                <Play className="w-5 h-5 text-white fill-white" />
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className={`font-medium truncate ${currentTrack?.id === track.id ? 'text-purple-400' : ''
                                                            }`}>
                                                            {track.title}
                                                        </h4>
                                                        <p className="text-sm text-gray-400 truncate">{track.artist}</p>
                                                    </div>
                                                    <span className="text-sm text-gray-500 hidden md:block">{track.genre}</span>
                                                    <span className="text-sm text-gray-500">{formatDuration(track.duration)}</span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* Podcasts */}
                                {filteredResults.podcasts.length > 0 && (
                                    <section>
                                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                            <Mic2 className="w-5 h-5 text-teal-400" />
                                            Podcasts
                                        </h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                                            {filteredResults.podcasts.map((podcast, index) => (
                                                <motion.div
                                                    key={podcast.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    whileHover={{ scale: 1.03 }}
                                                    onClick={() => navigate(`/podcasts/${podcast.id}`)}
                                                    className="cursor-pointer group"
                                                >
                                                    <div className="relative aspect-square rounded-xl overflow-hidden mb-3 shadow-lg">
                                                        <img
                                                            src={podcast.image_url}
                                                            alt={podcast.title}
                                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                        />
                                                        <motion.div className="absolute bottom-3 right-3 w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                                                            <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                                                        </motion.div>
                                                    </div>
                                                    <h4 className="font-semibold text-sm truncate group-hover:text-teal-400 transition-colors">
                                                        {podcast.title}
                                                    </h4>
                                                    <p className="text-xs text-gray-400 truncate">{podcast.host}</p>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Search;
