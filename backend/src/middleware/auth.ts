import { Request, Response, NextFunction } from 'express'
import { supabaseAdmin } from '../config/supabase.js'
import { isSupabaseConfigured } from '../config/env.js'

export interface AuthedRequest extends Request {
  user?: { id: string; email?: string }
}

export async function authMiddleware(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    // In demo mode without Supabase, allow anonymous
    if (!isSupabaseConfigured) {
      req.user = { id: 'demo-user' }
      return next()
    }
    return res.status(401).json({ error: 'Missing Authorization header' })
  }
  const token = header.slice(7)
  if (!isSupabaseConfigured || !supabaseAdmin) {
    req.user = { id: 'demo-user' }
    return next()
  }
  const { data, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !data.user) return res.status(401).json({ error: 'Invalid token' })
  req.user = { id: data.user.id, email: data.user.email || undefined }
  next()
}
