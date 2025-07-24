/*
  # Create customers table and storage bucket

  1. New Tables
    - `customers`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `phone` (text)
      - `delivery_method` (text array)
      - `image_url` (text, nullable)
      - `order_number` (text)
      - `created_at` (timestamp)

  2. Storage
    - Create `photos` bucket for storing customer images

  3. Security
    - Enable RLS on `customers` table
    - Add policies for public access (since no authentication is required)
    - Configure storage policies for public uploads
*/

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  delivery_method text[] NOT NULL DEFAULT '{}',
  image_url text,
  order_number text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Create policy for public access (no authentication required)
CREATE POLICY "Allow public access to customers"
  ON customers
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create storage bucket for photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy for public uploads
CREATE POLICY "Allow public uploads to photos bucket"
  ON storage.objects
  FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'photos');

-- Create storage policy for public access to photos
CREATE POLICY "Allow public access to photos"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'photos');