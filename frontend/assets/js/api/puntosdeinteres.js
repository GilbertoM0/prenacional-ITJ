// Funciones relacionadas con puntos de interés (restaurantes)

/**
 * Obtiene todos los puntos de interés (restaurantes, etc.) desde la API.
 * @returns {Promise<Array>} Lista de puntos de interés o [] si hay error.
 */
async function fetchPuntosDeInteres() {
    try {
        const response = await fetch(`${API_BASE_URL}/puntosdeinteres`);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        return response.json();
    } catch (error) {
        console.error('Error obteniendo puntos de interés:', error);
        return [];
    }
}

/**
 * Alias para compatibilidad con código existente.
 * @deprecated Usa fetchPuntosDeInteres en su lugar.
 */
const fetchRestaurantes = fetchPuntosDeInteres;
