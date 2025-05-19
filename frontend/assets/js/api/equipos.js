// Funciones relacionadas con equipos

/**
 * Obtiene todos los equipos desde la API.
 * @returns {Promise<Array>} Lista de equipos o [] si hay error.
 */
async function fetchTeams() {
    try {
        const response = await fetch(`${API_BASE_URL}/equipo`);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        return response.json();
    } catch (error) {
        console.error('Error obteniendo equipos:', error);
        return [];
    }
}

/**
 * Crea un equipo en la base de datos.
 * @param {Object} teamData
 * @returns {Promise<Object>} Respuesta de la API.
 */
async function createTeam(teamData) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/equipo`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(teamData)
        });
        return response.json();
    } catch (error) {
        console.error('Error en createTeam:', error);
        return { success: false, message: 'Error de conexión con el servidor' };
    }
}

/**
 * Modifica un equipo existente.
 * @param {Object} teamData
 * @param {number|string} ID
 * @returns {Promise<Object>} Respuesta de la API.
 */
async function modifyTeam(teamData, ID) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/equipo/${ID}?`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(teamData)
        });
        return response.json();
    } catch (error) {
        console.error('Error en modifyTeam:', error);
        return { success: false, message: 'Error de conexión con el servidor' };
    }
}

/**
 * Elimina un equipo por ID.
 * @param {number|string} ID
 * @returns {Promise<Object>} Respuesta de la API.
 */
async function deleteTeam(ID) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/equipo/${ID}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
        return response.json();
    } catch (error) {
        console.error('Error en deleteTeam:', error);
        return { success: false, message: 'Error de conexión con el servidor' };
    }
}

/**
 * Obtiene un equipo por ID.
 * @param {number|string} ID
 * @returns {Promise<Object|null>} Equipo encontrado o null.
 */
async function getTeamByID(ID) {
    try {
        const teams = await fetchTeams();
        return teams.find(t => t.id_equipo == ID) || null;
    } catch (error) {
        console.error('Error obteniendo equipos:', error);
        return null;
    }
}

/**
 * Obtiene equipos por disciplina ID.
 * @param {number|string} ID
 * @returns {Promise<Array>} Lista de equipos.
 */
async function getTeamsByDiscID(ID) {
    try {
        const equipos = await fetchTeams();
        return equipos.filter(e => e.diciplinaid == ID);
    } catch (error) {
        console.error('Error obteniendo equipos:', error);
        return [];
    }
}

/**
 * Obtiene equipos por array de disciplina IDs.
 * @param {Array<number>} ids
 * @returns {Promise<Array>} Lista de equipos.
 */
async function getTeamsByDiscipline(ids) {
    try {
        const equipos = await fetchTeams();
        return equipos.filter(e => ids.includes(e.diciplinaid));
    } catch (error) {
        console.error('Error obteniendo equipos:', error);
        return [];
    }
}

/**
 * Obtiene un equipo existente por nombre, categoría, grupo y tec.
 * @param {string} name
 * @param {string} category
 * @param {number|string} groupID
 * @param {number|string} tecID
 * @returns {Promise<Object|null>} Equipo encontrado o null.
 */
async function getExistingTeams(name, category, groupID, tecID) {
    try {
        const [teams, disciplines] = await Promise.all([
            fetchTeams(),
            fetchDisciplines()
        ]);
        const discipline = disciplines.find(d => d.nombre === disciplineName && d.categoria === category);
        if (!discipline) return null;
        const team = teams.find(t => 
            t.nombre.toLowerCase() === name.toLowerCase() &&
            t.diciplinaid == discipline.id_diciplinas &&
            t.grupoid == groupID &&
            t.tecsid == tecID
        );
        return team || null;
    } catch (error) {
        console.error('Error obteniendo equipos:', error);
        return null;
    }
}
