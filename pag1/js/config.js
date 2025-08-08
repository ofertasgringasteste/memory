/**
 * Configuração Centralizada - Sistema de Rastreamento Facebook Ads
 * Memory Pulse
 */

const TRACKING_CONFIG = {
    // Facebook Pixel Configuration
    facebook: {
        pixelId: '1478137953324470',
        accessToken: 'EAARAixYN78IBPDf9arUDfM6ZBfXZAZBiW098fBMilrCRqLX4sPjZCr09PK2suvtej3HKLfB6gmJh00hnOOLZAp4Pstc4FlWHgkHlYdFczZBZAsIjAtI3Ju8GCAfCgCDcVlqPgS1moOwv9kbegkbAkU6ZCmxQAWh5ZAm6fkqcFd1uoFMpmfS5ZCtyKZBLXhBZBfZBJ3VQtIAZDZD',
        apiVersion: 'v17.0'
    },

    // Product Configuration
    product: {
        name: 'Memory Pulse',
        category: 'Health & Wellness',
        value: 39.00,
        currency: 'USD',
        originalPrice: 169.00,
        discount: 70
    },

    // Analytics Configuration
    analytics: {
        sessionTimeout: 30 * 60 * 1000, // 30 minutos
        maxEvents: 100,
        maxSessions: 50,
        scrollThresholds: [25, 50, 75, 100],
        timeIntervals: [10, 30, 60, 120, 300] // segundos
    },

    // UTM Configuration
    utm: {
        cookieExpiration: 30, // dias
        maxCampaigns: 100,
        maxEvents: 500,
        defaultSource: 'direct',
        defaultMedium: 'none',
        defaultCampaign: 'organic'
    },

    // A/B Testing Configuration
    abTesting: {
        enabled: true,
        variants: {
            buttonColor: ['yellow', 'blue', 'green'],
            buttonText: ['Comprar Agora', 'Quero Recuperar', 'Acessar Oferta'],
            priceDisplay: ['normal', 'highlighted', 'countdown']
        }
    },

    // Event Tracking Configuration
    events: {
        // Facebook Pixel Events
        pixelEvents: [
            'PageView',
            'ViewContent',
            'InitiateCheckout',
            'AddToCart',
            'Purchase',
            'Lead',
            'Engagement'
        ],

        // Custom Events
        customEvents: [
            'VideoPlay',
            'VideoPause',
            'VideoComplete',
            'VideoProgress',
            'Scroll25',
            'Scroll50',
            'Scroll75',
            'Scroll100',
            'TimeOnPage',
            'ButtonClick',
            'CheckoutButtonClick',
            'PageLeave',
            'MouseActivity',
            'KeyPress',
            'WindowResize',
            'FormSubmission',
            'ConversionDetected'
        ],

        // UTM Events
        utmEvents: [
            'page_view',
            'engagement',
            'scroll_50',
            'form_submission',
            'checkout'
        ]
    },

    // Conversion Funnel Configuration
    funnel: {
        steps: [
            'pageView',
            'videoStart',
            'videoComplete',
            'scroll25',
            'scroll50',
            'scroll75',
            'scroll100',
            'buttonClick',
            'checkoutInitiated',
            'purchase'
        ],
        stepNames: {
            pageView: 'Visualização da Página',
            videoStart: 'Início do Vídeo',
            videoComplete: 'Vídeo Completo',
            scroll25: 'Scroll 25%',
            scroll50: 'Scroll 50%',
            scroll75: 'Scroll 75%',
            scroll100: 'Scroll 100%',
            buttonClick: 'Clique no Botão',
            checkoutInitiated: 'Início do Checkout',
            purchase: 'Compra Realizada'
        }
    },

    // URLs Configuration
    urls: {
        checkout: 'https://pay.speedsellx.com/688D5675E35A7',
        terms: '/termos',
        privacy: '/privacidade'
    },

    // Debug Configuration
    debug: {
        enabled: false,
        logLevel: 'info', // 'debug', 'info', 'warn', 'error'
        showConsoleLogs: true,
        trackErrors: true
    },

    // Privacy Configuration
    privacy: {
        gdprCompliant: true,
        cookieConsent: true,
        dataRetention: {
            events: 90, // dias
            sessions: 30, // dias
            utmData: 30 // dias
        }
    }
};

// Funções de utilidade para configuração
const ConfigUtils = {
    // Obtém configuração
    get: (path) => {
        return path.split('.').reduce((obj, key) => obj && obj[key], TRACKING_CONFIG);
    },

    // Define configuração
    set: (path, value) => {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const obj = keys.reduce((obj, key) => obj[key] = obj[key] || {}, TRACKING_CONFIG);
        obj[lastKey] = value;
    },

    // Verifica se debug está ativo
    isDebugEnabled: () => {
        return TRACKING_CONFIG.debug.enabled || localStorage.getItem('debug_mode') === 'true';
    },

    // Log com nível de debug
    log: (level, message, data = null) => {
        if (!ConfigUtils.isDebugEnabled()) return;

        const levels = ['debug', 'info', 'warn', 'error'];
        const currentLevel = levels.indexOf(TRACKING_CONFIG.debug.logLevel);
        const messageLevel = levels.indexOf(level);

        if (messageLevel >= currentLevel) {
            const prefix = `[Memory Pulse Tracking - ${level.toUpperCase()}]`;
            
            if (data) {
                console[level](prefix, message, data);
            } else {
                console[level](prefix, message);
            }
        }
    },

    // Valida configuração
    validate: () => {
        const errors = [];

        // Valida Facebook Pixel
        if (!TRACKING_CONFIG.facebook.pixelId) {
            errors.push('Facebook Pixel ID não configurado');
        }

        if (!TRACKING_CONFIG.facebook.accessToken) {
            errors.push('Facebook Access Token não configurado');
        }

        // Valida produto
        if (!TRACKING_CONFIG.product.value) {
            errors.push('Valor do produto não configurado');
        }

        // Valida URLs
        if (!TRACKING_CONFIG.urls.checkout) {
            errors.push('URL de checkout não configurada');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    },

    // Exporta configuração
    export: () => {
        return JSON.stringify(TRACKING_CONFIG, null, 2);
    },

    // Importa configuração
    import: (configString) => {
        try {
            const config = JSON.parse(configString);
            Object.assign(TRACKING_CONFIG, config);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
};

// Exemplo de URLs de teste
const TEST_URLS = {
    facebook: {
        awareness: '?utm_source=facebook&utm_medium=cpc&utm_campaign=memory_pulse_awareness&utm_content=video_ad&utm_term=memoria',
        consideration: '?utm_source=facebook&utm_medium=cpc&utm_campaign=memory_pulse_consideration&utm_content=carousel_ad&utm_term=concentracao',
        conversion: '?utm_source=facebook&utm_medium=cpc&utm_campaign=memory_pulse_conversion&utm_content=cta_ad&utm_term=ondas+cerebrais'
    },
    instagram: {
        stories: '?utm_source=instagram&utm_medium=cpc&utm_campaign=memory_pulse_stories&utm_content=story_ad&utm_term=memoria',
        feed: '?utm_source=instagram&utm_medium=cpc&utm_campaign=memory_pulse_feed&utm_content=feed_ad&utm_term=concentracao'
    },
    google: {
        search: '?utm_source=google&utm_medium=cpc&utm_campaign=memory_pulse_search&utm_content=search_ad&utm_term=ondas+cerebrais',
        display: '?utm_source=google&utm_medium=cpc&utm_campaign=memory_pulse_display&utm_content=display_ad&utm_term=memoria'
    },
    email: {
        newsletter: '?utm_source=email&utm_medium=email&utm_campaign=memory_pulse_newsletter&utm_content=newsletter&utm_term=memoria'
    }
};

// Exporta para uso global
window.TRACKING_CONFIG = TRACKING_CONFIG;
window.ConfigUtils = ConfigUtils;
window.TEST_URLS = TEST_URLS;

// Log de inicialização
if (ConfigUtils.isDebugEnabled()) {
    console.log('[Memory Pulse Tracking] Configuração carregada:', TRACKING_CONFIG);
    console.log('[Memory Pulse Tracking] URLs de teste disponíveis:', TEST_URLS);
    console.log('[Memory Pulse Tracking] Comandos disponíveis:');
    console.log('- ConfigUtils.get("facebook.pixelId") - Obtém Pixel ID');
    console.log('- ConfigUtils.set("debug.enabled", true) - Ativa debug');
    console.log('- ConfigUtils.validate() - Valida configuração');
    console.log('- ConfigUtils.export() - Exporta configuração');
} 