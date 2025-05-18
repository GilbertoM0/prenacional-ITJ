// Funciones relacionadas con disciplinas

/**
 * Obtiene todas las disciplinas desde la API.
 * @returns {Promise<Array>} Lista de disciplinas o [] si hay error.
 */
async function fetchDisciplines() {
    try {
        const response = await fetch(`${API_BASE_URL}/disciplinas`);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        return response.json();
    } catch (error) {
        console.error('Error obteniendo disciplinas:', error);
        return [];
    }
}

/**
 * Obtiene una disciplina por ID.
 * @param {number|string} ID
 * @returns {Promise<Object|null>} Disciplina encontrada o null.
 */
async function getDisciplineByID(ID) {
    try {
        const disciplines = await fetchDisciplines();
        return disciplines.find(d => d.id_diciplinas === ID) || null;
    } catch (error) {
        console.error('Error obteniendo disciplina:', error);
        return null;
    }
}

/**
 * Obtiene el ID de una disciplina por categoría.
 * @param {string} category
 * @returns {Promise<number|null>} ID de la disciplina o null.
 */
async function getDisciplineId(category) {
    try {
        const disciplines = await fetchDisciplines();
        const discipline = disciplines.find(d => 
            d.nombre === disciplineName && 
            d.categoria.toLowerCase() === category
        );
        return discipline?.id_diciplinas || null;
    } catch (error) {
        console.error('Error obteniendo disciplina:', error);
        return null;
    }
}

/**
 * Obtiene disciplinas por nombre global disciplineName.
 * @returns {Promise<Array>} Lista de disciplinas.
 */
async function getDisciplineByName() {
    try {
        const disciplines = await fetchDisciplines();
        return disciplines.filter(d => d.nombre === disciplineName);
    } catch (error) {
        console.error('Error obteniendo disciplinas:', error);
        return [];
    }
}
