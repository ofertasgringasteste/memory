/**
 * Sistema de Analytics Avançado para Memory Pulse
 * Complementa o rastreamento do Facebook Ads com métricas detalhadas
 */

class AdvancedAnalytics {
    constructor() {
        this.sessionData = {
            sessionId: this.generateSessionId(),
            startTime: Date.now(),
            pageViews: 0,
            events: [],
            userBehavior: {},
            conversionFunnel: {
                pageView: false,
                videoStart: false,
                videoComplete: false,
                scroll25: false,
                scroll50: false,
                scroll75: false,
                scroll100: false,
                buttonClick: false,
                checkoutInitiated: false,
                purchase: false
            }
        };
        
        this.init();
    }

    init() {
        this.setupTracking();
        this.trackUserBehavior();
        this.setupHeatmap();
        this.trackConversions();
        this.setupA/BTesting();
    }

    // Gera ID único da sessão
    generateSessionId() {
        return 'analytics_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Configura rastreamento básico
    setupTracking() {
        // Rastreia visualização da página
        this.trackPageView();

        // Rastreia tempo na página
        this.trackTimeOnPage();

        // Rastreia scroll
        this.trackScroll();

        // Rastreia cliques
        this.trackClicks();

        // Rastreia engajamento com vídeo
        this.trackVideoEngagement();

        // Rastreia saída da página
        this.trackPageExit();
    }

    // Rastreia visualização da página
    trackPageView() {
        this.sessionData.pageViews++;
        this.sessionData.conversionFunnel.pageView = true;
        
        this.logEvent('PageView', {
            url: window.location.href,
            referrer: document.referrer,
            userAgent: navigator.userAgent,
            screenResolution: `${screen.width}x${screen.height}`,
            viewport: `${window.innerWidth}x${window.innerHeight}`
        });
    }

    // Rastreia tempo na página
    trackTimeOnPage() {
        let timeOnPage = 0;
        const intervals = [10, 30, 60, 120, 300]; // segundos
        
        setInterval(() => {
            timeOnPage += 10;
            
            if (intervals.includes(timeOnPage)) {
                this.logEvent('TimeOnPage', {
                    timeSpent: timeOnPage,
                    percentage: Math.round((timeOnPage / 300) * 100)
                });
            }
        }, 10000);
    }

    // Rastreia scroll
    trackScroll() {
        let maxScroll = 0;
        
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                
                // Rastreia marcos de scroll
                if (scrollPercent >= 25 && !this.sessionData.conversionFunnel.scroll25) {
                    this.sessionData.conversionFunnel.scroll25 = true;
                    this.logEvent('Scroll25', { scrollPercent });
                }
                
                if (scrollPercent >= 50 && !this.sessionData.conversionFunnel.scroll50) {
                    this.sessionData.conversionFunnel.scroll50 = true;
                    this.logEvent('Scroll50', { scrollPercent });
                }
                
                if (scrollPercent >= 75 && !this.sessionData.conversionFunnel.scroll75) {
                    this.sessionData.conversionFunnel.scroll75 = true;
                    this.logEvent('Scroll75', { scrollPercent });
                }
                
                if (scrollPercent >= 100 && !this.sessionData.conversionFunnel.scroll100) {
                    this.sessionData.conversionFunnel.scroll100 = true;
                    this.logEvent('Scroll100', { scrollPercent });
                }
            }
        });
    }

    // Rastreia cliques
    trackClicks() {
        document.addEventListener('click', (e) => {
            const target = e.target;
            const clickData = {
                element: target.tagName.toLowerCase(),
                className: target.className,
                id: target.id,
                text: target.textContent?.substring(0, 50),
                position: {
                    x: e.clientX,
                    y: e.clientY
                },
                timestamp: Date.now()
            };

            // Rastreia cliques específicos
            if (target.matches('a[href*="pay.speedsellx.com"]')) {
                this.sessionData.conversionFunnel.buttonClick = true;
                this.sessionData.conversionFunnel.checkoutInitiated = true;
                
                this.logEvent('CheckoutButtonClick', {
                    ...clickData,
                    funnelStep: 'checkout_initiated'
                });
                
                // Rastreia no Facebook também
                if (window.facebookTracking) {
                    window.facebookTracking.trackInitiateCheckout();
                }
            }

            this.logEvent('Click', clickData);
        });
    }

    // Rastreia engajamento com vídeo
    trackVideoEngagement() {
        const videoElement = document.querySelector('video');
        
        if (videoElement) {
            videoElement.addEventListener('play', () => {
                this.sessionData.conversionFunnel.videoStart = true;
                this.logEvent('VideoPlay', {
                    videoId: videoElement.src,
                    currentTime: videoElement.currentTime
                });
            });

            videoElement.addEventListener('pause', () => {
                this.logEvent('VideoPause', {
                    videoId: videoElement.src,
                    currentTime: videoElement.currentTime,
                    duration: videoElement.duration
                });
            });

            videoElement.addEventListener('ended', () => {
                this.sessionData.conversionFunnel.videoComplete = true;
                this.logEvent('VideoComplete', {
                    videoId: videoElement.src,
                    duration: videoElement.duration
                });
            });

            // Rastreia progresso do vídeo
            videoElement.addEventListener('timeupdate', () => {
                const progress = Math.round((videoElement.currentTime / videoElement.duration) * 100);
                
                if (progress % 25 === 0) {
                    this.logEvent('VideoProgress', {
                        progress: progress,
                        currentTime: videoElement.currentTime,
                        duration: videoElement.duration
                    });
                }
            });
        }
    }

    // Rastreia saída da página
    trackPageExit() {
        window.addEventListener('beforeunload', () => {
            const sessionDuration = Date.now() - this.sessionData.startTime;
            
            this.logEvent('PageExit', {
                sessionDuration: sessionDuration,
                conversionFunnel: this.sessionData.conversionFunnel,
                totalEvents: this.sessionData.events.length
            });
            
            // Salva dados da sessão
            this.saveSessionData();
        });
    }

    // Rastreia comportamento do usuário
    trackUserBehavior() {
        // Rastreia movimentos do mouse
        let mouseMovements = 0;
        let lastMouseMove = Date.now();
        
        document.addEventListener('mousemove', () => {
            mouseMovements++;
            
            if (Date.now() - lastMouseMove > 1000) {
                this.logEvent('MouseActivity', {
                    movements: mouseMovements,
                    timeSinceLastMove: Date.now() - lastMouseMove
                });
                
                mouseMovements = 0;
                lastMouseMove = Date.now();
            }
        });

        // Rastreia teclas pressionadas
        document.addEventListener('keydown', (e) => {
            this.logEvent('KeyPress', {
                key: e.key,
                keyCode: e.keyCode,
                ctrlKey: e.ctrlKey,
                altKey: e.altKey,
                shiftKey: e.shiftKey
            });
        });

        // Rastreia redimensionamento da janela
        window.addEventListener('resize', () => {
            this.logEvent('WindowResize', {
                newSize: `${window.innerWidth}x${window.innerHeight}`,
                originalSize: `${screen.width}x${screen.height}`
            });
        });
    }

    // Configura heatmap básico
    setupHeatmap() {
        const heatmapData = {
            clicks: [],
            movements: [],
            scrolls: []
        };

        // Coleta dados de clique para heatmap
        document.addEventListener('click', (e) => {
            heatmapData.clicks.push({
                x: e.clientX,
                y: e.clientY,
                timestamp: Date.now()
            });
        });

        // Coleta dados de movimento para heatmap
        let movementTimeout;
        document.addEventListener('mousemove', (e) => {
            clearTimeout(movementTimeout);
            
            movementTimeout = setTimeout(() => {
                heatmapData.movements.push({
                    x: e.clientX,
                    y: e.clientY,
                    timestamp: Date.now()
                });
            }, 100);
        });

        // Salva dados do heatmap
        setInterval(() => {
            if (heatmapData.clicks.length > 0 || heatmapData.movements.length > 0) {
                this.logEvent('HeatmapData', heatmapData);
                
                // Limpa dados antigos
                heatmapData.clicks = [];
                heatmapData.movements = [];
            }
        }, 30000);
    }

    // Rastreia conversões
    trackConversions() {
        // Monitora mudanças na URL para detectar conversões
        let currentUrl = window.location.href;
        
        setInterval(() => {
            if (window.location.href !== currentUrl) {
                this.logEvent('URLChange', {
                    from: currentUrl,
                    to: window.location.href,
                    timestamp: Date.now()
                });
                
                currentUrl = window.location.href;
            }
        }, 1000);

        // Detecta conversões baseadas em elementos específicos
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        if (node.textContent?.includes('sucesso') || 
                            node.textContent?.includes('success') ||
                            node.textContent?.includes('obrigado') ||
                            node.textContent?.includes('thank you')) {
                            
                            this.sessionData.conversionFunnel.purchase = true;
                            this.logEvent('ConversionDetected', {
                                element: node.outerHTML,
                                text: node.textContent
                            });
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Configura A/B Testing
    setupA/BTesting() {
        const testVariants = {
            buttonColor: ['yellow', 'blue', 'green'],
            buttonText: ['Comprar Agora', 'Quero Recuperar', 'Acessar Oferta'],
            priceDisplay: ['normal', 'highlighted', 'countdown']
        };

        // Seleciona variante baseada no ID da sessão
        const sessionHash = this.hashCode(this.sessionData.sessionId);
        
        this.abTestData = {
            buttonColor: testVariants.buttonColor[sessionHash % testVariants.buttonColor.length],
            buttonText: testVariants.buttonText[sessionHash % testVariants.buttonText.length],
            priceDisplay: testVariants.priceDisplay[sessionHash % testVariants.priceDisplay.length]
        };

        this.logEvent('ABTestAssignment', this.abTestData);
        
        // Aplica variantes
        this.applyABTestVariants();
    }

    // Aplica variantes do A/B Test
    applyABTestVariants() {
        const buttons = document.querySelectorAll('a[href*="pay.speedsellx.com"]');
        
        buttons.forEach(button => {
            // Aplica cor do botão
            if (this.abTestData.buttonColor === 'blue') {
                button.style.backgroundColor = '#007bff';
                button.style.borderColor = '#0056b3';
            } else if (this.abTestData.buttonColor === 'green') {
                button.style.backgroundColor = '#28a745';
                button.style.borderColor = '#1e7e34';
            }

            // Aplica texto do botão
            if (this.abTestData.buttonText !== 'Comprar Agora') {
                button.textContent = this.abTestData.buttonText;
            }
        });

        // Aplica display do preço
        const priceElements = document.querySelectorAll('h2');
        priceElements.forEach(element => {
            if (element.textContent.includes('39,00')) {
                if (this.abTestData.priceDisplay === 'highlighted') {
                    element.style.backgroundColor = '#ffeb3b';
                    element.style.padding = '10px';
                    element.style.borderRadius = '5px';
                } else if (this.abTestData.priceDisplay === 'countdown') {
                    this.addCountdownTimer(element);
                }
            }
        });
    }

    // Adiciona timer de contagem regressiva
    addCountdownTimer(element) {
        const countdownDiv = document.createElement('div');
        countdownDiv.style.cssText = `
            background: #ff4444;
            color: white;
            padding: 10px;
            border-radius: 5px;
            text-align: center;
            margin: 10px 0;
            font-weight: bold;
        `;
        
        element.parentNode.insertBefore(countdownDiv, element.nextSibling);
        
        let timeLeft = 3600; // 1 hora
        
        const timer = setInterval(() => {
            const hours = Math.floor(timeLeft / 3600);
            const minutes = Math.floor((timeLeft % 3600) / 60);
            const seconds = timeLeft % 60;
            
            countdownDiv.textContent = `Oferta expira em: ${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                countdownDiv.textContent = 'Oferta Expirada!';
                countdownDiv.style.background = '#666';
            }
            
            timeLeft--;
        }, 1000);
    }

    // Hash simples para A/B Testing
    hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
    }

    // Registra evento
    logEvent(eventName, data = {}) {
        const event = {
            eventName,
            timestamp: Date.now(),
            sessionId: this.sessionData.sessionId,
            url: window.location.href,
            data
        };

        this.sessionData.events.push(event);
        
        // Envia para servidor (simulado)
        this.sendToServer(event);
        
        console.log(`Analytics Event: ${eventName}`, event);
    }

    // Envia dados para servidor
    async sendToServer(event) {
        try {
            // Em produção, isso enviaria para seu servidor de analytics
            const response = await fetch('/api/analytics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(event)
            });
            
            return await response.json();
        } catch (error) {
            console.log('Analytics data saved locally (server unavailable)');
            this.saveToLocalStorage(event);
        }
    }

    // Salva no localStorage como fallback
    saveToLocalStorage(event) {
        const analyticsData = JSON.parse(localStorage.getItem('analytics_data') || '[]');
        analyticsData.push(event);
        
        // Mantém apenas os últimos 100 eventos
        if (analyticsData.length > 100) {
            analyticsData.splice(0, analyticsData.length - 100);
        }
        
        localStorage.setItem('analytics_data', JSON.stringify(analyticsData));
    }

    // Salva dados da sessão
    saveSessionData() {
        const sessionData = {
            ...this.sessionData,
            endTime: Date.now(),
            duration: Date.now() - this.sessionData.startTime
        };

        const sessions = JSON.parse(localStorage.getItem('analytics_sessions') || '[]');
        sessions.push(sessionData);
        
        // Mantém apenas as últimas 50 sessões
        if (sessions.length > 50) {
            sessions.splice(0, sessions.length - 50);
        }
        
        localStorage.setItem('analytics_sessions', JSON.stringify(sessions));
    }

    // Obtém relatório de conversão
    getConversionReport() {
        const sessions = JSON.parse(localStorage.getItem('analytics_sessions') || '[]');
        
        const report = {
            totalSessions: sessions.length,
            conversions: sessions.filter(s => s.conversionFunnel.purchase).length,
            conversionRate: 0,
            funnelSteps: {
                pageView: 0,
                videoStart: 0,
                videoComplete: 0,
                scroll25: 0,
                scroll50: 0,
                scroll75: 0,
                scroll100: 0,
                buttonClick: 0,
                checkoutInitiated: 0
            }
        };

        sessions.forEach(session => {
            Object.keys(session.conversionFunnel).forEach(step => {
                if (session.conversionFunnel[step]) {
                    report.funnelSteps[step]++;
                }
            });
        });

        report.conversionRate = (report.conversions / report.totalSessions) * 100;

        return report;
    }

    // Exporta dados para CSV
    exportToCSV() {
        const sessions = JSON.parse(localStorage.getItem('analytics_sessions') || '[]');
        
        let csv = 'Session ID,Start Time,Duration,Page Views,Conversion,Video Complete,Scroll 100%,Button Click\n';
        
        sessions.forEach(session => {
            csv += `${session.sessionId},${new Date(session.startTime).toISOString()},${session.duration},${session.pageViews},${session.conversionFunnel.purchase},${session.conversionFunnel.videoComplete},${session.conversionFunnel.scroll100},${session.conversionFunnel.buttonClick}\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics_report_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    }
}

// Inicializa analytics
const analytics = new AdvancedAnalytics();

// Exporta para uso global
window.analytics = analytics;

// Adiciona funções úteis ao console
console.log('Sistema de Analytics Avançado inicializado!');
console.log('Comandos disponíveis:');
console.log('- analytics.getConversionReport() - Obtém relatório de conversão');
console.log('- analytics.exportToCSV() - Exporta dados para CSV'); 