'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Mail, Loader2, Check } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/login`,
      })
      if (error) {
        setError(error.message)
        return
      }
      setSent(true)
    } catch {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center font-bold mx-auto mb-4 text-white">
            AI
          </div>
          <h1 className="text-3xl font-bold text-white">Reset Password</h1>
          <p className="text-slate-400 mt-2">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        {sent ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-slate-300 mb-6">
              If an account exists for <span className="font-semibold">{email}</span>, a reset
              link has been sent.
            </p>
            <Link href="/auth/login" className="text-primary-400 hover:text-primary-300 font-semibold">
              Back to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <div className="text-center text-sm text-slate-400">
              Remembered it?{' '}
              <Link href="/auth/login" className="text-primary-400 hover:text-primary-300 font-semibold">
                Sign in
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
