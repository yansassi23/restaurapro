/*
  # Adicionar status de pagamento

  1. Modificações na Tabela
    - Adicionar coluna `payment_status` na tabela `customers`
    - Valores possíveis: 'pending', 'confirmed', 'failed'
    - Valor padrão: 'pending'

  2. Segurança
    - Manter RLS existente
    - Adicionar política para permitir atualizações via webhook
*/

-- Adicionar coluna payment_status
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'customers' AND column_name = 'payment_status'
  ) THEN
    ALTER TABLE customers ADD COLUMN payment_status text DEFAULT 'pending';
  END IF;
END $$;

-- Adicionar política para permitir atualizações do webhook
CREATE POLICY "Allow webhook updates"
  ON customers
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);