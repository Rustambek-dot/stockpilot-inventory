'use client'

import { Download } from 'lucide-react'
import {
  PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { formatCurrency } from '@/lib/utils'

const valueByCategory = [
  { name: 'Apparel', value: 82400, color: '#ea580c' },
  { name: 'Accessories', value: 41200, color: '#f97316' },
  { name: 'Merch', value: 24630, color: '#fdba74' },
]

const turnover = [
  { month: 'Feb', turnover: 2.1 }, { month: 'Mar', turnover: 2.4 }, { month: 'Apr', turnover: 2.2 },
  { month: 'May', turnover: 2.8 }, { month: 'Jun', turnover: 3.1 }, { month: 'Jul', turnover: 3.4 },
]

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold">Reports</h1>
        <button className="btn-secondary flex items-center gap-2">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total stock value', value: formatCurrency(148230) },
          { label: 'Dead stock (90d+)', value: formatCurrency(6120) },
          { label: 'Inventory turnover', value: '3.4x' },
          { label: 'Shrinkage (30d)', value: '0.8%' },
        ].map((k) => (
          <div key={k.label} className="card p-5">
            <div className="text-sm text-slate-500 mb-1">{k.label}</div>
            <div className="text-2xl font-bold">{k.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h2 className="font-semibold mb-4">Stock Value by Category</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={valueByCategory} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={3}>
                {valueByCategory.map((c) => <Cell key={c.name} fill={c.color} />)}
              </Pie>
              <Tooltip formatter={(v) => formatCurrency(Number(v))} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h2 className="font-semibold mb-4">Inventory Turnover</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={turnover}>
              <CartesianGrid strokeDasharray="3 3" stroke="#33415530" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="turnover" stroke="#ea580c" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
