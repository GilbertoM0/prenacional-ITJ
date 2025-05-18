// Funciones relacionadas con partidos

/**
 * Obtiene todos los partidos desde la API.
 * @returns {Promise<Array>} Lista de partidos o [] si hay error.
 */
async function fetchPartidos() {
    try {
        const response = await fetch(`${API_BASE_URL}/partidos`);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        return response.json();
    } catch (error) {
        console.error('Error obteniendo partidos:', error);
        return [];
    }
}
