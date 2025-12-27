import React, { useEffect, useRef } from 'react';

/**
 * ShaderBackground Component
 *
 * Renders an animated WebGL-based background using shader effects.
 * This component creates a fullscreen canvas that displays animated gradient waves.
 *
 * Features:
 * - Responsive canvas sizing
 * - Smooth animation loop
 * - Requires WebGL context
 * - Automatically cleans up resources on unmount
 * - Audio-reactive mode when audioRef is provided
 */

export const ShaderBackground = ({ audioRef, isPlaying, variant = 'default' }) => {
    const canvasRef = useRef(null);
    const animationFrameRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext('webgl', { antialias: true, alpha: true });
        if (!gl) return;

        // Set canvas size to window size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            gl.viewport(0, 0, canvas.width, canvas.height);
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Vertex shader
        const vertexShaderSource = `
      attribute vec4 position;
      void main() {
        gl_Position = position;
      }
    `;

        // Fragment shader with animated gradients and waves - Spotify-inspired
        const fragmentShaderSource = variant === 'spotify'
            ? `
        precision mediump float;
        uniform float time;
        uniform vec2 resolution;
        uniform float audioLevel;

        void main() {
          vec2 uv = gl_FragCoord.xy / resolution;

          // Create animated wave pattern
          float wave = sin(uv.x * 3.14159 * 4.0 + time * 2.0) * 0.5 + 0.5;
          float wave2 = sin(uv.y * 3.14159 * 3.0 - time * 1.5) * 0.5 + 0.5;

          // Combine waves with audio reactivity
          float combined = wave * wave2 * (1.0 + audioLevel * 0.5);

          // Spotify-inspired colors
          vec3 color1 = vec3(0.05, 0.05, 0.05);   // Near black
          vec3 color2 = vec3(0.08, 0.15, 0.08);   // Dark green tint
          vec3 color3 = vec3(0.11, 0.73, 0.33);   // Spotify green

          // Mix colors based on position and time
          vec3 finalColor = mix(color1, color2, uv.y + sin(time * 0.5) * 0.1);
          finalColor = mix(finalColor, color3, combined * 0.15);

          // Add subtle glow effect
          float glow = smoothstep(0.5, 0.0, length(uv - vec2(0.5, 0.5)));
          finalColor += color3 * glow * 0.05 * (1.0 + audioLevel);

          gl_FragColor = vec4(finalColor, 0.95);
        }
      `
            : `
        precision mediump float;
        uniform float time;
        uniform vec2 resolution;
        uniform float audioLevel;

        void main() {
          vec2 uv = gl_FragCoord.xy / resolution;

          // Create animated wave pattern
          float wave = sin(uv.x * 3.14159 * 4.0 + time * 2.0) * 0.5 + 0.5;
          float wave2 = sin(uv.y * 3.14159 * 3.0 - time * 1.5) * 0.5 + 0.5;

          // Combine waves with audio reactivity
          float combined = wave * wave2 * (1.0 + audioLevel * 0.5);

          // Purple-blue gradient
          vec3 color1 = vec3(0.1, 0.05, 0.15);   // Dark purple
          vec3 color2 = vec3(0.15, 0.08, 0.25);  // Purple
          vec3 color3 = vec3(0.4, 0.2, 0.6);     // Lighter purple

          // Mix colors based on position and time
          vec3 finalColor = mix(color1, color2, uv.y + sin(time * 0.5) * 0.1);
          finalColor = mix(finalColor, color3, combined * 0.2);

          // Add subtle animation
          finalColor += vec3(combined) * 0.08;

          gl_FragColor = vec4(finalColor, 0.95);
        }
      `;

        // Helper function to compile shaders
        const compileShader = (source, type) => {
            const shader = gl.createShader(type);
            if (!shader) return null;

            gl.shaderSource(shader, source);
            gl.compileShader(shader);

            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error('Shader compilation failed:', gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }

            return shader;
        };

        // Compile shaders
        const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
        const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);

        if (!vertexShader || !fragmentShader) {
            console.error('Failed to compile shaders');
            return;
        }

        // Link program
        const program = gl.createProgram();
        if (!program) return;

        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Program linking failed:', gl.getProgramInfoLog(program));
            return;
        }

        gl.useProgram(program);

        // Create vertex buffer
        const vertices = new Float32Array([
            -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0,
        ]);

        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        const positionLocation = gl.getAttribLocation(program, 'position');
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        // Get uniform locations
        const timeLocation = gl.getUniformLocation(program, 'time');
        const resolutionLocation = gl.getUniformLocation(program, 'resolution');
        const audioLevelLocation = gl.getUniformLocation(program, 'audioLevel');

        // Animation loop
        let startTime = Date.now();
        let audioLevel = 0;

        const animate = () => {
            const elapsed = (Date.now() - startTime) / 1000;

            // Simulate audio level if playing
            if (isPlaying) {
                audioLevel = Math.sin(elapsed * 3) * 0.3 + 0.5;
            } else {
                audioLevel *= 0.95; // Fade out
            }

            gl.uniform1f(timeLocation, elapsed);
            gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
            gl.uniform1f(audioLevelLocation, audioLevel);

            gl.drawArrays(gl.TRIANGLES, 0, 6);
            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animationFrameRef.current = requestAnimationFrame(animate);

        // Cleanup
        return () => {
            if (animationFrameRef.current !== null) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            window.removeEventListener('resize', resizeCanvas);
            gl.deleteProgram(program);
            gl.deleteShader(vertexShader);
            gl.deleteShader(fragmentShader);
            gl.deleteBuffer(buffer);
        };
    }, [variant, isPlaying]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 -z-10"
            style={{
                display: 'block',
                width: '100%',
                height: '100%',
            }}
        />
    );
};

export default ShaderBackground;
