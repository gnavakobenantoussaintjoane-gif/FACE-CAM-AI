import { useCallback, useEffect, useRef, useState } from 'react'

interface UseSpeechOptions {
  sourceLang: string
  targetLang: string
  onTranscript?: (text: string) => void
  onTranslation?: (text: string) => void
}

export function useSpeechTranslation(opts: UseSpeechOptions) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [translation, setTranslation] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [latencyMs, setLatencyMs] = useState<number | null>(null)
  const recognitionRef = useRef<unknown>(null)

  const translate = useCallback(async (text: string) => {
    if (!text.trim()) return
    const t0 = performance.now()
    try {
      // Try backend, fallback to MyMemory free API
      let translated = ''
      try {
        const res = await fetch('/api/translate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, source: opts.sourceLang, target: opts.targetLang }) })
        if (res.ok) { const j = await res.json(); translated = j.translation }
      } catch {}
      if (!translated) {
        const r = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${opts.sourceLang}|${opts.targetLang}`)
        const j = await r.json()
        translated = j.responseData?.translatedText || text
      }
      setTranslation(translated)
      opts.onTranslation?.(translated)
      setLatencyMs(Math.round(performance.now() - t0))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur traduction')
    }
  }, [opts])

  const start = useCallback(() => {
    setError(null)
    const SR: unknown = (window as unknown as Record<string, unknown>).SpeechRecognition || (window as unknown as Record<string, unknown>).webkitSpeechRecognition
    if (!SR) { setError("Reconnaissance vocale non supportée par ce navigateur. Utilisez Chrome ou Edge."); return }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rec: any = new (SR as any)()
    rec.lang = opts.sourceLang
    rec.continuous = true
    rec.interimResults = true
    rec.onresult = (e: { results: { [k: number]: { 0: { transcript: string }; isFinal: boolean } } & { length: number } }) => {
      let finalText = ''
      for (let i = e.results.length - 1; i >= 0; i--) {
        const res = e.results[i]
        if (res.isFinal) { finalText = (res as { 0: { transcript: string } })[0].transcript; break }
        else finalText = (res as { 0: { transcript: string } })[0].transcript
      }
      if (finalText) {
        setTranscript(finalText)
        opts.onTranscript?.(finalText)
        translate(finalText)
      }
    }
    rec.onerror = (ev: { error: string }) => setError(`Micro: ${ev.error}`)
    rec.onend = () => { if (isListening) try { rec.start() } catch {} }
    recognitionRef.current = rec
    try { rec.start(); setIsListening(true) } catch (err) { setError(err instanceof Error ? err.message : 'Erreur micro') }
  }, [opts, translate, isListening])

  const stop = useCallback(() => {
    setIsListening(false)
    const rec = recognitionRef.current as { stop?: () => void } | null
    try { rec?.stop?.() } catch {}
  }, [])

  useEffect(() => () => { const rec = recognitionRef.current as { stop?: () => void } | null; try { rec?.stop?.() } catch {} }, [])

  return { isListening, transcript, translation, error, latencyMs, start, stop, setTranscript, setTranslation }
}
