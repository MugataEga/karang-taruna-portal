// App.jsx
import { Routes, Route } from 'react-router-dom'
import { RWProvider } from './context/RWContext'
import { AuthProvider } from './context/AuthContext'
import PublicLayout from './components/layout/PublicLayout'
import HeaderOnlyLayout from './components/layout/HeaderOnlyLayout'
import Pengumuman from './pages/Pengumuman'
import Galeri from './pages/Galeri'
import Agenda from './pages/Agenda'
import Beranda from './pages/Beranda'
import Profil from './pages/Profile'
import Aspirasi from './pages/Aspirasi'
import Login from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'
import AdminPengumuman from './pages/admin/AdminPengumuman'
import AdminAgenda from './pages/admin/AdminAgenda'
import AdminGaleri from './pages/admin/AdminGaleri'
import AdminAspirasi from './pages/admin/AdminAspirasi'
import AdminPengurus from './pages/admin/AdminPengurus'
import ProtectedRoute from './components/ProtectedRoute'
import './global.css'

export default function App() {
  return (
    <AuthProvider>
      <RWProvider>
        <Routes>
          {/* Public Routes with Layout (Header + RWBar + Footer) */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Beranda />} />
            <Route path="/pengumuman" element={<Pengumuman />} />
            <Route path="/agenda" element={<Agenda />} />
            <Route path="/galeri" element={<Galeri />} />
          </Route>
          
          {/* Routes without RWBar (Header + Footer only) */}
          <Route element={<HeaderOnlyLayout />}>
            <Route path="/profil" element={<Profil />} />
            <Route path="/aspirasi" element={<Aspirasi />} />
          </Route>
          
          {/* Admin Routes (No Header/RWBar/Footer) */}
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/pengumuman" element={<ProtectedRoute><AdminPengumuman /></ProtectedRoute>} />
          <Route path="/admin/agenda" element={<ProtectedRoute><AdminAgenda /></ProtectedRoute>} />
          <Route path="/admin/galeri" element={<ProtectedRoute><AdminGaleri /></ProtectedRoute>} />
          <Route path="/admin/struktur-organisasi" element={<ProtectedRoute><AdminPengurus /></ProtectedRoute>} />
          <Route path="/admin/aspirasi" element={<ProtectedRoute><AdminAspirasi /></ProtectedRoute>} />
        </Routes>
      </RWProvider>
    </AuthProvider>
  )
}