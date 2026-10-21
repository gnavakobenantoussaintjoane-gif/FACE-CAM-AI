import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Sparkles } from 'lucide-react'

function Shell({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="min-h-screen bg-[#05070f] text-white flex">
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#1a1e3a] via-[#0f1224] to-[#05070f] p-10 flex-col justify-between border-r border-white/10">
        <Link to="/" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#7c3aed] grid place-items-center"><Sparkles className="h-5 w-5" /></div>
          <span className="display font-bold">FACE-CAM AI</span>
        </Link>
        <div>
          <h2 className="display text-4xl font-bold leading-tight">Le studio IA<br />pour vos <span className="gradient-text">lives & appels</span></h2>
          <p className="text-white/50 mt-4 max-w-[420px]">Transformation faciale, avatars et traduction en direct. Sécurisé, rapide, RGPD.</p>
        </div>
        <div className="text-xs text-white/30">© {new Date().getFullYear()} FACE-CAM AI</div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[420px]">
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8"><div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#7c3aed] grid place-items-center"><Sparkles className="h-4 w-4" /></div><span className="font-bold display">FACE-CAM AI</span></Link>
          <h1 className="display text-2xl font-bold">{title}</h1>
          <p className="text-white/50 text-sm mt-2">{subtitle}</p>
          <div className="mt-6 rounded-2xl bg-[#0f1224] border border-white/10 p-6">{children}</div>
        </div>
      </div>
    </div>
  )
}

export function LoginPage() {
  const { signIn } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(null); setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) setErr(error)
    else nav('/dashboard')
  }

  return (
    <Shell title="Bon retour !" subtitle="Connectez-vous pour accéder au studio.">
      <form onSubmit={submit} className="space-y-4">
        <div><label className="text-xs text-white/70">E-mail</label><input value={email} onChange={e => setEmail(e.target.value)} type="email" required placeholder="vous@exemple.com" className="mt-1 w-full rounded-xl bg-black border border-white/10 px-4 py-3 text-sm outline-none focus:border-[#6366f1]" /></div>
        <div><label className="text-xs text-white/70">Mot de passe</label><input value={password} onChange={e => setPassword(e.target.value)} type="password" required placeholder="••••••••" className="mt-1 w-full rounded-xl bg-black border border-white/10 px-4 py-3 text-sm outline-none focus:border-[#6366f1]" /></div>
        {err && <div className="text-xs p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300">{err}</div>}
        <button disabled={loading} className="w-full gradient-btn py-3 rounded-full font-semibold text-sm">{loading ? 'Connexion…' : 'Se connecter'}</button>
        <div className="text-center text-xs text-white/50">Pas de compte ? <Link to="/register" className="text-[#a78bfa] hover:text-white">Créer un compte</Link></div>
      </form>
    </Shell>
  )
}

export function RegisterPage() {
  const { signUp } = useAuth()
  const nav = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(null); setLoading(true)
    const { error } = await signUp(email, password, fullName)
    setLoading(false)
    if (error) setErr(error)
    else nav('/dashboard')
  }

  return (
    <Shell title="Créer un compte" subtitle="Commencez gratuitement — sans carte bancaire.">
      <form onSubmit={submit} className="space-y-4">
        <div><label className="text-xs text-white/70">Nom complet</label><input value={fullName} onChange={e => setFullName(e.target.value)} required placeholder="Ada Lovelace" className="mt-1 w-full rounded-xl bg-black border border-white/10 px-4 py-3 text-sm outline-none focus:border-[#6366f1]" /></div>
        <div><label className="text-xs text-white/70">E-mail</label><input value={email} onChange={e => setEmail(e.target.value)} type="email" required placeholder="vous@exemple.com" className="mt-1 w-full rounded-xl bg-black border border-white/10 px-4 py-3 text-sm outline-none focus:border-[#6366f1]" /></div>
        <div><label className="text-xs text-white/70">Mot de passe</label><input value={password} onChange={e => setPassword(e.target.value)} type="password" required placeholder="••••••••" className="mt-1 w-full rounded-xl bg-black border border-white/10 px-4 py-3 text-sm outline-none focus:border-[#6366f1]" /></div>
        {err && <div className="text-xs p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300">{err}</div>}
        <button disabled={loading} className="w-full gradient-btn py-3 rounded-full font-semibold text-sm">{loading ? 'Création…' : 'Créer mon compte'}</button>
        <div className="text-center text-xs text-white/50">Déjà un compte ? <Link to="/login" className="text-[#a78bfa] hover:text-white">Se connecter</Link></div>
        <p className="text-[11px] text-white/30 text-center">En créant un compte, vous acceptez nos conditions et notre politique de confidentialité. Vos images ne sont utilisées qu’avec votre consentement.</p>
      </form>
    </Shell>
  )
}
