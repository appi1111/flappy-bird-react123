import React, { useRef, useEffect } from 'react';
import { PHYSICS } from '../logic/physics';

const GameCanvas = ({ bird, pipes, gameState, score }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // 1. Background
        ctx.fillStyle = '#70c5ce';
        ctx.fillRect(0, 0, width, height);

        // 2. Draw Pipes
        pipes.forEach(pipe => {
            ctx.fillStyle = '#228b22'; // Dark Green
            const pipeWidth = 60;

            // Top Pipe
            ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);

            // Bottom Pipe
            const bottomPipeY = pipe.topHeight + PHYSICS.PIPE_GAP;
            const bottomPipeHeight = height - PHYSICS.GROUND_HEIGHT - bottomPipeY;
            ctx.fillRect(pipe.x, bottomPipeY, pipeWidth, bottomPipeHeight);

            // Pipe Caps (Details)
            ctx.fillStyle = '#1e5d1e';
            ctx.fillRect(pipe.x - 2, pipe.topHeight - 20, pipeWidth + 4, 20);
            ctx.fillRect(pipe.x - 2, bottomPipeY, pipeWidth + 4, 20);
        });

        // 3. Draw Ground
        ctx.fillStyle = '#ded895';
        ctx.fillRect(0, height - PHYSICS.GROUND_HEIGHT, width, PHYSICS.GROUND_HEIGHT);
        ctx.strokeStyle = '#73bf2e';
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(0, height - PHYSICS.GROUND_HEIGHT + 5);
        ctx.lineTo(width, height - PHYSICS.GROUND_HEIGHT + 5);
        ctx.stroke();

        // 4. Draw Bird
        ctx.save();
        ctx.translate(PHYSICS.BIRD_X, bird.y);
        // Rotation based on velocity
        const rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, (bird.velocity * 0.1)));
        ctx.rotate(rotation);

        // Bird Body
        ctx.fillStyle = '#f7e018';
        ctx.beginPath();
        ctx.arc(0, 0, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Eye
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(8, -5, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(10, -5, 2, 0, Math.PI * 2);
        ctx.fill();

        // Beak
        ctx.fillStyle = '#f07020';
        ctx.beginPath();
        ctx.moveTo(12, 5);
        ctx.lineTo(22, 0);
        ctx.lineTo(12, -5);
        ctx.closePath();
        ctx.fill();

        ctx.restore();

        // 5. Score Display in Game
        if (gameState === 'PLAYING') {
            ctx.fillStyle = '#fff';
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 3;
            ctx.font = 'bold 40px Arial';
            ctx.textAlign = 'center';
            ctx.strokeText(score, width / 2, 80);
            ctx.fillText(score, width / 2, 80);
        }

    }, [bird, pipes, gameState, score]);

    return (
        <canvas
            ref={canvasRef}
            width={400}
            height={600}
            className="game-canvas"
        />
    );
};

export default GameCanvas;
