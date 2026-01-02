import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayer } from '../context/PlayerContext';
import {
    Radio,
    Play,
    Pause,
    Heart,
    Volume2,
    Users,
    Waves,
    Globe,
    Music2,
    Sparkles,
    Zap,
    TrendingUp
} from 'lucide-react';

// Radio stations data with streaming URLs
const radioStations = [
    {
        id: 'lofi-beats',
        name: 'Lo-Fi Beats',
        genre: 'Lo-Fi',
        description: 'Relaxing beats for studying and chilling',
        image: 'https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?w=500&auto=format&fit=crop&q=60',
        streamUrl: 'https://streams.ilovemusic.de/iloveradio17.mp3',
        listeners: 12450,
        color: 'from-indigo-500 to-violet-600',
        isLive: true
    },
    {
        id: 'chill-vibes',
        name: 'Chill Vibes',
        genre: 'Ambient',
        description: 'Smooth ambient sounds for relaxation',
        image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&auto=format&fit=crop&q=60',
        streamUrl: 'https://streams.ilovemusic.de/iloveradio2.mp3',
        listeners: 8320,
        color: 'from-teal-500 to-cyan-500',
        isLive: true
    },
    {
        id: 'electronic-dance',
        name: 'Electronic Dance',
        genre: 'EDM',
        description: 'High energy electronic dance music',
        image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=60',
        streamUrl: 'https://streams.ilovemusic.de/iloveradio1.mp3',
        listeners: 15780,
        color: 'from-fuchsia-500 to-pink-500',
        isLive: true
    },
    {
        id: 'pop-hits',
        name: 'Pop Hits Radio',
        genre: 'Pop',
        description: 'Today\'s biggest pop hits',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&auto=format&fit=crop&q=60',
        streamUrl: 'https://streams.ilovemusic.de/iloveradio109.mp3',
        listeners: 23560,
        color: 'from-pink-500 to-rose-500',
        isLive: true
    },
    {
        id: 'rock-classics',
        name: 'Rock Classics',
        genre: 'Rock',
        description: 'Legendary rock from all decades',
        image: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=500&auto=format&fit=crop&q=60',
        streamUrl: 'https://streams.ilovemusic.de/iloveradio3.mp3',
        listeners: 9870,
        color: 'from-red-500 to-orange-500',
        isLive: true
    },
    {
        id: 'jazz-fm',
        name: 'Jazz FM',
        genre: 'Jazz',
        description: 'Smooth jazz for sophisticated ears',
        image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=500&auto=format&fit=crop&q=60',
        streamUrl: 'https://streams.ilovemusic.de/iloveradio12.mp3',
        listeners: 5420,
        color: 'from-violet-500 to-purple-600',
        isLive: true
    },
    {
        id: 'hip-hop-central',
        name: 'Hip-Hop Central',
        genre: 'Hip-Hop',
        description: 'The hottest hip-hop and rap tracks',
        image: 'https://images.unsplash.com/photo-1571609549706-04c226c47316?w=500&auto=format&fit=crop&q=60',
        streamUrl: 'https://streams.ilovemusic.de/iloveradio5.mp3',
        listeners: 18930,
        color: 'from-amber-500 to-orange-600',
        isLive: true
    },
    {
        id: 'classical-fm',
        name: 'Classical FM',
        genre: 'Classical',
        description: 'Timeless classical masterpieces',
        image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=500&auto=format&fit=crop&q=60',
        streamUrl: 'https://streams.ilovemusic.de/iloveradio12.mp3',
        listeners: 4580,
        color: 'from-amber-500 to-yellow-500',
        isLive: true
    }
];

const RadioPage = () => {
    const { playTrack, currentTrack, isPlaying, togglePlay } = usePlayer();
    const [selectedGenre, setSelectedGenre] = useState('All');
    const [likedStations, setLikedStations] = useState([]);
    const [currentStation, setCurrentStation] = useState(null);

    const genres = useMemo(() => ['All', ...new Set(radioStations.map(s => s.genre))], []);

    const filteredStations = useMemo(() => {
        if (selectedGenre === 'All') return radioStations;
        return radioStations.filter(s => s.genre === selectedGenre);
    }, [selectedGenre]);

    const featuredStations = radioStations.slice(0, 3);

    const handlePlayStation = (station) => {
        setCurrentStation(station);
        const track = {
            id: `radio-${station.id}`,
            title: station.name,
            artist: `${station.genre} Radio`,
            album: 'Live Radio',
            genre: station.genre,
            duration: 0, // Live stream
            audio_url: station.streamUrl,
            image_url: station.image,
            isRadio: true,
            isLive: true
        };
        playTrack(track, [track]);
    };

    const toggleLike = (stationId) => {
        setLikedStations(prev =>
            prev.includes(stationId)
                ? prev.filter(id => id !== stationId)
                : [...prev, stationId]
        );
    };

    const isStationPlaying = (stationId) => {
        return currentTrack?.id === `radio-${stationId}` && isPlaying;
    };

    const formatListeners = (count) => {
        if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}K`;
        }
        return count.toString();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white pb-32">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob" />
                <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-2000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000" />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-30 border-b border-white/10 backdrop-blur-xl bg-black/40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                                <Radio className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold">Radio</h1>
                                <p className="text-sm text-gray-400">Live streaming stations</p>
                            </div>
                        </div>

                        {/* Live Indicator */}
                        <div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-full">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            <span className="text-sm font-medium text-red-400">LIVE</span>
                        </div>
                    </motion.div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {/* Genre Filters */}
                <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="mb-10"
                >
                    <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
                        {genres.map((genre, index) => (
                            <motion.button
                                key={genre}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedGenre(genre)}
                                className={`flex-shrink-0 px-6 py-2.5 rounded-full font-medium transition-all ${selectedGenre === genre
                                        ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg shadow-purple-500/30'
                                        : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                                    }`}
                            >
                                {genre}
                            </motion.button>
                        ))}
                    </div>
                </motion.section>

                {/* Featured Stations */}
                {selectedGenre === 'All' && (
                    <motion.section
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mb-12"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <Sparkles className="w-6 h-6 text-purple-400" />
                                Featured Stations
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {featuredStations.map((station, index) => (
                                <motion.div
                                    key={station.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + index * 0.1 }}
                                    whileHover={{ scale: 1.02 }}
                                    className="relative overflow-hidden rounded-2xl cursor-pointer group"
                                    onClick={() => handlePlayStation(station)}
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${station.color} opacity-80`} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                                    <img
                                        src={station.image}
                                        alt={station.name}
                                        className="w-full aspect-[16/10] object-cover opacity-60 group-hover:scale-110 transition-transform duration-500"
                                    />

                                    {/* Live Badge */}
                                    <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 bg-red-500/90 rounded-full">
                                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                                        <span className="text-xs font-bold text-white">LIVE</span>
                                    </div>

                                    {/* Listeners */}
                                    <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full">
                                        <Users className="w-3 h-3 text-white" />
                                        <span className="text-xs font-medium text-white">{formatListeners(station.listeners)}</span>
                                    </div>

                                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                        <span className="text-xs font-semibold text-white/80 uppercase tracking-wider mb-2">
                                            {station.genre}
                                        </span>
                                        <h3 className="text-xl font-bold text-white mb-1">{station.name}</h3>
                                        <p className="text-sm text-white/70">{station.description}</p>
                                    </div>

                                    {/* Play Button */}
                                    <motion.div
                                        className="absolute bottom-4 right-4 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all"
                                    >
                                        {isStationPlaying(station.id) ? (
                                            <Pause className="w-6 h-6 text-gray-900 fill-gray-900" />
                                        ) : (
                                            <Play className="w-6 h-6 text-gray-900 fill-gray-900 ml-1" />
                                        )}
                                    </motion.div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* All Stations Grid */}
                <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Waves className="w-6 h-6 text-violet-400" />
                            {selectedGenre === 'All' ? 'All Stations' : `${selectedGenre} Stations`}
                        </h2>
                        <span className="text-sm text-gray-400 bg-white/5 px-3 py-1 rounded-full">
                            {filteredStations.length} stations
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredStations.map((station, index) => (
                            <motion.div
                                key={station.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ scale: 1.02 }}
                                className={`relative p-4 rounded-2xl cursor-pointer group transition-all ${isStationPlaying(station.id)
                                        ? 'bg-gradient-to-r from-purple-500/20 to-violet-500/10 border border-purple-500/30'
                                        : 'bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10'
                                    }`}
                                onClick={() => handlePlayStation(station)}
                            >
                                <div className="flex items-center gap-4">
                                    {/* Station Image */}
                                    <div className="relative w-16 h-16 flex-shrink-0">
                                        <img
                                            src={station.image}
                                            alt={station.name}
                                            className="w-full h-full rounded-xl object-cover"
                                        />
                                        <div className={`absolute inset-0 rounded-xl ${isStationPlaying(station.id)
                                                ? 'bg-purple-500/30'
                                                : 'bg-black/30 opacity-0 group-hover:opacity-100'
                                            } transition-opacity flex items-center justify-center`}>
                                            {isStationPlaying(station.id) ? (
                                                <div className="flex items-end gap-0.5 h-6">
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
                                            ) : (
                                                <Play className="w-6 h-6 text-white fill-white" />
                                            )}
                                        </div>

                                        {/* Live indicator */}
                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-gray-900 animate-pulse" />
                                    </div>

                                    {/* Station Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className={`font-semibold truncate transition-colors ${isStationPlaying(station.id) ? 'text-purple-400' : 'group-hover:text-purple-400'
                                                }`}>
                                                {station.name}
                                            </h3>
                                        </div>
                                        <p className="text-sm text-gray-400 truncate mb-2">{station.genre}</p>
                                        <div className="flex items-center gap-3 text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Users className="w-3 h-3" />
                                                {formatListeners(station.listeners)}
                                            </span>
                                            <span className="flex items-center gap-1 text-red-400">
                                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                                                LIVE
                                            </span>
                                        </div>
                                    </div>

                                    {/* Like Button */}
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleLike(station.id);
                                        }}
                                        className="p-2 rounded-full hover:bg-white/10 transition-colors"
                                    >
                                        <Heart
                                            className={`w-5 h-5 transition-colors ${likedStations.includes(station.id)
                                                    ? 'text-pink-500 fill-pink-500'
                                                    : 'text-gray-400 hover:text-white'
                                                }`}
                                        />
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Info Section */}
                <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-12"
                >
                    <div className="p-6 bg-gradient-to-r from-purple-500/10 to-violet-500/5 rounded-2xl border border-purple-500/20">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Globe className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Global Radio Stations</h3>
                                <p className="text-gray-400 text-sm">
                                    Stream high-quality radio stations from around the world. All stations are live 24/7
                                    and feature curated music for every mood and genre. Enjoy unlimited streaming with no ads.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.section>
            </main>
        </div>
    );
};

export default RadioPage;
