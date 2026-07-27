'use client'

import Link from 'next/link'
import { Package, Bell, MapPin, FileSpreadsheet, History, ShieldCheck } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="container-app flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center font-bold text-white text-sm">
              SP
            </div>
            <span className="font-bold text-lg">StockPilot</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-slate-600 hover:text-primary-600 font-medium">
              Sign In
            </Link>
            <Link href="/auth/register" className="btn-primary">Start Free</Link>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 container-app text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
          Know your stock. <span className="text-primary-600">Always.</span>
        </h1>
        <p className="text-xl text-slate-500 mb-8 max-w-2xl mx-auto">
          Real-time inventory across locations, full movement history, low-stock alerts,
          and one-click CSV import/export. Built for retail and distribution.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/auth/register" className="px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors">
            Start Free Trial
          </Link>
          <Link href="/auth/login" className="px-8 py-3 border border-slate-200 rounded-lg font-semibold hover:border-primary-300 transition-colors">
            Live Demo
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-20 text-left">
          {[
            { icon: Package, title: 'Full catalog control', text: 'SKUs, categories, units, costs, and prices in dense, fast tables.' },
            { icon: History, title: 'Every movement logged', text: 'Ins, outs, and adjustments with reason, user, and timestamp.' },
            { icon: Bell, title: 'Low-stock alerts', text: 'Set minimum levels — get warned before you run out.' },
            { icon: MapPin, title: 'Multi-location', text: 'Track quantities per warehouse, shop, or shelf.' },
            { icon: FileSpreadsheet, title: 'CSV in & out', text: 'Bulk import your catalog, export stock reports anytime.' },
            { icon: ShieldCheck, title: 'Role-based access', text: 'Admins, managers, and warehouse staff see what they need.' },
          ].map((f) => (
            <div key={f.title} className="card p-6">
              <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-primary-700" />
              </div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-slate-500 text-sm">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-100 py-10 text-center text-slate-400 text-sm">
        © 2026 StockPilot
      </footer>
    </div>
  )
}
