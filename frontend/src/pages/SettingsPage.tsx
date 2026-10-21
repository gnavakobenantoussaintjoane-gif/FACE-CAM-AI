import Sidebar from '../components/Sidebar'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Trash2, LogOut, Shield } from 'lucide-react'
import { useState } from 'react'

export default function SettingsPage() {
  const { user, signOut } = useAuth()
  const nav = useNavigate()
  const [retention, setRetention] = useState('session')

  return (
    <div className="min-h-screen bg-[#05070f] text-white flex">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <header className="h-[64px] border-b border-white/10 flex items-center px-6 bg-[#0b0e1a]/50"><h1 className="display font-semibold">Paramètres</h1></header>
        <div className="p-6 max-w-[900px] space-y-6">
          <div className="rounded-2xl bg-[#0f1224] border border-white/10 p-6">
            <h3 className="font-semibold text-sm">Profil</h3>
            <div className="mt-4 space-y-3 text-sm">
              <div><div className="text-xs text-white/50">E-mail</div><div className="mt-1 p-3 rounded-xl bg-black border border-white/10">{user?.email}</div></div>
              <div><div className="text-xs text-white/50">ID</div><div className="mt-1 p-3 rounded-xl bg-black border border-white/10 font-mono text-xs">{user?.id}</div></div>
            </div>
            <button onClick={async () => { await signOut(); nav('/') }} className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm"><LogOut className="h-4 w-4" /> Se déconnecter</button>
          </div>

          <div className="rounded-2xl bg-[#0f1224] border border-white/10 p-6">
            <h3 className="font-semibold text-sm flex items-center gap-2"><Shield className="h-4 w-4 text-[#a78bfa]" /> Confidentialité</h3>
            <div className="mt-4 space-y-4 text-sm">
              <div>
                <div className="text-xs text-white/60">Durée de conservation de la photo de référence</div>
                <select value={retention} onChange={e => setRetention(e.target.value)} className="mt-2 w-full rounded-xl bg-black border border-white/10 px-3 py-2.5 text-sm">
                  <option value="session">Session uniquement (recommandé)</option>
                  <option value="7d">7 jours</option>
                  <option value="30d">30 jours</option>
                </select>
                <p className="text-xs text-white/40 mt-2">Aucune image n’est publique par défaut. Suppression à la demande. Transferts chiffrés vers le serveur GPU si activé.</p>
              </div>
              <label className="flex items-center gap-2 text-xs"><input type="checkbox" defaultChecked /> Demander le consentement avant caméra/micro (requis)</label>
              <label className="flex items-center gap-2 text-xs"><input type="checkbox" /> Autoriser l’amélioration du modèle avec mes images (opt-in distinct)</label>
            </div>
          </div>

          <div className="rounded-2xl bg-red-950/20 border border-red-500/20 p-6">
            <h3 className="font-semibold text-sm text-red-300 flex items-center gap-2"><Trash2 className="h-4 w-4" /> Zone de danger</h3>
            <p className="text-xs text-white/50 mt-2">La suppression est définitive et efface profil, avatars, historiques et fichiers stockés.</p>
            <button onClick={() => { if (confirm('Supprimer définitivement votre compte ?')) { localStorage.clear(); nav('/') } }} className="mt-4 px-4 py-2 rounded-full bg-red-500 text-white text-sm">Supprimer mon compte</button>
          </div>
        </div>
      </div>
    </div>
  )
}
