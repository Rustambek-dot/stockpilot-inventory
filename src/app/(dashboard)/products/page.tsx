'use client'

import { useMemo, useState } from 'react'
import { Plus, Search, Download, Upload, Pencil, Trash2, ArrowUpDown } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface ProductRow {
  id: string
  sku: string
  name: string
  category: string
  qty: number
  min_stock: number
  cost: number
  price: number
}

const initial: ProductRow[] = [
  { id: 'p1', sku: 'TSH-BLK-M', name: 'T-Shirt Black M', category: 'Apparel', qty: 4, min_stock: 20, cost: 8, price: 24 },
  { id: 'p2', sku: 'TSH-BLK-L', name: 'T-Shirt Black L', category: 'Apparel', qty: 46, min_stock: 20, cost: 8, price: 24 },
  { id: 'p3', sku: 'HDY-GRY-L', name: 'Hoodie Grey L', category: 'Apparel', qty: 31, min_stock: 15, cost: 22, price: 59 },
  { id: 'p4', sku: 'MUG-WHT-01', name: 'Ceramic Mug White', category: 'Accessories', qty: 8, min_stock: 25, cost: 3.5, price: 14 },
  { id: 'p5', sku: 'CAP-NVY-01', name: 'Cap Navy', category: 'Accessories', qty: 73, min_stock: 30, cost: 6, price: 19 },
  { id: 'p6', sku: 'STK-PCK-10', name: 'Sticker Pack x10', category: 'Merch', qty: 12, min_stock: 50, cost: 1.2, price: 6 },
]

type SortKey = 'sku' | 'name' | 'qty' | 'price'

export default function ProductsPage() {
  const [products, setProducts] = useState(initial)
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('all')
  const [sortKey, setSortKey] = useState<SortKey>('sku')
  const [sortAsc, setSortAsc] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ sku: '', name: '', category: 'Apparel', qty: 0, min_stock: 10, cost: 0, price: 0 })

  const categories = ['all', ...Array.from(new Set(initial.map((p) => p.category)))]

  const filtered = useMemo(() => {
    const rows = products.filter(
      (p) =>
        (category === 'all' || p.category === category) &&
        (!q || `${p.sku} ${p.name}`.toLowerCase().includes(q.toLowerCase()))
    )
    rows.sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey]
      const cmp = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv))
      return sortAsc ? cmp : -cmp
    })
    return rows
  }, [products, q, category, sortKey, sortAsc])

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc)
    else { setSortKey(key); setSortAsc(true) }
  }

  const add = (e: React.FormEvent) => {
    e.preventDefault()
    setProducts((prev) => [{ id: crypto.randomUUID(), ...form }, ...prev])
    setShowForm(false)
    setForm({ sku: '', name: '', category: 'Apparel', qty: 0, min_stock: 10, cost: 0, price: 0 })
  }

  const exportCsv = () => {
    const header = 'sku,name,category,qty,min_stock,cost,price'
    const lines = products.map((p) => [p.sku, p.name, p.category, p.qty, p.min_stock, p.cost, p.price].join(','))
    const blob = new Blob([[header, ...lines].join('\n')], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'stock-export.csv'
    a.click()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Products</h1>
        <div className="flex gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search SKU or name..." className="input-base pl-9 w-56" />
          </div>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-base w-36 capitalize">
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <button onClick={exportCsv} className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="btn-secondary flex items-center gap-2">
            <Upload className="w-4 h-4" /> Import
          </button>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={add} className="card p-5 grid grid-cols-2 lg:grid-cols-4 gap-3 items-end">
          <div><label className="label">SKU</label><input className="input-base font-mono" required value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} /></div>
          <div><label className="label">Name</label><input className="input-base" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><label className="label">Qty</label><input className="input-base" type="number" min={0} value={form.qty} onChange={(e) => setForm({ ...form, qty: +e.target.value })} /></div>
          <div><label className="label">Min stock</label><input className="input-base" type="number" min={0} value={form.min_stock} onChange={(e) => setForm({ ...form, min_stock: +e.target.value })} /></div>
          <div><label className="label">Cost</label><input className="input-base" type="number" step="0.01" min={0} value={form.cost} onChange={(e) => setForm({ ...form, cost: +e.target.value })} /></div>
          <div><label className="label">Price</label><input className="input-base" type="number" step="0.01" min={0} value={form.price} onChange={(e) => setForm({ ...form, price: +e.target.value })} /></div>
          <button type="submit" className="btn-primary col-span-2">Add Product</button>
        </form>
      )}

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-left text-slate-500">
              {([['sku', 'SKU'], ['name', 'Name'], ['qty', 'Stock'], ['price', 'Price']] as [SortKey, string][]).map(([key, label]) => (
                <th key={key} className="px-4 py-3 font-medium cursor-pointer select-none" onClick={() => toggleSort(key)}>
                  <span className="flex items-center gap-1">{label} <ArrowUpDown className="w-3 h-3" /></span>
                </th>
              ))}
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium text-right">Margin</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const low = p.qty <= p.min_stock
              return (
                <tr key={p.id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-4 py-2.5 font-mono text-xs">{p.sku}</td>
                  <td className="px-4 py-2.5 font-medium">{p.name}</td>
                  <td className="px-4 py-2.5">
                    <span className={low ? 'text-danger font-semibold' : ''}>{p.qty}</span>
                    {low && <span className="badge-danger ml-2">low</span>}
                  </td>
                  <td className="px-4 py-2.5">{formatCurrency(p.price)}</td>
                  <td className="px-4 py-2.5 text-slate-500">{p.category}</td>
                  <td className="px-4 py-2.5 text-right text-slate-500">
                    {Math.round(((p.price - p.cost) / p.price) * 100)}%
                  </td>
                  <td className="px-4 py-2.5 text-right whitespace-nowrap">
                    <button className="p-1.5 text-slate-400 hover:text-primary-600"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => setProducts((prev) => prev.filter((x) => x.id !== p.id))} className="p-1.5 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-12 text-center text-slate-500">No products found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
