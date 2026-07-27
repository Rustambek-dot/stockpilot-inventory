'use client'

import { useState } from 'react'
import { MapPin, Users, Plus, Trash2 } from 'lucide-react'

const tabs = [
  { key: 'locations', label: 'Locations', icon: MapPin },
  { key: 'team', label: 'Team & Roles', icon: Users },
] as const

type TabKey = (typeof tabs)[number]['key']

export default function SettingsPage() {
  const [tab, setTab] = useState<TabKey>('locations')
  const [locations, setLocations] = useState(['Main Warehouse', 'Shop Floor', 'Returns Area'])
  const [newLoc, setNewLoc] = useState('')

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t.key
                ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {tab === 'locations' && (
        <div className="card p-6 max-w-xl space-y-4">
          <div className="space-y-2">
            {locations.map((l) => (
              <div key={l} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                <span className="font-medium text-sm">{l}</span>
                <button onClick={() => setLocations((prev) => prev.filter((x) => x !== l))} className="p-1.5 text-slate-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); if (newLoc) { setLocations((p) => [...p, newLoc]); setNewLoc('') } }}
            className="flex gap-2"
          >
            <input className="input-base" placeholder="New location name..." value={newLoc} onChange={(e) => setNewLoc(e.target.value)} />
            <button type="submit" className="btn-primary shrink-0 flex items-center gap-1.5"><Plus className="w-4 h-4" /> Add</button>
          </form>
        </div>
      )}

      {tab === 'team' && (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-left text-slate-500">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Role</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Demo Admin', email: 'demo@example.com', role: 'admin' },
                { name: 'Kira B.', email: 'kira@company.com', role: 'manager' },
                { name: 'Pavel N.', email: 'pavel@company.com', role: 'warehouse' },
              ].map((u) => (
                <tr key={u.email} className="border-b border-slate-100 dark:border-slate-800/50">
                  <td className="px-5 py-3 font-medium">{u.name}</td>
                  <td className="px-5 py-3 text-slate-500">{u.email}</td>
                  <td className="px-5 py-3"><span className="badge-primary capitalize">{u.role}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
