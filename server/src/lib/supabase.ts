import { createClient } from '@supabase/supabase-js'

let supabaseInstance: any = null
let supabaseAuthInstance: any = null
let supabaseClientInstance: any = null

function initializeClients() {
  if (supabaseInstance) return

  const SUPABASE_URL = process.env.SUPABASE_URL
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !SUPABASE_ANON_KEY) {
    console.warn('⚠️  Missing Supabase environment variables')
  }

  // Service role client (for admin operations)
  supabaseInstance = createClient(SUPABASE_URL || 'https://placeholder.supabase.co', SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key', {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  // Anon client (for user authentication)
  supabaseAuthInstance = createClient(SUPABASE_URL || 'https://placeholder.supabase.co', SUPABASE_ANON_KEY || 'placeholder-key', {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  // Client-side instance
  supabaseClientInstance = createClient(SUPABASE_URL || 'https://placeholder.supabase.co', SUPABASE_ANON_KEY || 'placeholder-key')
}

export function getSupabase() {
  initializeClients()
  return supabaseInstance
}

export function getSupabaseAuth() {
  initializeClients()
  return supabaseAuthInstance
}

export function getSupabaseClient() {
  initializeClients()
  return supabaseClientInstance
}
