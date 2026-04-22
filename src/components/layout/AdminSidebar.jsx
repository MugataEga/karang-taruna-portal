import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { signOut } = useAuth()

  const isActive = (path) => {
    return location.pathname === path
  }

  const handleLogout = async () => {
    if (confirm('Yakin ingin logout?')) {
      try {
        await signOut()
        navigate('/admin/login')
      } catch (error) {
        console.error('Error logout:', error)
        alert('Gagal logout')
      }
    }
  }

  const closeMobile = () => {
    setMobileOpen(false)
  }

  return (
    <>
      {/* Mobile Header */}
      <div className="admin-mobile-header">
        <div className="mobile-logo">
          <div className="logo-emblem">KT</div>
          <div className="logo-text">
            Karang Taruna
            <div className="sidebar-subtitle">Admin Panel</div>
          </div>
        </div>
        <button
          className={`admin-hamburger ${mobileOpen ? 'open' : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Overlay */}
      {mobileOpen && (
        <div 
          className="admin-sidebar-overlay" 
          onClick={closeMobile}
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-emblem">KT</div>
            <div className="logo-text">Karang Taruna
              <div className="sidebar-subtitle">Admin Panel</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <Link 
            to="/admin" 
            className={`nav-item ${isActive('/admin') ? 'active' : ''}`}
            onClick={closeMobile}
          >
            <span className="nav-icon">📊</span>
            <span>Dashboard</span>
          </Link>
          <Link 
            to="/admin/pengumuman" 
            className={`nav-item ${isActive('/admin/pengumuman') ? 'active' : ''}`}
            onClick={closeMobile}
          >
            <span className="nav-icon">📢</span>
            <span>Pengumuman</span>
          </Link>
          <Link 
            to="/admin/agenda" 
            className={`nav-item ${isActive('/admin/agenda') ? 'active' : ''}`}
            onClick={closeMobile}
          >
            <span className="nav-icon">📅</span>
            <span>Agenda</span>
          </Link>
          <Link 
            to="/admin/galeri" 
            className={`nav-item ${isActive('/admin/galeri') ? 'active' : ''}`}
            onClick={closeMobile}
          >
            <span className="nav-icon">🖼</span>
            <span>Galeri</span>
          </Link>
          <Link 
            to="/admin/struktur-organisasi" 
            className={`nav-item ${isActive('/admin/struktur-organisasi') ? 'active' : ''}`}
            onClick={closeMobile}
          >
            <span className="nav-icon">👥</span>
            <span>Struktur Organisasi</span>
          </Link>
          <Link 
            to="/admin/aspirasi" 
            className={`nav-item ${isActive('/admin/aspirasi') ? 'active' : ''}`}
            onClick={closeMobile}
          >
            <span className="nav-icon">✉️</span>
            <span>Aspirasi Warga</span>
          </Link>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="btn-logout">
            🚪 Logout
          </button>
          <Link to="/" className="btn-back" onClick={closeMobile}>
            ← Kembali ke Website
          </Link>
        </div>
      </aside>
    </>
  )
}
