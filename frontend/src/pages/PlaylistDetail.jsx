import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext';
import {
    ArrowLeft,
    Play,
    Pause,
    Shuffle,
    MoreHorizontal,
    Clock,
    Music2,
    Trash2,
    Edit3,
    Share2,
    Heart,
    Plus,
    GripVertical
} from 'lucide-react';
import { API_BASE_URL } from '../config/api';

const PlaylistDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { playTrack, currentTrack, isPlaying, togglePlay, toggleShuffle, isShuffled } = usePlayer();
    const [playlist, setPlaylist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [editDescription, setEditDescription] = useState('');

    useEffect(() => {
        fetchPlaylist();
    }, [id]);

    const fetchPlaylist = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/playlists/${id}`);
            if (!response.ok) throw new Error('Playlist not found');
            const data = await response.json();
            setPlaylist(data);
            setEditName(data.name);
            setEditDescription(data.description || '');
        } catch (error) {
            console.error('Error fetching playlist:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePlayAll = () => {
        if (playlist?.tracks?.length > 0) {
            playTrack(playlist.tracks[0], playlist.tracks);
        }
    };

    const handleRemoveTrack = async (trackId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/playlists/${id}/tracks/${trackId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setPlaylist(prev => ({
                    ...prev,
                    tracks: prev.tracks.filter(t => t.id !== trackId)
                }));
            }
        } catch (error) {
            console.error('Error removing track:', error);
        }
    };

    const handleUpdatePlaylist = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/playlists/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: editName,
                    description: editDescription
                })
            });
            if (response.ok) {
                setPlaylist(prev => ({ ...prev, name: editName, description: editDescription }));
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Error updating playlist:', error);
        }
    };

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const totalDuration = playlist?.tracks?.reduce((acc, t) => acc + (t.duration || 0), 0) || 0;
    const totalMins = Math.floor(totalDuration / 60);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white pb-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                    <div className="animate-pulse">
                        <div className="h-8 w-32 bg-white/5 rounded-lg mb-8" />
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="w-64 h-64 bg-white/5 rounded-2xl" />
                            <div className="flex-1 space-y-4">
                                <div className="h-8 bg-white/5 rounded w-1/2" />
                                <div className="h-4 bg-white/5 rounded w-1/4" />
                                <div className="h-12 bg-white/5 rounded w-40" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!playlist) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white flex items-center justify-center pb-32">
                <div className="text-center">
                    <Music2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Playlist not found</h2>
                    <button
                        onClick={() => navigate('/library')}
                        className="text-purple-400 hover:text-purple-300"
                    >
                        Go to Library
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white pb-32">
            {/* Gradient background based on playlist */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15" />
                <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10" />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-30 border-b border-white/10 backdrop-blur-xl bg-black/40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => navigate('/library')}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back to Library</span>
                    </motion.button>
                </div>
            </header>

            {/* Playlist Info */}
            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row gap-8 mb-8"
                >
                    {/* Cover */}
                    <div className="flex-shrink-0">
                        <div className="w-56 h-56 md:w-64 md:h-64 rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-purple-600/30 to-pink-600/30">
                            {playlist.image_url ? (
                                <img
                                    src={playlist.image_url}
                                    alt={playlist.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Music2 className="w-20 h-20 text-white/30" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-end">
                        <p className="text-sm text-gray-400 uppercase tracking-wider mb-2">Playlist</p>

                        {isEditing ? (
                            <div className="space-y-3 mb-4">
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="text-4xl font-bold bg-transparent border-b-2 border-purple-500 focus:outline-none w-full"
                                />
                                <textarea
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    placeholder="Add a description..."
                                    className="text-gray-400 bg-transparent border-b border-white/10 focus:outline-none w-full resize-none"
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleUpdatePlaylist}
                                        className="px-4 py-2 bg-purple-500 rounded-lg text-sm font-medium"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 bg-white/10 rounded-lg text-sm"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h1 className="text-4xl md:text-5xl font-bold mb-2">{playlist.name}</h1>
                                {playlist.description && (
                                    <p className="text-gray-400 mb-4">{playlist.description}</p>
                                )}
                            </>
                        )}

                        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                            <span>{playlist.tracks?.length || 0} songs</span>
                            <span>•</span>
                            <span>{totalMins} min</span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handlePlayAll}
                                disabled={!playlist.tracks?.length}
                                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-semibold shadow-lg disabled:opacity-50"
                            >
                                <Play className="w-5 h-5 fill-white" />
                                Play
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={toggleShuffle}
                                className={`p-3 rounded-full border transition-all ${isShuffled
                                    ? 'border-purple-500 text-purple-400 bg-purple-500/20'
                                    : 'border-white/20 text-gray-400 hover:text-white'
                                    }`}
                            >
                                <Shuffle className="w-5 h-5" />
                            </motion.button>

                            {user?.id === playlist.user_id && (
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setIsEditing(true)}
                                    className="p-3 rounded-full border border-white/20 text-gray-400 hover:text-white transition-colors"
                                >
                                    <Edit3 className="w-5 h-5" />
                                </motion.button>
                            )}

                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-3 rounded-full border border-white/20 text-gray-400 hover:text-white transition-colors"
                            >
                                <Share2 className="w-5 h-5" />
                            </motion.button>
                        </div>
                    </div>
                </motion.section>

                {/* Tracks List */}
                <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {/* Header */}
                    <div className="hidden md:flex items-center gap-4 px-4 py-3 text-sm text-gray-400 border-b border-white/5 mb-2">
                        <span className="w-8 text-center">#</span>
                        <span className="flex-1">Title</span>
                        <span className="w-32">Album</span>
                        <span className="w-24 text-right">
                            <Clock className="w-4 h-4 inline" />
                        </span>
                        <span className="w-12"></span>
                    </div>

                    {/* Tracks */}
                    <div className="space-y-1">
                        {playlist.tracks?.length === 0 ? (
                            <div className="text-center py-16">
                                <Music2 className="w-16 h-16 text-gray-400/50 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold mb-2">No tracks yet</h3>
                                <p className="text-gray-400 mb-4">Add some music to get started</p>
                                <button
                                    onClick={() => navigate('/search')}
                                    className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300"
                                >
                                    <Plus className="w-4 h-4" />
                                    Find tracks
                                </button>
                            </div>
                        ) : (
                            playlist.tracks.map((track, index) => (
                                <motion.div
                                    key={track.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                                    className={`flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer group ${currentTrack?.id === track.id ? 'bg-purple-500/20' : ''
                                        }`}
                                    onClick={() => playTrack(track, playlist.tracks)}
                                >
                                    <span className="w-8 text-center text-sm text-gray-400 group-hover:hidden">
                                        {index + 1}
                                    </span>
                                    <span className="w-8 text-center hidden group-hover:block">
                                        {currentTrack?.id === track.id && isPlaying ? (
                                            <Pause className="w-4 h-4 text-white fill-white mx-auto" />
                                        ) : (
                                            <Play className="w-4 h-4 text-white fill-white mx-auto" />
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

                                    <span className="w-32 text-sm text-gray-400 hidden md:block truncate">
                                        {track.album || track.genre}
                                    </span>

                                    <span className="w-24 text-sm text-gray-400 text-right hidden md:block">
                                        {formatDuration(track.duration)}
                                    </span>

                                    <div className="w-12 flex justify-end">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveTrack(track.id);
                                            }}
                                            className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 rounded-lg transition-all"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-400" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </motion.section>
            </main>
        </div>
    );
};

export default PlaylistDetail;
