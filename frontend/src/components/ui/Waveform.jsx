import React, { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Waveform Component
 *
 * Displays an animated SVG-based waveform visualization that responds to audio playback.
 * This is a vector-based approach using animated waves that scale with audio activity.
 *
 * Props:
 * - isPlaying: Whether audio is currently playing
 * - audioRef: Reference to HTMLAudioElement for analyzing playback
 * - barCount: Number of bars in the waveform (default: 40)
 * - height: Height of the waveform in pixels (default: 100)
 * - colorScheme: Color scheme for the waveform ('spotify', 'purple', 'blue', 'rainbow')
 */

const colorSchemes = {
    spotify: {
        stops: [
            { offset: '0%', color: '#1DB954', opacity: 1 },
            { offset: '50%', color: '#1ed760', opacity: 0.8 },
            { offset: '100%', color: '#169c46', opacity: 0.6 },
        ],
    },
    purple: {
        stops: [
            { offset: '0%', color: '#a855f7', opacity: 1 },
            { offset: '50%', color: '#8b5cf6', opacity: 0.8 },
            { offset: '100%', color: '#6366f1', opacity: 0.6 },
        ],
    },
    blue: {
        stops: [
            { offset: '0%', color: '#60a5fa', opacity: 1 },
            { offset: '50%', color: '#3b82f6', opacity: 0.8 },
            { offset: '100%', color: '#1e40af', opacity: 0.6 },
        ],
    },
    rainbow: {
        stops: [
            { offset: '0%', color: '#f43f5e', opacity: 1 },
            { offset: '25%', color: '#f97316', opacity: 0.9 },
            { offset: '50%', color: '#fbbf24', opacity: 0.8 },
            { offset: '75%', color: '#22c55e', opacity: 0.7 },
            { offset: '100%', color: '#3b82f6', opacity: 0.6 },
        ],
    },
    pink: {
        stops: [
            { offset: '0%', color: '#ec4899', opacity: 1 },
            { offset: '50%', color: '#db2777', opacity: 0.8 },
            { offset: '100%', color: '#be185d', opacity: 0.6 },
        ],
    },
};

export const Waveform = ({
    isPlaying,
    audioRef,
    barCount = 40,
    height = 100,
    className = '',
    colorScheme = 'spotify',
}) => {
    const [bars, setBars] = useState(Array(barCount).fill(0.3));
    const animationFrameRef = useRef(null);
    const analyserRef = useRef(null);
    const audioContextRef = useRef(null);
    const sourceRef = useRef(null);
    const gradientId = useRef(`waveGradient-${Math.random().toString(36).substring(7)}`);

    // Initialize Web Audio API on demand when playing
    const initializeAudioContext = useCallback(() => {
        if (!audioRef?.current || audioContextRef.current) return;

        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const audioContext = new AudioContext();
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;

            // Create source from audio element
            const source = audioContext.createMediaElementSource(audioRef.current);

            // Connect chain: source → analyser → destination
            source.connect(analyser);
            analyser.connect(audioContext.destination);

            audioContextRef.current = audioContext;
            analyserRef.current = analyser;
            sourceRef.current = source;
        } catch (err) {
            console.warn('Failed to initialize Web Audio API:', err);
        }
    }, [audioRef]);

    // Initialize when playing starts (user gesture)
    useEffect(() => {
        if (isPlaying) {
            initializeAudioContext();
        }
    }, [isPlaying, initializeAudioContext]);

    // Animate waveform bars only when playing
    useEffect(() => {
        // When not playing, reset bars to idle state
        if (!isPlaying) {
            setBars(prevBars => prevBars.map(() => 0.3));
            return;
        }

        // Only animate when actually playing AND analyser is initialized
        if (!analyserRef.current) {
            // Generate random animation when no audio context
            const animate = () => {
                if (!isPlaying) return;

                const newBars = Array(barCount)
                    .fill(0)
                    .map(() => Math.random() * 0.7 + 0.3);
                setBars(newBars);

                animationFrameRef.current = requestAnimationFrame(animate);
            };

            const intervalId = setInterval(() => {
                if (isPlaying) {
                    setBars(Array(barCount).fill(0).map(() => Math.random() * 0.7 + 0.3));
                }
            }, 100);

            return () => clearInterval(intervalId);
        }

        const animate = () => {
            if (!analyserRef.current || !isPlaying) return;

            try {
                const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
                analyserRef.current.getByteFrequencyData(dataArray);

                // Only update if we have actual frequency data
                const hasAudioData = dataArray.some(val => val > 10);

                if (hasAudioData) {
                    const newBars = Array(barCount)
                        .fill(0)
                        .map((_, i) => {
                            const index = Math.floor((i / barCount) * dataArray.length);
                            const value = dataArray[index] / 255;
                            return Math.min(1, value + 0.3);
                        });
                    setBars(newBars);
                }
            } catch (err) {
                console.warn('Error analyzing audio:', err);
            }

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animationFrameRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationFrameRef.current !== null) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isPlaying, barCount]);

    const barWidth = 100 / barCount;
    const centerY = height / 2;
    const scheme = colorSchemes[colorScheme] || colorSchemes.spotify;

    return (
        <svg
            className={`w-full ${className}`}
            height={height}
            viewBox={`0 0 100 ${height}`}
            preserveAspectRatio="none"
        >
            {/* Animated bars */}
            {bars.map((bar, i) => {
                const barHeight = bar * (height / 2);
                const x = i * barWidth + barWidth / 4;

                return (
                    <g key={i}>
                        {/* Top bar */}
                        <rect
                            x={x}
                            y={centerY - barHeight}
                            width={barWidth / 2}
                            height={barHeight}
                            fill={`url(#${gradientId.current})`}
                            opacity={0.8}
                            rx={1}
                            style={{
                                transition: 'height 0.08s ease-out, y 0.08s ease-out',
                            }}
                        />
                        {/* Bottom bar (mirror) */}
                        <rect
                            x={x}
                            y={centerY}
                            width={barWidth / 2}
                            height={barHeight}
                            fill={`url(#${gradientId.current})`}
                            opacity={0.8}
                            rx={1}
                            style={{
                                transition: 'height 0.08s ease-out',
                            }}
                        />
                    </g>
                );
            })}

            {/* Gradient definitions */}
            <defs>
                <linearGradient id={gradientId.current} x1="0%" y1="0%" x2="0%" y2="100%">
                    {scheme.stops.map((stop, i) => (
                        <stop
                            key={i}
                            offset={stop.offset}
                            stopColor={stop.color}
                            stopOpacity={stop.opacity}
                        />
                    ))}
                </linearGradient>
            </defs>
        </svg>
    );
};

export default Waveform;
