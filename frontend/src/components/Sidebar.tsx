import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Video, Palette, Languages, Camera, Settings, Sparkles, Crown } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/swap', label: 'Swap Live', icon: Video },
  { to: '/restyle', label: 'Restyle Studio', icon: Palette },
  { to: '/translate', label: 'Live Translate', icon: Languages },
  { to: '/virtual-camera', label: 'Virtual Camera', icon: Camera },
  { to: '/settings', label: 'Paramètres', icon: Settings },
]

export default function Sidebar() {
  const { user } = useAuth()
  return (
    <aside className="hidden lg:flex w-[260px] shrink-0 border-r border-[#1e2240] bg-[#0b0e1a] flex-col">
      <div className="p-5 border-b border-white/5 flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#7c3aed] flex items-center justify-center"><Sparkles className="h-5 w-5" /></div>
        <div><div className="font-bold display text-sm">FACE-CAM AI</div><div className="text-xs text-white/50">{user?.email || 'Invité'}</div></div>
      </div>
      <nav className="p-3 flex-1 space-y-1">
        {links.map(l => (
          <NavLink key={l.to} to={l.to} className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${isActive ? 'bg-[#1a1e3a] text-white border border-[#2a2f5a]' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
            <l.icon className="h-4 w-4" /> {l.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4">
        <div className="rounded-2xl bg-gradient-to-br from-[#6366f1]/20 to-[#7c3aed]/20 border border-[#6366f1]/30 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold"><Crown className="h-4 w-4 text-[#a78bfa]" /> Passez Pro</div>
          <p className="text-xs text-white/60 mt-1">Débloquez quotas illimités et avatars premium.</p>
          <button className="mt-3 w-full gradient-btn py-2 rounded-full text-xs font-semibold">Voir les offres</button>
        </div>
      </div>
    </aside>
  )
}
