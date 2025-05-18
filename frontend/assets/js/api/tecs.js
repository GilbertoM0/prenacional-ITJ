// Funciones relacionadas con tecs (tecnológicos)

/**
 * Obtiene todos los tecs desde la API.
 * @returns {Promise<Array>} Lista de tecs o [] si hay error.
 */
async function fetchTecs() {
    try {
        const response = await fetch(`${API_BASE_URL}/tecs`);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        return response.json();
    } catch (error) {
        console.error('Error obteniendo tecs:', error);
        return [];
    }
}

/**
 * Obtiene un tec por ID.
 * @param {number|string} ID
 * @returns {Promise<Object|null>} Tec encontrado o null.
 */
async function getTecCityByID(ID) {
    try {
        const tecs = await fetchTecs();
        return tecs.find(t => t.id_tecs == ID) || null;
    } catch (error) {
        console.error('Error obteniendo tecs:', error);
        return null;
    }
}

/**
 * Obtiene todos los tecs (alias).
 * @returns {Promise<Array>} Lista de tecs.
 */
async function getTecs() {
    try {
        const tecs = await fetchTecs();
        return tecs;
    } catch (error) {
        console.error('Error obteniendo tecnologicos:', error);
        return [];
    }
}
