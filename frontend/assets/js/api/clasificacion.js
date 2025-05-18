// Funciones relacionadas con clasificación

/**
 * Obtiene toda la clasificación desde la API.
 * @returns {Promise<Array>} Lista de clasificación o [] si hay error.
 */
async function fetchClasificacion() {
    try {
        const response = await fetch(`${API_BASE_URL}/clasificacion`);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        return response.json();
    } catch (error) {
        console.error('Error obteniendo clasificacion:', error);
        return [];
    }
}
