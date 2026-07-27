import { createClient } from '@supabase/supabase-js'

// Placeholders keep the app buildable/runnable in demo mode without a Supabase project
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'public-anon-key-placeholder'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Service role client for server-side operations
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey
)
