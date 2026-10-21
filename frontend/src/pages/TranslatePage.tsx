import Sidebar from '../components/Sidebar'
import { useSpeechTranslation } from '../hooks/useSpeechTranslation'
import { LANGUAGES } from '../types'
import { useState, useEffect } from 'react'
import { Mic, MicOff, Languages, Clock, Trash2, Download } from 'lucide-react'

export default function TranslatePage() {
  const [source, setSource] = useState('fr')
  const [target, setTarget] = useState('en')
  const [history, setHistory] = useState<{ t: string; text: string; trans: string }[]>(() => {
    try { return JSON.parse(localStorage.getItem('facecam_history') || '[]') } catch { return [] }
  })
  const [saveHistory, setSaveHistory] = useState(true)

  const hook = useSpeechTranslation({
    sourceLang: source,
    targetLang: target,
    onTranslation: (trans) => {
      if (saveHistory && hook.transcript) {
        setHistory(h => [{ t: new Date().toLocaleTimeString(), text: hook.transcript, trans }, ...h].slice(0, 50))
      }
    }
  })

  useEffect(() => { localStorage.setItem('facecam_history', JSON.stringify(history)) }, [history])

  return (
    <div className="min-h-screen bg-[#05070f] text-white flex">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <header className="h-[64px] border-b border-white/10 flex items-center justify-between px-6 bg-[#0b0e1a]/50">
          <h1 className="display font-semibold flex items-center gap-2"><Languages className="h-5 w-5 text-[#a78bfa]" /> Live Translate</h1>
          <div className="text-xs text-white/40">Phase 1 · sous-titres traduits</div>
        </header>

        <div className="p-6 grid lg:grid-cols-[1fr_360px] gap-6">
          <div className="space-y-4">
            <div className="rounded-2xl bg-[#0f1224] border border-white/10 p-5 flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select value={source} onChange={e => setSource(e.target.value)} className="flex-1 rounded-full bg-black border border-white/10 px-4 py-2.5 text-sm">
                  {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
                </select>
                <span className="text-white/40">→</span>
                <select value={target} onChange={e => setTarget(e.target.value)} className="flex-1 rounded-full bg-black border border-white/10 px-4 py-2.5 text-sm">
                  {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <span className={`h-2 w-2 rounded-full ${hook.isListening ? 'bg-emerald-400 animate-pulse' : 'bg-white/20'}`} />
                <span className="text-xs text-white/60">{hook.isListening ? 'Micro actif' : 'Micro arrêté'}</span>
                <span className="text-xs text-white/30 hidden sm:inline">· Latence {hook.latencyMs ? `${hook.latencyMs} ms` : '—'}</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-[#0f1224] border border-white/10 p-5">
                <div className="text-xs font-semibold tracking-wide text-white/50">TRANSCRIPTION · {LANGUAGES.find(l => l.code === source)?.label}</div>
                <div className="mt-3 min-h-[140px] p-4 rounded-xl bg-black border border-white/10 text-sm leading-relaxed">
                  {hook.transcript || <span className="text-white/30">Parlez après avoir démarré le micro…</span>}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  {!hook.isListening ? (
                    <button onClick={hook.start} className="gradient-btn px-6 py-2.5 rounded-full text-sm font-semibold inline-flex items-center gap-2"><Mic className="h-4 w-4" /> Démarrer</button>
                  ) : (
                    <button onClick={hook.stop} className="px-6 py-2.5 rounded-full bg-red-500 text-white text-sm font-semibold inline-flex items-center gap-2"><MicOff className="h-4 w-4" /> Arrêter</button>
                  )}
                  <button onClick={() => { hook.setTranscript(''); hook.setTranslation('') }} className="px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs">Effacer</button>
                </div>
                {hook.error && <div className="mt-3 text-xs p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300">{hook.error}</div>}
              </div>

              <div className="rounded-2xl bg-[#0f1224] border border-white/10 p-5">
                <div className="text-xs font-semibold tracking-wide text-[#a78bfa]">TRADUCTION · {LANGUAGES.find(l => l.code === target)?.label}</div>
                <div className="mt-3 min-h-[140px] p-4 rounded-xl bg-[#6366f1]/10 border border-[#6366f1]/20 text-sm leading-relaxed">
                  {hook.translation || <span className="text-white/30">La traduction apparaîtra ici…</span>}
                </div>
                <div className="mt-3 text-xs text-white/40">Sous-titres traduits prêts pour intégration WebRTC Phase 3.</div>
              </div>
            </div>

            <div className="rounded-2xl bg-[#6366f1]/10 border border-[#6366f1]/20 p-4">
              <div className="text-xs font-semibold text-[#a78bfa]">Architecture extensible</div>
              <p className="text-xs text-white/60 mt-1 leading-relaxed">Phase 1 (actuel) : transcription + sous-titres. Phase 2 : synthèse vocale (TTS) via service backend sécurisé. Phase 3 : injection audio dans flux WebRTC pour appels/streams. Clés API jamais exposées côté frontend.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl bg-[#0f1224] border border-white/10 p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold flex items-center gap-2"><Clock className="h-4 w-4" /> Historique</div>
                <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={saveHistory} onChange={e => setSaveHistory(e.target.checked)} /> Enregistrer</label>
              </div>
              <div className="mt-3 space-y-2 max-h-[420px] overflow-auto pr-1">
                {history.length === 0 && <div className="text-xs text-white/30 py-8 text-center">Aucune session enregistrée</div>}
                {history.map((h, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="text-[11px] text-white/40">{h.t}</div>
                    <div className="text-xs mt-1">{h.text}</div>
                    <div className="text-xs mt-1 text-[#a78bfa]">→ {h.trans}</div>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={() => setHistory([])} className="flex-1 py-2 rounded-full bg-white/5 border border-white/10 text-xs inline-flex items-center justify-center gap-1"><Trash2 className="h-3.5 w-3.5" /> Vider</button>
                <button onClick={() => {
                  const blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a'); a.href = url; a.download = 'translations.json'; a.click()
                }} className="flex-1 py-2 rounded-full bg-white text-black text-xs font-medium inline-flex items-center justify-center gap-1"><Download className="h-3.5 w-3.5" /> Exporter</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
