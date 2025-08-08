# Sistema de Rastreamento Facebook Ads Avançado - Memory Pulse

## 📊 Visão Geral

Este sistema implementa um rastreamento ultra avançado para campanhas do Facebook Ads, incluindo:

- **Facebook Pixel** com Conversions API
- **Analytics Avançado** com funil de conversão
- **UTM Tracking** completo
- **A/B Testing** automático
- **Heatmap** de comportamento do usuário

## 🔧 Configuração

### Pixel ID e Token
- **Pixel ID**: `1478137953324470`
- **Access Token**: `EAARAixYN78IBPDf9arUDfM6ZBfXZAZBiW098fBMilrCRqLX4sPjZCr09PK2suvtej3HKLfB6gmJh00hnOOLZAp4Pstc4FlWHgkHlYdFczZBZAsIjAtI3Ju8GCAfCgCDcVlqPgS1moOwv9kbegkbAkU6ZCmxQAWh5ZAm6fkqcFd1uoFMpmfS5ZCtyKZBLXhBZBfZBJ3VQtIAZDZD`

### Arquivos Incluídos
1. `js/facebook-tracking.js` - Sistema principal do Facebook
2. `js/analytics-advanced.js` - Analytics avançado
3. `js/utm-tracking.js` - Rastreamento UTM

## 🎯 Eventos Rastreados

### Facebook Pixel Events
- **PageView** - Visualização da página
- **ViewContent** - Visualização de conteúdo
- **InitiateCheckout** - Início de checkout
- **AddToCart** - Adição ao carrinho
- **Purchase** - Compra realizada
- **Lead** - Geração de lead
- **Engagement** - Engajamento do usuário

### Eventos Customizados
- **VideoPlay** - Início do vídeo
- **VideoComplete** - Vídeo completo
- **Scroll25/50/75/100** - Marcos de scroll
- **TimeOnPage** - Tempo na página
- **ButtonClick** - Cliques em botões

## 📈 Analytics Avançado

### Funil de Conversão
```
PageView → VideoStart → VideoComplete → Scroll25 → Scroll50 → Scroll75 → Scroll100 → ButtonClick → CheckoutInitiated → Purchase
```

### Métricas Coletadas
- **Tempo na página**
- **Profundidade de scroll**
- **Engajamento com vídeo**
- **Comportamento do mouse**
- **Cliques e interações**
- **Taxa de conversão por etapa**

## 🔗 UTM Tracking

### Parâmetros Suportados
- `utm_source` - Fonte do tráfego
- `utm_medium` - Meio de aquisição
- `utm_campaign` - Nome da campanha
- `utm_content` - Conteúdo específico
- `utm_term` - Palavras-chave
- `utm_id` - ID da campanha

### Click IDs
- `fbclid` - Facebook Click ID
- `gclid` - Google Click ID
- `msclkid` - Microsoft Click ID

## 🧪 A/B Testing

### Variáveis Testadas
1. **Cor do Botão**: Amarelo, Azul, Verde
2. **Texto do Botão**: "Comprar Agora", "Quero Recuperar", "Acessar Oferta"
3. **Display do Preço**: Normal, Destacado, Contador

### Como Funciona
- Variantes são atribuídas baseadas no hash da sessão
- Testes são consistentes por usuário
- Dados são coletados automaticamente

## 📊 Relatórios Disponíveis

### Comandos no Console

#### Facebook Tracking
```javascript
// Rastrear evento customizado
facebookTracking.trackEvent('CustomEvent', { value: 39.00 });

// Rastrear compra
facebookTracking.trackPurchase('order_123', 39.00, 'USD');

// Obter dados de rastreamento
facebookTracking.getUTMParameters();
```

#### Analytics
```javascript
// Obter relatório de conversão
analytics.getConversionReport();

// Exportar dados para CSV
analytics.exportToCSV();

// Ver dados da sessão atual
analytics.sessionData;
```

#### UTM Tracking
```javascript
// Obter relatório UTM
utmTracking.getUTMReport();

// Exportar dados UTM
utmTracking.exportUTMToCSV();

// Gerar URLs de teste
utmTracking.generateTestURLs();

// Validar parâmetros
utmTracking.validateUTMParams();
```

## 🎯 URLs de Teste

### Exemplos de URLs com UTM
```
https://seudominio.com/?utm_source=facebook&utm_medium=cpc&utm_campaign=memory_pulse_awareness&utm_content=video_ad&utm_term=memoria

https://seudominio.com/?utm_source=instagram&utm_medium=cpc&utm_campaign=memory_pulse_consideration&utm_content=story_ad&utm_term=concentracao

https://seudominio.com/?utm_source=google&utm_medium=cpc&utm_campaign=memory_pulse_conversion&utm_content=search_ad&utm_term=ondas+cerebrais
```

## 📱 Compatibilidade

### Navegadores Suportados
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Dispositivos
- Desktop
- Tablet
- Mobile

## 🔒 Privacidade e LGPD

### Dados Coletados
- **Anônimos**: IP, User Agent, Resolução
- **Comportamentais**: Cliques, Scroll, Tempo
- **Campanha**: UTM, Click IDs
- **Conversão**: Eventos de compra

### Armazenamento
- **LocalStorage**: Dados temporários
- **Cookies**: Parâmetros UTM (30 dias)
- **Facebook**: Eventos de conversão

## 🚀 Implementação

### 1. Inclusão dos Scripts
Os scripts já estão incluídos no HTML:
```html
<script src="js/facebook-tracking.js"></script>
<script src="js/analytics-advanced.js"></script>
<script src="js/utm-tracking.js"></script>
```

### 2. Verificação de Funcionamento
Abra o console do navegador e verifique:
```javascript
// Deve retornar os objetos dos sistemas
console.log(facebookTracking);
console.log(analytics);
console.log(utmTracking);
```

### 3. Teste de Eventos
```javascript
// Teste de evento de checkout
facebookTracking.trackInitiateCheckout();

// Teste de evento de compra
facebookTracking.trackPurchase('test_order', 39.00, 'USD');
```

## 📊 Dashboard de Métricas

### Métricas Principais
- **Taxa de Conversão**: Compra/Visualização
- **Funil de Conversão**: Abandono por etapa
- **Performance por Campanha**: ROI por UTM
- **Engajamento**: Tempo, Scroll, Vídeo

### KPIs Importantes
- **CTR** (Click Through Rate)
- **CVR** (Conversion Rate)
- **CPC** (Cost Per Click)
- **CPA** (Cost Per Acquisition)
- **ROAS** (Return on Ad Spend)

## 🔧 Personalização

### Modificar Eventos
Edite `facebook-tracking.js` para adicionar eventos customizados:
```javascript
// Exemplo de evento customizado
facebookTracking.trackEvent('VideoWatched', {
    content_name: 'Memory Pulse Video',
    video_duration: 120,
    watch_percentage: 75
});
```

### Adicionar Métricas
Edite `analytics-advanced.js` para novas métricas:
```javascript
// Exemplo de nova métrica
analytics.logEvent('CustomMetric', {
    metric_name: 'scroll_depth',
    value: 85
});
```

## 🐛 Troubleshooting

### Problemas Comuns

#### 1. Pixel não carrega
- Verifique se o Pixel ID está correto
- Confirme se não há bloqueadores de anúncios
- Verifique o console para erros

#### 2. Eventos não aparecem
- Verifique o token de acesso
- Confirme se a Conversions API está ativa
- Teste com eventos básicos primeiro

#### 3. UTM não funciona
- Verifique se os parâmetros estão na URL
- Confirme se os cookies estão sendo salvos
- Teste com URLs de exemplo

### Debug
```javascript
// Ativar modo debug
localStorage.setItem('debug_mode', 'true');

// Ver logs detalhados
console.log('Facebook Events:', facebookTracking.events);
console.log('Analytics Events:', analytics.sessionData.events);
console.log('UTM Data:', utmTracking.campaignData);
```

## 📞 Suporte

### Logs Importantes
- **Facebook Events**: Console do navegador
- **Analytics Data**: localStorage
- **UTM Data**: Cookies e localStorage

### Contatos
- **Desenvolvedor**: Sistema implementado
- **Facebook Ads**: Suporte oficial
- **Documentação**: Este arquivo

---

## 🎉 Conclusão

Este sistema oferece rastreamento completo e avançado para suas campanhas do Facebook Ads, permitindo:

✅ **Rastreamento preciso** de conversões
✅ **Analytics detalhado** do comportamento
✅ **A/B Testing** automático
✅ **Relatórios completos** de performance
✅ **Conformidade** com LGPD
✅ **Fácil implementação** e manutenção

O sistema está pronto para uso e otimização de suas campanhas do Memory Pulse! 