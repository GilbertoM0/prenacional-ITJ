// admin.js - Solo lógica de UI y orquestación de eventos
// Todas las funciones de acceso a datos están en la carpeta api/
// Asegúrate de que los scripts de la carpeta api/ estén incluidos antes en el HTML

// Ejemplo de función de UI para mostrar grupos en un select
async function renderGroupOptions(selectId) {
    const grupos = await fetchGroups();
    const select = document.getElementById(selectId);
    if (!select) return;
    select.innerHTML = grupos.map(g => `<option value="${g.id_grupo}">${g.nombre}</option>`).join('');
}

// Ejemplo de función de UI para mostrar equipos en un select
async function renderTeamOptions(selectId) {
    const equipos = await fetchTeams();
    const select = document.getElementById(selectId);
    if (!select) return;
    select.innerHTML = equipos.map(e => `<option value="${e.id_equipo}">${e.nombre}</option>`).join('');
}

// Ejemplo de función de UI para mostrar disciplinas en un select
async function renderDisciplineOptions(selectId) {
    const disciplinas = await fetchDisciplines();
    const select = document.getElementById(selectId);
    if (!select) return;
    select.innerHTML = disciplinas.map(d => `<option value="${d.id_diciplinas}">${d.nombre}</option>`).join('');
}

// Aquí puedes agregar más funciones de UI para renderizar jugadores, tecs, partidos, etc.
// Y listeners para los botones y formularios

// Ejemplo de listener para un botón de recarga de grupos
const reloadGroupsBtn = document.getElementById('reloadGroupsBtn');
if (reloadGroupsBtn) {
    reloadGroupsBtn.addEventListener('click', () => renderGroupOptions('groupS'));
}

// ========== HAMBURGER MENU LOGIC FOR ADMIN PAGES ========== //
document.addEventListener('DOMContentLoaded', function () {
    const navHamburger = document.getElementById('navHamburger');
    const mainNav = document.getElementById('mainNav');
    if (navHamburger && mainNav) {
        navHamburger.addEventListener('click', function () {
            mainNav.classList.toggle('open');
        });
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                if (window.innerWidth <= 900) {
                    const parentLi = link.closest('li');
                    if (!parentLi || !parentLi.querySelector('ul')) {
                        mainNav.classList.remove('open');
                    } else {
                        e.preventDefault();
                    }
                }
            });
        });
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 900 && mainNav.classList.contains('open')) {
                if (!mainNav.contains(e.target) && !navHamburger.contains(e.target)) {
                    mainNav.classList.remove('open');
                }
            }
        });
    }
});