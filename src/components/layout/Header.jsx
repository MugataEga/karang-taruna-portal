// components/layout/Header.jsx
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/',            label: 'Beranda',        icon: '🏠' },
  { to: '/pengumuman',  label: 'Pengumuman',      icon: '📢' },
  { to: '/agenda',      label: 'Agenda',          icon: '📅' },
  { to: '/galeri',      label: 'Galeri',          icon: '🖼'  },
  { to: '/profil',      label: 'Profil',          icon: '👥' },
  { to: '/aspirasi',    label: 'Aspirasi',        icon: '✉',  special: true },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  function isActive(to) {
    return to === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(to)
  }

  function closeMobile() {
    setMobileOpen(false)
  }

  return (
    <header>
      <div className="header-inner">

        {/* Logo */}
        <Link className="logo" to="/">
          <div className="logo-emblem">KT</div>
          <div className="logo-text">
            <div className="l1">Karang Taruna</div>
            <div className="l2">Kelurahan Duri Selatan · Jakarta Barat</div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav id="mainNav">
          {NAV_LINKS.map(({ to, label, special }) => (
            <Link
              key={to}
              to={to}
              className={[
                'nav-link',
                special   ? 'nav-aspirasi' : '',
                isActive(to) ? 'active' : '',
              ].join(' ').trim()}
            >
              {special ? `✉ ${label}` : label}
            </Link>
          ))}
        </nav>

        {/* Hamburger */}
        <button
          className={`hamburger ${mobileOpen ? 'open' : ''}`}
          id="hamburger"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <span /><span /><span />
        </button>

      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="mobile-menu" id="mobileMenu">
          {NAV_LINKS.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className={`nav-link ${isActive(to) ? 'active' : ''}`}
              onClick={closeMobile}
            >
              {icon} {label === 'Aspirasi' ? 'Kotak Aspirasi' : label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}