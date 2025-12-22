import { motion } from 'framer-motion';
import { Play, Pause, Heart } from 'lucide-react';
import { useState } from 'react';

const TrackCard = ({ track, index, onPlay, isPlaying }) => {
    const [isLiked, setIsLiked] = useState(false);

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10"
        >
            {/* Cover Image */}
            <div className="relative aspect-square overflow-hidden">
                <img
                    src={track.image_url || 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=500'}
                    alt={track.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Play Button */}
                <motion.button
                    onClick={(e) => { e.stopPropagation(); onPlay(track); }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute bottom-4 right-4 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                >
                    {isPlaying ? (
                        <Pause className="w-5 h-5 text-white fill-white" />
                    ) : (
                        <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                    )}
                </motion.button>

                {/* Like Button */}
                <motion.button
                    onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                    <Heart
                        className={`w-6 h-6 transition-colors ${isLiked ? 'text-pink-500 fill-pink-500' : 'text-white/70 hover:text-pink-400'}`}
                    />
                </motion.button>
            </div>

            {/* Track Info */}
            <div className="p-4">
                <h3 className="font-semibold text-white truncate mb-1 group-hover:text-purple-300 transition-colors">
                    {track.title}
                </h3>
                <p className="text-sm text-gray-400 truncate mb-2">
                    {track.artist}
                </p>
                <div className="flex items-center justify-between">
                    <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full">
                        {track.genre || 'Music'}
                    </span>
                    <span className="text-xs text-gray-500">
                        {formatDuration(track.duration || 0)}
                    </span>
                </div>
            </div>

            {/* Glow Effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-purple-500/5 group-hover:via-transparent group-hover:to-pink-500/5 transition-all duration-500 pointer-events-none" />
        </motion.div>
    );
};

export default TrackCard;
