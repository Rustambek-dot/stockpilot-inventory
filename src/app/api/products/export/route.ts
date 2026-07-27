import { NextResponse } from 'next/server'

// Demo dataset; in production this queries the stock table joined with products.
const rows = [
  { sku: 'TSH-BLK-M', name: 'T-Shirt Black M', category: 'Apparel', qty: 4, min_stock: 20, cost: 8, price: 24 },
  { sku: 'TSH-BLK-L', name: 'T-Shirt Black L', category: 'Apparel', qty: 46, min_stock: 20, cost: 8, price: 24 },
  { sku: 'HDY-GRY-L', name: 'Hoodie Grey L', category: 'Apparel', qty: 31, min_stock: 15, cost: 22, price: 59 },
  { sku: 'MUG-WHT-01', name: 'Ceramic Mug White', category: 'Accessories', qty: 8, min_stock: 25, cost: 3.5, price: 14 },
]

export async function GET() {
  const header = 'sku,name,category,qty,min_stock,cost,price'
  const lines = rows.map((r) =>
    [r.sku, `"${r.name}"`, r.category, r.qty, r.min_stock, r.cost, r.price].join(',')
  )
  const csv = [header, ...lines].join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="stock-export.csv"',
    },
  })
}
