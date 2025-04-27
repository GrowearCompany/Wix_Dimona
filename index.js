const express = require('express');
const config = require('./src/config');
const webhookHandler = require('./src/webhook-handler');

// Criar a aplicação Express
const app = express();

// Middleware para processar JSON
app.use(express.json());

// Rota de saúde - útil para verificar se o serviço está funcionando
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'Serviço de integração Wix-Dimona está funcionando'
  });
});

// Rota para receber webhooks de pedidos do Wix
app.post('/webhook/wix-orders', webhookHandler.processOrderWebhook);

// Rota para sincronização manual de pedidos recentes
app.get('/sync/recent-orders', webhookHandler.syncRecentOrders);

// Iniciar o servidor
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Endpoint de webhook: http://localhost:${PORT}/webhook/wix-orders`);
  console.log(`Endpoint de sincronização manual: http://localhost:${PORT}/sync/recent-orders`);
});
