import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Sparkles, Menu, X, LogOut } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const nav = useNavigate()
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-40 border-b border-[#1e2240] bg-[#05070f]/80 backdrop-blur-xl">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 flex h-[64px] items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#7c3aed] flex items-center justify-center shadow-lg shadow-[#6366f1]/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="display font-bold text-lg tracking-tight">FACE-CAM <span className="gradient-text">AI</span></span>
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-sm text-white/70">
          <a href="#fonctionnalites" className="hover:text-white transition">Fonctionnalités</a>
          <a href="#swap" className="hover:text-white transition">Swap Live</a>
          <a href="#restyle" className="hover:text-white transition">Restyle</a>
          <a href="#translate" className="hover:text-white transition">Live Translate</a>
          <a href="#pricing" className="hover:text-white transition">Tarifs</a>
        </nav>
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link to="/dashboard" className="px-4 py-2 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90 transition">Dashboard</Link>
              <button onClick={async () => { await signOut(); nav('/') }} className="p-2 rounded-full border border-white/10 hover:bg-white/10"><LogOut className="h-4 w-4" /></button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-white/80 hover:text-white px-3 py-2">Se connecter</Link>
              <Link to="/register" className="gradient-btn px-5 py-2.5 rounded-full text-sm font-semibold text-white">Créer un compte</Link>
            </>
          )}
        </div>
        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </div>
      {open && (
        <div className="md:hidden border-t border-white/10 bg-[#0b0e1a] p-4 flex flex-col gap-3">
          <a href="#fonctionnalites" onClick={() => setOpen(false)}>Fonctionnalités</a>
          <Link to="/login" className="text-white/80">Se connecter</Link>
          <Link to="/register" className="gradient-btn px-5 py-3 rounded-full text-center font-semibold">Créer un compte</Link>
        </div>
      )}
    </header>
  )
}
