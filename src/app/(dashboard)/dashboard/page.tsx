'use client'

import { Package, DollarSign, AlertTriangle, ArrowLeftRight } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { formatCurrency } from '@/lib/utils'

const weekMovements = [
  { day: 'Mon', in: 120, out: 85 }, { day: 'Tue', in: 60, out: 110 }, { day: 'Wed', in: 200, out: 95 },
  { day: 'Thu', in: 40, out: 130 }, { day: 'Fri', in: 90, out: 160 }, { day: 'Sat', in: 0, out: 75 }, { day: 'Sun', in: 0, out: 20 },
]

const lowStock = [
  { sku: 'TSH-BLK-M', name: 'T-Shirt Black M', qty: 4, min: 20 },
  { sku: 'MUG-WHT-01', name: 'Ceramic Mug White', qty: 8, min: 25 },
  { sku: 'STK-PCK-10', name: 'Sticker Pack x10', qty: 12, min: 50 },
]

const topProducts = [
  { name: 'T-Shirt Black M', sold: 240 },
  { name: 'Hoodie Grey L', sold: 185 },
  { name: 'Ceramic Mug White', sold: 162 },
  { name: 'Cap Navy', sold: 121 },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Stock value', value: formatCurrency(148230), icon: DollarSign },
          { label: 'Active SKUs', value: '1,247', icon: Package },
          { label: 'Low-stock items', value: '3', icon: AlertTriangle, warn: true },
          { label: 'Movements (7d)', value: '186', icon: ArrowLeftRight },
        ].map((s) => (
          <div key={s.label} className="card p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-500">{s.label}</span>
              <s.icon className={`w-5 h-5 ${s.warn ? 'text-danger' : 'text-primary-500'}`} />
            </div>
            <div className={`text-2xl font-bold ${s.warn ? 'text-danger' : ''}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Low stock alerts */}
      <div className="card p-5 border-l-4 border-l-danger">
        <h2 className="font-semibold mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-danger" /> Low Stock Alerts
        </h2>
        <div className="space-y-2">
          {lowStock.map((p) => (
            <div key={p.sku} className="flex items-center justify-between text-sm">
              <span className="font-mono text-xs text-slate-500 w-28">{p.sku}</span>
              <span className="flex-1 font-medium">{p.name}</span>
              <span className="text-danger font-semibold">{p.qty} left</span>
              <span className="text-slate-400 ml-2">(min {p.min})</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h2 className="font-semibold mb-4">Movements This Week</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={weekMovements}>
              <CartesianGrid strokeDasharray="3 3" stroke="#33415530" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar dataKey="in" fill="#10b981" radius={[4, 4, 0, 0]} name="Inbound" />
              <Bar dataKey="out" fill="#ea580c" radius={[4, 4, 0, 0]} name="Outbound" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h2 className="font-semibold mb-4">Top Products (30d, units sold)</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={topProducts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#33415530" />
              <XAxis type="number" stroke="#64748b" fontSize={12} />
              <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={12} width={140} />
              <Tooltip />
              <Bar dataKey="sold" fill="#f97316" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
