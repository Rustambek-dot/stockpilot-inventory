'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Mail, Lock, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        return
      }

      router.push('/dashboard')
    } catch {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center font-bold mx-auto mb-4">
            AI
          </div>
          <h1 className="text-3xl font-bold text-white">StockPilot</h1>
          <p className="text-slate-400 mt-2">Sign in to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Demo Credentials Notice */}
          <div className="p-3 bg-primary-500/10 border border-primary-500/20 rounded-lg text-primary-300 text-sm">
            Demo: demo@example.com / Demo123!
          </div>

          {/* Email */}
          <div>
            <label className="label text-white">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-base pl-10"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="label text-white">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-base pl-10"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Links */}
        <div className="mt-6 text-center text-sm">
          <Link href="/auth/forgot-password" className="text-primary-400 hover:text-primary-300">
            Forgot password?
          </Link>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-700 text-center text-slate-400 text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" className="text-primary-400 hover:text-primary-300 font-semibold">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}
