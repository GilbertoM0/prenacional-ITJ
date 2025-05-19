/**
 * Script para manejar la funcionalidad del menú hamburguesa
 * Módulo independiente para mejor mantenibilidad
 */

document.addEventListener('DOMContentLoaded', function() {
    // Referencias a los elementos
    const navHamburger = document.getElementById('navHamburger');
    const mainNav = document.getElementById('mainNav');
    
    // Crear overlay para cierre del menú
    const menuOverlay = document.createElement('div');
    menuOverlay.className = 'menu-overlay';
    document.body.appendChild(menuOverlay);
    
    if (navHamburger && mainNav) {
        // Toggle del menú al hacer clic en hamburguesa
        navHamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            navHamburger.classList.toggle('active');
            mainNav.classList.toggle('open');
            menuOverlay.classList.toggle('show');
            
            // Bloquear scroll del body cuando el menú está abierto
            if (mainNav.classList.contains('open')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Cerrar menú al hacer clic en el overlay
        menuOverlay.addEventListener('click', function() {
            closeMenu();
        });
        
        // Manejar submenús
        setupSubmenus();
        
        // Cerrar menú al hacer clic en links de navegación (excepto los que tienen submenú)
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function(e) {
                const parentLi = link.closest('li');
                if (!parentLi || !parentLi.querySelector('ul')) {
                    closeMenu();
                } else if (window.innerWidth <= 900) {
                    e.preventDefault();
                    const submenu = parentLi.querySelector('ul');
                    if (submenu) {
                        // Toggle para mostrar/ocultar submenú
                        parentLi.classList.toggle('active');
                        
                        // Si se abre este, cerrar otros submenús
                        if (parentLi.classList.contains('active')) {
                            const siblings = Array.from(parentLi.parentNode.children).filter(el => el !== parentLi);
                            siblings.forEach(sibling => {
                                sibling.classList.remove('active');
                            });
                        }
                    }
                }
            });
        });
        
        // Cerrar menú en cambio de orientación/resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 900) {
                closeMenu();
            }
        });
        
        // ESC para cerrar menú
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mainNav.classList.contains('open')) {
                closeMenu();
            }
        });
    }
    
    // Función para cerrar el menú
    function closeMenu() {
        if (navHamburger && mainNav) {
            navHamburger.classList.remove('active');
            mainNav.classList.remove('open');
            menuOverlay.classList.remove('show');
            document.body.style.overflow = '';
        }
    }
    
    // Configurar submenús
    function setupSubmenus() {
        // En modo desktop usamos hover en lugar de click
        const hasSubmenu = document.querySelectorAll('li:has(ul)');
        
        if (window.innerWidth > 900) {
            hasSubmenu.forEach(item => {
                item.addEventListener('mouseenter', function() {
                    if (window.innerWidth > 900) {
                        this.classList.add('active');
                    }
                });
                
                item.addEventListener('mouseleave', function() {
                    if (window.innerWidth > 900) {
                        this.classList.remove('active');
                    }
                });
            });
        }
    }
});
