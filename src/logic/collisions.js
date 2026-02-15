import { PHYSICS } from './physics';

/**
 * Prüft auf Kollisionen zwischen Vogel und Welt.
 * @param {Object} bird - { y, radius }
 * @param {Array} pipes - Liste der Rohre
 * @param {number} canvasHeight - Höhe des Canvas
 * @returns {boolean} True, wenn eine Kollision vorliegt.
 */
export const checkCollision = (bird, pipes, canvasHeight) => {
    const birdRadius = 15; // Visueller Radius des Vogels
    const birdX = PHYSICS.BIRD_X;
    const birdY = bird.y;

    // 1. Kollision mit Boden oder Decke
    if (birdY + birdRadius > canvasHeight - PHYSICS.GROUND_HEIGHT || birdY - birdRadius < 0) {
        return true;
    }

    // 2. Kollision mit Rohren
    for (const pipe of pipes) {
        const pipeWidth = 60;

        // Prüfe ob der Vogel horizontal im Bereich des Rohrs ist
        if (birdX + birdRadius > pipe.x && birdX - birdRadius < pipe.x + pipeWidth) {
            // Prüfe ob der Vogel vertikal gegen das obere oder untere Rohr stößt
            if (birdY - birdRadius < pipe.topHeight || birdY + birdRadius > pipe.topHeight + PHYSICS.PIPE_GAP) {
                return true;
            }
        }
    }

    return false;
};
