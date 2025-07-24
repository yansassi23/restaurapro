# Sistema de Restauração de Fotos - FotoRevive

Sistema completo para restauração de fotos antigas com integração de pagamento e webhook.

## Funcionalidades

- ✅ Upload de fotos antigas
- ✅ Formulário de dados do cliente
- ✅ Integração com gateway de pagamento (Cakto)
- ✅ Webhook para confirmação automática de pagamento
- ✅ Verificação em tempo real do status do pagamento
- ✅ Armazenamento seguro no Supabase
- ✅ Interface responsiva e moderna

## Webhook de Pagamento

### Configuração no Cakto

Configure o webhook no painel do Cakto para apontar para:
```
https://[seu-projeto].supabase.co/functions/v1/payment-webhook
```

### ID do Webhook
```
6a1b4038-a91b-47a3-a6da-bc0bd5c8ba01
```

### Payload Esperado

O webhook espera receber um payload JSON com os seguintes campos:

```json
{
  "order_number": "ABC123DEF",
  "status": "paid", // ou "failed", "cancelled"
  "payment_status": "confirmed", // ou "failed"
  "transaction_id": "txn_123456",
  "amount": 5.00,
  "customer_email": "cliente@email.com"
}
```

### Status de Pagamento

- `pending`: Pagamento aguardando confirmação
- `confirmed`: Pagamento confirmado com sucesso
- `failed`: Pagamento falhou ou foi cancelado

## Estrutura do Banco de Dados

### Tabela `customers`

```sql
- id (uuid, primary key)
- name (text)
- email (text)
- phone (text)
- delivery_method (text[])
- image_url (text, nullable)
- order_number (text)
- payment_status (text, default: 'pending')
- created_at (timestamptz)
```

## Como Funciona

1. **Upload**: Cliente faz upload da foto antiga
2. **Dados**: Cliente preenche formulário com dados pessoais
3. **Pagamento**: Cliente é redirecionado para gateway de pagamento
4. **Webhook**: Sistema recebe confirmação automática via webhook
5. **Verificação**: Interface verifica status em tempo real
6. **Sucesso**: Cliente é notificado da confirmação

## Desenvolvimento

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

## Variáveis de Ambiente

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

## Supabase Edge Functions

A Edge Function `payment-webhook` está configurada para:
- Receber webhooks do Cakto
- Validar payload recebido
- Atualizar status de pagamento no banco
- Retornar confirmação de processamento

## Segurança

- ✅ Row Level Security (RLS) habilitado
- ✅ Validação de payload do webhook
- ✅ Políticas de acesso granulares
- ✅ Chaves de API protegidas