import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'
import { Sparkles, Video, Palette, Languages, Camera, Zap, Shield, Layers, Play, Check, ChevronDown, ArrowRight } from 'lucide-react'
import { useState } from 'react'

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-white/10 rounded-2xl bg-[#0f1224] overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 text-left">
        <span className="font-medium pr-4">{q}</span><ChevronDown className={`h-4 w-4 shrink-0 transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="px-5 pb-5 text-sm text-white/60 leading-relaxed">{a}</div>}
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#05070f] text-white">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#6366f1]/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#7c3aed]/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="mx-auto max-w-[1280px] px-6 pt-14 pb-10 grid lg:grid-cols-2 gap-10 items-center relative">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/70">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Nouveau · Moteur Photo-to-Live v1
            </div>
            <h1 className="display text-[42px] sm:text-[56px] font-bold leading-[0.95] mt-5">
              Changez <span className="gradient-text">d’apparence.</span><br />
              Traduisez <br />en direct.
            </h1>
            <p className="text-white/60 mt-5 text-[17px] leading-relaxed max-w-[520px]">
              Exprimez-vous sans frontières. Transformez votre visage en temps réel, créez des avatars réalistes et diffusez-les dans vos appels et streams.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link to="/register" className="gradient-btn px-7 py-3.5 rounded-full font-semibold text-sm inline-flex items-center gap-2">Commencer gratuitement <ArrowRight className="h-4 w-4" /></Link>
              <a href="#demo" className="px-7 py-3.5 rounded-full bg-white text-black font-semibold text-sm inline-flex items-center gap-2"><Play className="h-4 w-4" /> Voir la démo</a>
            </div>
            <div className="flex items-center gap-6 mt-8 text-xs text-white/50">
              <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-400" /> Sans carte bancaire</span>
              <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-400" /> Webcam instantanée</span>
              <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-400" /> RGPD & chiffré</span>
            </div>
          </div>

          {/* Hero Visual */}
          <div id="demo" className="relative">
            <div className="rounded-[28px] bg-gradient-to-br from-[#1a1e3a] to-[#0f1224] border border-white/10 p-3 shadow-2xl">
              <div className="rounded-2xl overflow-hidden bg-black aspect-[16/10] relative">
                <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900&q=80" alt="demo" className="w-full h-full object-cover opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 glass rounded-2xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-emerald-500 flex items-center justify-center"><Video className="h-4 w-4 text-white" /></div>
                    <div><div className="text-xs font-semibold">LIVE · 60 FPS</div><div className="text-[11px] text-white/60">Photo → Live activé</div></div>
                  </div>
                  <div className="text-xs px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300">● Suivi actif</div>
                </div>
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur text-xs border border-white/10">Modèle : Realistic Pro</div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3">
                {['Réaliste', 'Cinématique', 'Futuriste'].map(t => (
                  <div key={t} className="rounded-xl bg-white/5 border border-white/10 p-2 text-center text-xs text-white/70">{t}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="fonctionnalites" className="mx-auto max-w-[1280px] px-6 py-10">
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: Sparkles, title: 'Transformation faciale', desc: 'Remplacez votre apparence en direct à partir d’une simple photo. Suivi des expressions et inclinaison de tête.' },
            { icon: Palette, title: 'Avatars réalistes', desc: 'Bibliothèque de 6 styles. Importez votre référence, enregistrez et réutilisez vos créations.' },
            { icon: Languages, title: 'Traduction en temps réel', desc: 'Parlez en français, soyez compris en anglais, espagnol, portugais, allemand ou italien.' },
          ].map(f => (
            <div key={f.title} className="rounded-3xl bg-[#0f1224] border border-white/10 p-6 card-hover">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#7c3aed] flex items-center justify-center mb-4"><f.icon className="h-5 w-5" /></div>
              <div className="font-semibold">{f.title}</div>
              <p className="text-sm text-white/55 mt-2 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Swap Live */}
      <section id="swap" className="mx-auto max-w-[1280px] px-6 py-12">
        <div className="rounded-[32px] bg-[#0f1224] border border-white/10 overflow-hidden grid lg:grid-cols-2">
          <div className="p-8 lg:p-10">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-[#a78bfa]"><Zap className="h-4 w-4" /> SWAP LIVE</div>
            <h2 className="display text-3xl font-bold mt-3">Photo-to-Live Face Transformation</h2>
            <p className="text-white/55 mt-3 leading-relaxed text-sm">Importez une photo, le moteur reproduit l’apparence en vidéo animée et synchronisée avec vos mouvements — tête, sourire, bouche et clignements.</p>
            <ul className="mt-6 space-y-2.5 text-sm">
              {['Import JPG/PNG/WebP avec détection automatique du visage', 'Analyse forme, yeux, peau, coiffure et éclairage', 'Animation temps réel < 80 ms de latence', 'Stabilisation temporelle et reprise après perte de suivi'].map(x => (
                <li key={x} className="flex gap-2 text-white/70"><Check className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" /> {x}</li>
              ))}
            </ul>
            <Link to="/swap" className="inline-flex mt-7 gradient-btn px-6 py-3 rounded-full text-sm font-semibold">Ouvrir le studio Swap</Link>
          </div>
          <div className="bg-gradient-to-br from-[#1a1e3a] to-[#0b0e1a] p-6 flex items-center">
            <div className="w-full rounded-2xl bg-black border border-white/10 overflow-hidden">
              <div className="aspect-video bg-[#0a0c18] flex items-center justify-center relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-28 w-28 rounded-full border-2 border-[#6366f1]/40 flex items-center justify-center"><Layers className="h-10 w-10 text-white/60" /></div>
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex gap-2">
                  <span className="flex-1 bg-white text-black text-xs font-semibold py-2 rounded-full text-center">Démarrer le LIVE</span>
                  <span className="px-4 py-2 rounded-full bg-white/10 border border-white/10 text-xs">Changer photo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Restyle */}
      <section id="restyle" className="mx-auto max-w-[1280px] px-6 py-6">
        <div className="rounded-[32px] bg-gradient-to-br from-[#1a1e3a] via-[#0f1224] to-[#0b0e1a] border border-white/10 p-8 lg:p-10">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-[#60a5fa]"><Palette className="h-4 w-4" /> RESTYLE STUDIO</div>
          <h2 className="display text-3xl font-bold mt-3">Personnalisez votre apparence</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-3 mt-6">
            {['Réaliste', 'Professionnel', 'Cinématographique', 'Artistique', 'Futuriste', 'Virtuel'].map(c => (
              <div key={c} className="rounded-2xl bg-white/5 border border-white/10 p-4 text-center card-hover">
                <div className="h-16 rounded-xl bg-gradient-to-br from-white/10 to-white/5 mb-3" />
                <div className="text-xs font-medium">{c}</div>
              </div>
            ))}
          </div>
          <Link to="/restyle" className="inline-flex mt-6 px-6 py-3 rounded-full bg-white text-black text-sm font-semibold">Explorer la bibliothèque</Link>
        </div>
      </section>

      {/* Live Translate */}
      <section id="translate" className="mx-auto max-w-[1280px] px-6 py-6">
        <div className="rounded-[32px] bg-[#0f1224] border border-white/10 p-8 lg:p-10 grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-emerald-300"><Languages className="h-4 w-4" /> LIVE TRANSLATE</div>
            <h2 className="display text-3xl font-bold mt-3">Traduction vocale instantanée</h2>
            <p className="text-white/55 mt-3 text-sm leading-relaxed">Capture micro, transcription et sous-titres traduits. Architecture prête pour synthèse vocale (Phase 2) et flux WebRTC (Phase 3).</p>
            <div className="flex flex-wrap gap-2 mt-5">
              {['Français', 'English', 'Español', 'Português', 'Deutsch', 'Italiano'].map(l => (
                <span key={l} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/70">{l}</span>
              ))}
            </div>
            <Link to="/translate" className="inline-flex mt-6 gradient-btn px-6 py-3 rounded-full text-sm font-semibold">Tester la traduction</Link>
          </div>
          <div className="rounded-2xl bg-black border border-white/10 p-4">
            <div className="space-y-3">
              <div className="rounded-xl bg-white/5 p-3 border border-white/10">
                <div className="text-[11px] text-white/50">TRANSCRIPTION (FR)</div>
                <div className="text-sm mt-1">Bonjour, bienvenue sur Face-Cam AI !</div>
              </div>
              <div className="rounded-xl bg-[#6366f1]/15 border border-[#6366f1]/20 p-3">
                <div className="text-[11px] text-[#a78bfa]">TRADUCTION (EN)</div>
                <div className="text-sm mt-1">Hello, welcome to Face-Cam AI!</div>
              </div>
              <div className="text-xs text-white/40">Latence : 320 ms · Micro : ● actif</div>
            </div>
          </div>
        </div>
      </section>

      {/* Compatible apps */}
      <section className="mx-auto max-w-[1280px] px-6 py-6">
        <h3 className="display text-xl font-semibold text-center">Compatible avec vos outils préférés</h3>
        <p className="text-center text-white/50 text-sm mt-2">Flux navigateur + WebRTC. Caméra virtuelle système via application complémentaire Windows (documentée).</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          {['OBS Studio', 'Zoom', 'Google Meet', 'Discord', 'Microsoft Teams', 'Streamlabs', 'Twitch Studio', 'YouTube Live'].map(app => (
            <div key={app} className="rounded-2xl bg-[#0f1224] border border-white/10 py-6 text-center text-sm font-medium card-hover">{app}</div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Link to="/virtual-camera" className="text-sm text-[#a78bfa] hover:text-white inline-flex items-center gap-1">En savoir plus sur la Virtual Camera <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-[1280px] px-6 py-10">
        <h2 className="display text-3xl font-bold text-center">Choisissez votre plan</h2>
        <p className="text-center text-white/50 text-sm mt-2">Quotas configurables côté backend. Paiement Stripe à intégrer (webhooks sécurisés).</p>
        <div className="grid md:grid-cols-3 gap-5 mt-8">
          {[
            { name: 'FREE', price: '0€', per: '/mois', features: ['5 transformations / jour', '30 min de traitement', 'Bibliothèque limitée', '720p · Filigrane'], cta: 'Commencer', highlight: false },
            { name: 'PRO', price: '19€', per: '/mois', features: ['Transformations illimitées', '10h de traitement', 'Bibliothèque complète', '1080p · Sans filigrane · Priorité'], cta: 'Passer Pro', highlight: true },
            { name: 'PREMIUM', price: '49€', per: '/mois', features: ['Tout PRO +', '20h de traitement', 'Modèles premium & GPU prioritaire', 'Support dédié · API accès'], cta: 'Choisir Premium', highlight: false },
          ].map(p => (
            <div key={p.name} className={`rounded-[24px] border p-7 ${p.highlight ? 'bg-gradient-to-b from-[#6366f1]/20 to-[#0f1224] border-[#6366f1]/40 shadow-xl shadow-[#6366f1]/15' : 'bg-[#0f1224] border-white/10'}`}>
              <div className="text-xs tracking-widest font-bold text-white/60">{p.name}</div>
              <div className="mt-3 flex items-baseline gap-1"><span className="text-4xl font-bold">{p.price}</span><span className="text-white/50 text-sm">{p.per}</span></div>
              <ul className="mt-6 space-y-2.5 text-sm">
                {p.features.map(f => <li key={f} className="flex gap-2 text-white/70"><Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" /> {f}</li>)}
              </ul>
              <Link to="/register" className={`mt-7 block text-center py-3 rounded-full text-sm font-semibold ${p.highlight ? 'gradient-btn text-white' : 'bg-white text-black'}`}>{p.cta}</Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-[1280px] px-6 py-6">
        <h2 className="display text-2xl font-bold">Questions fréquentes</h2>
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <FAQItem q="Une simple photo suffit-elle pour un rendu photoréaliste à 360° ?" a="Non. Une seule photo ne permet pas de reconstruire parfaitement toutes les vues. Notre moteur estime les parties non visibles et reste fluide jusqu’à ~30° de rotation. Au-delà, un léger flou ou warping peut apparaître — l’architecture prévoit un futur modèle 3D/GAN serveur." />
          <FAQItem q="La caméra virtuelle fonctionne-t-elle dans Zoom/OBS ?" a="Le flux transformé est disponible dans le navigateur et via WebRTC. La caméra virtuelle système Windows nécessite une application complémentaire (ex: OBS VirtualCam ou driver dédié) documentée dans /virtual-camera." />
          <FAQItem q="Mes photos sont-elles conservées ?" a="Non, par défaut la photo de référence est conservée uniquement pendant la session. Vous pouvez la supprimer à tout moment. Aucune image n’est publique sans consentement et aucun entraînement n’est fait sans autorisation distincte." />
          <FAQItem q="Quels navigateurs sont supportés ?" a="Chrome et Edge (recommandés) pour reconnaissance vocale et MediaPipe GPU. Firefox fonctionne pour la vidéo mais sans Web Speech API. Windows 10/11 recommandé." />
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-[1280px] px-6 py-10">
        <div className="rounded-[28px] bg-gradient-to-br from-[#6366f1] to-[#7c3aed] p-[1px]">
          <div className="rounded-[27px] bg-[#0f1224] p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="display text-2xl font-bold">Prêt à transformer votre présence en ligne ?</h3>
              <p className="text-white/60 text-sm mt-2">Lancez votre première session en 30 secondes. Sans installation.</p>
            </div>
            <Link to="/swap" className="shrink-0 px-8 py-3.5 rounded-full bg-white text-black font-semibold text-sm">Lancer le studio →</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
