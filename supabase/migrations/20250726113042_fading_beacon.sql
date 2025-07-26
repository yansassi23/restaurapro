/*
  # Add colorize and comments options to customers table

  1. New Columns
    - `colorize` (boolean, default false) - Whether customer wants photo colorized
    - `comments` (text, nullable) - Additional comments from customer about the photo restoration

  2. Changes
    - Add colorize column with default value false
    - Add comments column allowing null values for optional comments
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'customers' AND column_name = 'colorize'
  ) THEN
    ALTER TABLE customers ADD COLUMN colorize boolean DEFAULT false;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'customers' AND column_name = 'comments'
  ) THEN
    ALTER TABLE customers ADD COLUMN comments text;
  END IF;
END $$;