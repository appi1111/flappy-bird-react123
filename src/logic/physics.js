/**
 * Konstanten für die Spielphysik
 */
export const PHYSICS = {
    GRAVITY: 0.6,
    JUMP_STRENGTH: -8,
    MAX_VELOCITY: 10,
    PIPE_SPEED: 3,
    PIPE_SPAWN_RATE: 1500, // ms
    PIPE_GAP: 160,
    BIRD_X: 50,
    GROUND_HEIGHT: 100,
};

/**
 * Berechnet die neue Position und Geschwindigkeit des Vogels.
 * @param {Object} bird - Der aktuelle Zustand des Vogels { y, velocity }.
 * @param {number} deltaTime - Zeit seit dem letzten Frame.
 * @returns {Object} Neuer Zustand des Vogels.
 */
export const updateBird = (bird, deltaTime) => {
    // deltaTime Normalisierung (basiert auf ~60fps)
    const factor = deltaTime / (1000 / 60);

    const velocity = Math.min(bird.velocity + PHYSICS.GRAVITY * factor, PHYSICS.MAX_VELOCITY);
    const y = bird.y + velocity * factor;

    return { y, velocity };
};

/**
 * Erzeugt ein neues Hindernis.
 * @param {number} canvasHeight - Die Höhe des Spielfelds.
 * @returns {Object} Neues Hindernis-Objekt.
 */
export const createPipe = (canvasHeight) => {
    const minPipeHeight = 50;
    const maxPipeHeight = canvasHeight - PHYSICS.GROUND_HEIGHT - PHYSICS.PIPE_GAP - minPipeHeight;
    const topHeight = Math.floor(Math.random() * (maxPipeHeight - minPipeHeight + 1)) + minPipeHeight;

    return {
        x: 500, // Startet außerhalb des rechten Rands (wird im Renderer angepasst)
        topHeight,
        passed: false,
    };
};

/**
 * Bewegt die Hindernisse nach links.
 * @param {Array} pipes - Liste der aktuellen Hindernisse.
 * @param {number} deltaTime - Zeit seit dem letzten Frame.
 * @returns {Array} Aktualisierte Hindernisse.
 */
export const updatePipes = (pipes, deltaTime) => {
    const factor = deltaTime / (1000 / 60);
    return pipes
        .map(pipe => ({ ...pipe, x: pipe.x - PHYSICS.PIPE_SPEED * factor }))
        .filter(pipe => pipe.x > -100); // Entferne Rohre, die links aus dem Bild sind
};
