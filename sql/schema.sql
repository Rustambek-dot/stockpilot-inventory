CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'warehouse', -- admin | manager | warehouse
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  sku VARCHAR(100) NOT NULL,
  name VARCHAR(500) NOT NULL,
  category VARCHAR(100) DEFAULT 'general',
  unit VARCHAR(20) DEFAULT 'pcs',
  price DECIMAL(12,2) DEFAULT 0,
  cost DECIMAL(12,2) DEFAULT 0,
  min_stock INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(org_id, sku)
);

CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS stock (
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  qty INT NOT NULL DEFAULT 0,
  PRIMARY KEY (product_id, location_id)
);

CREATE TABLE IF NOT EXISTS movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES locations(id),
  type VARCHAR(10) NOT NULL CHECK (type IN ('in', 'out', 'adjust')),
  qty INT NOT NULL,
  reason VARCHAR(50) DEFAULT 'correction',
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  contact VARCHAR(255),
  email VARCHAR(255)
);

-- Transactional movement registration: inserts movement AND updates stock atomically
CREATE OR REPLACE FUNCTION register_movement(
  p_org UUID, p_product UUID, p_location UUID,
  p_type VARCHAR, p_qty INT, p_reason VARCHAR, p_user UUID
) RETURNS UUID AS $$
DECLARE
  v_delta INT;
  v_id UUID;
BEGIN
  v_delta := CASE WHEN p_type = 'out' THEN -ABS(p_qty) ELSE p_qty END;

  INSERT INTO movements (org_id, product_id, location_id, type, qty, reason, user_id)
  VALUES (p_org, p_product, p_location, p_type, v_delta, p_reason, p_user)
  RETURNING id INTO v_id;

  INSERT INTO stock (product_id, location_id, qty)
  VALUES (p_product, p_location, v_delta)
  ON CONFLICT (product_id, location_id)
  DO UPDATE SET qty = stock.qty + v_delta;

  RETURN v_id;
END;
$$ LANGUAGE plpgsql;

-- Indexes
CREATE INDEX idx_products_org ON products(org_id);
CREATE INDEX idx_products_category ON products(org_id, category);
CREATE INDEX idx_movements_org_time ON movements(org_id, created_at DESC);
CREATE INDEX idx_movements_product ON movements(product_id);
CREATE INDEX idx_stock_location ON stock(location_id);

-- RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "org read products" ON products FOR SELECT
  USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));
CREATE POLICY "org write products" ON products FOR ALL
  USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));
CREATE POLICY "org read movements" ON movements FOR SELECT
  USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));
CREATE POLICY "org write movements" ON movements FOR INSERT
  WITH CHECK (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));
CREATE POLICY "org read suppliers" ON suppliers FOR SELECT
  USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));
CREATE POLICY "org write suppliers" ON suppliers FOR ALL
  USING (org_id IN (SELECT org_id FROM users WHERE id = auth.uid()));
CREATE POLICY "org read stock" ON stock FOR SELECT
  USING (product_id IN (SELECT id FROM products WHERE org_id IN (SELECT org_id FROM users WHERE id = auth.uid())));
