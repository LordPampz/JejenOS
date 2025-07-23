# 🦟 JejenOS - Sistema Operativo Web

JejenOS es un sistema operativo web experimental que simula un entorno de escritorio completo en el navegador. Desarrollado con tecnologías web modernas para ofrecer una experiencia similar a un SO tradicional.

## 🚀 Características

### Funcionalidades Actuales (v1.0.0 Beta)
- **Escritorio interactivo** con iconos arrastrables
- **Barra de tareas** funcional con reloj en tiempo real
- **Menú de inicio** con aplicaciones disponibles
- **Sistema de ventanas** completamente funcional:
  - Ventanas arrastrables y redimensionables
  - Minimizar, maximizar y cerrar
  - Gestión de z-index automática
- **Aplicaciones integradas**:
  - 🧮 **Calculadora** - Calculadora completa con operaciones básicas
  - 📝 **Bloc de Notas** - Editor de texto simple
  - 📁 **Explorador de Archivos** - Navegación por sistema de archivos simulado
  - ⚙️ **Configuración** - Panel de configuración del sistema
- **Sistema de notificaciones** con animaciones
- **Interfaz responsive** para dispositivos móviles
- **Tema mosquito** con emojis y colores personalizados

## 🛠 Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Backend**: PHP (para futuras expansiones)
- **Servidor**: Apache (XAMPP)
- **Arquitectura**: Modular y orientada a componentes

## 📁 Estructura del Proyecto

```
JejenOS/
├── index.php                 # Página principal del SO
├── README.md                 # Documentación
└── assets/
    ├── css/
    │   └── style.css         # Estilos principales
    ├── js/
    │   ├── core.js           # Sistema principal
    │   ├── window-manager.js # Gestor de ventanas
    │   └── apps.js           # Aplicaciones
    └── img/                  # Recursos de imagen
```

## 🚀 Instalación y Uso

### Prerrequisitos
- XAMPP instalado y funcionando
- Navegador web moderno

### Pasos
1. Clona o descarga el proyecto en tu directorio `htdocs` de XAMPP
2. Asegúrate de que Apache esté ejecutándose
3. Navega a `http://localhost/proyectos/JejenOS/`
4. ¡Disfruta de JejenOS! 🦟

## 🎮 Cómo Usar

### Acciones Básicas
- **Abrir aplicaciones**: Doble clic en iconos del escritorio o usar el menú inicio
- **Mover ventanas**: Arrastra desde la barra de título
- **Redimensionar**: Arrastra desde la esquina inferior derecha
- **Minimizar/Maximizar**: Usa los botones de control de ventana
- **Cambiar entre ventanas**: Haz clic en la barra de tareas

### Aplicaciones Disponibles
- **Calculadora**: Operaciones matemáticas básicas
- **Bloc de Notas**: Edición de texto simple
- **Explorador**: Navegación por archivos simulados
- **Configuración**: Información del sistema y preferencias

## 🔮 Roadmap - Próximas Funciones

### Fase 2 - Funcionalidades Básicas
- [ ] Terminal/Consola web
- [ ] Reproductor de multimedia
- [ ] Visor de imágenes
- [ ] Calendario y reloj avanzado
- [ ] Gestión de procesos

### Fase 3 - Funcionalidades Avanzadas
- [ ] Sistema de archivos persistente (LocalStorage/IndexedDB)
- [ ] Multi-usuario con autenticación
- [ ] Temas personalizables
- [ ] Widgets de escritorio
- [ ] API REST para comunicación backend

### Fase 4 - Características Avanzadas
- [ ] Sistema de plugins
- [ ] Compartir archivos entre usuarios
- [ ] Navegador web integrado
- [ ] Editor de código
- [ ] Sistema de actualizaciones automáticas

## 🧩 Arquitectura Modular

JejenOS está diseñado con una arquitectura modular para facilitar el desarrollo y mantenimiento:

- **Core System** (`core.js`): Maneja la inicialización y eventos principales
- **Window Manager** (`window-manager.js`): Gestiona todas las operaciones de ventanas
- **App Manager** (`apps.js`): Controla las aplicaciones y su ciclo de vida

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Para contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📝 Notas de Desarrollo

### Agregar Nueva Aplicación
1. Agregar entrada en el menú inicio y escritorio (index.php)
2. Crear método `openNuevaApp()` en `AppManager`
3. Implementar lógica específica de la aplicación
4. Agregar estilos CSS necesarios

### Convenciones de Código
- Usar camelCase para variables y funciones
- Clases con PascalCase
- Comentarios en español
- Código limpio y bien documentado

## 🐛 Problemas Conocidos

- La persistencia de datos es temporal (se pierde al recargar)
- Algunas animaciones pueden ser lentas en dispositivos antiguos
- El explorador de archivos es simulado (no accede a archivos reales)

## 📜 Licencia

Este proyecto es de código abierto y está disponible bajo la Licencia MIT.

## 👨‍💻 Créditos

Desarrollado con ❤️ y mucho ☕ para la comunidad de desarrollo web.

---

**¡Gracias por usar JejenOS! 🦟**

*¿Encontraste un bug? ¿Tienes una idea genial? ¡Déjanos saberlo!*
