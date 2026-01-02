import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import { useNavigate } from 'react-router-dom';
import {
    ListMusic,
    Plus,
    Play,
    Pause,
    MoreHorizontal,
    Edit3,
    Trash2,
    Music2,
    Clock,
    Lock,
    Globe,
    Search,
    X
} from 'lucide-react';
import { API_BASE_URL } from '../config/api';

const Library = () => {
    const { user } = useAuth();
    const { playTrack, currentTrack, isPlaying, togglePlay } = usePlayer();
    const navigate = useNavigate();
    const [playlists, setPlaylists] = useState([]);
    const [likedTracks, setLikedTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('playlists');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [newPlaylistDescription, setNewPlaylistDescription] = useState('');

    useEffect(() => {
        if (user) {
            fetchPlaylists();
            fetchLikedTracks();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchPlaylists = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/playlists/user/${user.id}`);
            if (response.ok) {
                const data = await response.json();
                setPlaylists(data);
            }
        } catch (error) {
            console.error('Error fetching playlists:', error);
        }
    };

    const fetchLikedTracks = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/history/liked/${user.id}`);
            if (response.ok) {
                const data = await response.json();
                setLikedTracks(data);
            }
        } catch (error) {
            console.error('Error fetching liked tracks:', error);
        } finally {
            setLoading(false);
        }
    };

    const createPlaylist = async () => {
        if (!newPlaylistName.trim()) return;

        try {
            const response = await fetch(`${API_BASE_URL}/playlists`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newPlaylistName,
                    description: newPlaylistDescription,
                    user_id: user.id,
                    is_public: false
                })
            });

            if (response.ok) {
                const newPlaylist = await response.json();
                setPlaylists([newPlaylist, ...playlists]);
                setShowCreateModal(false);
                setNewPlaylistName('');
                setNewPlaylistDescription('');
            }
        } catch (error) {
            console.error('Error creating playlist:', error);
        }
    };

    const deletePlaylist = async (id) => {
        if (!confirm('Are you sure you want to delete this playlist?')) return;

        try {
            const response = await fetch(`${API_BASE_URL}/playlists/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setPlaylists(playlists.filter(p => p.id !== id));
            }
        } catch (error) {
            console.error('Error deleting playlist:', error);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white flex items-center justify-center pb-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ListMusic className="w-12 h-12 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Your Library</h2>
                    <p className="text-gray-400 mb-6 max-w-md">
                        Sign in to create playlists, save your favorite tracks, and access your music library from anywhere.
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-semibold"
                    >
                        Sign In
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white pb-32">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob" />
                <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-2000" />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-30 border-b border-white/10 backdrop-blur-xl bg-black/40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between"
                    >
                        <div>
                            <h1 className="text-3xl font-bold">Your Library</h1>
                            <p className="text-gray-400 text-sm mt-1">
                                {playlists.length} playlists • {likedTracks.length} liked songs
                            </p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-semibold shadow-lg"
                        >
                            <Plus className="w-5 h-5" />
                            Create Playlist
                        </motion.button>
                    </motion.div>

                    {/* Tabs */}
                    <div className="flex gap-2 mt-6">
                        {['playlists', 'liked'].map((tab) => (
                            <motion.button
                                key={tab}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setActiveTab(tab)}
                                className={`px-5 py-2 rounded-full font-medium capitalize transition-all ${activeTab === tab
                                    ? 'bg-white text-black'
                                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                    }`}
                            >
                                {tab === 'liked' ? 'Liked Songs' : tab}
                            </motion.button>
                        ))}
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-square bg-white/5 rounded-2xl mb-4" />
                                <div className="h-4 bg-white/5 rounded w-3/4 mb-2" />
                                <div className="h-3 bg-white/5 rounded w-1/2" />
                            </div>
                        ))}
                    </div>
                ) : activeTab === 'playlists' ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {playlists.length === 0 ? (
                            <div className="col-span-full text-center py-16">
                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <ListMusic className="w-10 h-10 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">No playlists yet</h3>
                                <p className="text-gray-400 mb-4">Create your first playlist to get started</p>
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="text-purple-400 hover:text-purple-300"
                                >
                                    Create Playlist
                                </button>
                            </div>
                        ) : (
                            playlists.map((playlist, index) => (
                                <motion.div
                                    key={playlist.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ scale: 1.03 }}
                                    className="group cursor-pointer"
                                    onClick={() => navigate(`/playlist/${playlist.id}`)}
                                >
                                    <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-purple-600/30 to-pink-600/30 shadow-lg">
                                        {playlist.image_url ? (
                                            <img
                                                src={playlist.image_url}
                                                alt={playlist.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Music2 className="w-16 h-16 text-white/50" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <motion.button
                                            className="absolute bottom-3 right-3 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all"
                                        >
                                            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                                        </motion.button>
                                        {!playlist.is_public && (
                                            <div className="absolute top-3 left-3 p-1.5 bg-black/50 rounded-full">
                                                <Lock className="w-3 h-3 text-white" />
                                            </div>
                                        )}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deletePlaylist(playlist.id);
                                            }}
                                            className="absolute top-3 right-3 p-2 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/50"
                                        >
                                            <Trash2 className="w-4 h-4 text-white" />
                                        </button>
                                    </div>
                                    <h3 className="font-semibold truncate group-hover:text-purple-400 transition-colors">
                                        {playlist.name}
                                    </h3>
                                    <p className="text-sm text-gray-400 truncate">
                                        {playlist.track_count || 0} tracks
                                    </p>
                                </motion.div>
                            ))
                        )}
                    </div>
                ) : (
                    /* Liked Songs Tab */
                    <div className="space-y-2">
                        {likedTracks.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="w-20 h-20 bg-pink-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Music2 className="w-10 h-10 text-pink-400" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">No liked songs yet</h3>
                                <p className="text-gray-400">Songs you like will appear here</p>
                            </div>
                        ) : (
                            likedTracks.map((track, index) => (
                                <motion.div
                                    key={track.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                    whileHover={{ scale: 1.01 }}
                                    onClick={() => playTrack(track, likedTracks)}
                                    className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all group ${currentTrack?.id === track.id
                                        ? 'bg-purple-500/20 border border-purple-500/30'
                                        : 'bg-white/5 hover:bg-white/10'
                                        }`}
                                >
                                    <span className="w-6 text-center text-sm text-gray-500 group-hover:hidden">
                                        {index + 1}
                                    </span>
                                    <span className="w-6 text-center hidden group-hover:block">
                                        {currentTrack?.id === track.id && isPlaying ? (
                                            <Pause className="w-4 h-4 text-purple-400" />
                                        ) : (
                                            <Play className="w-4 h-4 text-white fill-white" />
                                        )}
                                    </span>
                                    <img
                                        src={track.image_url}
                                        alt={track.title}
                                        className="w-12 h-12 rounded-lg object-cover"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h4 className={`font-medium truncate ${currentTrack?.id === track.id ? 'text-purple-400' : ''
                                            }`}>
                                            {track.title}
                                        </h4>
                                        <p className="text-sm text-gray-400 truncate">{track.artist}</p>
                                    </div>
                                    <span className="text-sm text-gray-500">{track.genre}</span>
                                    <span className="text-sm text-gray-500 hidden md:block">
                                        {formatDate(track.liked_at)}
                                    </span>
                                </motion.div>
                            ))
                        )}
                    </div>
                )}
            </main>

            {/* Create Playlist Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                        onClick={() => setShowCreateModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-md"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold">Create Playlist</h3>
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="p-2 hover:bg-white/10 rounded-lg"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <input
                                type="text"
                                placeholder="Playlist name"
                                value={newPlaylistName}
                                onChange={(e) => setNewPlaylistName(e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 mb-4 focus:outline-none focus:border-purple-500/50"
                            />
                            <textarea
                                placeholder="Description (optional)"
                                value={newPlaylistDescription}
                                onChange={(e) => setNewPlaylistDescription(e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 mb-6 focus:outline-none focus:border-purple-500/50 resize-none h-24"
                            />
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 py-3 bg-white/10 rounded-xl font-medium hover:bg-white/20"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={createPlaylist}
                                    disabled={!newPlaylistName.trim()}
                                    className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold disabled:opacity-50"
                                >
                                    Create
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Library;
