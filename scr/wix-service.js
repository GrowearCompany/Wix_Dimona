const axios = require('axios');
const config = require('./config');

// Configuração dos headers para autenticação no Wix
const getWixHeaders = () => {
  return {
    'Authorization': config.wix.apiKey,
    'wix-account-id': config.wix.accountId,
    'wix-site-id': config.wix.siteId
  };
};

// Função para buscar pedidos recentes do Wix
const fetchRecentOrders = async (daysAgo = 1) => {
  try {
    // Calcular data início (pedidos dos últimos X dias)
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);
    const isoStartDate = startDate.toISOString();
    
    const response = await axios.get(`${config.wix.apiBaseUrl}/orders`, {
      headers: getWixHeaders(),
      params: {
        // Filtrar pedidos recentes que não foram cumpridos
        'dateCreated.ge': isoStartDate,
        'fulfillmentStatus': 'NOT_FULFILLED'
      }
    });
    
    console.log(`Encontrados ${response.data.orders?.length || 0} pedidos recentes no Wix`);
    return response.data.orders || [];
  } catch (error) {
    console.error('Erro ao buscar pedidos do Wix:', error.message);
    if (error.response) {
      console.error('Detalhes do erro:', error.response.data);
    }
    throw error;
  }
};

// Função para buscar um pedido específico pelo ID
const fetchOrderById = async (orderId) => {
  try {
    const response = await axios.get(`${config.wix.apiBaseUrl}/orders/${orderId}`, {
      headers: getWixHeaders()
    });
    
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar o pedido ${orderId} do Wix:`, error.message);
    throw error;
  }
};

module.exports = {
  fetchRecentOrders,
  fetchOrderById
};
