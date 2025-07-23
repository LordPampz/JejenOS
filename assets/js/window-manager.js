// JejenOS - Administrador de Ventanas
class WindowManager {
    constructor() {
        this.windows = new Map();
        this.windowCounter = 0;
        this.activeWindow = null;
        this.zIndexCounter = 100;
    }

    createWindow(appName, title, content, options = {}) {
        const windowId = `window-${++this.windowCounter}`;
        const defaultOptions = {
            width: 500,
            height: 400,
            x: 100 + (this.windowCounter * 30),
            y: 100 + (this.windowCounter * 30),
            resizable: true,
            maximizable: true,
            minimizable: true
        };

        const finalOptions = { ...defaultOptions, ...options };

        const windowElement = document.createElement('div');
        windowElement.className = 'window';
        windowElement.id = windowId;
        windowElement.style.width = finalOptions.width + 'px';
        windowElement.style.height = finalOptions.height + 'px';
        windowElement.style.left = finalOptions.x + 'px';
        windowElement.style.top = finalOptions.y + 'px';
        windowElement.style.zIndex = ++this.zIndexCounter;

        windowElement.innerHTML = `
            <div class="window-header">
                <div class="window-title">
                    <span class="window-icon">${this.getAppIcon(appName)}</span>
                    <span>${title}</span>
                </div>
                <div class="window-controls">
                    ${finalOptions.minimizable ? '<button class="window-control minimize">−</button>' : ''}
                    ${finalOptions.maximizable ? '<button class="window-control maximize">□</button>' : ''}
                    <button class="window-control close">×</button>
                </div>
            </div>
            <div class="window-content">
                ${content}
            </div>
        `;

        document.getElementById('windows-container').appendChild(windowElement);

        const windowData = {
            id: windowId,
            appName,
            title,
            element: windowElement,
            isMaximized: false,
            isMinimized: false,
            originalBounds: null
        };

        this.windows.set(windowId, windowData);
        this.setupWindowEvents(windowData, finalOptions);
        this.addToTaskbar(windowData);
        this.focusWindow(windowId);

        return windowId;
    }

    setupWindowEvents(windowData, options) {
        const { element, id } = windowData;
        const header = element.querySelector('.window-header');
        
        // Hacer ventana activa al hacer clic
        element.addEventListener('mousedown', () => {
            this.focusWindow(id);
        });

        // Arrastrar ventana
        this.makeDraggable(element, header);

        // Controles de ventana
        const minimizeBtn = element.querySelector('.minimize');
        const maximizeBtn = element.querySelector('.maximize');
        const closeBtn = element.querySelector('.close');

        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.minimizeWindow(id);
            });
        }

        if (maximizeBtn) {
            maximizeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMaximizeWindow(id);
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.closeWindow(id);
            });
        }

        // Redimensionar (si está habilitado)
        if (options.resizable) {
            this.makeResizable(element);
        }
    }

    makeDraggable(element, handle) {
        let isDragging = false;
        let startX, startY, startLeft, startTop;

        handle.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('window-control')) return;
            
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startLeft = parseInt(element.style.left);
            startTop = parseInt(element.style.top);
            
            handle.style.cursor = 'grabbing';
            document.body.style.userSelect = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            let newLeft = startLeft + deltaX;
            let newTop = startTop + deltaY;

            // Limitar a los bordes de la pantalla
            newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - element.offsetWidth));
            newTop = Math.max(0, Math.min(newTop, window.innerHeight - element.offsetHeight - 50));

            element.style.left = newLeft + 'px';
            element.style.top = newTop + 'px';
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                handle.style.cursor = 'move';
                document.body.style.userSelect = '';
            }
        });
    }

    makeResizable(element) {
        const resizer = document.createElement('div');
        resizer.className = 'window-resizer';
        resizer.style.cssText = `
            position: absolute;
            bottom: 0;
            right: 0;
            width: 15px;
            height: 15px;
            cursor: nw-resize;
            background: linear-gradient(-45deg, transparent 40%, #ccc 40%, #ccc 60%, transparent 60%);
        `;
        element.appendChild(resizer);

        let isResizing = false;
        let startX, startY, startWidth, startHeight;

        resizer.addEventListener('mousedown', (e) => {
            isResizing = true;
            startX = e.clientX;
            startY = e.clientY;
            startWidth = parseInt(document.defaultView.getComputedStyle(element).width, 10);
            startHeight = parseInt(document.defaultView.getComputedStyle(element).height, 10);
            document.body.style.userSelect = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;

            const width = Math.max(300, startWidth + e.clientX - startX);
            const height = Math.max(200, startHeight + e.clientY - startY);

            element.style.width = width + 'px';
            element.style.height = height + 'px';
        });

        document.addEventListener('mouseup', () => {
            if (isResizing) {
                isResizing = false;
                document.body.style.userSelect = '';
            }
        });
    }

    focusWindow(windowId) {
        if (this.activeWindow) {
            this.activeWindow.classList.remove('active');
        }
        
        const window = this.windows.get(windowId);
        if (window) {
            window.element.classList.add('active');
            window.element.style.zIndex = ++this.zIndexCounter;
            this.activeWindow = window.element;
        }
    }

    minimizeWindow(windowId) {
        const window = this.windows.get(windowId);
        if (window) {
            window.element.style.display = 'none';
            window.isMinimized = true;
            this.updateTaskbarButton(windowId);
        }
    }

    toggleMaximizeWindow(windowId) {
        const window = this.windows.get(windowId);
        if (!window) return;

        if (window.isMaximized) {
            // Restaurar
            if (window.originalBounds) {
                const { width, height, left, top } = window.originalBounds;
                window.element.style.width = width;
                window.element.style.height = height;
                window.element.style.left = left;
                window.element.style.top = top;
            }
            window.isMaximized = false;
        } else {
            // Maximizar
            window.originalBounds = {
                width: window.element.style.width,
                height: window.element.style.height,
                left: window.element.style.left,
                top: window.element.style.top
            };
            
            window.element.style.width = '100%';
            window.element.style.height = 'calc(100vh - 50px)';
            window.element.style.left = '0';
            window.element.style.top = '0';
            window.isMaximized = true;
        }
    }

    closeWindow(windowId) {
        const window = this.windows.get(windowId);
        if (window) {
            window.element.remove();
            this.removeFromTaskbar(windowId);
            this.windows.delete(windowId);
            
            if (this.activeWindow === window.element) {
                this.activeWindow = null;
            }
        }
    }

    addToTaskbar(windowData) {
        const taskbarApps = document.getElementById('taskbar-apps');
        const button = document.createElement('div');
        button.className = 'taskbar-app';
        button.id = `taskbar-${windowData.id}`;
        button.innerHTML = `${this.getAppIcon(windowData.appName)} ${windowData.title}`;
        
        button.addEventListener('click', () => {
            if (windowData.isMinimized) {
                windowData.element.style.display = 'block';
                windowData.isMinimized = false;
                this.focusWindow(windowData.id);
            } else {
                this.focusWindow(windowData.id);
            }
        });

        taskbarApps.appendChild(button);
    }

    removeFromTaskbar(windowId) {
        const button = document.getElementById(`taskbar-${windowId}`);
        if (button) {
            button.remove();
        }
    }

    updateTaskbarButton(windowId) {
        const button = document.getElementById(`taskbar-${windowId}`);
        const window = this.windows.get(windowId);
        
        if (button && window) {
            if (window.isMinimized) {
                button.style.opacity = '0.6';
            } else {
                button.style.opacity = '1';
            }
        }
    }

    getAppIcon(appName) {
        const icons = {
            calculator: '🧮',
            notepad: '📝',
            'file-manager': '📁',
            settings: '⚙️',
            terminal: '💻',
            browser: '🌐'
        };
        return icons[appName] || '📄';
    }

    createNotification(title, message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 9999;
            max-width: 300px;
            border-left: 4px solid ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
            animation: slideIn 0.3s ease;
        `;

        notification.innerHTML = `
            <strong style="display: block; margin-bottom: 5px;">${title}</strong>
            <div style="font-size: 14px; color: #666;">${message}</div>
        `;

        document.body.appendChild(notification);

        // Auto-eliminar después de 5 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 5000);

        // Agregar estilos de animación si no existen
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
}