// Funciones relacionadas con jugadores

/**
 * Obtiene todos los jugadores desde la API.
 * @returns {Promise<Array>} Lista de jugadores o [] si hay error.
 */
async function fetchPlayers() {
    try {
        const response = await fetch(`${API_BASE_URL}/jugador`);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        return response.json();
    } catch (error) {
        console.error('Error obteniendo jugadores:', error);
        return [];
    }
}

/**
 * Crea un jugador en la base de datos.
 * @param {Object} playerData
 * @returns {Promise<Object>} Respuesta de la API.
 */
async function createPlayer(playerData) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/jugador`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(playerData)
        });
        return response.json();
    } catch (error) {
        console.error('Error en createPlayer:', error);
        return { success: false, message: 'Error de conexión con el servidor' };
    }
}

/**
 * Elimina un jugador por ID.
 * @param {number|string} ID
 * @returns {Promise<Object>} Respuesta de la API.
 */
async function deletePlayer(ID) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/jugador/${ID}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
        return response.json();
    } catch (error) {
        console.error('Error en deletePlayer:', error);
        return { success: false, message: 'Error de conexión con el servidor' };
    }
}

/**
 * Obtiene un jugador por ID.
 * @param {number|string} ID
 * @returns {Promise<Object|null>} Jugador encontrado o null.
 */
async function getPlayerByID(ID) {
    try {
        const players = await fetchPlayers();
        return players.find(p => p.id_jugador == ID) || null;
    } catch (error) {
        console.error('Error obteniendo jugadores:', error);
        return null;
    }
}

/**
 * Obtiene jugadores por equipos (array de IDs).
 * @param {Array<number>} ids
 * @returns {Promise<Array>} Lista de jugadores.
 */
async function getPlayersByTeams(ids) {
    try {
        const players = await fetchPlayers();
        return players.filter(p => ids.includes(p.equipoid));
    } catch (error) {
        console.error('Error obteniendo jugadores:', error);
        return [];
    }
}

/**
 * Obtiene un jugador existente por nombre, número y equipo.
 * @param {string} name
 * @param {number|string} number
 * @param {number|string} team
 * @returns {Promise<Object|null>} Jugador encontrado o null.
 */
async function getExistingPlayer(name, number, team) {
    try {
        const players = await fetchPlayers();
        return players.find(p => 
            p.nombre.toLowerCase().trim() === name.toLowerCase().trim() &&
            p.numero == number &&
            p.equipoid == team
        ) || null;
    } catch (error) {
        console.error('Error obteniendo jugadores:', error);
        return null;
    }
}

/**
 * Obtiene la disciplina de un jugador por equipo.
 * @param {number|string} teamID
 * @returns {Promise<Object|null>} Disciplina encontrada o null.
 */
async function getPlayerDisc(teamID) {
    try {
        const teams = await fetchTeams();
        const team = teams.find(t => t.id_equipo == teamID);
        if (!team) return null;
        const disciplines = await fetchDisciplines();
        return disciplines.find(d => d.id_diciplinas === team.diciplinaid) || null;
    } catch (error) {
        console.error('Error obteniendo jugadores:', error);
        return null;
    }
}
