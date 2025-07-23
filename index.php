<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JejenOS - Sistema Operativo Web</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="icon" href="assets/img/mosquito-icon.png" type="image/png">
</head>
<body>
    <!-- Escritorio principal -->
    <div id="desktop" class="desktop">
        <!-- Iconos del escritorio -->
        <div class="desktop-icons">
            <div class="desktop-icon" data-app="calculator">
                <div class="icon">🧮</div>
                <span>Calculadora</span>
            </div>
            <div class="desktop-icon" data-app="notepad">
                <div class="icon">📝</div>
                <span>Bloc de Notas</span>
            </div>
            <div class="desktop-icon" data-app="file-manager">
                <div class="icon">📁</div>
                <span>Archivos</span>
            </div>
            <div class="desktop-icon" data-app="terminal">
                <div class="icon">💻</div>
                <span>Terminal</span>
            </div>
        </div>
    </div>

    <!-- Barra de tareas -->
    <div id="taskbar" class="taskbar">
        <div class="taskbar-left">
            <button id="start-btn" class="start-button">
                <span class="mosquito-logo">🦟</span>
                <span>JejenOS</span>
            </button>
            <div id="taskbar-apps" class="taskbar-apps"></div>
        </div>
        
        <div class="taskbar-right">
            <div class="system-tray">
                <span id="clock" class="clock"></span>
            </div>
        </div>
    </div>

    <!-- Menú de inicio -->
    <div id="start-menu" class="start-menu hidden">
        <div class="start-menu-header">
            <span class="mosquito-logo">🦟</span>
            <span>JejenOS</span>
        </div>
        <div class="start-menu-apps">
            <div class="start-app" data-app="calculator">
                <span class="icon">🧮</span>
                <span>Calculadora</span>
            </div>
            <div class="start-app" data-app="notepad">
                <span class="icon">📝</span>
                <span>Bloc de Notas</span>
            </div>
            <div class="start-app" data-app="file-manager">
                <span class="icon">📁</span>
                <span>Explorador de Archivos</span>
            </div>
            <div class="start-app" data-app="terminal">
                <span class="icon">💻</span>
                <span>Terminal</span>
            </div>
            <div class="start-app" data-app="settings">
                <span class="icon">⚙️</span>
                <span>Configuración</span>
            </div>
        </div>
        <div class="start-menu-footer">
            <button class="power-btn">🔌 Apagar</button>
        </div>
    </div>

    <!-- Contenedor de ventanas -->
    <div id="windows-container"></div>

    <!-- Scripts -->
    <script src="assets/js/core.js"></script>
    <script src="assets/js/window-manager.js"></script>
    <script src="assets/js/apps.js"></script>
</body>
</html>