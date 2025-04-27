const axios = require('axios');
const config = require('./config');

// Configuração dos headers para autenticação na Dimona
const getDimonaHeaders = () => {
  return {
    'Authorization': `Bearer ${config.dimona.apiKey}`,
    'Content-Type': 'application/json'
  };
};

// Função para mapear os dados do pedido Wix para o formato aceito pela Dimona
const mapWixOrderToDimona = (wixOrder) => {
  // Nota: Esta função precisa ser adaptada com base na documentação da API Dimona
  // O formato abaixo é um exemplo e deve ser ajustado
  
  return {
    id_externo: wixOrder.id,
    cliente: {
      nome: wixOrder.buyerInfo?.fullName || '',
      email: wixOrder.buyerInfo?.email || '',
      telefone: wixOrder.buyerInfo?.phone || ''
    },
    endereco_entrega: {
      // Mapear o endereço de entrega
      rua: wixOrder.shippingInfo?.shipmentDetails?.address?.addressLine || '',
      numero: wixOrder.shippingInfo?.shipmentDetails?.address?.streetNumber || '',
      bairro: wixOrder.shippingInfo?.shipmentDetails?.address?.neighborhood || '',
      cidade: wixOrder.shippingInfo?.shipmentDetails?.address?.city || '',
      estado: wixOrder.shippingInfo?.shipmentDetails?.address?.subdivision || '',
      cep: wixOrder.shippingInfo?.shipmentDetails?.address?.postalCode || '',
      complemento: wixOrder.shippingInfo?.shipmentDetails?.address?.addressLine2 || ''
    },
    itens: (wixOrder.lineItems || []).map(item => ({
      produto_id: item.productId,
      variacao_id: item.variantId || '',
      quantidade: item.quantity,
      valor: item.price,
      // Adicionar outros campos necessários
    }))
  };
};

// Função para enviar um pedido para a Dimona
const sendOrderToDimona = async (wixOrder) => {
  try {
    // Converter o pedido para o formato da Dimona
    const dimonaOrder = mapWixOrderToDimona(wixOrder);
    
    // Enviar para a API da Dimona
    const response = await axios.post(
      `${config.dimona.apiBaseUrl}/pedidos`, 
      dimonaOrder,
      { headers: getDimonaHeaders() }
    );
    
    console.log(`Pedido ${wixOrder.id} enviado com sucesso para Dimona`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao enviar pedido ${wixOrder.id} para Dimona:`, error.message);
    if (error.response) {
      console.error('Detalhes do erro:', error.response.data);
    }
    throw error;
  }
};

module.exports = {
  sendOrderToDimona,
  mapWixOrderToDimona
};
