# Integração Wix-Dimona

Aplicação para integrar pedidos da plataforma Wix com a plataforma de produção Dimona.

## Configuração

1. Clone este repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie um arquivo `.env` com as seguintes variáveis:
   ```
   WIX_API_KEY=sua_chave_api_wix
   WIX_ACCOUNT_ID=seu_account_id_wix
   WIX_SITE_ID=seu_site_id_wix
   DIMONA_API_KEY=sua_chave_api_dimona
   PORT=3000
   ```

4. Inicie a aplicação:
   ```bash
   npm start
   ```

## Endpoints

- `GET /`: Verificação de saúde da aplicação
- `POST /webhook/wix-orders`: Endpoint para receber webhooks de pedidos do Wix
- `GET /sync/recent-orders`: Endpoint para sincronização manual de pedidos recentes

## Configuração no Wix

1. Acesse o Wix Developer Center
2. Configure um webhook para o evento "Order Created" apontando para a URL `/webhook/wix-orders`
3. Configure as chaves de API necessárias
