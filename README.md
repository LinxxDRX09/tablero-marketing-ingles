# MarketingPro Dashboard

Un sistema completo e interactivo de gestión de marketing digital desarrollado con tecnologías web modernas.

## 🚀 Características Principales

### ✅ Funcionalidades Implementadas

1. **Interfaz Totalmente Interactiva**
   - Todos los botones tienen funcionalidad real
   - Doble clic para editar cualquier contenido
   - Guardado automático de cambios
   - Sistema de notificaciones en tiempo real

2. **Sistema de Navegación**
   - Navegación fluida entre páginas
   - Filtros por categorías (Mercado, Estrategia, Métricas, Campañas)
   - Barra de búsqueda inteligente
   - Búsqueda en tiempo real

3. **Gestión de Campañas Real**
   - Crear, editar, pausar y eliminar campañas
   - Asignar presupuestos y fechas
   - Filtrar por tipo y estado
   - Vista detallada de campañas

4. **Editor de Presupuesto Funcional**
   - Modificar porcentajes de asignación
   - Actualización visual en tiempo real
   - Validación de datos
   - Guardado persistente

5. **Planificador de Contenidos**
   - Editar contenido de cada día
   - Vista previa de publicaciones
   - Calendario integrado
   - Programación de contenido

6. **Sistema de Notificaciones**
   - Notificaciones por cada acción
   - Panel de notificaciones deslizable
   - Marcado como leído
   - Historial de actividades

### 📊 Dashboard Principal

- **Mercado Global**: Datos actualizados del mercado de cursos de inglés online
- **Segmentación**: Análisis detallado de audiencias objetivo
- **Tendencias IA**: Información sobre tecnologías emergentes
- **Estrategias de Marketing**: Planes detallados por plataforma
- **KPIs**: Métricas clave en tiempo real
- **Presupuesto**: Asignación y control de recursos

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica y moderna
- **CSS3**: Tailwind CSS para estilos responsivos
- **JavaScript**: Vanilla JS para máximo rendimiento
- **LocalStorage**: Persistencia de datos del usuario
- **Font Awesome**: Iconos vectoriales
- **Google Fonts**: Tipografías premium

## 📁 Estructura del Proyecto

```
marketingpro-dashboard/
├── index.html          # Dashboard principal
├── campaigns.html      # Gestor de campañas
├── main.js            # Lógica principal
└── README.md          # Este archivo
```

## 🚀 Instalación y Uso

### Opción 1: Implementación en GitHub Pages

1. **Crear un repositorio en GitHub**
   ```bash
   # Crear nuevo repositorio
   git init
   git add .
   git commit -m "Initial commit - MarketingPro Dashboard"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/marketingpro-dashboard.git
   git push -u origin main
   ```

2. **Activar GitHub Pages**
   - Ir a Settings → Pages
   - Seleccionar "Deploy from a branch"
   - Elegir la rama "main" y carpeta "/ (root)"
   - Guardar

3. **Acceder al Dashboard**
   - URL: `https://TU_USUARIO.github.io/marketingpro-dashboard/`

### Opción 2: Servidor Local

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/TU_USUARIO/marketingpro-dashboard.git
   cd marketingpro-dashboard
   ```

2. **Iniciar servidor local**
   ```bash
   # Con Python
   python -m http.server 8000
   
   # Con Node.js
   npx serve .
   
   # Con PHP
   php -S localhost:8000
   ```

3. **Abrir en navegador**
   - URL: `http://localhost:8000`

## 💡 Cómo Usar

### Editar Contenido
1. Haz doble clic en cualquier texto editable
2. Modifica el contenido
3. Presiona Enter o haz clic fuera para guardar
4. Los cambios se guardan automáticamente

### Crear Campañas
1. Haz clic en "Nueva Campaña"
2. Completa el formulario
3. Asigna presupuesto y fechas
4. La campaña aparecerá en la lista

### Filtrar Información
1. Usa los filtros en la parte superior
2. La búsqueda funciona en tiempo real
3. Combinar múltiples filtros para resultados específicos

### Sistema de Notificaciones
1. Haz clic en el icono de campana
2. Revisa el historial de actividades
3. Marca notificaciones como leídas

## 🔧 Personalización

### Modificar Datos Iniciales
Edita los valores en los elementos HTML con atributos `data-field`:

```html
<div class="editable-content" contenteditable="false" data-field="market-value">$13.97B</div>
```

### Agregar Nuevas Secciones
1. Añade el HTML en `index.html`
2. Implementa la lógica en `main.js`
3. Asegúrate de usar clases consistentes

### Personalizar Estilos
Modifica las clases de Tailwind CSS o agrega estilos personalizados en el `<style>` del HTML.

## 📱 Responsive Design

El dashboard es completamente responsivo:
- **Desktop**: Vista completa con 3 columnas
- **Tablet**: Diseño adaptativo
- **Mobile**: Vista apilada optimizada para touch

## 🔒 Seguridad y Privacidad

- Todos los datos se almacenan localmente
- No hay envío de datos a servidores externos
- Cumplimiento con GDPR por diseño
- Sin cookies de rastreo

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Por favor:

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo LICENSE para detalles.

## 📞 Soporte

Si tienes preguntas o necesitas ayuda:

- Crea un Issue en GitHub
- Revisa la documentación
- Contacta al equipo de desarrollo

---

**¡Disfruta usando MarketingPro Dashboard! 🚀**
