require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  wix: {
    apiKey: process.env.WIX_API_KEY,
    accountId: process.env.WIX_ACCOUNT_ID,
    siteId: process.env.WIX_SITE_ID,
    apiBaseUrl: 'https://www.wixapis.com/ecom/v1'
  },
  dimona: {
    apiKey: process.env.DIMONA_API_KEY,
    apiBaseUrl: 'https://api.camisadimona.com.br'
  }
};
