import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import DashboardPage from './pages/DashboardPage'
import SwapLivePage from './pages/SwapLivePage'
import RestylePage from './pages/RestylePage'
import TranslatePage from './pages/TranslatePage'
import VirtualCameraPage from './pages/VirtualCameraPage'
import SettingsPage from './pages/SettingsPage'
import { LoginPage, RegisterPage } from './pages/AuthPages'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/swap" element={<ProtectedRoute><SwapLivePage /></ProtectedRoute>} />
          <Route path="/restyle" element={<ProtectedRoute><RestylePage /></ProtectedRoute>} />
          <Route path="/translate" element={<ProtectedRoute><TranslatePage /></ProtectedRoute>} />
          <Route path="/virtual-camera" element={<ProtectedRoute><VirtualCameraPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
