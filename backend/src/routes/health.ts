import { Router } from 'express'
import { isSupabaseConfigured } from '../config/env.js'
import { supabaseAdmin } from '../config/supabase.js'

const router = Router()

router.get('/', async (_req, res) => {
  let db: string = isSupabaseConfigured ? 'configured' : 'not-configured (demo mode)'
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { error } = await supabaseAdmin.from('profiles').select('id').limit(1)
      db = error ? `error: ${error.message}` : 'connected'
    } catch (e) {
      db = `error: ${e instanceof Error ? e.message : String(e)}`
    }
  }
  res.json({ status: 'ok', db, time: new Date().toISOString() })
})

export default router
