import Sidebar from '../components/Sidebar'
import { useCamera } from '../hooks/useCamera'
import { LiveVideoPipeline, Quality } from '../engine/PhotoToLiveEngine'
import { useEffect, useRef, useState } from 'react'
import { Upload, Play, Square, RefreshCcw, Eye, EyeOff, Settings2, AlertTriangle, Gauge, Image as ImageIcon } from 'lucide-react'

const TRANSFORMS = [
  { id: 'realistic', label: 'Réaliste Pro', thumb: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=60' },
  { id: 'cinematic', label: 'Cinématique', thumb: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&q=60' },
  { id: 'pro', label: 'Professionnel', thumb: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=60' },
  { id: 'artistic', label: 'Artistique', thumb: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&q=60' },
  { id: 'futuristic', label: 'Futuriste', thumb: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&q=60' },
  { id: 'virtual', label: 'Virtuel', thumb: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=60' },
]

export default function SwapLivePage() {
  const cam = useCamera()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pipelineRef = useRef<LiveVideoPipeline | null>(null)
  const hiddenVideoRef = useRef<HTMLVideoElement>(null)

  const [selectedTransform, setSelectedTransform] = useState('realistic')
  const [referencePreview, setReferencePreview] = useState<string | null>(null)
  const [status, setStatus] = useState<string>('idle')
  const [metrics, setMetrics] = useState({ fps: 0, latencyMs: 0, faceDetected: false, trackingLost: 0 })
  const [quality, setQuality] = useState<Quality>('medium')
  const [showOriginal, setShowOriginal] = useState(true)
  const [live, setLive] = useState(false)
  const [photoError, setPhotoError] = useState<string | null>(null)

  // init pipeline
  useEffect(() => {
    const p = new LiveVideoPipeline()
    p.quality = quality
    p.setCallbacks(setMetrics, (s) => setStatus(s))
    pipelineRef.current = p
    return () => p.destroy()
  }, [])

  useEffect(() => { if (pipelineRef.current) pipelineRef.current.quality = quality }, [quality])

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoError(null)
    try {
      const pipeline = pipelineRef.current!
      const ref = await pipeline.loadReference(file)
      setReferencePreview(URL.createObjectURL(file))
      // if not initialized, init
      if (pipeline.status === 'idle') await pipeline.init()
    } catch (err) {
      setPhotoError(err instanceof Error ? err.message : 'Erreur chargement image')
    }
  }

  const startLive = async () => {
    if (!pipelineRef.current) return
    try {
      await pipelineRef.current.init()
      await cam.start(cam.selectedDevice || undefined)
      // wait video ready
      setTimeout(() => {
        if (!cam.videoRef.current || !canvasRef.current || !hiddenVideoRef.current) return
        // use hiddenVideoRef as source for pipeline but we have cam.videoRef; sync stream
        const canvas = canvasRef.current!
        const video = cam.videoRef.current!
        // ensure hidden video mirrors stream for pipeline detection (same stream)
        if (hiddenVideoRef.current && cam.streamRef.current) {
          hiddenVideoRef.current.srcObject = cam.streamRef.current
          hiddenVideoRef.current.play().catch(() => {})
          // pipeline uses hiddenVideoRef for detection, canvas for rendering
          pipelineRef.current!.start(hiddenVideoRef.current, canvas)
        } else {
          pipelineRef.current!.start(video, canvas)
        }
        setLive(true)
      }, 600)
    } catch (err) {
      setPhotoError(err instanceof Error ? err.message : 'Impossible de démarrer')
    }
  }

  const stopLive = () => {
    pipelineRef.current?.stop()
    cam.stop()
    setLive(false)
    if (hiddenVideoRef.current) { hiddenVideoRef.current.srcObject = null }
  }

  const resetSession = () => {
    stopLive()
    setReferencePreview(null)
    setPhotoError(null)
    pipelineRef.current?.stop()
    if (pipelineRef.current) { pipelineRef.current.reference = null; (pipelineRef.current as unknown as { stabilizer: { reset: () => void } }).stabilizer.reset() }
  }

  return (
    <div className="min-h-screen bg-[#05070f] text-white flex">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-[64px] border-b border-white/10 flex items-center justify-between px-6 bg-[#0b0e1a]/50">
          <h1 className="display font-semibold">Swap Live — Photo-to-Live</h1>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-3 py-1 rounded-full border ${status === 'running' ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' : status === 'no-face' ? 'bg-amber-500/15 border-amber-500/30 text-amber-300' : status === 'error' ? 'bg-red-500/15 border-red-500/30 text-red-300' : 'bg-white/5 border-white/10 text-white/60'}`}>{status.toUpperCase()}</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-xs text-white/50"><Gauge className="h-3.5 w-3.5" /> {metrics.fps} FPS · {metrics.latencyMs} ms</span>
          </div>
        </header>

        <div className="flex-1 grid lg:grid-cols-[1fr_360px] gap-4 p-4 lg:p-6">
          {/* Video zone */}
          <div className="space-y-4 min-w-0">
            <div className="rounded-[24px] bg-[#0f1224] border border-white/10 p-3">
              <div className="grid md:grid-cols-2 gap-3">
                {/* Original preview */}
                <div className="rounded-2xl overflow-hidden bg-black border border-white/10 relative aspect-video">
                  <video ref={cam.videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                  {/* hidden video for pipeline */}
                  <video ref={hiddenVideoRef} autoPlay playsInline muted className="hidden" />
                  {!cam.active && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0c18] text-white/50 text-sm gap-2">
                      <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center"><ImageIcon className="h-6 w-6" /></div>
                      Caméra à l’arrêt
                      <span className="text-xs text-white/30">Autorisez l’accès et démarrez le LIVE</span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 text-[11px] px-2.5 py-1 rounded-full bg-black/60 border border-white/10 backdrop-blur">ORIGINAL {showOriginal ? '' : '(masqué)'}</div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className={`text-[11px] px-2 py-1 rounded-full border ${cam.active ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300' : 'bg-white/5 border-white/10 text-white/50'}`}>{cam.active ? '● Caméra active' : '○ Caméra arrêtée'}</span>
                    <button onClick={() => setShowOriginal(!showOriginal)} className="p-2 rounded-full bg-white/10 backdrop-blur border border-white/10">{showOriginal ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}</button>
                  </div>
                </div>

                {/* Transformed */}
                <div className="rounded-2xl overflow-hidden bg-black border border-white/10 relative aspect-video">
                  <canvas ref={canvasRef} className="w-full h-full object-cover" />
                  {!live && <div className="absolute inset-0 flex items-center justify-center bg-[#0a0c18]/80 text-sm text-white/60">Résultat transformé — démarrez le LIVE</div>}
                  <div className="absolute top-3 left-3 text-[11px] px-2.5 py-1 rounded-full bg-[#6366f1] text-white">TRANSFORMÉ</div>
                  {metrics.faceDetected && <div className="absolute bottom-3 left-3 text-[11px] px-2 py-1 rounded-full bg-emerald-500 text-white">Visage suivi</div>}
                  {status === 'no-face' && <div className="absolute bottom-3 left-3 text-[11px] px-2 py-1 rounded-full bg-amber-500 text-black flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Suivi perdu — recentrez votre visage</div>}
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-wrap items-center gap-3 mt-4">
                <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-sm font-semibold cursor-pointer hover:bg-white/90">
                  <Upload className="h-4 w-4" /> Importer une photo
                  <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFile} />
                </label>
                <button onClick={() => document.getElementById('file2')?.click()} className="px-5 py-2.5 rounded-full bg-white/10 border border-white/10 text-sm">Changer de photo</button>
                <input id="file2" type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFile} />

                {!live ? (
                  <button onClick={startLive} className="gradient-btn px-6 py-2.5 rounded-full text-sm font-semibold inline-flex items-center gap-2"><Play className="h-4 w-4" /> Démarrer le LIVE</button>
                ) : (
                  <button onClick={stopLive} className="px-6 py-2.5 rounded-full bg-red-500 text-white text-sm font-semibold inline-flex items-center gap-2"><Square className="h-4 w-4" /> Arrêter le LIVE</button>
                )}
                <button onClick={resetSession} className="px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm inline-flex items-center gap-2"><RefreshCcw className="h-4 w-4" /> Réinitialiser</button>
              </div>

              {photoError && <div className="mt-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-300 flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> {photoError}</div>}
              {!referencePreview && <div className="mt-3 text-xs text-white/40">Formats : JPG, PNG, WebP · Max 10 Mo · Visage bien visible recommandé. L’IA conserve l’apparence de référence pendant la session.</div>}
              {status === 'loading' && <div className="mt-3 text-xs text-[#a78bfa]">Chargement du modèle MediaPipe Face Landmarker… première fois ~5-8 Mo.</div>}
            </div>

            {/* Camera controls */}
            <div className="rounded-2xl bg-[#0f1224] border border-white/10 p-4 grid sm:grid-cols-3 gap-4">
              <div>
                <div className="text-xs font-semibold text-white/70 flex items-center gap-1"><Settings2 className="h-3.5 w-3.5" /> Caméra</div>
                <select value={cam.selectedDevice} onChange={e => cam.setSelectedDevice(e.target.value)} className="mt-2 w-full rounded-xl bg-black border border-white/10 px-3 py-2.5 text-sm">
                  <option value="">Par défaut</option>
                  {cam.devices.map(d => <option key={d.deviceId} value={d.deviceId}>{d.label || `Caméra ${d.deviceId.slice(0, 6)}`}</option>)}
                </select>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => cam.start(cam.selectedDevice || undefined)} className="flex-1 py-2 rounded-full bg-white/10 border border-white/10 text-xs">Activer</button>
                  <button onClick={cam.stop} className="flex-1 py-2 rounded-full bg-white/5 border border-white/10 text-xs">Désactiver</button>
                </div>
                {cam.error && <div className="text-xs text-red-300 mt-2">{cam.error}</div>}
              </div>
              <div>
                <div className="text-xs font-semibold text-white/70">Qualité</div>
                <div className="mt-2 grid grid-cols-3 gap-1">
                  {(['low', 'medium', 'high'] as Quality[]).map(q => (
                    <button key={q} onClick={() => setQuality(q)} className={`py-2 rounded-full text-xs font-medium border ${quality === q ? 'bg-[#6366f1] border-[#6366f1] text-white' : 'bg-white/5 border-white/10 text-white/60'}`}>{q.toUpperCase()}</button>
                  ))}
                </div>
                <div className="text-[11px] text-white/40 mt-2">Élevé = plus de détails & ombre · Latence mesurée en direct.</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-white/70">Performances</div>
                <div className="mt-2 space-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-white/50">FPS</span><span className="font-mono">{metrics.fps}</span></div>
                  <div className="flex justify-between"><span className="text-white/50">Latence</span><span className="font-mono">{metrics.latencyMs} ms</span></div>
                  <div className="flex justify-between"><span className="text-white/50">Suivi</span><span className={metrics.faceDetected ? 'text-emerald-400' : 'text-amber-400'}>{metrics.faceDetected ? 'OK' : 'Perdu'}</span></div>
                  <div className="text-[11px] text-white/30">Cible : 24-30 FPS sur GPU intégré. Si &lt;15 FPS, passez en Low.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div className="space-y-4">
            <div className="rounded-2xl bg-[#0f1224] border border-white/10 p-4">
              <div className="text-sm font-semibold">Photo de référence</div>
              <div className="mt-3 rounded-xl overflow-hidden bg-black border border-white/10 aspect-[4/3] flex items-center justify-center">
                {referencePreview ? <img src={referencePreview} alt="ref" className="w-full h-full object-cover" /> : <div className="text-xs text-white/30 text-center p-4">Aucune photo importée.<br />Le flux affichera la vidéo pass-through jusqu’à l’import.</div>}
              </div>
              <div className="mt-3 text-xs text-white/50">L’IA conserve forme, yeux, peau, coiffure et éclairage de la référence. Ne modifie pas arbitrairement l’apparence entre les sessions.</div>
            </div>

            <div className="rounded-2xl bg-[#0f1224] border border-white/10 p-4">
              <div className="text-sm font-semibold">Transformations</div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {TRANSFORMS.map(t => (
                  <button key={t.id} onClick={() => setSelectedTransform(t.id)} className={`rounded-xl overflow-hidden border text-left ${selectedTransform === t.id ? 'border-[#6366f1] ring-1 ring-[#6366f1]/40' : 'border-white/10'}`}>
                    <img src={t.thumb} alt={t.label} className="h-16 w-full object-cover" />
                    <div className="px-2 py-1.5 text-[11px] text-white/70">{t.label}</div>
                  </button>
                ))}
              </div>
              <div className="mt-3 text-[11px] text-white/40">Note : ces vignettes sont des presets visuels. Le rendu photoréaliste complet (GAN) nécessite un serveur GPU — voir docs moteur modulaire. Version actuelle : warp + landmarks locaux.</div>
            </div>

            <div className="rounded-2xl bg-[#6366f1]/10 border border-[#6366f1]/20 p-4">
              <div className="text-xs font-semibold text-[#a78bfa]">Limites connues</div>
              <ul className="text-xs text-white/60 mt-2 space-y-1 list-disc list-inside">
                <li>Rotation &gt;30° : estimation des zones non visibles.</li>
                <li>Lunettes / barbe fournie : suivi moins stable.</li>
                <li>Éclairage faible : détection dégradée.</li>
                <li>Un seul visage suivi à la fois.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
