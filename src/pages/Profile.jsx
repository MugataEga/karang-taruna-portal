// pages/Profil.jsx
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const VISI = `Terwujudnya generasi muda Duri Selatan yang mandiri, kreatif, peduli sosial, dan berdaya saing tinggi untuk kemajuan masyarakat kelurahan.`

const MISI = [
  'Menumbuhkan jiwa kepedulian sosial dan semangat gotong royong pemuda',
  'Mengembangkan potensi dan kreativitas generasi muda melalui berbagai kegiatan positif',
  'Memfasilitasi program pemberdayaan ekonomi dan keterampilan warga',
  'Menjaga kebersihan, keindahan, dan kenyamanan lingkungan bersama warga',
  'Menjadi jembatan komunikasi antara warga dan pemerintah kelurahan',
]

const TABS = [
  { key: 'kelurahan', label: 'Kelurahan' },
  { key: 'rw001', label: 'RW 001' },
  { key: 'rw002', label: 'RW 002' },
  { key: 'rw003', label: 'RW 003' },
  { key: 'rw004', label: 'RW 004' },
  { key: 'rw005', label: 'RW 005' },
  { key: 'rw006', label: 'RW 006' },
]

// Avatar colors
const AVATAR_COLORS = [
  '#1a5c38', '#2e7d52', '#0f3d23', '#d4920a', 
  '#1a5c38', '#2e7d52', '#0f3d23', '#d4920a'
]

// ── Sub-components ──────────────────────────────────────────

function PengurusCard({ nama, jabatan, inisial, asal_rw, foto_url, kontak, index }) {
  const bgColor = AVATAR_COLORS[index % AVATAR_COLORS.length]
  
  // Generate initials from nama if inisial is not available
  const displayInitial = inisial || nama.charAt(0).toUpperCase()
  
  return (
    <div className="pengurus-card-profil">
      {foto_url ? (
        <img 
          src={foto_url} 
          alt={nama}
          className="pengurus-avatar-profil"
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '3px solid var(--border)'
          }}
        />
      ) : (
        <div className="pengurus-avatar-profil" style={{ background: bgColor }}>
          {displayInitial}
        </div>
      )}
      <h4 className="pengurus-nama">{nama}</h4>
      {asal_rw && <p className="pengurus-rw">{asal_rw}</p>}
      <span className="pengurus-jabatan-badge">{jabatan}</span>
      {kontak && (
        <p className="pengurus-kontak" style={{ 
          fontSize: '0.85rem', 
          color: 'var(--text-light)', 
          marginTop: '0.5rem' 
        }}>
          {kontak}
        </p>
      )}
    </div>
  )
}

function PengurusGrid({ pengurus, loading }) {
  if (loading) {
    return <p style={{ padding: '20px', color: 'var(--text-light)' }}>Memuat data pengurus...</p>
  }
  if (!pengurus.length) {
    return <p style={{ padding: '20px', color: 'var(--text-light)' }}>Belum ada data pengurus.</p>
  }
  return (
    <div className="pengurus-grid-profil">
      {pengurus.map((p, index) => (
        <PengurusCard key={p.id} {...p} index={index} />
      ))}
    </div>
  )
}

// ── Main Component ──────────────────────────────────────────

export default function Profil() {
  const [activeTab, setActiveTab] = useState('kelurahan')
  const [pengurus, setPengurus] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPengurus() {
      setLoading(true)

      const { data, error } = await supabase
        .from('pengurus')
        .select('*')
        .eq('unit', activeTab)
        .order('urutan', { ascending: true })

      if (!error) setPengurus(data || [])
      setLoading(false)
    }

    fetchPengurus()
  }, [activeTab])

  return (
    <>
      {/* Banner Header */}
      <div className="page-banner-profil">
        <div className="page-banner-inner">
          <h1>Profil Organisasi</h1>
          <p>Karang Taruna Kelurahan Duri Selatan — bersatu, bergerak, berdampak</p>
        </div>
      </div>

      {/* Content */}
      <div className="content-wrap">
        <div className="profil-layout">
          
          {/* Left Side - Organization Info */}
          <div className="profil-sidebar">
            <div className="profil-identity-card">
              <div className="profil-logo">
                <div className="profil-emblem">KT</div>
              </div>
              <h2 className="profil-org-name">Karang Taruna<br />Duri Selatan</h2>
              <p className="profil-address">
                Kelurahan Duri Selatan<br />
                Kecamatan Tambora<br />
                Jakarta Barat
              </p>
              
              <div className="profil-info-item">
                <span className="info-label">Berdiri</span>
                <span className="info-value">Tahun 2026</span>
              </div>
              
              <div className="profil-info-item">
                <span className="info-label">Unit</span>
                <span className="info-value">Sie TIK · Unit 05</span>
              </div>
              
              <div className="profil-info-item">
                <span className="info-label">Kontak</span>
                <span className="info-value">📱 0898-9625-550</span>
              </div>
            </div>
          </div>

          {/* Right Side - Visi, Misi, Ruang Lingkup */}
          <div className="profil-content">
            
            {/* Visi */}
            <div className="profil-section">
              <h3>Visi</h3>
              <p>{VISI}</p>
            </div>

            {/* Misi */}
            <div className="profil-section">
              <h3>Misi</h3>
              <ul className="profil-list">
                {MISI.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Ruang Lingkup */}
            <div className="profil-section">
              <h3>Ruang Lingkup</h3>
              <p>
                Karang Taruna Duri Selatan mencakup <strong>6 Rukun Warga (RW)</strong> yang masing-masing dipimpin oleh Ketua Karang Taruna RW. Koordinasi dilakukan secara rutin melalui rapat bulanan tingkat kelurahan.
              </p>
            </div>

          </div>
        </div>

        {/* Struktur Pengurus */}
        <div className="profil-struktur">
          <h2 className="struktur-title">Struktur Pengurus</h2>

          {/* Tabs */}
          <div className="profil-tabs">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                className={`profil-tab ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Pengurus Grid */}
          <PengurusGrid pengurus={pengurus} loading={loading} />
        </div>

      </div>
    </>
  )
}