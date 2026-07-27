'use client'

import { useMemo, useState } from 'react'
import { Plus, ArrowDownToLine, ArrowUpFromLine, Wrench } from 'lucide-react'
import { formatDateWithTime } from '@/lib/utils'

interface MovementRow {
  id: string
  when: string
  sku: string
  product: string
  type: 'in' | 'out' | 'adjust'
  qty: number
  reason: string
  location: string
  user: string
}

const initial: MovementRow[] = [
  { id: 'm1', when: '2026-07-27T09:15:00', sku: 'TSH-BLK-L', product: 'T-Shirt Black L', type: 'in', qty: 50, reason: 'purchase', location: 'Main Warehouse', user: 'Demo Admin' },
  { id: 'm2', when: '2026-07-27T10:02:00', sku: 'MUG-WHT-01', product: 'Ceramic Mug White', type: 'out', qty: 12, reason: 'sale', location: 'Shop Floor', user: 'Kira B.' },
  { id: 'm3', when: '2026-07-26T17:40:00', sku: 'HDY-GRY-L', product: 'Hoodie Grey L', type: 'out', qty: 3, reason: 'damage', location: 'Main Warehouse', user: 'Demo Admin' },
  { id: 'm4', when: '2026-07-26T12:30:00', sku: 'STK-PCK-10', product: 'Sticker Pack x10', type: 'adjust', qty: -2, reason: 'correction', location: 'Main Warehouse', user: 'Demo Admin' },
  { id: 'm5', when: '2026-07-25T14:00:00', sku: 'CAP-NVY-01', product: 'Cap Navy', type: 'in', qty: 100, reason: 'purchase', location: 'Main Warehouse', user: 'Kira B.' },
]

const typeMeta = {
  in: { icon: ArrowDownToLine, cls: 'text-success', badge: 'badge-success' },
  out: { icon: ArrowUpFromLine, cls: 'text-primary-600', badge: 'badge-warning' },
  adjust: { icon: Wrench, cls: 'text-slate-500', badge: 'badge bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300' },
}

export default function MovementsPage() {
  const [movements, setMovements] = useState(initial)
  const [type, setType] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ sku: '', qty: 1, type: 'in' as MovementRow['type'], reason: 'purchase', location: 'Main Warehouse' })

  const filtered = useMemo(
    () => movements.filter((m) => type === 'all' || m.type === type),
    [movements, type]
  )

  const add = (e: React.FormEvent) => {
    e.preventDefault()
    setMovements((prev) => [
      {
        id: crypto.randomUUID(),
        when: new Date().toISOString(),
        sku: form.sku,
        product: form.sku,
        type: form.type,
        qty: form.type === 'out' ? -Math.abs(form.qty) : form.qty,
        reason: form.reason,
        location: form.location,
        user: 'Demo Admin',
      },
      ...prev,
    ])
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Stock Movements</h1>
        <div className="flex gap-2">
          <select value={type} onChange={(e) => setType(e.target.value)} className="input-base w-36">
            <option value="all">All types</option>
            <option value="in">Inbound</option>
            <option value="out">Outbound</option>
            <option value="adjust">Adjustments</option>
          </select>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Register
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={add} className="card p-5 grid grid-cols-2 lg:grid-cols-5 gap-3 items-end">
          <div><label className="label">SKU</label><input className="input-base font-mono" required value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} /></div>
          <div><label className="label">Type</label>
            <select className="input-base" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as MovementRow['type'] })}>
              <option value="in">Inbound</option><option value="out">Outbound</option><option value="adjust">Adjust</option>
            </select>
          </div>
          <div><label className="label">Qty</label><input className="input-base" type="number" required value={form.qty} onChange={(e) => setForm({ ...form, qty: +e.target.value })} /></div>
          <div><label className="label">Reason</label>
            <select className="input-base" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })}>
              <option>purchase</option><option>sale</option><option>damage</option><option>loss</option><option>correction</option><option>transfer</option>
            </select>
          </div>
          <button type="submit" className="btn-primary">Save</button>
        </form>
      )}

      <div className="card divide-y divide-slate-100 dark:divide-slate-800">
        {filtered.map((m) => {
          const meta = typeMeta[m.type]
          return (
            <div key={m.id} className="flex items-center gap-4 px-5 py-3.5">
              <meta.icon className={`w-5 h-5 shrink-0 ${meta.cls}`} />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{m.product}</div>
                <div className="text-xs text-slate-500 font-mono">{m.sku} · {m.location}</div>
              </div>
              <span className={meta.badge}>{m.reason}</span>
              <span className={`font-semibold w-16 text-right ${m.qty > 0 ? 'text-success' : 'text-danger'}`}>
                {m.qty > 0 ? '+' : ''}{m.qty}
              </span>
              <span className="text-xs text-slate-400 w-36 text-right hidden sm:block">{formatDateWithTime(m.when)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
