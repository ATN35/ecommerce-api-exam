CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ===========================
-- TABLE: USERS
-- ===========================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  cookie_consent BOOLEAN NOT NULL DEFAULT FALSE
);

-- ===========================
-- TABLE: PRODUCTS
-- ===========================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ===========================
-- TABLE: ORDERS
-- ===========================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_cents INTEGER NOT NULL CHECK (total_cents >= 0),
  status TEXT NOT NULL DEFAULT 'created',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ===========================
-- TABLE: ORDER_ITEMS
-- ===========================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price_cents INTEGER NOT NULL CHECK (unit_price_cents >= 0)
);

-- ===========================
-- CONTRAINTES CASCADE FIX
-- ===========================
ALTER TABLE IF EXISTS order_items
  DROP CONSTRAINT IF EXISTS order_items_order_id_fkey;

ALTER TABLE order_items
  ADD CONSTRAINT order_items_order_id_fkey
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;

ALTER TABLE IF EXISTS orders
  DROP CONSTRAINT IF EXISTS orders_user_id_fkey;

ALTER TABLE orders
  ADD CONSTRAINT orders_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- ===========================
-- SEED COMPTE ADMIN FIXÉ
-- ===========================
INSERT INTO users (email, password_hash, role, cookie_consent)
VALUES (
  'admin@local.test',
  '$2a$10$O22/iB48Oz5IZlRPLVmVMushAm.vybjUwnCP71AbfplYloHoQ7w4u',
  'admin',
  TRUE
)
ON CONFLICT (email) DO NOTHING;

-- ===========================
-- SEED PRODUITS
-- ===========================
INSERT INTO products (name, description, price_cents, stock) VALUES
('T-shirt', 'T-shirt 100% coton', 1999, 100),
('Mug', 'Mug en céramique 350ml', 1299, 200),
('Sticker Pack', 'Lot de stickers', 499, 500)
ON CONFLICT DO NOTHING;
