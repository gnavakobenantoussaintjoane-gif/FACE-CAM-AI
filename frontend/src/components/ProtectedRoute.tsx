import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="p-10 text-center text-white/50">Chargement…</div>
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}
