import { Router } from 'express'
import { supabaseAdmin } from '../config/supabase.js'
import { isSupabaseConfigured } from '../config/env.js'
import { authMiddleware, AuthedRequest } from '../middleware/auth.js'

const router = Router()

router.get('/me', authMiddleware, async (req: AuthedRequest, res) => {
  if (!isSupabaseConfigured || !supabaseAdmin) {
    return res.json({ profile: { id: req.user!.id, email: 'demo@facecam.ai', subscription_tier: 'free', usage: { minutes_used: 72, quota_minutes: 300 } } })
  }
  const { data, error } = await supabaseAdmin.from('profiles').select('*').eq('id', req.user!.id).single()
  if (error) return res.status(404).json({ error: error.message })
  res.json({ profile: data })
})

export default router
