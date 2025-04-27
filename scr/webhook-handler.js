const crypto = require('crypto');
const config = require('./config');
const wixService = require('./wix-service');
const dimonaService = require('./dimona-service');

// Verificar a assinatura do webhook para garantir que é autêntico
const verifyWebhookSignature = (req) => {
  // Nota: Implementar quando configurar o webhook no Wix
  // Esta é uma função de exemplo e precisa ser ajustada conforme a documentação
  
  const signature = req.headers['x-wix-signature'];
  if (!signature) {
    return false; // Sem assinatura é inválido
  }
  
  // No ambiente de desenvolvimento, podemos pular a verificação
  // Em produção, deve ser implementada corretamente
  return true;
};

// Processar um webhook de pedido do Wix
const processOrderWebhook = async (req, res) => {
  console.log('Webhook recebido:', JSON.stringify({
    headers: req.headers,
    body: req.body
  }, null, 2));
  
  try {
    // Verificar a autenticidade do webhook
    if (!verifyWebhookSignature(req)) {
      console.log('Assinatura de webhook inválida');
      return res.status(401).json({ 
        status: 'error', 
        message: 'Assinatura inválida' 
      });
    }
    
    // Extrair o ID do pedido do corpo do webhook
    // Nota: Ajuste conforme o formato real dos webhooks do Wix
    const orderId = req.body.orderId || req.body.data?.orderId;
    
    if (!orderId) {
      console.log('ID do pedido não encontrado no webhook');
      return res.status(400).json({
        status: 'error',
        message: 'ID do pedido não encontrado'
      });
    }
    
    // Buscar os detalhes completos do pedido no Wix
    console.log(`Buscando detalhes do pedido ${orderId}`);
    const orderDetails = await wixService.fetchOrderById(orderId);
    
    // Enviar o pedido para a Dimona
    console.log(`Enviando pedido ${orderId} para a Dimona`);
    await dimonaService.sendOrderToDimona(orderDetails);
    
    // Responder com sucesso
    return res.json({
      status: 'success',
      message: `Pedido ${orderId} processado com sucesso`
    });
  } catch (error) {
    console.error('Erro ao processar webhook de pedido:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Sincronizar pedidos recentes manualmente
const syncRecentOrders = async (req, res) => {
  try {
    // Obter pedidos recentes do Wix
    const daysAgo = req.query.days ? parseInt(req.query.days) : 1;
    const orders = await wixService.fetchRecentOrders(daysAgo);
    
    console.log(`Sincronizando ${orders.length} pedidos recentes`);
    
    // Processar cada pedido
    const results = [];
    for (const order of orders) {
      try {
        // Enviar para a Dimona
        const result = await dimonaService.sendOrderToDimona(order);
        results.push({
          orderId: order.id,
          status: 'success',
          dimonaOrderId: result.id || 'N/A'
        });
      } catch (error) {
        results.push({
          orderId: order.id,
          status: 'error',
          message: error.message
        });
      }
    }
    
    return res.json({
      status: 'success',
      processed: results.length,
      results
    });
  } catch (error) {
    console.error('Erro ao sincronizar pedidos recentes:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

module.exports = {
  processOrderWebhook,
  syncRecentOrders
};
