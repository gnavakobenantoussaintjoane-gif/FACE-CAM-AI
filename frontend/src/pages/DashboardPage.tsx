import Sidebar from '../components/Sidebar'
import { Video, Palette, Languages, Camera, Clock, Zap, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { api } from '../services/api'

export default function DashboardPage() {
  const [health, setHealth] = useState<string>('…')
  useEffect(() => { api.health().then(r => setHealth(r.status)).catch(() => setHealth('offline (mode démo)')) }, [])

  return (
    <div className="min-h-screen bg-[#05070f] text-white flex">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <header className="h-[64px] border-b border-white/10 flex items-center justify-between px-6 lg:px-8 bg-[#0b0e1a]/50">
          <h1 className="display font-semibold">Dashboard</h1>
          <div className="text-xs text-white/50">API: <span className={health === 'ok' ? 'text-emerald-400' : 'text-amber-300'}>{health}</span></div>
        </header>

        <div className="p-6 lg:p-8 space-y-6">
          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { label: 'Temps utilisé', value: '1.2h', sub: '/ 5h ce mois', icon: Clock },
              { label: 'Transformations', value: '24', sub: '/ 100', icon: Zap },
              { label: 'Avatars', value: '7', sub: 'enregistrés', icon: Palette },
              { label: 'Traductions', value: '12', sub: 'sessions', icon: Languages },
            ].map(s => (
              <div key={s.label} className="rounded-2xl bg-[#0f1224] border border-white/10 p-5">
                <div className="flex items-center justify-between"><span className="text-xs text-white/50">{s.label}</span><s.icon className="h-4 w-4 text-white/30" /></div>
                <div className="text-2xl font-bold mt-2">{s.value} <span className="text-xs font-normal text-white/40">{s.sub}</span></div>
                <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden"><div className="h-full w-[42%] bg-gradient-to-r from-[#6366f1] to-[#7c3aed]" /></div>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: 'Swap Live', desc: 'Photo → Live transformation', to: '/swap', icon: Video, grad: 'from-[#6366f1] to-[#7c3aed]' },
              { title: 'Restyle Studio', desc: 'Parcourez les avatars', to: '/restyle', icon: Palette, grad: 'from-[#06b6d4] to-[#2563eb]' },
              { title: 'Live Translate', desc: 'Traduction en direct', to: '/translate', icon: Languages, grad: 'from-emerald-500 to-teal-600' },
            ].map(c => (
              <Link key={c.title} to={c.to} className="rounded-2xl bg-[#0f1224] border border-white/10 p-5 card-hover block">
                <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${c.grad} flex items-center justify-center`}><c.icon className="h-5 w-5" /></div>
                <div className="font-semibold mt-4">{c.title}</div>
                <div className="text-xs text-white/50 mt-1">{c.desc}</div>
              </Link>
            ))}
          </div>

          {/* Recent + usage */}
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-[#0f1224] border border-white/10 p-6">
              <div className="flex items-center justify-between"><h3 className="font-semibold text-sm">Derniers projets</h3><TrendingUp className="h-4 w-4 text-white/30" /></div>
              <div className="mt-4 space-y-3">
                {[
                  { name: 'Avatar Pro — Studio 02', time: 'il y a 2h', status: 'Prêt' },
                  { name: 'Session traduction FR→EN', time: 'hier', status: 'Terminée' },
                  { name: 'Photo-to-Live — Portrait #4', time: 'il y a 3 jours', status: 'Prêt' },
                ].map(r => (
                  <div key={r.name} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                    <div><div className="text-sm font-medium">{r.name}</div><div className="text-xs text-white/40">{r.time}</div></div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">{r.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-[#0f1224] border border-white/10 p-6">
              <h3 className="font-semibold text-sm">Quota & abonnement</h3>
              <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-[#6366f1]/15 to-[#7c3aed]/10 border border-[#6366f1]/20">
                <div className="text-sm font-semibold">Plan FREE</div>
                <p className="text-xs text-white/60 mt-1">5 transformations / jour · 30 min de traitement</p>
                <div className="mt-3 h-2 rounded-full bg-white/10 overflow-hidden"><div className="h-full w-[62%] bg-white" /></div>
                <div className="mt-2 text-xs text-white/50">62% du quota utilisé</div>
              </div>
              <Link to="/#pricing" className="mt-4 block text-center py-2.5 rounded-full bg-white text-black text-sm font-semibold">Passer Pro — 19€/mois</Link>
              <Link to="/virtual-camera" className="mt-3 flex items-center justify-center gap-2 text-xs text-white/60 hover:text-white"><Camera className="h-3.5 w-3.5" /> Configurer la caméra virtuelle</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
