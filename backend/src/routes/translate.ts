import { Router } from 'express'
import { z } from 'zod'

const router = Router()

const schema = z.object({
  text: z.string().min(1).max(2000),
  source: z.string().min(2).max(5),
  target: z.string().min(2).max(5),
})

router.post('/', async (req, res) => {
  const parsed = schema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })
  const { text, source, target } = parsed.data

  // Try MyMemory free provider as fallback (no key needed for demo)
  try {
    const r = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${source}|${target}`)
    const j = await r.json() as { responseData?: { translatedText?: string } }
    const translation = j.responseData?.translatedText
    if (translation) return res.json({ translation, provider: 'mymemory' })
  } catch {}

  // Fallback: LibreTranslate public instance (if available) else echo
  return res.json({ translation: `[${source}→${target}] ${text}`, provider: 'fallback', note: 'Configure a real provider via backend env.' })
})

export default router
