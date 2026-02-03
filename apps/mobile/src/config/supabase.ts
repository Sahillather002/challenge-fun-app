// Use mock for web development to bypass import issues
// Uncomment the real import for mobile/production
// import { createClient } from '@supabase/supabase-js'
import { supabase as mockSupabase, supabaseHelpers as mockHelpers } from './supabase.mock'

// Mock Supabase for web development
export const supabase = mockSupabase;
export const supabaseHelpers = mockHelpers;
