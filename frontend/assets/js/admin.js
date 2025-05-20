/* ========================================== CARGA DE PÁGINA  ========================================== */
const disciplineName = document.querySelector('.type').textContent.trim();

document.addEventListener("DOMContentLoaded", async () => {
    await initializeMenu();
    await setupOption();
    await mostrarEquiposEnInfo(); // Mostrar equipos y tablas al cargar
});

/* ========================================== ALERTA ERROR ========================================== */
function Toast(icon, titulo) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-right',
      iconColor: 'white',
      customClass: {
        popup: 'colored-toast'
      },
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
    });
  
    Toast.fire({
      icon: icon,
      title: titulo
    });
}

/* ========================================== MENÚ ========================================== */
async function initializeMenu() {
  try {
      // Cargar disciplinas desde la API
      const disciplines = await fetchDisciplines();
      
      // Procesar y mostrar en el menu
      disciplinesMenu(disciplines);

      // Configurar interactividad
      setupMenuInteractions();
  } 
  catch(error) {
      handleMenuError(error);
  }
}

/* ============================= funciones principales ============================= */
// Procesar y mostrar disciplinas
function disciplinesMenu(disciplines) {
  const menuContainer = document.querySelector('.subdiscipline');
  const uniqueDisciplines = getUniqueDisciplines(disciplines);

  menuContainer.innerHTML = uniqueDisciplines
      .map(discipline => createDisciplineItem(discipline))
      .join('');
}

// Configurar eventos del menú
function setupMenuInteractions() {
  setupSubmenus('.navigation > li');
  setupSubmenus('.subdiscipline > li');
  setupSubmenus('.options > li');
}

/* ============================= funciones auxiliares ============================= */
// Filtrar disciplinas únicas por nombre
function getUniqueDisciplines(disciplines) {
  const seen = new Set();
  return disciplines.filter(discipline => {
      const normalized = discipline.nombre.toLowerCase().trim();
      return seen.has(normalized) ? false : seen.add(normalized);
  });
}

// Crear elemento HTML para una disciplina
function createDisciplineItem(discipline) {
  const name = discipline.nombre.toUpperCase();
  let ruta = '#';

  if(name === 'BÁSQUETBOL')
    ruta = './discBasquet.html';
  else if(name === 'VOLEIBOL')
    ruta = './discVolley.html';
  else if(name === 'FÚTBOL')
    ruta = './discFutbol.html';

  return `
  <li data-discipline-id="${discipline.id_diciplinas}" 
      data-category="${discipline.categoria}">
      <a href="${ruta}" class="menu-link">
          ${name}
      </a>
  </li>
  `;
}

// Configurar submenús
function setupSubmenus(selector) {
  document.querySelectorAll(selector).forEach(item => {
      const submenu = item.querySelector('ul');
      if (!submenu) return;

      let hoverTimeout;

      // Abrir con hover
      item.addEventListener('mouseenter', () => {
          if(!item.classList.contains('pinned')) {
              clearTimeout(hoverTimeout);
              handleSubmenuHover(item);
          }
      });

      // Cerrar submenú al salir
      item.addEventListener('mouseleave', () => {
          if(!item.classList.contains('pinned')) {
              hoverTimeout = setTimeout(() => closeSubmenu(item), 300);
          }
      });

      submenu.addEventListener('mouseenter', () => clearTimeout(hoverTimeout));
      submenu.addEventListener('mouseleave', () => {
          if (!item.classList.contains('pinned'))
              closeSubmenu(item);        
      });

      // Abrir / cerrar con click
      const link = item.querySelector('a');
      if(link) {
          link.addEventListener('click', (e) => {
              if(!submenu) return;
              e.preventDefault();
              const isPinned = item.classList.contains('pinned');

              submenu.querySelectorAll('a').forEach(link => {
                  link.addEventListener('click', () => {
                      closeAllSubmenus(); // Cierra menú al seleccionar opción
                  });
              });

              // Cerrar los demás submenús
              document.querySelectorAll(selector).forEach(otherItem => {
                  otherItem.classList.remove('pinned', 'active');
              });

              if(!isPinned)
                  item.classList.add('pinned', 'active');
              else
                  item.classList.remove('pinned', 'active');
          });
      }
  });

  document.addEventListener('click', (e) => {
      const clickedInsideMenu = e.target.closest('li');
      if(!clickedInsideMenu)
          closeAllSubmenus();
  });
}

// Manejar hover
function handleSubmenuHover(menuItem) {
  closeSiblingSubmenus(menuItem);
  menuItem.classList.add('active');
}

// Cerrar submenú
function closeSubmenu(menuItem) {
  menuItem.classList.remove('active');
}

// Cerrar otros submenús del mismo nivel
function closeSiblingSubmenus(currentItem) {
  const parentList = currentItem.closest('ul');
  if (parentList) {
      parentList.querySelectorAll('li').forEach(item => {
          if (item !== currentItem)
              item.classList.remove('active');            
      });
  }
}

// Cerrar al hacer click fuera de él
function closeAllSubmenus() {
  document.querySelectorAll('li.active, li.pinned').forEach(item => {
      item.classList.remove('active', 'pinned');
  });
}

// Manejo de errores
function handleMenuError(error) {
  console.error('Error en el menú:', error);
  document.querySelector('.subdiscience').innerHTML = `
      <li class="error-message">
          <ion-icon name="warning-outline"></ion-icon>
          Error cargando disciplinas
      </li>
  `;
}

/* ========================================== BOTONES ========================================== */
async function setupOption() {
    const container = document.querySelector('.groupOptions');    
    const subContainer = document.querySelector('.info');

    document.querySelectorAll('.lblOption').forEach((option => {
        option.addEventListener('click', async() => {
            const text = option.textContent.trim();
            const opt = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
            container.innerHTML = '';
            subContainer.innerHTML = '';

            container.insertAdjacentHTML('beforeend', `
                <div class="bttnOpt">
                    <div class="opt Add"><ion-icon name="add-circle"></ion-icon>AGREGAR</div> 
                    <div class="opt Mod"><ion-icon name="pencil"></ion-icon>MODIFICAR</div>
                    <div class="opt Sear"><ion-icon name="search"></ion-icon>BUSCAR</div>          
                    <div class="opt Del"><ion-icon name="trash"></ion-icon>ELIMINAR</div>                  
                </div>

                <div class="bttnNm">
                    <p>${opt}</p>
                </div>
            `);

            // Remover listeners previos
            container.removeEventListener('click', SubOptionG);
            container.removeEventListener('click', SubOptionE);
            container.removeEventListener('click', SubOptionJ);
            container.removeEventListener('click', SubOptionP);
            container.removeEventListener('click', SubOptionC);

            // Delegación de eventos para sub-opciones
            if (opt === 'Grupo')
                container.addEventListener('click', SubOptionG);
            else if (opt === 'Equipo')
                container.addEventListener('click', SubOptionE);
            else if (opt === 'Jugador')
                container.addEventListener('click', SubOptionJ);            
            else if (opt === 'Partido')
                container.addEventListener('click', SubOptionP);            
            else if (opt === 'Clasificacion')
                container.addEventListener('click', SubOptionC);            
        });
    }));
}

async function SubOptionG(e) {
    const container = document.querySelector('.info');
    const addBtn = e.target.closest('.opt.Add');
    const modBtn = e.target.closest('.opt.Mod');
    const searBtn = e.target.closest('.opt.Sear');
    const delBtn = e.target.closest('.opt.Del');

    if(addBtn) {
        container.innerHTML = `
            <div class="input-box">           
                <p class="title">GRUPO</p>         
                <input class="input" id="name" type="text">                                               
            </div> 

            <div class="category">
                <p class="title">CATEGORIA</p>      
                <select class="input selector" id="categoria">
                    <option value="Femenil">Femenil</option>
                    <option value="Varonil">Varonil</option>
                </select>
            </div>

            <button class="btns" id="save">GUARDAR</button> 
        `;

        document.getElementById('save').addEventListener('click', NewGroup);
    }

    if(modBtn) {
        const disciplineList = await getDisciplineByName();
        const ids = disciplineList.map(d => d.id_diciplinas);
        const groups = await getGroupsByDiscipline(ids);

        // Genera las opciones
        const optionsHTML = groups.map(group => 
            `<option value="${group.id_grupo}">${group.nombre}</option>`
        ).join('');

        container.innerHTML = `
            <div class="modify">
                <p>SELECCIONE EL GRUPO A MODIFICAR</p>                
                <select class="input selector m" id="groupS">
                    ${optionsHTML}
                </select>
            </div>

            <button class="btns" id="select">SELECCIONAR</button> 
        `;

        document.getElementById('select').addEventListener('click', SelectGroup);
    }

    if(searBtn) {
        container.innerHTML = `
            <div class="modify">           
                <p>ESCRIBA EL NOMBRE DEL GRUPO QUE DESEA BUSCAR</p>         
                <input class="input m" id="name" type="text">                                               
            </div> 

            <div class="modify">
                <p class="catSearch">SELECCIONE SU CATEGORÍA</p>      
                <select class="input selector m" id="categoria">
                    <option value="Femenil">Femenil</option>
                    <option value="Varonil">Varonil</option>
                </select>
            </div>

            <button class="btns" id="search">BUSCAR</button> 
        `;
        document.getElementById('search').addEventListener('click', SearchGroup);
    }

    if(delBtn) {    
        const disciplineList = await getDisciplineByName();
        const ids = disciplineList.map(d => d.id_diciplinas);
        const groups = await getGroupsByDiscipline(ids);

        container.innerHTML = `
            <div class="modify">
                <p>SELECCIONE EL GRUPO A ELIMINAR</p>                
                <select class="input selector m" id="groupS">
                    ${groups.map(group => `<option value="${group.id_grupo}">${group.nombre}</option>`).join('')}
                </select>
            </div>

            <button class="btns" id="delete">ELIMINAR</button> 
        `;

        document.getElementById('delete').addEventListener('click', DeleteGroup);
    }
}

async function SubOptionE(e) {
    const container = document.querySelector('.info');
    const addBtn = e.target.closest('.opt.Add');
    const modBtn = e.target.closest('.opt.Mod');
    const searBtn = e.target.closest('.opt.Sear');
    const delBtn = e.target.closest('.opt.Del');    

    if(addBtn) {
        try {            
            let category = document.getElementById('categoria')?.value;
            if(!category) category = 'Femenil';

            const discipline = await getDisciplineId(category.toLowerCase());
            const groups = await getGroupsByDiscID(discipline);
            const tecs = await getTecs();

            container.innerHTML = `
                <div class="category team">
                    <div class="teamOpt">
                        <p class="title">NOMBRE</p>
                        <input class="input selector team" id="name" type="text" placeholder="Opcional">
                    </div>           
                        
                    <div class="teamOpt">
                        <p class="title">CATEGORIA</p>      
                        <select class="input selector team" id="categoria">
                            <option value="Femenil">Femenil</option>
                            <option value="Varonil">Varonil</option>
                        </select>
                    </div>
                </div> 

                <div class="category team">
                    <div class="teamOpt">
                        <p class="title">GRUPO</p>
                        <select class="input selector team" id="groupTm">
                            ${groups.map(group => `<option value="${group.id_grupo}">${group.nombre}</option>`).join('')}
                        </select>
                    </div>

                    <div class="teamOpt">
                        <p class="title">TEC</p>
                        <select class="input selector team" id="tecTm">
                            ${tecs.map(tec => `<option value="${tec.id_tecs}">${tec.nombre}</option>`).join('')}
                        </select>
                    </div>
                </div>

                <button class="btns" id="save">GUARDAR</button>
            `;            

            document.getElementById('save').addEventListener('click', NewTeam);

            // Escuchar cambios en la categoría para actualizar los grupos
            document.getElementById('categoria').addEventListener('change', async (e) => {
                const selectedCategory = e.target.value;
                const disciplineId = await getDisciplineId(selectedCategory.toLowerCase());
                const updatedGroups = await getGroupsByDiscID(disciplineId);

                const groupSelect = document.getElementById('groupTm');
                groupSelect.innerHTML = updatedGroups
                    .map(group => `<option value="${group.id_grupo}">${group.nombre}</option>`)
                    .join('');
            });
        } catch(error){
            console.log("Error en añadir grupos y tecs: ", error);
        }
    }

    if(modBtn) {
        const disciplineList = await getDisciplineByName();
        const ids = disciplineList.map(d => d.id_diciplinas);
        const teams = await getTeamsByDiscipline(ids);

        try {
            const optionsPromises = teams.map(async (team) => {
                let teamName = team.nombre;

                if(!teamName) {                                        
                    const result = await getTecCityByID(team.tecsid);      
                    teamName = result.ciudad;                    
                }
                return `<option value="${team.id_equipo}">${teamName}</option>`;
            });

            const optionsHTML = (await Promise.all(optionsPromises)).join('');

            container.innerHTML = `
                <div class="modify">
                    <p>SELECCIONE EL EQUIPO A MODIFICAR</p>                
                    <select class="input selector m" id="teamS">
                        ${optionsHTML}
                    </select>
                </div>

                <button class="btns" id="select">SELECCIONAR</button> 
            `;
            document.getElementById('select').addEventListener('click', SelectTeam);
        } catch(error) {
            console.log('Error', error);
        }
    }

    if(searBtn) {
        try {
            let category = document.getElementById('categoria')?.value;
            if(!category) category = 'Femenil';

            const discipline = await getDisciplineId(category.toLowerCase());
            const groups = await getGroupsByDiscID(discipline);
            const tecs = await getTecs();

            container.innerHTML = `
                <div class="category srcTeam">
                    <div class="modify srcTeam">
                        <p class="title">EQUIPO QUE DESEA BUSCAR</p>
                        <input class="input selector srcTeam" id="name" type="text" placeholder="Opcional">
                    </div>           
                            
                    <div class="modify srcTeam">
                        <p class="title">SELECCIONE SU CATEGORÍA</p>      
                        <select class="input selector srcTeam" id="categoria">
                            <option value="Femenil">Femenil</option>
                            <option value="Varonil">Varonil</option>
                        </select>
                    </div>
                </div> 

                <div class="category srcTeam">
                        <div class="modify srcTeam">
                            <p class="title">SELECCIONE SU GRUPO</p>
                            <select class="input selector srcTeam" id="groupTm">
                                ${groups.map(group => `<option value="${group.id_grupo}">${group.nombre}</option>`).join('')}
                            </select>
                        </div>

                        <div class="modify srcTeam">
                            <p class="title">SELECCIONE EL TEC</p>
                            <select class="input selector srcTeam" id="tecTm">
                                ${tecs.map(tec => `<option value="${tec.id_tecs}">${tec.nombre}</option>`).join('')}
                            </select>
                        </div>
                </div>

                <button class="btns srcTeam" id="search">BUSCAR</button>
            `;

            document.getElementById('search').addEventListener('click', SearchTeam);

            document.getElementById('categoria').addEventListener('change', async (e) => {
                console.log("Escuchando cambio en categoría");
                const selectedCategory = e.target.value;
                const disciplineId = await getDisciplineId(selectedCategory.toLowerCase());
                const updatedGroups = await getGroupsByDiscID(disciplineId);

                const groupSelect = document.getElementById('groupTm');
                groupSelect.innerHTML = updatedGroups
                    .map(group => `<option value="${group.id_grupo}">${group.nombre}</option>`)
                    .join('');
            });
        } catch(error){
            console.log("Error en añadir grupos y tecs: ", error);
        }
    }

    if(delBtn) {
        const disciplineList = await getDisciplineByName();
        const ids = disciplineList.map(d => d.id_diciplinas);
        const teams = await getTeamsByDiscipline(ids);

        try {
            const optionsPromises = teams.map(async (team) => {
                let teamName = team.nombre;

                if(!teamName) {                                        
                    const result = await getTecCityByID(team.tecsid);      
                    teamName = result.ciudad;                    
                }
                return `<option value="${team.id_equipo}">${teamName}</option>`;
            });

            const optionsHTML = (await Promise.all(optionsPromises)).join('');

            container.innerHTML = `
                <div class="modify">
                    <p>SELECCIONE EL EQUIPO A ELIMINAR</p>                
                    <select class="input selector m" id="teamS">
                        ${optionsHTML}
                    </select>
                </div>

                <button class="btns" id="delete">ELIMINAR</button> 
            `;
            document.getElementById('delete').addEventListener('click', DeleteTeam);
        } catch(error) {
            console.log('Error', error);
        }
    }
}

async function SubOptionJ(e) {
    const container = document.querySelector('.info');
    const addBtn = e.target.closest('.opt.Add');
    const modBtn = e.target.closest('.opt.Mod');
    const searBtn = e.target.closest('.opt.Sear');
    const delBtn = e.target.closest('.opt.Del');

    if(addBtn) {
        let category = document.getElementById('categoria')?.value;
        if(!category) category = 'Femenil';

        const discipline = await getDisciplineId(category.toLowerCase());
        const teamsList = await getTeamsByDiscID(discipline);

        try {
            const optionsPromises = teamsList.map(async (team) => {
                let teamName = team.nombre;

                if(!teamName) {                                        
                    const result = await getTecCityByID(team.tecsid);      
                    teamName = result.ciudad;                    
                }
                return `<option value="${team.id_equipo}">${teamName}</option>`;
            });

            const optionsHTML = (await Promise.all(optionsPromises)).join('');

            container.innerHTML = `
                <div class="input-box play">           
                    <p class="title">NOMBRE</p>         
                    <input class="input play" id="name" type="text">                                               
                </div> 

                <div class="category team play">
                    <div class="teamOpt">
                        <p class="title">CATEGORIA</p>
                        <select class="input selector play" id="categoria">
                            <option value="Femenil">Femenil</option>
                            <option value="Varonil">Varonil</option>
                        </select>
                    </div>           
                            
                    <div class="teamOpt">
                        <p class="title">EQUIPO</p>      
                        <select class="input selector play" id="equipo">
                            ${optionsHTML}
                        </select>
                    </div>
                </div>
                
                <div class="category team play">
                    <div class="teamOpt">
                        <p class="title">NUMERO</p>
                        <input class="input selector play" id="number" type="number" min="0" step="1">
                    </div>           
                            
                    <div class="teamOpt position">
                        <p class="title">POSICION</p>                        
                    </div>
                </div>   

                <button class="btns play" id="picture">SELECCIONAR FOTO</button>
            `;

            const positionContainer = document.querySelector('.teamOpt.position');
            if(disciplineName === 'Básquetbol') {                
                positionContainer.innerHTML += `
                    <select class="input selector play" id="posicion">
                        <option value="Base">Base</option>
                        <option value="Escolta">Escolta</option>
                        <option value="Alero">Alero</option>
                        <option value="Ala-Pívot">Ala-Pívot</option>
                        <option value="Pívot">Pívot</option>
                    </select>
                `;
            } else 
                if(disciplineName === 'Voleibol') {
                    positionContainer.innerHTML += `
                        <select class="input selector play" id="posicion">
                            <option value="Colocador">Colocador</option>
                            <option value="Opuesto">Opuesto</option>
                            <option value="Central">Central</option>
                            <option value="Receptor-Punta">Receptor-Punta</option>
                            <option value="Libero">Libero</option>
                            <option value="Defensa">Defensa</option>
                        </select>                        
                    `;
                } else 
                    if(disciplineName === 'Fútbol') {
                        positionContainer.innerHTML += `
                            <select id="posicion" class="input selector play">
                                <option value="Portero">Portero</option>
                                <option value="Defensa Central">Defensa Central</option>
                                <option value="Lateral Derecho">Lateral Derecho</option>
                                <option value="Lateral Izquierdo">Lateral Izquierdo</option>
                                <option value="Mediapunta">Mediapunta</option>
                                <option value="Centrocampista Defensivo">Centrocampista Defensivo</option>
                                <option value="Mediocentro">Mediocentro</option>
                                <option value="Interior Derecho">Interior Derecho</option>
                                <option value="Interior Izquierdo">Interior Izquierdo</option>
                                <option value="Extremo Derecho">Extremo Derecho</option>
                                <option value="Extremo Izquierdo">Extremo Izquierdo</option>
                                <option value="Delantero Centro">Delantero Centro</option>
                                <option value="Segundo Delantero">Segundo Delantero</option>
                                </select>
                        `;
                    }                
            
            document.getElementById('picture').addEventListener('click', UploadPhoto);

            document.getElementById('categoria').addEventListener('change', async (e) => {
                const selectedCategory = e.target.value;
                const disciplineId = await getDisciplineId(selectedCategory.toLowerCase());
                const updatedTeams = await getTeamsByDiscID(disciplineId);

                const optionsPromises = updatedTeams.map(async (team) => {
                    let teamName = team.nombre;

                    if (!teamName) {
                        const result = await getTecCityByID(team.tecsid);
                        teamName = result.ciudad;
                    }

                    return `<option value="${team.id_equipo}">${teamName}</option>`;
                });
                const optionsHTML = (await Promise.all(optionsPromises)).join('');

                const teamSelect = document.getElementById('equipo');
                teamSelect.innerHTML = optionsHTML;
            });
        } catch(error) {
            console.log('Error', error);
        }
    }

    if(modBtn) {
        const disciplineList = await getDisciplineByName();
        const ids = disciplineList.map(d => d.id_diciplinas);

        const teamsList = await getTeamsByDiscipline(ids);
        const idsT = teamsList.map(t => t.id_equipo);

        const players = await getPlayersByTeams(idsT);

        container.innerHTML = `
            <div class="modify">
                <p>SELECCIONE EL JUGADOR A MODIFICAR</p>                
                <select class="input selector m" id="playerS">
                    ${players.map(player => `<option value="${player.id_jugador}">${player.nombre}</option>`).join('')}
                </select>
            </div>

            <button class="btns" id="select">SELECCIONAR</button> 
        `;

        document.getElementById('select').addEventListener('click', SelectPlayer);
    }

    if(delBtn) {
        const disciplineList = await getDisciplineByName();
        const ids = disciplineList.map(d => d.id_diciplinas);

        const teamsList = await getTeamsByDiscipline(ids);
        const idsT = teamsList.map(t => t.id_equipo);

        const players = await getPlayersByTeams(idsT);

        container.innerHTML = `
            <div class="modify">
                <p>SELECCIONE EL JUGADOR A ELIMINAR</p>                
                <select class="input selector m" id="playerS">
                    ${players.map(player => `<option value="${player.id_jugador}">${player.nombre}</option>`).join('')}
                </select>
            </div>

            <button class="btns" id="delete">ELIMINAR</button> 
        `;

        document.getElementById('delete').addEventListener('click', DeletePlayer);
    }
}
// Renderiza una tarjeta de equipo con logo y tabla de puntos única
function renderTeamCard(team, logo, point) {
  return `
    <div class="equipo-card">
      <div class="team-header">
        <img src="${logo.logo}" alt="${logo.ciudad}" class="teamLogos">
        <span class="tec">${team.nombre ? team.nombre : logo.ciudad}</span>
      </div>
      <table class="numberPoints-table">
        <thead>
          <tr>
            <th>JJ</th>
            <th>JG</th>
            <th>JP</th>
            <th>PF</th>
            <th>PC</th>
            <th>DP</th>
            <th>PTS</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${point.partidosJugados ?? ''}</td>
            <td>${point.partidosGanados ?? ''}</td>
            <td>${point.partidosPerdidos ?? ''}</td>
            <td>${point.puntosAFavor ?? ''}</td>
            <td>${point.puntosEnContra ?? ''}</td>
            <td>${point.diferenciaPuntos ?? ''}</td>
            <td>${point.puntosTotales ?? ''}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
}

// Renderiza los equipos en la sección de info con su respectiva tabla
async function mostrarEquiposEnInfo() {
  const container = document.querySelector('.info');
  
  // Limpiar el contenedor antes de agregar nuevos elementos
  container.innerHTML = '';
  
  // Crear un contenedor específico para las tarjetas de equipo
  const pointsContainer = document.createElement('div');
  pointsContainer.className = 'points';
  container.appendChild(pointsContainer);
  
  // Obtener equipos, logos y puntos
  try {
    const disciplineList = await getDisciplineByName();
    const ids = disciplineList.map(d => d.id_diciplinas);
    const teams = await getTeamsByDiscipline(ids);
    
    // Procesar cada equipo
    for (const team of teams) {
      const logo = await getTecCityByID(team.tecsid) || {logo: '', ciudad: ''};
      const point = await getPointsByTeam(team.id_equipo) || {};
      
      // Agregar la tarjeta de equipo al contenedor
      pointsContainer.innerHTML += renderTeamCard(team, logo, point);
    }
    
    // Para móviles, ocultar el encabezado principal de la tabla ya que cada tarjeta tiene su propio encabezado
    if (window.innerWidth <= 768) {
      const gridHeader = document.querySelector('.grid-header');
      if (gridHeader) gridHeader.style.display = 'none';
    }
  } catch (error) {
    console.error('Error al mostrar equipos:', error);
    container.innerHTML = '<p class="error-message">Error al cargar los equipos</p>';
  }
}
// Puedes llamar mostrarEquiposEnInfo() cuando quieras mostrar la tabla de equipos