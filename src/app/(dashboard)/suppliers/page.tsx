'use client'

import { useState } from 'react'
import { Plus, Mail, Phone, Trash2 } from 'lucide-react'

interface SupplierRow {
  id: string
  name: string
  contact: string
  email: string
  products: number
}

const initial: SupplierRow[] = [
  { id: 's1', name: 'TextilePro Ltd', contact: '+1 555 0201', email: 'orders@textilepro.com', products: 34 },
  { id: 's2', name: 'MerchWorks Co', contact: '+1 555 0202', email: 'sales@merchworks.io', products: 18 },
  { id: 's3', name: 'PrintHouse Inc', contact: '+1 555 0203', email: 'hello@printhouse.com', products: 7 },
]

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState(initial)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', contact: '', email: '' })

  const add = (e: React.FormEvent) => {
    e.preventDefault()
    setSuppliers((prev) => [...prev, { id: crypto.randomUUID(), products: 0, ...form }])
    setShowForm(false)
    setForm({ name: '', contact: '', email: '' })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Suppliers</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Supplier
        </button>
      </div>

      {showForm && (
        <form onSubmit={add} className="card p-5 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
          <div><label className="label">Name</label><input className="input-base" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><label className="label">Phone</label><input className="input-base" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} /></div>
          <div><label className="label">Email</label><input className="input-base" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <button type="submit" className="btn-primary">Add</button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {suppliers.map((s) => (
          <div key={s.id} className="card p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="font-semibold">{s.name}</div>
              <button onClick={() => setSuppliers((prev) => prev.filter((x) => x.id !== s.id))} className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1.5 text-sm text-slate-500">
              <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> {s.contact}</div>
              <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> {s.email}</div>
            </div>
            <div className="mt-4 text-sm text-slate-400">{s.products} products supplied</div>
          </div>
        ))}
      </div>
    </div>
  )
}
