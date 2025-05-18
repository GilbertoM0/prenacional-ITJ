// Funciones relacionadas con roles de juego

/**
 * Obtiene todos los roles de juego desde la API.
 * @returns {Promise<Array>} Lista de roles o [] si hay error.
 */
async function fetchRoles() {
    try {
        const response = await fetch(`${API_BASE_URL}/roldejuegos`);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        return response.json();
    } catch (error) {
        console.error('Error obteniendo partidos:', error);
        return [];
    }
}
