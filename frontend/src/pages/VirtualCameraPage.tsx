import Sidebar from '../components/Sidebar'
import { Camera, Monitor, AlertTriangle, Check, ExternalLink } from 'lucide-react'

export default function VirtualCameraPage() {
  return (
    <div className="min-h-screen bg-[#05070f] text-white flex">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <header className="h-[64px] border-b border-white/10 flex items-center px-6 bg-[#0b0e1a]/50">
          <h1 className="display font-semibold flex items-center gap-2"><Camera className="h-5 w-5 text-[#60a5fa]" /> Virtual Camera</h1>
        </header>
        <div className="p-6 max-w-[1000px] space-y-6">
          <div className="rounded-2xl bg-[#0f1224] border border-white/10 p-6">
            <h2 className="font-semibold">Trois flux distincts</h2>
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              {[
                { title: 'Flux original', desc: 'Webcam brute du navigateur', status: 'Disponible' },
                { title: 'Flux transformé', desc: 'Rendu Canvas / WebGL dans le studio', status: 'Disponible' },
                { title: 'Caméra système', desc: 'Périphérique virtuel pour Zoom/OBS', status: 'Application requise' },
              ].map(f => (
                <div key={f.title} className="p-4 rounded-xl bg-black border border-white/10">
                  <div className="text-sm font-medium">{f.title}</div>
                  <div className="text-xs text-white/50 mt-1">{f.desc}</div>
                  <div className={`mt-3 text-xs px-2 py-1 rounded-full border inline-flex ${f.status === 'Disponible' ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' : 'bg-amber-500/15 border-amber-500/30 text-amber-300'}`}>{f.status}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex gap-3 text-sm">
              <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />
              <div>
                <div className="font-semibold text-amber-200">Une page Web seule ne peut pas créer une caméra virtuelle système sur Windows.</div>
                <p className="text-white/60 text-xs mt-1">C’est une limitation navigateur : la création d’un périphérique DirectShow/Media Foundation nécessite un driver ou une app de bureau. Nous ne prétendons pas que cela fonctionne nativement dans OBS/Zoom avant validation.</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-[#0f1224] border border-white/10 p-6">
            <h3 className="font-semibold flex items-center gap-2"><Monitor className="h-4 w-4" /> Options d’intégration</h3>
            <div className="mt-4 space-y-3">
              {[
                { o: 'Flux navigateur + partage d’écran', d: 'Utilisez le rendu transformé en présentation / partage d’onglet.', ok: true },
                { o: 'WebRTC sortant', d: 'Envoyez le MediaStream traité vers votre propre serveur SFU (LiveKit, mediasoup).', ok: true },
                { o: 'OBS Virtual Camera', d: 'Capture fenêtre/navigateur → VirtualCam d’OBS → Zoom/Meet.', ok: true },
                { o: 'App de bureau dédiée (à développer)', d: 'Electron + driver virtuel (ex: obs-virtualcam, UnityCapture). Documentée ci-dessous.', ok: false },
              ].map(x => (
                <div key={x.o} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className={`mt-0.5 h-5 w-5 rounded-full grid place-items-center shrink-0 ${x.ok ? 'bg-emerald-500' : 'bg-white/15'}`}>{x.ok ? <Check className="h-3 w-3 text-white" /> : <span className="text-[10px]">…</span>}</span>
                  <div><div className="text-sm font-medium">{x.o}</div><div className="text-xs text-white/50">{x.d}</div></div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-[#0f1224] border border-white/10 p-6">
            <h3 className="font-semibold">Roadmap Virtual Camera</h3>
            <ol className="mt-4 space-y-3 text-sm list-decimal list-inside text-white/70">
              <li>Actuel : <strong className="text-white">canvas.captureStream(30)</strong> exposé comme MediaStream pour WebRTC interne.</li>
              <li>Prochain : build Electron avec <code className="bg-white/10 px-1 py-0.5 rounded">electron-capture → virtual driver</code>.</li>
              <li>Futur : driver signé WHQL pour apparaître nativement comme “FACE-CAM AI Virtual Camera”.</li>
            </ol>
            <a href="https://obsproject.com/kb/virtual-camera-guide" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 mt-4 text-sm text-[#a78bfa] hover:text-white">Guide OBS Virtual Camera <ExternalLink className="h-3.5 w-3.5" /></a>
          </div>

          <div className="rounded-2xl bg-black border border-white/10 p-4">
            <div className="text-xs font-mono text-white/50">// Exemple : récupérer le flux transformé</div>
            <pre className="mt-2 text-xs bg-[#0f1224] p-3 rounded-xl overflow-auto">{`const canvas = document.querySelector('canvas')
const stream = canvas.captureStream(30) // MediaStream 30 FPS
// Envoyer via WebRTC:
const pc = new RTCPeerConnection()
stream.getTracks().forEach(t => pc.addTrack(t, stream))`}</pre>
          </div>
        </div>
      </div>
    </div>
  )
}
