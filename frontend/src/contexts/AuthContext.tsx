import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../services/supabase'

type User = { id: string; email: string; full_name?: string } | null

interface AuthCtx {
  user: User
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  isConfigured: boolean
}

const Ctx = createContext<AuthCtx>({ user: null, loading: true, signIn: async () => ({}), signUp: async () => ({}), signOut: async () => {}, isConfigured: false })

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      // Demo mode: check localStorage
      const demo = localStorage.getItem('facecam_demo_user')
      if (demo) setUser(JSON.parse(demo))
      setLoading(false)
      return
    }
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) setUser({ id: data.session.user.id, email: data.session.user.email || '' })
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session?.user) setUser({ id: session.user.id, email: session.user.email || '' })
      else setUser(null)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured || !supabase) {
      if (email && password.length >= 6) {
        const u = { id: 'demo-' + Date.now(), email, full_name: email.split('@')[0] }
        localStorage.setItem('facecam_demo_user', JSON.stringify(u))
        setUser(u)
        return {}
      }
      return { error: 'Mot de passe trop court (min 6 caractères).' }
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return error ? { error: error.message } : {}
  }
  const signUp = async (email: string, password: string, fullName: string) => {
    if (!isSupabaseConfigured || !supabase) {
      const u = { id: 'demo-' + Date.now(), email, full_name: fullName }
      localStorage.setItem('facecam_demo_user', JSON.stringify(u))
      setUser(u)
      return {}
    }
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } })
    return error ? { error: error.message } : {}
  }
  const signOut = async () => {
    if (!isSupabaseConfigured || !supabase) {
      localStorage.removeItem('facecam_demo_user')
      setUser(null)
      return
    }
    await supabase.auth.signOut()
    setUser(null)
  }

  return <Ctx.Provider value={{ user, loading, signIn, signUp, signOut, isConfigured: isSupabaseConfigured }}>{children}</Ctx.Provider>
}

export const useAuth = () => useContext(Ctx)
