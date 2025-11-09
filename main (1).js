// Global variables
let currentFilter = 'all';
let searchTerm = '';
let notifications = [];
let campaigns = [];
let isEditing = false;
let originalData = {};
let currentDate = new Date();
let calendarEvents = {};

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupEventListeners();
    animateNumbers();
    loadSavedData();
    loadCampaigns();
    updateNotificationBadge();
    initializeCalendar();
    createSegmentationChart();
});

function initializeDashboard() {
    // Show all content initially
    filterContent('all');
    
    // Add hover effects to cards
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
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function(e) {
        searchTerm = e.target.value.toLowerCase();
        if (searchTerm.length > 0) {
            showSearchResults(searchTerm);
        } else {
            hideSearchResults();
        }
        filterContent(currentFilter);
    });

    // Hide search results when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('#searchInput') && !e.target.closest('#searchResults')) {
            hideSearchResults();
        }
    });

    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-button');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            currentFilter = this.dataset.filter;
            filterContent(currentFilter);
        });
    });

    // Notification panel
    document.getElementById('notificationBtn').addEventListener('click', toggleNotificationPanel);
    document.getElementById('closeNotifications').addEventListener('click', toggleNotificationPanel);

    // Form submissions
    document.getElementById('campaignForm').addEventListener('submit', handleCampaignSubmit);
    document.getElementById('consultationForm').addEventListener('submit', handleConsultationSubmit);

    // Make content editable on double click
    const editableElements = document.querySelectorAll('.editable-content');
    editableElements.forEach(element => {
        element.addEventListener('dblclick', function() {
            if (!isEditing) {
                makeEditable(this);
            }
        });
    });
}

// Search functionality
function showSearchResults(query) {
    const results = [];
    const searchResults = document.getElementById('searchResults');
    
    // Search in all editable content
    const editableElements = document.querySelectorAll('.editable-content');
    editableElements.forEach(element => {
        const text = element.textContent.toLowerCase();
        if (text.includes(query.toLowerCase())) {
            const section = element.closest('[data-category]');
            if (section) {
                const category = section.dataset.category;
                const sectionTitle = section.querySelector('.section-title');
                const title = sectionTitle ? sectionTitle.textContent : 'Sección';
                
                results.push({
                    title: title,
                    text: element.textContent.substring(0, 50) + '...',
                    category: category,
                    element: element
                });
            }
        }
    });
    
    if (results.length > 0) {
        searchResults.innerHTML = results.map(result => `
            <div class="search-result-item" onclick="scrollToElement('${result.element.id || ''}', '${result.category}')">
                <div class="font-medium text-gray-800">${result.title}</div>
                <div class="text-sm text-gray-600">${result.text}</div>
                <div class="text-xs text-blue-600 capitalize">${result.category}</div>
            </div>
        `).join('');
        searchResults.classList.add('show');
    } else {
        searchResults.innerHTML = '<div class="search-result-item"><div class="text-gray-500">No se encontraron resultados</div></div>';
        searchResults.classList.add('show');
    }
}

function hideSearchResults() {
    document.getElementById('searchResults').classList.remove('show');
}

function scrollToElement(elementId, category) {
    hideSearchResults();
    document.getElementById('searchInput').value = '';
    searchTerm = '';
    
    // Scroll to section
    const sections = {
        'market': 'market-section',
        'strategy': 'strategy-section',
        'metrics': 'metrics-section',
        'campaigns': 'campaigns-section'
    };
    
    const sectionId = sections[category];
    if (sectionId) {
        document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
        
        // Highlight the section briefly
        const section = document.getElementById(sectionId);
        section.style.backgroundColor = '#eff6ff';
        setTimeout(() => {
            section.style.backgroundColor = '';
        }, 2000);
    }
}

function scrollToSection(sectionId) {
    const targetId = sectionId === 'dashboard' ? 'dashboard' : 
                     sectionId === 'market-section' ? 'market-section' :
                     sectionId === 'strategy-section' ? 'strategy-section' :
                     sectionId === 'metrics-section' ? 'metrics-section' :
                     sectionId === 'campaigns-section' ? 'campaigns-section' : 'dashboard';
    
    document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' });
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

// Notification system
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = message;
    toast.classList.remove('translate-y-full');
    
    // Add notification to panel
    addNotification(message, type);
    
    setTimeout(() => {
        toast.classList.add('translate-y-full');
    }, 3000);
}

function addNotification(message, type = 'info') {
    const notification = {
        id: Date.now(),
        message: message,
        type: type,
        timestamp: new Date(),
        read: false
    };
    
    notifications.unshift(notification);
    updateNotificationBadge();
    renderNotifications();
    
    // Save to localStorage
    localStorage.setItem('marketingDashboard_notifications', JSON.stringify(notifications));
}

function updateNotificationBadge() {
    const badge = document.getElementById('notificationBadge');
    const unreadCount = notifications.filter(n => !n.read).length;
    badge.textContent = unreadCount;
    badge.style.display = unreadCount > 0 ? 'flex' : 'none';
}

function renderNotifications() {
    const list = document.getElementById('notificationList');
    list.innerHTML = '';
    
    if (notifications.length === 0) {
        list.innerHTML = '<div class="p-4 text-center text-gray-500">No hay notificaciones</div>';
        return;
    }
    
    notifications.forEach(notification => {
        const item = document.createElement('div');
        item.className = `notification-item ${!notification.read ? 'unread' : ''}`;
        
        const iconMap = {
            'success': 'fas fa-check-circle text-green-500',
            'error': 'fas fa-exclamation-circle text-red-500',
            'warning': 'fas fa-exclamation-triangle text-yellow-500',
            'info': 'fas fa-info-circle text-blue-500'
        };
        
        item.innerHTML = `
            <div class="flex items-start space-x-3">
                <i class="${iconMap[notification.type] || iconMap.info} mt-1"></i>
                <div class="flex-1">
                    <p class="text-sm text-gray-800">${notification.message}</p>
                    <p class="text-xs text-gray-500 mt-1">${formatTime(notification.timestamp)}</p>
                </div>
                <button onclick="markAsRead(${notification.id})" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times text-xs"></i>
                </button>
            </div>
        `;
        
        list.appendChild(item);
    });
}

function toggleNotificationPanel() {
    const panel = document.getElementById('notificationPanel');
    panel.classList.toggle('open');
    
    if (panel.classList.contains('open')) {
        // Mark all as read
        notifications.forEach(n => n.read = true);
        updateNotificationBadge();
        localStorage.setItem('marketingDashboard_notifications', JSON.stringify(notifications));
    }
}

function markAsRead(id) {
    notifications = notifications.filter(n => n.id !== id);
    updateNotificationBadge();
    renderNotifications();
    localStorage.setItem('marketingDashboard_notifications', JSON.stringify(notifications));
}

function formatTime(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Justo ahora';
    if (minutes < 60) return `Hace ${minutes} min`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Hace ${hours} h`;
    
    const days = Math.floor(hours / 24);
    return `Hace ${days} d`;
}

// Editable content functions
function makeEditable(element) {
    if (isEditing) return;
    
    isEditing = true;
    element.contentEditable = 'true';
    element.classList.add('editing');
    element.focus();
    
    // Store original value
    originalData[element.dataset.field] = element.textContent;
    
    // Select all text
    const range = document.createRange();
    range.selectNodeContents(element);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    
    // Add event listeners for save/cancel
    element.addEventListener('blur', saveEdit);
    element.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            saveEdit.call(element);
        } else if (e.key === 'Escape') {
            cancelEdit.call(element);
        }
    });
    
    function saveEdit() {
        const newValue = this.textContent.trim();
        const field = this.dataset.field;
        
        if (newValue && newValue !== originalData[field]) {
            showSaveIndicator();
            
            setTimeout(() => {
                this.contentEditable = 'false';
                this.classList.remove('editing');
                isEditing = false;
                
                // Save to localStorage
                const savedData = JSON.parse(localStorage.getItem('marketingDashboard_data') || '{}');
                savedData[field] = newValue;
                localStorage.setItem('marketingDashboard_data', JSON.stringify(savedData));
                
                hideSaveIndicator();
                showToast('Cambios guardados exitosamente');
                
                // Update related displays if needed
                updateRelatedDisplays(field, newValue);
            }, 500);
        } else {
            this.contentEditable = 'false';
            this.classList.remove('editing');
            isEditing = false;
        }
    }
    
    function cancelEdit() {
        this.textContent = originalData[this.dataset.field];
        this.contentEditable = 'false';
        this.classList.remove('editing');
        isEditing = false;
    }
}

function showSaveIndicator() {
    const indicator = document.getElementById('saveIndicator');
    indicator.classList.add('show');
}

function hideSaveIndicator() {
    const indicator = document.getElementById('saveIndicator');
    indicator.classList.remove('show');
}

function updateRelatedDisplays(field, value) {
    // Update progress bars if percentage fields change
    if (field.includes('percent')) {
        const progressBar = document.querySelector(`[data-field="${field}"]`).parentElement.querySelector('.bg-blue-500, .bg-green-500, .bg-purple-500');
        if (progressBar) {
            const percent = parseInt(value) || 0;
            progressBar.style.width = `${percent}%`;
        }
    }
}

// Data persistence
function loadSavedData() {
    const savedData = JSON.parse(localStorage.getItem('marketingDashboard_data') || '{}');
    
    Object.keys(savedData).forEach(field => {
        const element = document.querySelector(`[data-field="${field}"]`);
        if (element) {
            element.textContent = savedData[field];
        }
    });
    
    // Load notifications
    const savedNotifications = localStorage.getItem('marketingDashboard_notifications');
    if (savedNotifications) {
        notifications = JSON.parse(savedNotifications);
        renderNotifications();
    }
    
    // Load calendar events
    const savedCalendarEvents = localStorage.getItem('marketingDashboard_calendarEvents');
    if (savedCalendarEvents) {
        calendarEvents = JSON.parse(savedCalendarEvents);
    }
}

// Calendar functionality
function initializeCalendar() {
    renderCalendar();
}

function renderCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    const currentMonthElement = document.getElementById('currentMonth');
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    currentMonthElement.textContent = new Date(year, month).toLocaleDateString('es-ES', { 
        month: 'long', 
        year: 'numeric' 
    });
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    calendarGrid.innerHTML = '';
    
    // Add day headers
    const dayHeaders = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    dayHeaders.forEach(day => {
        const header = document.createElement('div');
        header.className = 'calendar-day font-semibold text-center bg-gray-100 text-gray-600';
        header.textContent = day;
        calendarGrid.appendChild(header);
    });
    
    // Add calendar days
    for (let i = 0; i < 42; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        if (date.getMonth() !== month) {
            dayElement.classList.add('other-month');
        }
        
        const dateKey = formatDateKey(date);
        if (calendarEvents[dateKey]) {
            dayElement.classList.add('has-content');
        }
        
        dayElement.innerHTML = `
            <div class="font-medium">${date.getDate()}</div>
            ${calendarEvents[dateKey] ? `<div class="calendar-event">${calendarEvents[dateKey]}</div>` : ''}
        `;
        
        dayElement.addEventListener('click', () => selectDate(date));
        
        calendarGrid.appendChild(dayElement);
    }
}

function previousMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
}

function selectDate(date) {
    const dateKey = formatDateKey(date);
    const event = prompt('Agregar evento para ' + date.toLocaleDateString('es-ES') + ':');
    
    if (event && event.trim()) {
        calendarEvents[dateKey] = event.trim();
        localStorage.setItem('marketingDashboard_calendarEvents', JSON.stringify(calendarEvents));
        renderCalendar();
        showToast('Evento agregado al calendario');
        addNotification(`Evento agregado: ${event.trim()} para ${date.toLocaleDateString('es-ES')}`, 'success');
    }
}

function formatDateKey(date) {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function showContentCalendar() {
    const calendar = document.getElementById('contentCalendar');
    calendar.style.display = calendar.style.display === 'none' ? 'block' : 'none';
    if (calendar.style.display === 'block') {
        renderCalendar();
        showToast('Calendario de contenido abierto');
    }
}

// Chart functionality
function createSegmentationChart() {
    const data = [{
        values: [54, 28, 18],
        labels: ['Alumnos Individuales', 'Escuelas', 'Corporaciones'],
        type: 'pie',
        hole: 0.4,
        marker: {
            colors: ['#3b82f6', '#10b981', '#8b5cf6']
        },
        textinfo: 'label+percent',
        textposition: 'outside',
        hovertemplate: '<b>%{label}</b><br>%{percent}<br><extra></extra>'
    }];

    const layout = {
        showlegend: false,
        margin: { t: 0, b: 0, l: 0, r: 0 },
        font: {
            family: 'Inter, sans-serif',
            size: 12,
            color: '#374151'
        },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
    };

    const config = {
        displayModeBar: false,
        responsive: true
    };

    Plotly.newPlot('segmentationChart', data, layout, config);
}

// Consultation modal functions
function openConsultationModal() {
    const modal = document.getElementById('consultationModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeConsultationModal() {
    const modal = document.getElementById('consultationModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.getElementById('consultationForm').reset();
}

function handleConsultationSubmit(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('consultationName').value,
        email: document.getElementById('consultationEmail').value,
        phone: document.getElementById('consultationPhone').value,
        date: document.getElementById('consultationDate').value,
        time: document.getElementById('consultationTime').value,
        type: document.getElementById('consultationType').value,
        message: document.getElementById('consultationMessage').value
    };
    
    // Simulate API call
    showSaveIndicator();
    
    setTimeout(() => {
        // Save consultation data
        const consultations = JSON.parse(localStorage.getItem('marketingDashboard_consultations') || '[]');
        consultations.push({
            id: Date.now(),
            ...formData,
            status: 'pending',
            createdAt: new Date()
        });
        localStorage.setItem('marketingDashboard_consultations', JSON.stringify(consultations));
        
        hideSaveIndicator();
        closeConsultationModal();
        showToast('Consultoría agendada exitosamente');
        addNotification(`Nueva consultoría agendada: ${formData.name} para ${formData.date} a las ${formData.time}`, 'success');
    }, 1500);
}

// Interactive functions
function showDetails(type) {
    const modal = document.getElementById('detailModal');
    const title = document.getElementById('modalTitle');
    const content = document.getElementById('modalContent');
    
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
        case 'tech-trends':
            title.textContent = 'Tendencias Tecnológicas';
            content.innerHTML = `
                <div class="space-y-4">
                    <div class="bg-blue-50 p-4 rounded-lg">
                        <h4 class="font-bold text-blue-800 mb-2">Chatbots Educativos</h4>
                        <p class="text-sm text-gray-700">Los chatbots con IA están revolucionando la educación online, proporcionando retroalimentación instantánea y apoyo personalizado 24/7.</p>
                    </div>
                    <div class="bg-green-50 p-4 rounded-lg">
                        <h4 class="font-bold text-green-800 mb-2">Apps Móviles</h4>
                        <p class="text-sm text-gray-700">El aprendizaje móvil está en auge, con 980M de usuarios activos mensuales en aplicaciones de idiomas.</p>
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
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

// Budget editor
function openBudgetEditor() {
    const modal = document.getElementById('budgetModal');
    
    // Load current values
    document.getElementById('digitalAdsInput').value = document.querySelector('[data-field="digital-ads"]').textContent.replace('%', '');
    document.getElementById('contentMarketingInput').value = document.querySelector('[data-field="content-marketing"]').textContent.replace('%', '');
    document.getElementById('influencersInput').value = document.querySelector('[data-field="influencers"]').textContent.replace('%', '');
    document.getElementById('aiToolsInput').value = document.querySelector('[data-field="ai-tools"]').textContent.replace('%', '');
    
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeBudgetEditor() {
    const modal = document.getElementById('budgetModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function saveBudget() {
    const digitalAds = document.getElementById('digitalAdsInput').value;
    const contentMarketing = document.getElementById('contentMarketingInput').value;
    const influencers = document.getElementById('influencersInput').value;
    const aiTools = document.getElementById('aiToolsInput').value;
    
    // Update display values
    document.querySelector('[data-field="digital-ads"]').textContent = digitalAds + '%';
    document.querySelector('[data-field="content-marketing"]').textContent = contentMarketing + '%';
    document.querySelector('[data-field="influencers"]').textContent = influencers + '%';
    document.querySelector('[data-field="ai-tools"]').textContent = aiTools + '%';
    
    // Update progress bars
    document.querySelector('[data-field="digital-ads"]').parentElement.querySelector('.bg-blue-500').style.width = digitalAds + '%';
    document.querySelector('[data-field="content-marketing"]').parentElement.querySelector('.bg-green-500').style.width = contentMarketing + '%';
    document.querySelector('[data-field="influencers"]').parentElement.querySelector('.bg-purple-500').style.width = influencers + '%';
    document.querySelector('[data-field="ai-tools"]').parentElement.querySelector('.bg-red-500').style.width = aiTools + '%';
    
    // Save to localStorage
    const savedData = JSON.parse(localStorage.getItem('marketingDashboard_data') || '{}');
    savedData['digital-ads'] = digitalAds + '%';
    savedData['content-marketing'] = contentMarketing + '%';
    savedData['influencers'] = influencers + '%';
    savedData['ai-tools'] = aiTools + '%';
    localStorage.setItem('marketingDashboard_data', JSON.stringify(savedData));
    
    closeBudgetEditor();
    showToast('Presupuesto actualizado exitosamente');
    addNotification(`Presupuesto modificado: Digital ${digitalAds}%, Content ${contentMarketing}%, Influencers ${influencers}%, IA ${aiTools}%`, 'success');
}

// Campaign management
function createCampaign() {
    const modal = document.getElementById('campaignModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeCampaignCreator() {
    const modal = document.getElementById('campaignModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.getElementById('campaignForm').reset();
}

function handleCampaignSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('campaignName').value.trim();
    const type = document.getElementById('campaignType').value;
    const budget = parseFloat(document.getElementById('campaignBudget').value);
    const startDate = document.getElementById('campaignStartDate').value;
    const endDate = document.getElementById('campaignEndDate').value;
    const description = document.getElementById('campaignDescription').value.trim();
    
    const campaign = {
        id: Date.now(),
        name: name,
        type: type,
        budget: budget,
        startDate: startDate,
        endDate: endDate,
        description: description,
        status: 'active',
        createdAt: new Date()
    };
    
    campaigns.push(campaign);
    saveCampaigns();
    renderCampaigns();
    closeCampaignCreator();
    showToast('Campaña creada exitosamente');
    addNotification(`Nueva campaña creada: ${name} (${type})`, 'success');
}

function renderCampaigns() {
    const list = document.getElementById('campaignList');
    
    if (campaigns.length === 0) {
        list.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <i class="fas fa-bullhorn text-3xl mb-2"></i>
                <p>No hay campañas activas</p>
                <button onclick="createCampaign()" class="mt-2 text-blue-600 hover:text-blue-800">
                    <i class="fas fa-plus mr-1"></i>Crear primera campaña
                </button>
            </div>
        `;
        return;
    }
    
    list.innerHTML = '';
    campaigns.forEach(campaign => {
        const item = document.createElement('div');
        item.className = 'bg-white p-4 rounded-lg border hover:shadow-md transition-all cursor-pointer';
        
        const typeIcons = {
            'social': 'fab fa-facebook text-blue-500',
            'email': 'fas fa-envelope text-green-500',
            'ads': 'fas fa-bullhorn text-purple-500',
            'content': 'fas fa-pen text-orange-500'
        };
        
        const statusColors = {
            'active': 'bg-green-100 text-green-800',
            'paused': 'bg-yellow-100 text-yellow-800',
            'completed': 'bg-gray-100 text-gray-800'
        };
        
        item.innerHTML = `
            <div class="flex items-center justify-between mb-2">
                <div class="flex items-center space-x-2">
                    <i class="${typeIcons[campaign.type] || typeIcons.social}"></i>
                    <h4 class="font-semibold text-gray-800">${campaign.name}</h4>
                </div>
                <span class="px-2 py-1 rounded-full text-xs font-medium ${statusColors[campaign.status] || statusColors.active}">
                    ${campaign.status}
                </span>
            </div>
            <div class="text-sm text-gray-600 mb-2">
                <div class="flex justify-between">
                    <span>Presupuesto: $${campaign.budget.toLocaleString()}</span>
                    <span>${formatDate(campaign.startDate)} - ${formatDate(campaign.endDate)}</span>
                </div>
            </div>
            <div class="flex space-x-2">
                <button onclick="editCampaign(${campaign.id})" class="text-blue-600 hover:text-blue-800 text-sm">
                    <i class="fas fa-edit mr-1"></i>Editar
                </button>
                <button onclick="${campaign.status === 'active' ? 'pauseCampaign' : 'activateCampaign'}(${campaign.id})" class="text-yellow-600 hover:text-yellow-800 text-sm">
                    <i class="fas fa-${campaign.status === 'active' ? 'pause' : 'play'} mr-1"></i>${campaign.status === 'active' ? 'Pausar' : 'Reanudar'}
                </button>
                <button onclick="deleteCampaign(${campaign.id})" class="text-red-600 hover:text-red-800 text-sm">
                    <i class="fas fa-trash mr-1"></i>Eliminar
                </button>
            </div>
        `;
        
        list.appendChild(item);
    });
}

function editCampaign(id) {
    const campaign = campaigns.find(c => c.id === id);
    if (!campaign) return;
    
    const newName = prompt('Nuevo nombre de la campaña:', campaign.name);
    if (newName && newName.trim()) {
        campaign.name = newName.trim();
        saveCampaigns();
        renderCampaigns();
        showToast('Campaña actualizada');
        addNotification(`Campaña modificada: ${newName}`, 'success');
    }
}

function pauseCampaign(id) {
    const campaign = campaigns.find(c => c.id === id);
    if (!campaign) return;
    
    campaign.status = 'paused';
    saveCampaigns();
    renderCampaigns();
    showToast('Campaña pausada');
    addNotification(`Campaña pausada: ${campaign.name}`, 'warning');
}

function activateCampaign(id) {
    const campaign = campaigns.find(c => c.id === id);
    if (!campaign) return;
    
    campaign.status = 'active';
    saveCampaigns();
    renderCampaigns();
    showToast('Campaña activada');
    addNotification(`Campaña activada: ${campaign.name}`, 'success');
}

function deleteCampaign(id) {
    if (!confirm('¿Estás seguro de eliminar esta campaña?')) return;
    
    const campaign = campaigns.find(c => c.id === id);
    campaigns = campaigns.filter(c => c.id !== id);
    saveCampaigns();
    renderCampaigns();
    showToast('Campaña eliminada');
    addNotification(`Campaña eliminada: ${campaign.name}`, 'error');
}

function saveCampaigns() {
    localStorage.setItem('marketingDashboard_campaigns', JSON.stringify(campaigns));
}

function loadCampaigns() {
    const savedCampaigns = localStorage.getItem('marketingDashboard_campaigns');
    if (savedCampaigns) {
        campaigns = JSON.parse(savedCampaigns);
        renderCampaigns();
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
    });
}

// Other interactive functions
function refreshData(type) {
    showToast(`Datos de ${type} actualizados exitosamente`);
    animateNumbers();
    addNotification(`Datos de ${type} actualizados`, 'success');
}

function toggleSegmentation() {
    showToast('Segmentación actualizada');
    addNotification('Segmentación de mercado actualizada', 'info');
    createSegmentationChart();
}

function editSegment(segment) {
    const element = document.querySelector(`[data-field="${segment}-percent"]`);
    if (element) {
        makeEditable(element);
        setTimeout(() => createSegmentationChart(), 100);
    }
}

function showTechDetails() {
    showDetails('tech-trends');
}

function editTechMetric(metric) {
    const element = document.querySelector(`[data-field="${metric}-adoption"], [data-field="${metric}-users"]`);
    if (element) {
        makeEditable(element);
    }
}

function showStrategyDetails() {
    showToast('Detalles de estrategia mostrados');
    addNotification('Estrategias de marketing revisadas', 'info');
}

function exportStrategy() {
    // Create downloadable content
    const strategyData = {
        platforms: {
            linkedin: {
                name: 'LinkedIn',
                description: document.querySelector('[data-field="linkedin-desc"]').textContent,
                target: document.querySelector('[data-field="linkedin-target"]').textContent
            },
            instagram: {
                name: 'Instagram',
                description: document.querySelector('[data-field="instagram-desc"]').textContent,
                target: document.querySelector('[data-field="instagram-target"]').textContent
            },
            youtube: {
                name: 'YouTube',
                description: document.querySelector('[data-field="youtube-desc"]').textContent,
                target: document.querySelector('[data-field="youtube-target"]').textContent
            },
            tiktok: {
                name: 'TikTok',
                description: document.querySelector('[data-field="tiktok-desc"]').textContent,
                target: document.querySelector('[data-field="tiktok-target"]').textContent
            }
        },
        valueProposition: document.querySelector('[data-field="value-proposition"]').textContent,
        exportDate: new Date().toLocaleDateString('es-ES')
    };
    
    const dataStr = JSON.stringify(strategyData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `estrategia-marketing-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showToast('Estrategia exportada exitosamente');
    addNotification('Estrategia exportada a JSON', 'success');
}

function editPlatform(platform) {
    const descElement = document.querySelector(`[data-field="${platform}-desc"]`);
    if (descElement) {
        makeEditable(descElement);
    }
}

function editValueProposition() {
    const element = document.querySelector('[data-field="value-proposition"]');
    if (element) {
        makeEditable(element);
    }
}

function testValueProposition() {
    showToast('Test A/B iniciado');
    addNotification('Test A/B de propuesta de valor iniciado', 'info');
}

function addContent() {
    showToast('Nuevo contenido agregado');
    addNotification('Nuevo contenido agregado al plan', 'success');
}

function editContent(day) {
    const titleElement = document.querySelector(`[data-field="${day}-title"]`);
    const descElement = document.querySelector(`[data-field="${day}-desc"]`);
    
    if (titleElement) {
        makeEditable(titleElement);
        setTimeout(() => {
            if (descElement) {
                makeEditable(descElement);
            }
        }, 100);
    }
}

function previewContent(day) {
    showToast(`Vista previa de contenido de ${day}`);
    addNotification(`Vista previa de contenido: ${day}`, 'info');
}

function refreshKPIs() {
    showToast('KPIs actualizados');
    animateNumbers();
    addNotification('KPIs actualizados con nuevos datos', 'success');
}

function launchCampaign() {
    createCampaign();
}

function scheduleConsultation() {
    openConsultationModal();
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
        closeBudgetEditor();
        closeCampaignCreator();
        closeConsultationModal();
        document.getElementById('notificationPanel').classList.remove('open');
        hideSearchResults();
    }
    if (e.key === 'f' && e.ctrlKey) {
        e.preventDefault();
        document.getElementById('searchInput').focus();
    }
    if (e.key === 'n' && e.ctrlKey) {
        e.preventDefault();
        toggleNotificationPanel();
    }
});

// Close modals when clicking outside
document.getElementById('detailModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

document.getElementById('budgetModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeBudgetEditor();
    }
});

document.getElementById('campaignModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeCampaignCreator();
    }
});

document.getElementById('consultationModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeConsultationModal();
    }
});

// Initialize with welcome notification
setTimeout(() => {
    addNotification('Sistema de MarketingPro inicializado correctamente', 'success');
}, 1000);