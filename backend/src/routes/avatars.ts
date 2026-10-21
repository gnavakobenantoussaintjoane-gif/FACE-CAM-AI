import { Router } from 'express'
import { z } from 'zod'
import { supabaseAdmin } from '../config/supabase.js'
import { isSupabaseConfigured } from '../config/env.js'
import { AuthedRequest, authMiddleware } from '../middleware/auth.js'

const router = Router()

const categories = ['realistic','professional','cinematic','artistic','futuristic','virtual'] as const

const createSchema = z.object({
  name: z.string().min(1).max(100),
  category: z.enum(categories),
  image_url: z.string().url().optional(),
  thumbnail_url: z.string().url().optional(),
})

// In-memory fallback for demo mode
const demoAvatars: unknown[] = []

router.get('/', async (req, res) => {
  const category = req.query.category as string | undefined
  if (!isSupabaseConfigured || !supabaseAdmin) {
    return res.json({ avatars: demoAvatars })
  }
  let q = supabaseAdmin.from('avatars').select('*').order('created_at', { ascending: false })
  if (category) q = q.eq('category', category)
  const { data, error } = await q
  if (error) return res.status(500).json({ error: error.message })
  res.json({ avatars: data })
})

router.post('/', authMiddleware, async (req: AuthedRequest, res) => {
  const parsed = createSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })
  if (!isSupabaseConfigured || !supabaseAdmin) {
    const entry = { id: 'demo-' + Date.now(), user_id: req.user!.id, ...parsed.data, is_public: false, created_at: new Date().toISOString() }
    demoAvatars.unshift(entry)
    return res.status(201).json({ avatar: entry })
  }
  const { data, error } = await supabaseAdmin.from('avatars').insert({
    user_id: req.user!.id,
    name: parsed.data.name,
    category: parsed.data.category,
    image_url: parsed.data.image_url || null,
    thumbnail_url: parsed.data.thumbnail_url || null,
    is_public: false,
  }).select().single()
  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json({ avatar: data })
})

router.delete('/:id', authMiddleware, async (req: AuthedRequest, res) => {
  const id = req.params.id
  if (!isSupabaseConfigured || !supabaseAdmin) {
    const idx = (demoAvatars as { id: string }[]).findIndex(a => a.id === id)
    if (idx >= 0) demoAvatars.splice(idx, 1)
    return res.json({ ok: true })
  }
  const { error } = await supabaseAdmin.from('avatars').delete().eq('id', id).eq('user_id', req.user!.id)
  if (error) return res.status(500).json({ error: error.message })
  res.json({ ok: true })
})

export default router
