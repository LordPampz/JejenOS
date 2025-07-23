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
        const multiInstanceApps = ['notepad', 'calculator', 'terminal'];
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
            case 'terminal':
                windowId = this.openTerminal();
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

    openTerminal() {
        const content = `
            <div class="terminal">
                <div class="terminal-output" id="terminal-output"></div>
                <div class="terminal-input-line">
                    <span class="terminal-prompt" id="terminal-prompt">🦟 usuario@jejenos:~$</span>
                    <input type="text" class="terminal-input" id="terminal-input" autocomplete="off" spellcheck="false" autofocus>
                </div>
            </div>
        `;

        const windowId = this.windowManager.createWindow(
            'terminal',
            'Terminal JejenOS',
            content,
            { 
                width: 700, 
                height: 500,
                x: 150,
                y: 100
            }
        );

        setTimeout(() => this.initTerminal(windowId), 100);
        return windowId;
    }

    initTerminal(windowId) {
        const terminalOutput = document.getElementById('terminal-output');
        const terminalInput = document.getElementById('terminal-input');
        const terminalPrompt = document.getElementById('terminal-prompt');

        if (!terminalOutput || !terminalInput || !terminalPrompt) return;

        // Sistema de archivos simulado (integrado con fileManager)
        const fileSystem = window.fileManager ? window.fileManager.files : {
            '/home/usuario': [
                { name: 'Documentos', type: 'folder', icon: '📁' },
                { name: 'Imágenes', type: 'folder', icon: '📁' },
                { name: 'Música', type: 'folder', icon: '📁' },
                { name: 'Videos', type: 'folder', icon: '📁' },
                { name: 'mi-documento.txt', type: 'file', icon: '📄', content: 'Este es un documento de prueba de JejenOS 🦟' },
                { name: 'foto.jpg', type: 'file', icon: '🖼️', content: 'Imagen JPEG simulada' },
                { name: 'cancion.mp3', type: 'file', icon: '🎵', content: 'Archivo de audio simulado' }
            ],
            '/home/usuario/Documentos': [
                { name: 'proyecto.txt', type: 'file', icon: '📄', content: 'Archivo de proyecto de JejenOS' },
                { name: 'notas.txt', type: 'file', icon: '📄', content: 'Mis notas importantes' },
                { name: 'importante.pdf', type: 'file', icon: '📋', content: 'Documento PDF simulado' }
            ],
            '/home/usuario/Imágenes': [
                { name: 'vacaciones.jpg', type: 'file', icon: '🖼️', content: 'Foto de vacaciones' },
                { name: 'familia.png', type: 'file', icon: '🖼️', content: 'Foto familiar' }
            ]
        };

        const terminal = {
            currentPath: '/home/usuario',
            history: [],
            historyIndex: -1,
            
            init() {
                this.showWelcome();
                this.updatePrompt();
                this.setupEventListeners();
            },

            showWelcome() {
                const welcome = `<div class="command-success">
🦟 ¡Bienvenido al Terminal de JejenOS! 🦟

Sistema Operativo Web v1.0.0 Beta
Terminal Interactivo - Desarrollado con amor y café ☕

Escribe 'help' para ver los comandos disponibles
Escribe 'jején' para ver nuestro logo ASCII

</div>`;
                terminalOutput.innerHTML = welcome;
            },

            setupEventListeners() {
                terminalInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        this.processCommand(terminalInput.value.trim());
                        terminalInput.value = '';
                    } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        this.navigateHistory(-1);
                    } else if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        this.navigateHistory(1);
                    } else if (e.key === 'Tab') {
                        e.preventDefault();
                        this.autoComplete();
                    }
                });

                // Auto-focus cuando se hace clic en el terminal
                terminalOutput.addEventListener('click', () => {
                    terminalInput.focus();
                });
            },

            navigateHistory(direction) {
                if (this.history.length === 0) return;

                this.historyIndex += direction;
                
                if (this.historyIndex < 0) {
                    this.historyIndex = -1;
                    terminalInput.value = '';
                } else if (this.historyIndex >= this.history.length) {
                    this.historyIndex = this.history.length - 1;
                }

                if (this.historyIndex >= 0) {
                    terminalInput.value = this.history[this.historyIndex];
                }
            },

            autoComplete() {
                const input = terminalInput.value;
                const commands = ['help', 'ls', 'cd', 'cat', 'echo', 'clear', 'date', 'whoami', 'ps', 'kill', 'jején', 'weather', 'joke', 'theme'];
                
                const matches = commands.filter(cmd => cmd.startsWith(input));
                if (matches.length === 1) {
                    terminalInput.value = matches[0];
                } else if (matches.length > 1) {
                    this.output(`\n<div class="command-info">Posibles comandos: ${matches.join(', ')}</div>`, 'info');
                }
            },

            processCommand(command) {
                if (!command) return;

                this.history.push(command);
                this.historyIndex = this.history.length;

                // Mostrar el comando ejecutado
                this.output(`<div class="command-input">${terminalPrompt.textContent} ${command}</div>`);

                const [cmd, ...args] = command.split(' ');
                
                switch (cmd.toLowerCase()) {
                    case 'help':
                        this.showHelp();
                        break;
                    case 'ls':
                        this.listFiles(args);
                        break;
                    case 'cd':
                        this.changeDirectory(args[0]);
                        break;
                    case 'cat':
                        this.showFile(args[0]);
                        break;
                    case 'echo':
                        this.echo(args.join(' '));
                        break;
                    case 'clear':
                        this.clear();
                        break;
                    case 'date':
                        this.showDate();
                        break;
                    case 'whoami':
                        this.whoami();
                        break;
                    case 'ps':
                        this.showProcesses();
                        break;
                    case 'kill':
                        this.killProcess(args[0]);
                        break;
                    case 'jején':
                        this.showLogo();
                        break;
                    case 'weather':
                        this.showWeather();
                        break;
                    case 'joke':
                        this.showJoke();
                        break;
                    case 'theme':
                        this.changeTheme(args[0]);
                        break;
                    default:
                        this.output(`<div class="command-error">Comando no encontrado: ${cmd}. Escribe 'help' para ver comandos disponibles.</div>`);
                }

                this.scrollToBottom();
            },

            output(content) {
                terminalOutput.innerHTML += content + '\n';
            },

            scrollToBottom() {
                terminalOutput.scrollTop = terminalOutput.scrollHeight;
            },

            updatePrompt() {
                const pathParts = this.currentPath.split('/');
                const shortPath = pathParts.length > 3 ? '~/' + pathParts.slice(-2).join('/') : this.currentPath.replace('/home/usuario', '~');
                terminalPrompt.textContent = `🦟 usuario@jejenos:${shortPath}$`;
            },

            showHelp() {
                const help = `<div class="command-info">
📚 COMANDOS DISPONIBLES EN JEJENOS TERMINAL

📁 Archivos y Navegación:
  ls [path]     - Listar archivos y directorios
  cd <path>     - Cambiar directorio
  cat <file>    - Mostrar contenido de archivo

💻 Sistema:
  ps            - Mostrar procesos (ventanas abiertas)
  kill <id>     - Cerrar ventana por ID
  whoami        - Información del usuario
  date          - Mostrar fecha y hora actual

🔧 Utilidades:
  echo <text>   - Imprimir texto
  clear         - Limpiar terminal
  help          - Mostrar esta ayuda

🦟 Especiales JejenOS:
  jején         - Mostrar logo ASCII del mosquito
  weather       - Mostrar clima simulado
  joke          - Chiste aleatorio sobre mosquitos
  theme <color> - Cambiar tema (green, blue, red, purple)

💡 Atajos de teclado:
  ↑/↓          - Navegar historial de comandos
  Tab          - Autocompletar comandos
  Ctrl+C       - Cancelar comando actual

</div>`;
                this.output(help);
            },

            listFiles(args) {
                const path = args[0] || this.currentPath;
                const files = fileSystem[path];
                
                if (!files) {
                    this.output(`<div class="command-error">Directorio no encontrado: ${path}</div>`);
                    return;
                }

                let output = `<div class="command-output">Contenido de ${path}:\n<div class="file-list">`;
                
                files.forEach(file => {
                    const className = file.type === 'folder' ? 'folder' : file.name.endsWith('.exe') ? 'executable' : '';
                    output += `<div class="file-item ${className}">${file.icon} ${file.name}</div>`;
                });
                
                output += '</div></div>';
                this.output(output);
            },

            changeDirectory(path) {
                if (!path) {
                    this.currentPath = '/home/usuario';
                    this.updatePrompt();
                    return;
                }

                if (path === '..') {
                    const pathParts = this.currentPath.split('/');
                    if (pathParts.length > 2) {
                        pathParts.pop();
                        this.currentPath = pathParts.join('/');
                        this.updatePrompt();
                        return;
                    }
                }

                const newPath = path.startsWith('/') ? path : `${this.currentPath}/${path}`;
                
                if (fileSystem[newPath]) {
                    this.currentPath = newPath;
                    this.updatePrompt();
                    this.output(`<div class="command-success">Directorio cambiado a: ${newPath}</div>`);
                } else {
                    this.output(`<div class="command-error">Directorio no encontrado: ${newPath}</div>`);
                }
            },

            showFile(filename) {
                if (!filename) {
                    this.output(`<div class="command-error">Uso: cat &lt;nombre_archivo&gt;</div>`);
                    return;
                }

                const files = fileSystem[this.currentPath];
                const file = files?.find(f => f.name === filename);

                if (!file) {
                    this.output(`<div class="command-error">Archivo no encontrado: ${filename}</div>`);
                    return;
                }

                if (file.type === 'folder') {
                    this.output(`<div class="command-error">${filename} es un directorio</div>`);
                    return;
                }

                const content = file.content || `Contenido del archivo ${filename}`;
                this.output(`<div class="command-output">${content}</div>`);
            },

            echo(text) {
                this.output(`<div class="command-output">${text || ''}</div>`);
            },

            clear() {
                terminalOutput.innerHTML = '';
            },

            showDate() {
                const now = new Date();
                const dateStr = now.toLocaleString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });
                this.output(`<div class="command-info">📅 ${dateStr}</div>`);
            },

            whoami() {
                this.output(`<div class="command-info">
👤 Usuario: usuario
🏠 Directorio home: /home/usuario
🦟 Sistema: JejenOS v1.0.0 Beta
🌐 Terminal: JejenOS Terminal
💻 Plataforma: Web Browser
</div>`);
            },

            showProcesses() {
                if (!window.jejenOS?.windowManager) {
                    this.output(`<div class="command-error">No se puede acceder al administrador de ventanas</div>`);
                    return;
                }

                const windows = window.jejenOS.windowManager.windows;
                let output = `<div class="command-info">📊 PROCESOS ACTIVOS (${windows.size} ventanas abiertas):\n\n`;
                
                windows.forEach((window, id) => {
                    const status = window.isMinimized ? 'minimizada' : 'activa';
                    output += `PID: ${id.split('-')[1]} | ${window.appName} | ${window.title} | Estado: ${status}\n`;
                });
                
                output += `\nUsa 'kill &lt;PID&gt;' para cerrar una ventana</div>`;
                this.output(output);
            },

            killProcess(pid) {
                if (!pid) {
                    this.output(`<div class="command-error">Uso: kill &lt;PID&gt;</div>`);
                    return;
                }

                const windowId = `window-${pid}`;
                if (window.jejenOS?.windowManager?.windows.has(windowId)) {
                    window.jejenOS.windowManager.closeWindow(windowId);
                    this.output(`<div class="command-success">Proceso ${pid} terminado correctamente</div>`);
                } else {
                    this.output(`<div class="command-error">Proceso no encontrado: ${pid}</div>`);
                }
            },

            showLogo() {
                const logo = `<div class="ascii-art">
    🦟 JEJENOS TERMINAL 🦟
    
         /|
        / |__
       /    o\\
      |      |\\
      |       \\\\
      |        \\\\
      |         |
       \\       /
        \\     /
         \\___/
    
   ¡Bzzz! Sistema Operativo Web
   Desarrollado con amor y café ☕
   
</div>`;
                this.output(logo);
            },

            showWeather() {
                const weathers = [
                    { emoji: '☀️', desc: 'Soleado', temp: '25°C' },
                    { emoji: '🌤️', desc: 'Parcialmente nublado', temp: '22°C' },
                    { emoji: '🌧️', desc: 'Lluvioso', temp: '18°C' },
                    { emoji: '🌩️', desc: 'Tormenta', temp: '20°C' },
                    { emoji: '❄️', desc: 'Nevado', temp: '-2°C' }
                ];
                
                const weather = weathers[Math.floor(Math.random() * weathers.length)];
                this.output(`<div class="command-info">
🌍 CLIMA EN JEJENOS CITY:
${weather.emoji} ${weather.desc}
🌡️ Temperatura: ${weather.temp}
💨 Viento: 15 km/h
💧 Humedad: 65%
🦟 Actividad de mosquitos: ALTA
</div>`);
            },

            showJoke() {
                const jokes = [
                    "¿Por qué los mosquitos son buenos programadores? ¡Porque siempre encuentran los bugs! 🐛",
                    "¿Qué dice un mosquito cuando termina de picar? ¡Hasta la vista, baby! 🦟",
                    "¿Por qué JejenOS es el mejor SO? ¡Porque tiene la mejor interfaz de usuario... zumbante! 🎵",
                    "¿Cómo se despiden los mosquitos? ¡Nos vemos en el próximo commit! 💻",
                    "¿Por qué los mosquitos no usan Windows? ¡Porque prefieren sistemas más... voladores! 🪟"
                ];
                
                const joke = jokes[Math.floor(Math.random() * jokes.length)];
                this.output(`<div class="command-success">😄 ${joke}</div>`);
            },

            changeTheme(color) {
                const themes = {
                    green: '#00ff00',
                    blue: '#00bfff',
                    red: '#ff4757',
                    purple: '#a55eea',
                    orange: '#ffa726'
                };

                if (!color || !themes[color]) {
                    this.output(`<div class="command-info">Temas disponibles: ${Object.keys(themes).join(', ')}</div>`);
                    return;
                }

                const newColor = themes[color];
                const terminalContainer = document.querySelector('.terminal');
                if (terminalContainer) {
                    terminalContainer.style.setProperty('--terminal-color', newColor);
                    // Aplicar el color a todos los elementos del terminal
                    terminalContainer.style.color = newColor;
                    terminalPrompt.style.color = newColor;
                    terminalInput.style.color = newColor;
                    terminalInput.style.caretColor = newColor;
                }

                this.output(`<div class="command-success">✨ Tema cambiado a: ${color}</div>`);
            }
        };

        // Inicializar el terminal
        terminal.init();
        
        // Hacer el terminal accesible globalmente para debugging
        window.terminal = terminal;
    }
}

// Hacer AppManager disponible globalmente
window.AppManager = AppManager;