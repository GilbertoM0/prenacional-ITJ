// Funciones relacionadas con grupos

/**
 * Obtiene todos los grupos desde la API.
 * @returns {Promise<Array>} Lista de grupos o [] si hay error.
 */
async function fetchGroups() {
    try {
        const response = await fetch(`${API_BASE_URL}/grupos`);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        return response.json();
    } catch (error) {
        console.error('Error obteniendo grupos:', error);
        return [];
    }
}

/**
 * Crea un grupo en la base de datos.
 * @param {Object} groupData
 * @returns {Promise<Object>} Respuesta de la API.
 */
async function createGroup(groupData) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/grupos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(groupData)
        });
        return response.json();
    } catch (error) {
        console.error('Error en createGroup:', error);
        return { success: false, message: 'Error de conexión con el servidor' };
    }
}

/**
 * Modifica un grupo existente.
 * @param {Object} groupData
 * @param {number|string} ID
 * @returns {Promise<Object>} Respuesta de la API.
 */
async function modifyGroup(groupData, ID) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/grupos/${ID}?`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(groupData)
        });
        return response.json();
    } catch (error) {
        console.error('Error en modifyGroup:', error);
        return { success: false, message: 'Error de conexión con el servidor' };
    }
}

/**
 * Elimina un grupo por ID.
 * @param {number|string} ID
 * @returns {Promise<Object>} Respuesta de la API.
 */
async function deleteGroup(ID) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/grupos/${ID}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
        return response.json();
    } catch (error) {
        console.error('Error en deleteGroup:', error);
        return { success: false, message: 'Error de conexión con el servidor' };
    }
}

/**
 * Obtiene un grupo por ID.
 * @param {number|string} ID
 * @returns {Promise<Object|null>} Grupo encontrado o null.
 */
async function getGroupByID(ID) {
    try {
        const grupos = await fetchGroups();
        return grupos.find(g => g.id_grupo == ID) || null;
    } catch (error) {
        console.error('Error obteniendo grupos:', error);
        return null;
    }
}

/**
 * Obtiene grupos por disciplina ID.
 * @param {number|string} ID
 * @returns {Promise<Array>} Lista de grupos.
 */
async function getGroupsByDiscID(ID) {
    try {
        const grupos = await fetchGroups();
        return grupos.filter(g => g.disciplinaid == ID);
    } catch (error) {
        console.error('Error obteniendo grupos:', error);
        return [];
    }
}

/**
 * Obtiene grupos por array de disciplina IDs.
 * @param {Array<number>} ids
 * @returns {Promise<Array>} Lista de grupos.
 */
async function getGroupsByDiscipline(ids) {
    try {
        const grupos = await fetchGroups();
        return grupos.filter(g => ids.includes(g.disciplinaid));
    } catch (error) {
        console.error('Error obteniendo grupos:', error);
        return [];
    }
}

/**
 * Obtiene un grupo por nombre y categoría.
 * @param {string} name
 * @param {string} category
 * @returns {Promise<Object|null>} Grupo encontrado o null.
 */
async function getGroupByNC(name, category) {
    try {
        const [grupos, disciplines] = await Promise.all([
            fetchGroups(),
            fetchDisciplines()
        ]);
        const disciplina = disciplines.find(d => d.nombre === disciplineName && d.categoria === category);
        if (!disciplina) return null;
        const nombreBuscado = `Grupo ${name}`;
        const grupo = grupos.find(g => g.nombre === nombreBuscado && g.disciplinaid === disciplina.id_diciplinas);
        return grupo || null;
    } catch (error) {
        console.error('Error obteniendo grupos:', error);
        return null;
    }
}

/**
 * Obtiene un grupo por nombre.
 * @param {string} name
 * @returns {Promise<Object|string>} Grupo encontrado o "".
 */
async function getGroupByName(name) {
    try {
        const grupos = await fetchGroups();
        const nombre = "Grupo " + name;
        return grupos.find(g => g.nombre == nombre) || "";
    } catch (error) {
        console.error('Error obteniendo grupos:', error);
        return null;
    }
}
