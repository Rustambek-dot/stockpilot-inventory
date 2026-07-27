'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import {
  BarChart3,
  Package,
  ArrowLeftRight,
  Truck,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Moon,
  Sun,
} from 'lucide-react'

interface NavItem {
  name: string
  href: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: <BarChart3 className="w-5 h-5" />,
  },
  {
    name: 'Products',
    href: '/products',
    icon: <Package className="w-5 h-5" />,
  },
  {
    name: 'Movements',
    href: '/movements',
    icon: <ArrowLeftRight className="w-5 h-5" />,
  },
  {
    name: 'Suppliers',
    href: '/suppliers',
    icon: <Truck className="w-5 h-5" />,
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: <FileText className="w-5 h-5" />,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: <Settings className="w-5 h-5" />,
  },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Apply dark mode
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="h-screen flex bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform fixed md:relative z-40 h-full flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center font-bold text-white text-sm">
              AI
            </div>
            <span className="font-bold text-lg text-slate-900 dark:text-white">StockPilot</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-semibold'
                    : 'text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            <span>{darkMode ? 'Light' : 'Dark'} Mode</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <div className="flex-1 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white hidden md:block">
              Dashboard
            </h1>

            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                J
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
