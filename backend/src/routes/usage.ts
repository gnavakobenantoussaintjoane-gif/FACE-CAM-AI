import { Router } from 'express'
import { authMiddleware, AuthedRequest } from '../middleware/auth.js'
import { isSupabaseConfigured } from '../config/env.js'
import { supabaseAdmin } from '../config/supabase.js'

const router = Router()

router.get('/', authMiddleware, async (req: AuthedRequest, res) => {
  if (!isSupabaseConfigured || !supabaseAdmin) {
    return res.json({ usage: { minutes_used: 72, quota_minutes: 300, transformations_used: 24, quota_transformations: 100, tier: 'free' } })
  }
  const { data } = await supabaseAdmin.from('usage_records').select('*').eq('user_id', req.user!.id).maybeSingle()
  res.json({ usage: data || { minutes_used: 0, quota_minutes: 300, transformations_used: 0, quota_transformations: 100 } })
})

export default router
