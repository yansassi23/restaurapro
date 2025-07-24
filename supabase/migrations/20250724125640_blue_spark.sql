/*
  # Update customers table for multiple images

  1. Schema Changes
    - Change `image_url` column from `text` to `text[]` to store multiple image URLs
    - Add `image_count` column to track number of images uploaded
    - Update existing records to use array format

  2. Data Migration
    - Convert existing single image URLs to array format
    - Set image_count based on existing data

  3. Security
    - Maintain existing RLS policies
*/

-- Add new column for image count
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'customers' AND column_name = 'image_count'
  ) THEN
    ALTER TABLE customers ADD COLUMN image_count integer DEFAULT 1;
  END IF;
END $$;

-- Convert image_url from text to text[] if it's not already an array
DO $$
BEGIN
  -- Check if image_url is currently text type
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'customers' 
    AND column_name = 'image_url' 
    AND data_type = 'text'
  ) THEN
    -- Create a temporary column for the array
    ALTER TABLE customers ADD COLUMN image_urls_temp text[];
    
    -- Migrate existing data to array format
    UPDATE customers 
    SET image_urls_temp = CASE 
      WHEN image_url IS NOT NULL AND image_url != '' THEN ARRAY[image_url]
      ELSE ARRAY[]::text[]
    END;
    
    -- Drop the old column and rename the new one
    ALTER TABLE customers DROP COLUMN image_url;
    ALTER TABLE customers RENAME COLUMN image_urls_temp TO image_url;
  END IF;
END $$;

-- Ensure image_url is text[] type
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'customers' 
    AND column_name = 'image_url' 
    AND data_type = 'ARRAY'
  ) THEN
    ALTER TABLE customers ALTER COLUMN image_url TYPE text[] USING 
      CASE 
        WHEN image_url IS NULL THEN ARRAY[]::text[]
        ELSE ARRAY[image_url::text]
      END;
  END IF;
END $$;

-- Set default value for image_url
ALTER TABLE customers ALTER COLUMN image_url SET DEFAULT ARRAY[]::text[];