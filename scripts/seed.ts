/**
 * Seed script — org, users, locations, products, stock, movements, suppliers.
 * Usage: npm run db:seed  (requires SUPABASE_SERVICE_ROLE_KEY)
 */
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const db = createClient(url, key)

async function seed() {
  console.log('Seeding StockPilot...')

  const { data: org, error: oErr } = await db
    .from('organizations').insert({ name: 'Demo Retail Co' }).select().single()
  if (oErr) throw oErr

  const { data: user, error: uErr } = await db.from('users')
    .insert({ email: 'demo@example.com', full_name: 'Demo Admin', role: 'admin', org_id: org.id })
    .select().single()
  if (uErr) throw uErr

  const { data: locations, error: lErr } = await db.from('locations')
    .insert([
      { org_id: org.id, name: 'Main Warehouse' },
      { org_id: org.id, name: 'Shop Floor' },
    ]).select()
  if (lErr) throw lErr

  const { data: products, error: pErr } = await db.from('products')
    .insert([
      { org_id: org.id, sku: 'TSH-BLK-M', name: 'T-Shirt Black M', category: 'Apparel', price: 24, cost: 8, min_stock: 20 },
      { org_id: org.id, sku: 'TSH-BLK-L', name: 'T-Shirt Black L', category: 'Apparel', price: 24, cost: 8, min_stock: 20 },
      { org_id: org.id, sku: 'HDY-GRY-L', name: 'Hoodie Grey L', category: 'Apparel', price: 59, cost: 22, min_stock: 15 },
      { org_id: org.id, sku: 'MUG-WHT-01', name: 'Ceramic Mug White', category: 'Accessories', price: 14, cost: 3.5, min_stock: 25 },
      { org_id: org.id, sku: 'CAP-NVY-01', name: 'Cap Navy', category: 'Accessories', price: 19, cost: 6, min_stock: 30 },
    ]).select()
  if (pErr) throw pErr

  // Register initial inbound movements through the transactional RPC
  for (const [i, product] of products.entries()) {
    const qty = [4, 46, 31, 8, 73][i]
    const { error } = await db.rpc('register_movement', {
      p_org: org.id,
      p_product: product.id,
      p_location: locations[0].id,
      p_type: 'in',
      p_qty: qty,
      p_reason: 'purchase',
      p_user: user.id,
    })
    if (error) throw error
  }

  const { error: sErr } = await db.from('suppliers').insert([
    { org_id: org.id, name: 'TextilePro Ltd', contact: '+1 555 0201', email: 'orders@textilepro.com' },
    { org_id: org.id, name: 'MerchWorks Co', contact: '+1 555 0202', email: 'sales@merchworks.io' },
  ])
  if (sErr) throw sErr

  console.log('Seed complete: 1 org, 1 user, 2 locations, 5 products with stock, 5 movements, 2 suppliers')
  console.log('Demo login: demo@example.com / Demo123! (create in Supabase Auth dashboard)')
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
