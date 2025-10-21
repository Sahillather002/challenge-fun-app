// .env loader for React Native/Expo
// This handles environment variables from .env files

const getEnvVar = (key: string, defaultValue?: string): string => {
  // Try process.env first (works in development/web)
  if (typeof process !== 'undefined' && process.env) {
    const value = process.env[key]
    if (value) return value
  }

  // For production builds, we would need Constants.expoConfig.extra
  // But since user wants .env only, we'll use a different approach

  // For React Native/Expo development, .env files need special handling
  // This is a simplified approach - in production, use Constants.expoConfig.extra

  return defaultValue || ''
}

// Supabase configuration from .env
const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL', 'https://your-project-id.supabase.co')
const supabaseAnonKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'your-anon-key-here')

console.log('🔗 Loading environment variables...')
console.log('Supabase URL configured:', supabaseUrl !== 'https://your-project-id.supabase.co')
console.log('Supabase Key configured:', supabaseAnonKey !== 'your-anon-key-here')

export const envConfig = {
  supabaseUrl,
  supabaseAnonKey,
  isConfigured: supabaseUrl !== 'https://your-project-id.supabase.co' &&
               supabaseAnonKey !== 'your-anon-key-here'
}
