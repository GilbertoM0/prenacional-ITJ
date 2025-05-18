// Funciones relacionadas con canchas

/**
 * Obtiene todas las canchas desde la API.
 * @returns {Promise<Array>} Lista de canchas o [] si hay error.
 */
async function fetchCancha() {
    try {
        const response = await fetch(`${API_BASE_URL}/cancha`);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        return response.json();
    } catch (error) {
        console.error('Error obteniendo cancha:', error);
        return [];
    }
}
