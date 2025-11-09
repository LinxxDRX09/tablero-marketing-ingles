// Tablero de Marketing Digital - JavaScript Principal
// Cursos de Inglés Certificados

// Variables globales
let currentFilter = 'all';
let searchTerm = '';
let currentPage = 'dashboard';

// Inicialización del dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupEventListeners();
    animateNumbers();
});

function initializeDashboard() {
    // Mostrar todo el contenido inicialmente
    filterContent('all');
    
    // Agregar efectos hover a las tarjetas
    const cards = document.querySelectorAll('.card-hover');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

function setupEventListeners() {
    // Funcionalidad de búsqueda
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            searchTerm = e.target.value.toLowerCase();
            filterContent(currentFilter);
        });
    }

    // Botones de filtro
    const filterButtons = document.querySelectorAll('.filter-button');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover clase activa de todos los botones
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Agregar clase activa al botón clickeado
            this.classList.add('active');
            
            currentFilter = this.dataset.filter;
            filterContent(currentFilter);
        });
    });
}

function filterContent(filter) {
    const cards = document.querySelectorAll('[data-category]');
    
    cards.forEach(card => {
        const category = card.dataset.category;
        const text = card.textContent.toLowerCase();
        
        const matchesFilter = filter === 'all' || category === filter;
        const matchesSearch = searchTerm === '' || text.includes(searchTerm);
        
        if (matchesFilter && matchesSearch) {
            card.style.display = 'block';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        } else {
            card.style.opacity = '0.3';
            card.style.transform = 'translateY(10px)';
        }
    });
}

function animateNumbers() {
    const numbers = document.querySelectorAll('.text-3xl.font-bold, .text-2xl.font-bold');
    numbers.forEach((number, index) => {
        setTimeout(() => {
            const finalValue = number.textContent;
            const isPercentage = finalValue.includes('%');
            const numericValue = parseFloat(finalValue.replace(/[^\d.]/g, ''));
            
            if (numericValue) {
                let currentValue = 0;
                const increment = numericValue / 50;
                
                const timer = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= numericValue) {
                        currentValue = numericValue;
                        clearInterval(timer);
                    }
                    
                    let displayValue = currentValue;
                    if (currentValue > 1000000) {
                        displayValue = (currentValue / 1000000).toFixed(0) + 'M';
                    } else if (currentValue > 1000) {
                        displayValue = (currentValue / 1000).toFixed(0) + 'K';
                    } else {
                        displayValue = Math.floor(currentValue);
                    }
                    
                    if (isPercentage) displayValue += '%';
                    if (finalValue.includes('$') && !finalValue.includes('M')) displayValue = '$' + displayValue;
                    
                    number.textContent = displayValue;
                }, 30);
            }
        }, index * 200);
    });
}

// Funciones de navegación
function showPage(pageId) {
    // Ocultar todas las páginas
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // Mostrar página seleccionada
    document.getElementById(pageId).classList.add('active');
    
    // Actualizar pestañas de navegación
    const tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    
    currentPage = pageId;
    showToast(`Cambiado a ${pageId}`);
}

// Funciones interactivas
function showDetails(type) {
    const modal = document.getElementById('detailModal');
    const title = document.getElementById('modalTitle');
    const content = document.getElementById('modalContent');
    
    if (!modal || !title || !content) return;
    
    switch(type) {
        case 'market-size':
            title.textContent = 'Detalles del Mercado';
            content.innerHTML = `
                <div class="space-y-4">
                    <div class="bg-blue-50 p-4 rounded-lg">
                        <h4 class="font-bold text-blue-800 mb-2">Proyección de Crecimiento</h4>
                        <p class="text-sm text-gray-700">El mercado se espera que crezca de $13.97B en 2024 a $49.7B en 2033, con una tasa de crecimiento anual compuesta del 15%.</p>
                    </div>
                    <div class="bg-green-50 p-4 rounded-lg">
                        <h4 class="font-bold text-green-800 mb-2">Factores de Crecimiento</h4>
                        <ul class="text-sm text-gray-700 space-y-1">
                            <li>• Aumento de la penetración de Internet global</li>
                            <li>• Demanda creciente de certificaciones internacionales</li>
                            <li>• Flexibilidad del aprendizaje online</li>
                            <li>• Adopción de tecnologías IA en educación</li>
                        </ul>
                    </div>
                </div>
            `;
            break;
        default:
            title.textContent = 'Información';
            content.textContent = 'Más detalles próximamente...';
    }
    
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeModal() {
    const modal = document.getElementById('detailModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    if (!toast || !toastMessage) return;
    
    toastMessage.textContent = message;
    toast.classList.remove('translate-y-full');
    
    setTimeout(() => {
        toast.classList.add('translate-y-full');
    }, 3000);
}

// Funciones de acción
function refreshData(type) {
    showToast(`Datos de ${type} actualizados exitosamente`);
    animateNumbers();
}

function toggleSegmentation() {
    showToast('Segmentación actualizada');
}

function highlightSegment(segment) {
    showToast(`Segmento ${segment} destacado`);
}

function showTechDetails() {
    showDetails('tech-trends');
}

function showTechMetric(metric) {
    showToast(`Métrica de ${metric} mostrada`);
}

function showStrategyDetails() {
    showToast('Detalles de estrategia mostrados');
}

function exportStrategy() {
    showToast('Estrategia exportada exitosamente');
}

function showPlatformDetails(platform) {
    showToast(`Detalles de ${platform} mostrados`);
}

function editValueProposition() {
    showToast('Editor de propuesta de valor abierto');
}

function testValueProposition() {
    showToast('Test A/B iniciado');
}

function showContentCalendar() {
    showToast('Calendario de contenido abierto');
}

function addContent() {
    showToast('Nuevo contenido agregado');
}

function editContent(day) {
    showToast(`Editor de contenido para ${day} abierto`);
}

function previewContent(day) {
    showToast(`Vista previa de contenido de ${day}`);
}

function refreshKPIs() {
    showToast('KPIs actualizados');
    animateNumbers();
}

function adjustBudget() {
    showToast('Ajustador de presupuesto abierto');
}

function launchCampaign() {
    showToast('Campaña lanzada exitosamente');
}

function scheduleConsultation() {
    showToast('Consultoría agendada');
}

function showNotifications() {
    showToast('3 notificaciones pendientes');
}

function createNewCampaign() {
    showToast('Nueva campaña creada exitosamente');
}

// Event listeners adicionales
document.addEventListener('DOMContentLoaded', function() {
    // Cerrar modal al hacer click fuera
    const modal = document.getElementById('detailModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
    }
    
    // Atajos de teclado
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
        if (e.key === 'f' && e.ctrlKey) {
            e.preventDefault();
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.focus();
            }
        }
    });
});

// Exportar funciones para uso global
window.showPage = showPage;
window.showDetails = showDetails;
window.closeModal = closeModal;
window.showToast = showToast;
window.refreshData = refreshData;
window.toggleSegmentation = toggleSegmentation;
window.highlightSegment = highlightSegment;
window.showTechDetails = showTechDetails;
window.showTechMetric = showTechMetric;
window.showStrategyDetails = showStrategyDetails;
window.exportStrategy = exportStrategy;
window.showPlatformDetails = showPlatformDetails;
window.editValueProposition = editValueProposition;
window.testValueProposition = testValueProposition;
window.showContentCalendar = showContentCalendar;
window.addContent = addContent;
window.editContent = editContent;
window.previewContent = previewContent;
window.refreshKPIs = refreshKPIs;
window.adjustBudget = adjustBudget;
window.launchCampaign = launchCampaign;
window.scheduleConsultation = scheduleConsultation;
window.showNotifications = showNotifications;
window.createNewCampaign = createNewCampaign;