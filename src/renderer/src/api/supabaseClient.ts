import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.RENDERER_VITE_API_URL
const supabaseKey = import.meta.env.RENDERER_VITE_API_KEY
const supabaseClient = createClient(supabaseUrl, supabaseKey)

export default supabaseClient
