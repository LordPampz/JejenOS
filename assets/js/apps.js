// JejenOS - Administrador de Aplicaciones
class AppManager {
    constructor() {
        this.windowManager = null;
        this.runningApps = new Map();
        this.initWindowManager();
    }

    initWindowManager() {
        // Esperar a que WindowManager esté disponible
        if (window.jejenOS && window.jejenOS.windowManager) {
            this.windowManager = window.jejenOS.windowManager;
        } else {
            setTimeout(() => this.initWindowManager(), 100);
        }
    }

    openApp(appName) {
        if (!this.windowManager) {
            console.error('WindowManager no está disponible');
            return;
        }

        // Verificar si la app ya está abierta (excepto apps que permiten múltiples instancias)
        const multiInstanceApps = ['notepad', 'calculator'];
        if (!multiInstanceApps.includes(appName) && this.runningApps.has(appName)) {
            const existingWindowId = this.runningApps.get(appName);
            this.windowManager.focusWindow(existingWindowId);
            return;
        }

        let windowId;
        switch (appName) {
            case 'calculator':
                windowId = this.openCalculator();
                break;
            case 'notepad':
                windowId = this.openNotepad();
                break;
            case 'file-manager':
                windowId = this.openFileManager();
                break;
            case 'settings':
                windowId = this.openSettings();
                break;
            default:
                this.windowManager.createNotification(
                    'App no encontrada',
                    `La aplicación "${appName}" no está disponible aún.`,
                    'error'
                );
                return;
        }

        if (windowId && !multiInstanceApps.includes(appName)) {
            this.runningApps.set(appName, windowId);
        }
    }

    openCalculator() {
        const content = `
            <div class="calculator">
                <input type="text" id="calc-display" class="calculator-display" value="0" readonly>
                <div class="calculator-buttons">
                    <button class="calc-btn" onclick="calculator.clear()">C</button>
                    <button class="calc-btn" onclick="calculator.clearEntry()">CE</button>
                    <button class="calc-btn" onclick="calculator.backspace()">←</button>
                    <button class="calc-btn operator" onclick="calculator.operation('/')">÷</button>
                    
                    <button class="calc-btn" onclick="calculator.number('7')">7</button>
                    <button class="calc-btn" onclick="calculator.number('8')">8</button>
                    <button class="calc-btn" onclick="calculator.number('9')">9</button>
                    <button class="calc-btn operator" onclick="calculator.operation('*')">×</button>
                    
                    <button class="calc-btn" onclick="calculator.number('4')">4</button>
                    <button class="calc-btn" onclick="calculator.number('5')">5</button>
                    <button class="calc-btn" onclick="calculator.number('6')">6</button>
                    <button class="calc-btn operator" onclick="calculator.operation('-')">−</button>
                    
                    <button class="calc-btn" onclick="calculator.number('1')">1</button>
                    <button class="calc-btn" onclick="calculator.number('2')">2</button>
                    <button class="calc-btn" onclick="calculator.number('3')">3</button>
                    <button class="calc-btn operator" onclick="calculator.operation('+')">+</button>
                    
                    <button class="calc-btn" onclick="calculator.number('0')" style="grid-column: span 2;">0</button>
                    <button class="calc-btn" onclick="calculator.decimal()">.</button>
                    <button class="calc-btn operator" onclick="calculator.equals()">=</button>
                </div>
            </div>
        `;

        const windowId = this.windowManager.createWindow(
            'calculator',
            'Calculadora',
            content,
            { width: 300, height: 450, resizable: false }
        );

        // Inicializar lógica de la calculadora
        setTimeout(() => this.initCalculator(), 100);

        return windowId;
    }

    initCalculator() {
        window.calculator = {
            display: document.getElementById('calc-display'),
            currentInput: '0',
            operator: null,
            previousInput: null,
            waitingForNewInput: false,

            updateDisplay() {
                this.display.value = this.currentInput;
            },

            number(num) {
                if (this.waitingForNewInput) {
                    this.currentInput = num;
                    this.waitingForNewInput = false;
                } else {
                    this.currentInput = this.currentInput === '0' ? num : this.currentInput + num;
                }
                this.updateDisplay();
            },

            decimal() {
                if (this.waitingForNewInput) {
                    this.currentInput = '0.';
                    this.waitingForNewInput = false;
                } else if (this.currentInput.indexOf('.') === -1) {
                    this.currentInput += '.';
                }
                this.updateDisplay();
            },

            operation(op) {
                if (this.operator && !this.waitingForNewInput) {
                    this.equals();
                }
                this.operator = op;
                this.previousInput = this.currentInput;
                this.waitingForNewInput = true;
            },

            equals() {
                if (this.operator && this.previousInput !== null) {
                    const prev = parseFloat(this.previousInput);
                    const current = parseFloat(this.currentInput);
                    
                    switch (this.operator) {
                        case '+':
                            this.currentInput = (prev + current).toString();
                            break;
                        case '-':
                            this.currentInput = (prev - current).toString();
                            break;
                        case '*':
                            this.currentInput = (prev * current).toString();
                            break;
                        case '/':
                            this.currentInput = current !== 0 ? (prev / current).toString() : 'Error';
                            break;
                    }
                    
                    this.operator = null;
                    this.previousInput = null;
                    this.waitingForNewInput = true;
                    this.updateDisplay();
                }
            },

            clear() {
                this.currentInput = '0';
                this.operator = null;
                this.previousInput = null;
                this.waitingForNewInput = false;
                this.updateDisplay();
            },

            clearEntry() {
                this.currentInput = '0';
                this.updateDisplay();
            },

            backspace() {
                if (this.currentInput.length > 1) {
                    this.currentInput = this.currentInput.slice(0, -1);
                } else {
                    this.currentInput = '0';
                }
                this.updateDisplay();
            }
        };
    }

    openNotepad() {
        const timestamp = new Date().toLocaleString('es-ES');
        const content = `
            <textarea class="notepad-textarea" placeholder="Escribe aquí tus notas...">JejenOS - Bloc de Notas 📝
Creado: ${timestamp}

¡Bienvenido al bloc de notas de JejenOS!
Puedes escribir aquí todo lo que necesites.

🦟 Sistema operativo web desarrollado con amor
</textarea>
        `;

        return this.windowManager.createWindow(
            'notepad',
            'Bloc de Notas',
            content,
            { width: 600, height: 500 }
        );
    }

    openFileManager() {
        const content = `
            <div style="height: 100%; display: flex; flex-direction: column;">
                <div style="display: flex; gap: 10px; margin-bottom: 15px; padding: 10px; background: #f8f9fa; border-radius: 6px;">
                    <button onclick="fileManager.goBack()" style="padding: 8px 12px; border: none; background: #6c757d; color: white; border-radius: 4px; cursor: pointer;">← Atrás</button>
                    <button onclick="fileManager.goHome()" style="padding: 8px 12px; border: none; background: #28a745; color: white; border-radius: 4px; cursor: pointer;">🏠 Inicio</button>
                    <button onclick="fileManager.refresh()" style="padding: 8px 12px; border: none; background: #17a2b8; color: white; border-radius: 4px; cursor: pointer;">🔄 Actualizar</button>
                </div>
                
                <div style="margin-bottom: 10px; padding: 8px; background: white; border: 1px solid #ddd; border-radius: 4px;">
                    <strong>📁 Ubicación:</strong> <span id="current-path">/home/usuario</span>
                </div>
                
                <div id="file-list" style="flex: 1; border: 1px solid #ddd; border-radius: 6px; padding: 10px; background: white; overflow-y: auto;">
                    <!-- Los archivos se cargarán aquí -->
                </div>
            </div>
        `;

        const windowId = this.windowManager.createWindow(
            'file-manager',
            'Explorador de Archivos',
            content,
            { width: 650, height: 500 }
        );

        setTimeout(() => this.initFileManager(), 100);
        return windowId;
    }

    initFileManager() {
        window.fileManager = {
            currentPath: '/home/usuario',
            history: ['/home/usuario'],
            historyIndex: 0,

            files: {
                '/home/usuario': [
                    { name: 'Documentos', type: 'folder', icon: '📁' },
                    { name: 'Imágenes', type: 'folder', icon: '📁' },
                    { name: 'Música', type: 'folder', icon: '📁' },
                    { name: 'Videos', type: 'folder', icon: '📁' },
                    { name: 'mi-documento.txt', type: 'file', icon: '📄' },
                    { name: 'foto.jpg', type: 'file', icon: '🖼️' },
                    { name: 'cancion.mp3', type: 'file', icon: '🎵' }
                ],
                '/home/usuario/Documentos': [
                    { name: 'proyecto.txt', type: 'file', icon: '📄' },
                    { name: 'notas.txt', type: 'file', icon: '📄' },
                    { name: 'importante.pdf', type: 'file', icon: '📋' }
                ],
                '/home/usuario/Imágenes': [
                    { name: 'vacaciones.jpg', type: 'file', icon: '🖼️' },
                    { name: 'familia.png', type: 'file', icon: '🖼️' }
                ]
            },

            loadFiles() {
                const fileList = document.getElementById('file-list');
                const pathElement = document.getElementById('current-path');
                
                if (!fileList || !pathElement) return;
                
                pathElement.textContent = this.currentPath;
                
                const files = this.files[this.currentPath] || [];
                
                fileList.innerHTML = files.map(file => `
                    <div style="display: flex; align-items: center; padding: 8px; margin: 2px 0; border-radius: 4px; cursor: pointer; transition: background-color 0.2s;" 
                         onmouseover="this.style.backgroundColor='#f8f9fa'" 
                         onmouseout="this.style.backgroundColor=''" 
                         ondblclick="fileManager.openItem('${file.name}', '${file.type}')">
                        <span style="margin-right: 10px; font-size: 18px;">${file.icon}</span>
                        <span>${file.name}</span>
                    </div>
                `).join('');
            },

            openItem(name, type) {
                if (type === 'folder') {
                    const newPath = this.currentPath + '/' + name;
                    if (this.files[newPath]) {
                        this.currentPath = newPath;
                        this.addToHistory(newPath);
                        this.loadFiles();
                    }
                } else {
                    // Simular apertura de archivo
                    if (window.jejenOS && window.jejenOS.windowManager) {
                        window.jejenOS.windowManager.createNotification(
                            'Archivo abierto',
                            `Se abrió el archivo: ${name}`,
                            'info'
                        );
                    }
                }
            },

            addToHistory(path) {
                this.historyIndex++;
                this.history = this.history.slice(0, this.historyIndex);
                this.history.push(path);
            },

            goBack() {
                if (this.historyIndex > 0) {
                    this.historyIndex--;
                    this.currentPath = this.history[this.historyIndex];
                    this.loadFiles();
                }
            },

            goHome() {
                this.currentPath = '/home/usuario';
                this.addToHistory(this.currentPath);
                this.loadFiles();
            },

            refresh() {
                this.loadFiles();
                if (window.jejenOS && window.jejenOS.windowManager) {
                    window.jejenOS.windowManager.createNotification(
                        'Actualizado',
                        'La lista de archivos se ha actualizado',
                        'info'
                    );
                }
            }
        };

        window.fileManager.loadFiles();
    }

    openSettings() {
        const content = `
            <div style="height: 100%;">
                <h2 style="margin-bottom: 20px; color: #2c3e50;">⚙️ Configuración de JejenOS</h2>
                
                <div style="display: grid; gap: 20px;">
                    <div style="padding: 15px; border: 1px solid #ddd; border-radius: 8px;">
                        <h3 style="margin-bottom: 10px; color: #34495e;">🎨 Apariencia</h3>
                        <label style="display: block; margin-bottom: 10px;">
                            <input type="checkbox" checked> Tema oscuro
                        </label>
                        <label style="display: block;">
                            <input type="checkbox" checked> Animaciones suaves
                        </label>
                    </div>
                    
                    <div style="padding: 15px; border: 1px solid #ddd; border-radius: 8px;">
                        <h3 style="margin-bottom: 10px; color: #34495e;">🔧 Sistema</h3>
                        <p><strong>Versión:</strong> JejenOS 1.0.0 Beta</p>
                        <p><strong>Desarrollador:</strong> Tu Equipo de Desarrollo</p>
                        <p><strong>Basado en:</strong> Tecnologías Web Modernas</p>
                    </div>
                    
                    <div style="padding: 15px; border: 1px solid #ddd; border-radius: 8px;">
                        <h3 style="margin-bottom: 10px; color: #34495e;">📊 Información</h3>
                        <p><strong>Tiempo de ejecución:</strong> <span id="uptime">Calculando...</span></p>
                        <p><strong>Ventanas abiertas:</strong> <span id="window-count">0</span></p>
                    </div>
                    
                    <div style="padding: 15px; border: 1px solid #ddd; border-radius: 8px;">
                        <h3 style="margin-bottom: 10px; color: #34495e;">🦟 Acerca de</h3>
                        <p>JejenOS es un sistema operativo web experimental que simula un entorno de escritorio completo en el navegador.</p>
                        <p style="margin-top: 10px;">
                            <strong>Características:</strong><br>
                            • Ventanas arrastrables y redimensionables<br>
                            • Aplicaciones integradas<br>
                            • Sistema de notificaciones<br>
                            • Interfaz moderna y responsive
                        </p>
                    </div>
                </div>
            </div>
        `;

        const windowId = this.windowManager.createWindow(
            'settings',
            'Configuración',
            content,
            { width: 700, height: 600 }
        );

        setTimeout(() => this.initSettings(), 100);
        return windowId;
    }

    initSettings() {
        const updateSystemInfo = () => {
            const uptimeElement = document.getElementById('uptime');
            const windowCountElement = document.getElementById('window-count');
            
            if (uptimeElement && window.jejenOS) {
                const uptime = Date.now() - window.jejenOS.startTime.getTime();
                const minutes = Math.floor(uptime / 60000);
                const seconds = Math.floor((uptime % 60000) / 1000);
                uptimeElement.textContent = `${minutes}m ${seconds}s`;
            }
            
            if (windowCountElement && this.windowManager) {
                windowCountElement.textContent = this.windowManager.windows.size;
            }
        };

        updateSystemInfo();
        setInterval(updateSystemInfo, 1000);
    }
}

// Hacer AppManager disponible globalmente
window.AppManager = AppManager;