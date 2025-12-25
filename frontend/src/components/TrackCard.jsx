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
            transition={{ delay: index * 0.03, duration: 0.3 }}
            className="group cursor-pointer bg-[#181818] hover:bg-[#282828] rounded-lg p-4 transition-all duration-300"
            onClick={() => onPlay(track)}
        >
            {/* Album Art */}
            <div className="relative aspect-square rounded-md overflow-hidden mb-4 shadow-lg">
                <img
                    src={track.image_url}
                    alt={track.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                />

                {/* Play Button - Spotify Style */}
                <motion.div
                    className={`absolute bottom-2 right-2 w-12 h-12 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${isPlaying
                            ? 'bg-[#1DB954] opacity-100 translate-y-0'
                            : 'bg-[#1DB954] opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0'
                        }`}
                    whileHover={{ scale: 1.06 }}
                >
                    {isPlaying ? (
                        <Pause className="w-5 h-5 text-black fill-black" />
                    ) : (
                        <Play className="w-5 h-5 text-black fill-black ml-0.5" />
                    )}
                </motion.div>

                {/* Like Button */}
                <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsLiked(!isLiked);
                    }}
                    className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${isLiked
                            ? 'bg-[#1DB954]/80 opacity-100'
                            : 'bg-black/60 opacity-0 group-hover:opacity-100'
                        }`}
                >
                    <Heart className={`w-4 h-4 transition-colors ${isLiked ? 'text-white fill-white' : 'text-white'
                        }`} />
                </motion.button>

                {/* Playing Indicator */}
                {isPlaying && (
                    <div className="absolute top-2 left-2 flex items-end gap-0.5 h-4 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                        {[...Array(4)].map((_, i) => (
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
            </div>

            {/* Track Info */}
            <div>
                <h3 className={`font-bold text-sm truncate transition-colors ${isPlaying ? 'text-[#1DB954]' : 'text-white'
                    }`}>
                    {track.title}
                </h3>
                <p className="text-sm text-[#b3b3b3] truncate mt-1">
                    {track.artist}
                </p>
            </div>
        </motion.div>
    );
};

export default TrackCard;
