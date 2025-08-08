/**
 * Sistema de Rastreamento UTM Avançado para Facebook Ads
 * Rastreia e gerencia parâmetros UTM para campanhas
 */

class UTMTracking {
    constructor() {
        this.utmParams = this.extractUTMParams();
        this.campaignData = this.buildCampaignData();
        this.init();
    }

    init() {
        this.saveUTMData();
        this.setupUTMListeners();
        this.trackUTMEvents();
        this.setupUTMExpiration();
    }

    // Extrai parâmetros UTM da URL
    extractUTMParams() {
        const urlParams = new URLSearchParams(window.location.search);
        
        return {
            utm_source: urlParams.get('utm_source') || this.getCookie('utm_source'),
            utm_medium: urlParams.get('utm_medium') || this.getCookie('utm_medium'),
            utm_campaign: urlParams.get('utm_campaign') || this.getCookie('utm_campaign'),
            utm_term: urlParams.get('utm_term') || this.getCookie('utm_term'),
            utm_content: urlParams.get('utm_content') || this.getCookie('utm_content'),
            utm_id: urlParams.get('utm_id') || this.getCookie('utm_id'),
            fbclid: urlParams.get('fbclid') || this.getCookie('fbclid'),
            gclid: urlParams.get('gclid') || this.getCookie('gclid'),
            msclkid: urlParams.get('msclkid') || this.getCookie('msclkid')
        };
    }

    // Constrói dados da campanha
    buildCampaignData() {
        const campaign = {
            source: this.utmParams.utm_source || 'direct',
            medium: this.utmParams.utm_medium || 'none',
            campaign: this.utmParams.utm_campaign || 'organic',
            term: this.utmParams.utm_term || '',
            content: this.utmParams.utm_content || '',
            id: this.utmParams.utm_id || '',
            click_id: this.utmParams.fbclid || this.utmParams.gclid || this.utmParams.msclkid || '',
            landing_page: window.location.pathname,
            referrer: document.referrer,
            timestamp: Date.now(),
            session_id: this.generateSessionId()
        };

        // Determina tipo de campanha
        campaign.campaign_type = this.determineCampaignType(campaign);
        campaign.platform = this.determinePlatform(campaign);

        return campaign;
    }

    // Determina tipo de campanha
    determineCampaignType(campaign) {
        if (campaign.source === 'facebook' || campaign.source === 'fb') {
            return 'facebook_ads';
        } else if (campaign.source === 'google') {
            return 'google_ads';
        } else if (campaign.source === 'instagram') {
            return 'instagram_ads';
        } else if (campaign.source === 'email') {
            return 'email_marketing';
        } else if (campaign.source === 'direct') {
            return 'direct_traffic';
        } else {
            return 'other';
        }
    }

    // Determina plataforma
    determinePlatform(campaign) {
        if (campaign.fbclid) {
            return 'facebook';
        } else if (campaign.gclid) {
            return 'google';
        } else if (campaign.msclkid) {
            return 'microsoft';
        } else {
            return 'unknown';
        }
    }

    // Gera ID único da sessão
    generateSessionId() {
        return 'utm_session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Salva dados UTM
    saveUTMData() {
        // Salva parâmetros UTM em cookies (30 dias)
        Object.keys(this.utmParams).forEach(key => {
            if (this.utmParams[key]) {
                this.setCookie(key, this.utmParams[key], 30);
            }
        });

        // Salva dados da campanha no localStorage
        const campaigns = JSON.parse(localStorage.getItem('utm_campaigns') || '[]');
        campaigns.push(this.campaignData);
        
        // Mantém apenas as últimas 100 campanhas
        if (campaigns.length > 100) {
            campaigns.splice(0, campaigns.length - 100);
        }
        
        localStorage.setItem('utm_campaigns', JSON.stringify(campaigns));
        localStorage.setItem('current_campaign', JSON.stringify(this.campaignData));
    }

    // Configura listeners UTM
    setupUTMListeners() {
        // Rastreia cliques em links internos
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href]')) {
                const link = e.target.href;
                
                // Adiciona parâmetros UTM a links internos
                if (this.isInternalLink(link)) {
                    e.preventDefault();
                    const utmUrl = this.addUTMToURL(link);
                    window.location.href = utmUrl;
                }
            }
        });

        // Rastreia formulários
        document.addEventListener('submit', (e) => {
            if (e.target.matches('form')) {
                this.trackFormSubmission(e.target);
            }
        });
    }

    // Rastreia eventos UTM
    trackUTMEvents() {
        // Rastreia visualização da página com UTM
        this.trackUTMEvent('page_view', {
            campaign_data: this.campaignData,
            page_url: window.location.href,
            user_agent: navigator.userAgent
        });

        // Rastreia engajamento com UTM
        setTimeout(() => {
            this.trackUTMEvent('engagement', {
                campaign_data: this.campaignData,
                time_on_page: 30
            });
        }, 30000);

        // Rastreia scroll com UTM
        let scrollTracked = false;
        window.addEventListener('scroll', () => {
            if (!scrollTracked) {
                const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
                if (scrollPercent > 50) {
                    scrollTracked = true;
                    this.trackUTMEvent('scroll_50', {
                        campaign_data: this.campaignData,
                        scroll_percent: scrollPercent
                    });
                }
            }
        });
    }

    // Configura expiração UTM
    setupUTMExpiration() {
        // Verifica se os cookies UTM expiraram
        setInterval(() => {
            const utmSource = this.getCookie('utm_source');
            if (!utmSource) {
                this.clearUTMCookies();
            }
        }, 60000); // Verifica a cada minuto
    }

    // Rastreia evento UTM
    trackUTMEvent(eventName, data = {}) {
        const eventData = {
            event_name: eventName,
            timestamp: Date.now(),
            campaign_data: this.campaignData,
            session_id: this.campaignData.session_id,
            ...data
        };

        // Envia para Facebook Tracking se disponível
        if (window.facebookTracking) {
            window.facebookTracking.trackEvent(eventName, {
                ...data,
                utm_source: this.campaignData.source,
                utm_medium: this.campaignData.medium,
                utm_campaign: this.campaignData.campaign,
                utm_content: this.campaignData.content,
                utm_term: this.campaignData.term
            });
        }

        // Salva evento localmente
        this.saveUTMEvent(eventData);

        console.log(`UTM Event: ${eventName}`, eventData);
    }

    // Salva evento UTM
    saveUTMEvent(eventData) {
        const events = JSON.parse(localStorage.getItem('utm_events') || '[]');
        events.push(eventData);
        
        // Mantém apenas os últimos 500 eventos
        if (events.length > 500) {
            events.splice(0, events.length - 500);
        }
        
        localStorage.setItem('utm_events', JSON.stringify(events));
    }

    // Adiciona UTM a URL
    addUTMToURL(url) {
        const urlObj = new URL(url);
        
        // Adiciona parâmetros UTM se não existirem
        if (!urlObj.searchParams.get('utm_source') && this.campaignData.source) {
            urlObj.searchParams.set('utm_source', this.campaignData.source);
        }
        if (!urlObj.searchParams.get('utm_medium') && this.campaignData.medium) {
            urlObj.searchParams.set('utm_medium', this.campaignData.medium);
        }
        if (!urlObj.searchParams.get('utm_campaign') && this.campaignData.campaign) {
            urlObj.searchParams.set('utm_campaign', this.campaignData.campaign);
        }
        if (!urlObj.searchParams.get('utm_content') && this.campaignData.content) {
            urlObj.searchParams.set('utm_content', this.campaignData.content);
        }
        if (!urlObj.searchParams.get('utm_term') && this.campaignData.term) {
            urlObj.searchParams.set('utm_term', this.campaignData.term);
        }

        return urlObj.toString();
    }

    // Verifica se é link interno
    isInternalLink(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname === window.location.hostname;
        } catch {
            return false;
        }
    }

    // Rastreia submissão de formulário
    trackFormSubmission(form) {
        const formData = new FormData(form);
        const formFields = {};
        
        for (let [key, value] of formData.entries()) {
            formFields[key] = value;
        }

        this.trackUTMEvent('form_submission', {
            campaign_data: this.campaignData,
            form_action: form.action,
            form_fields: formFields
        });
    }

    // Obtém cookie
    getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    // Define cookie
    setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    }

    // Limpa cookies UTM
    clearUTMCookies() {
        const utmCookies = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'utm_id'];
        utmCookies.forEach(cookie => {
            document.cookie = `${cookie}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
        });
    }

    // Obtém relatório UTM
    getUTMReport() {
        const campaigns = JSON.parse(localStorage.getItem('utm_campaigns') || '[]');
        const events = JSON.parse(localStorage.getItem('utm_events') || '[]');

        const report = {
            total_campaigns: campaigns.length,
            total_events: events.length,
            campaigns_by_source: {},
            campaigns_by_medium: {},
            campaigns_by_type: {},
            conversion_funnel: {
                page_views: 0,
                engagements: 0,
                scroll_50: 0,
                form_submissions: 0,
                checkouts: 0
            }
        };

        // Agrupa campanhas por fonte
        campaigns.forEach(campaign => {
            report.campaigns_by_source[campaign.source] = (report.campaigns_by_source[campaign.source] || 0) + 1;
            report.campaigns_by_medium[campaign.medium] = (report.campaigns_by_medium[campaign.medium] || 0) + 1;
            report.campaigns_by_type[campaign.campaign_type] = (report.campaigns_by_type[campaign.campaign_type] || 0) + 1;
        });

        // Conta eventos do funil
        events.forEach(event => {
            switch (event.event_name) {
                case 'page_view':
                    report.conversion_funnel.page_views++;
                    break;
                case 'engagement':
                    report.conversion_funnel.engagements++;
                    break;
                case 'scroll_50':
                    report.conversion_funnel.scroll_50++;
                    break;
                case 'form_submission':
                    report.conversion_funnel.form_submissions++;
                    break;
                case 'checkout':
                    report.conversion_funnel.checkouts++;
                    break;
            }
        });

        return report;
    }

    // Exporta dados UTM para CSV
    exportUTMToCSV() {
        const campaigns = JSON.parse(localStorage.getItem('utm_campaigns') || '[]');
        const events = JSON.parse(localStorage.getItem('utm_events') || '[]');

        // Exporta campanhas
        let campaignsCSV = 'Session ID,Source,Medium,Campaign,Content,Term,Platform,Campaign Type,Timestamp\n';
        campaigns.forEach(campaign => {
            campaignsCSV += `${campaign.session_id},${campaign.source},${campaign.medium},${campaign.campaign},${campaign.content},${campaign.term},${campaign.platform},${campaign.campaign_type},${new Date(campaign.timestamp).toISOString()}\n`;
        });

        // Exporta eventos
        let eventsCSV = 'Session ID,Event Name,Timestamp,Campaign Source,Campaign Medium,Campaign\n';
        events.forEach(event => {
            eventsCSV += `${event.session_id},${event.event_name},${new Date(event.timestamp).toISOString()},${event.campaign_data.source},${event.campaign_data.medium},${event.campaign_data.campaign}\n`;
        });

        // Download dos arquivos
        this.downloadCSV(campaignsCSV, `utm_campaigns_${new Date().toISOString().split('T')[0]}.csv`);
        this.downloadCSV(eventsCSV, `utm_events_${new Date().toISOString().split('T')[0]}.csv`);
    }

    // Download CSV
    downloadCSV(csv, filename) {
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
    }

    // Gera URLs de teste UTM
    generateTestURLs() {
        const baseUrl = window.location.origin + window.location.pathname;
        const testParams = [
            { source: 'facebook', medium: 'cpc', campaign: 'memory_pulse_awareness' },
            { source: 'instagram', medium: 'cpc', campaign: 'memory_pulse_consideration' },
            { source: 'google', medium: 'cpc', campaign: 'memory_pulse_conversion' },
            { source: 'email', medium: 'email', campaign: 'memory_pulse_newsletter' }
        ];

        const testUrls = testParams.map(params => {
            const url = new URL(baseUrl);
            url.searchParams.set('utm_source', params.source);
            url.searchParams.set('utm_medium', params.medium);
            url.searchParams.set('utm_campaign', params.campaign);
            url.searchParams.set('utm_content', 'test_content');
            url.searchParams.set('utm_term', 'test_term');
            return url.toString();
        });

        console.log('URLs de teste UTM:', testUrls);
        return testUrls;
    }

    // Valida parâmetros UTM
    validateUTMParams() {
        const validation = {
            isValid: true,
            errors: [],
            warnings: []
        };

        // Verifica se source está presente
        if (!this.campaignData.source || this.campaignData.source === 'direct') {
            validation.warnings.push('UTM Source não definido ou é tráfego direto');
        }

        // Verifica se medium está presente
        if (!this.campaignData.medium || this.campaignData.medium === 'none') {
            validation.warnings.push('UTM Medium não definido');
        }

        // Verifica se campaign está presente
        if (!this.campaignData.campaign || this.campaignData.campaign === 'organic') {
            validation.warnings.push('UTM Campaign não definido');
        }

        // Verifica se há click ID
        if (!this.campaignData.click_id) {
            validation.warnings.push('Click ID não encontrado (fbclid, gclid, msclkid)');
        }

        return validation;
    }
}

// Inicializa UTM Tracking
const utmTracking = new UTMTracking();

// Exporta para uso global
window.utmTracking = utmTracking;

// Adiciona funções úteis ao console
console.log('Sistema de UTM Tracking inicializado!');
console.log('Dados da campanha atual:', utmTracking.campaignData);
console.log('Comandos disponíveis:');
console.log('- utmTracking.getUTMReport() - Obtém relatório UTM');
console.log('- utmTracking.exportUTMToCSV() - Exporta dados UTM para CSV');
console.log('- utmTracking.generateTestURLs() - Gera URLs de teste UTM');
console.log('- utmTracking.validateUTMParams() - Valida parâmetros UTM'); 