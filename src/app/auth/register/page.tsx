'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Mail, Lock, User, Loader2, Check } from 'lucide-react'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      setLoading(false)
      return
    }

    try {
      // Sign up
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      })

      if (signUpError) {
        setError(signUpError.message)
        return
      }

      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase.from('users').insert([
          {
            id: data.user.id,
            email: formData.email,
            full_name: formData.fullName,
            role: 'salesperson',
            company_id: crypto.randomUUID(), // TODO: Create company first
          },
        ])

        if (profileError) {
          setError(profileError.message)
          return
        }

        setSuccess(true)
        setTimeout(() => {
          router.push('/auth/login')
        }, 2000)
      }
    } catch {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Account Created!</h2>
          <p className="text-slate-400 mb-4">
            Check your email to confirm your account. Redirecting to login...
          </p>
        </div>
      </div>
    )
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
          <p className="text-slate-400 mt-2">Create your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="label text-white">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className="input-base pl-10"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="label text-white">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="input-base pl-10"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="label text-white">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
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
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {/* Terms */}
        <div className="mt-6 text-center text-xs text-slate-500">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </div>

        {/* Link to Login */}
        <div className="mt-6 pt-6 border-t border-slate-700 text-center text-slate-400 text-sm">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-primary-400 hover:text-primary-300 font-semibold">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
