-- Create stores table
CREATE TABLE IF NOT EXISTS stores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  purchase_price DECIMAL(10, 2) NOT NULL,
  purchase_date DATE NOT NULL,
  sale_price DECIMAL(10, 2),
  sale_date DATE,
  sold_at TEXT,
  product_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_store_id ON products(store_id);
CREATE INDEX IF NOT EXISTS idx_products_sale_date ON products(sale_date);
CREATE INDEX IF NOT EXISTS idx_products_purchase_date ON products(purchase_date);

-- Insert default store (The Real Real)
INSERT INTO stores (name) VALUES ('The Real Real') ON CONFLICT (name) DO NOTHING;

-- Migration: Add product_url column if it doesn't exist
ALTER TABLE products ADD COLUMN IF NOT EXISTS product_url TEXT;
