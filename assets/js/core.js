// JejenOS - Sistema Principal
class JejenOS {
    constructor() {
        this.init();
        this.windowManager = new WindowManager();
        this.apps = new AppManager();
        this.startTime = new Date();
    }

    init() {
        this.setupEventListeners();
        this.startClock();
        this.showWelcome();
    }

    setupEventListeners() {
        // Botón de inicio
        const startBtn = document.getElementById('start-btn');
        const startMenu = document.getElementById('start-menu');
        
        startBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleStartMenu();
        });

        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!startMenu.contains(e.target) && !startBtn.contains(e.target)) {
                this.hideStartMenu();
            }
        });

        // Iconos del escritorio
        document.querySelectorAll('.desktop-icon').forEach(icon => {
            icon.addEventListener('dblclick', () => {
                const appName = icon.dataset.app;
                this.apps.openApp(appName);
            });
        });

        // Apps del menú inicio
        document.querySelectorAll('.start-app').forEach(app => {
            app.addEventListener('click', () => {
                const appName = app.dataset.app;
                this.apps.openApp(appName);
                this.hideStartMenu();
            });
        });

        // Botón de apagar
        document.querySelector('.power-btn').addEventListener('click', () => {
            this.shutdown();
        });

        // Prevenir menú contextual
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }

    toggleStartMenu() {
        const startMenu = document.getElementById('start-menu');
        startMenu.classList.toggle('hidden');
    }

    hideStartMenu() {
        const startMenu = document.getElementById('start-menu');
        startMenu.classList.add('hidden');
    }

    startClock() {
        const updateClock = () => {
            const now = new Date();
            const timeString = now.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
            });
            document.getElementById('clock').textContent = timeString;
        };

        updateClock();
        setInterval(updateClock, 1000);
    }

    showWelcome() {
        setTimeout(() => {
            this.windowManager.createNotification(
                '¡Bienvenido a JejenOS! 🦟',
                'Sistema operativo web desarrollado con amor y café ☕',
                'success'
            );
        }, 1000);
    }

    shutdown() {
        const confirmed = confirm('¿Estás seguro de que quieres cerrar JejenOS?');
        if (confirmed) {
            document.body.style.background = '#000';
            document.body.innerHTML = `
                <div style="
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    color: white;
                    font-size: 24px;
                    text-align: center;
                ">
                    <div style="font-size: 64px; margin-bottom: 20px;">🦟</div>
                    <div>JejenOS se está apagando...</div>
                    <div style="font-size: 14px; margin-top: 20px; opacity: 0.7;">
                        ¡Gracias por usar JejenOS!
                    </div>
                </div>
            `;
            
            setTimeout(() => {
                window.close();
                // Si no se puede cerrar la ventana, recargar la página
                setTimeout(() => {
                    location.reload();
                }, 2000);
            }, 3000);
        }
    }
}

// Inicializar JejenOS cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.jejenOS = new JejenOS();
    console.log('🦟 JejenOS iniciado correctamente');
});