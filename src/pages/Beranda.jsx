// pages/Beranda.jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useRW } from '../context/RWContext'

const RW_BADGES = ['001', '002', '003', '004', '005', '006']

// ── Sub-components ──────────────────────────────────────────

function PengumumanCard({ judul, isi, kategori, tag_color, icon_emoji, tanggal, rw }) {
  const rwLabel = rw?.includes('all') ? 'Semua RW' : rw?.[1]?.replace('rw', 'RW ') ?? ''
  const tgl = new Date(tanggal).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric'
  })

  return (
    <div className="card">
      <div className="card-img-placeholder">{icon_emoji}</div>
      <div className="card-body">
        <span className={`tag tag-${tag_color}`}>{kategori}</span>
        <h3>{judul}</h3>
        <p>{isi}</p>
        <div className="card-meta">
          <span>📅 {tgl}</span>
          <span>🏘 {rwLabel}</span>
        </div>
      </div>
    </div>
  )
}

function AgendaCard({ judul, deskripsi, kategori, tag_color, tanggal, waktu, lokasi }) {
  const date   = new Date(tanggal)
  const day    = date.toLocaleDateString('id-ID', { day: '2-digit' })
  const month  = date.toLocaleDateString('id-ID', { month: 'short' }).toUpperCase()

  return (
    <div className="agenda-card-beranda">
      <div className="agenda-date-box-beranda">
        <div className="date-day">{day}</div>
        <div className="date-month">{month}</div>
      </div>
      <div className="agenda-content-beranda">
        <span className={`agenda-tag-beranda tag-${tag_color}`}>{kategori.toUpperCase()}</span>
        <h4 className="agenda-title-beranda">{judul}</h4>
        <p className="agenda-text-beranda">{deskripsi}</p>
        <div className="agenda-meta-beranda">
          <span className="meta-item">⏰ {waktu}</span>
          <span className="meta-item">📍 {lokasi}</span>
        </div>
      </div>
    </div>
  )
}

function StatItem({ num, label }) {
  return (
    <div className="stat-item">
      <div className="stat-num">{num}</div>
      <div className="stat-lbl">{label}</div>
    </div>
  )
}

// ── Main Component ──────────────────────────────────────────

export default function Beranda() {
  const { activeRW } = useRW()
  const [pengumuman, setPengumuman] = useState([])
  const [agenda, setAgenda] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAll() {
      setLoading(true)
      try {
        // Build query untuk pengumuman dengan filter RW
        let pQuery = supabase
          .from('pengumuman')
          .select('*')
          .order('is_pinned', { ascending: false })
          .order('tanggal', { ascending: false })
          .limit(3)

        // Filter berdasarkan RW yang dipilih
        if (activeRW !== 'all') {
          pQuery = pQuery.contains('rw', [activeRW])
        }

        const { data: pData, error: pError } = await pQuery

        if (pError) throw pError

        // Build query untuk agenda dengan filter RW
        const today = new Date().toISOString().split('T')[0]
        let aQuery = supabase
          .from('agenda')
          .select('*')
          .gte('tanggal', today)
          .order('tanggal', { ascending: true })
          .limit(3)

        // Filter berdasarkan RW yang dipilih
        if (activeRW !== 'all') {
          aQuery = aQuery.contains('rw', [activeRW])
        }

        const { data: aData, error: aError } = await aQuery

        if (aError) throw aError

        // Jika tidak ada agenda mendatang, ambil yang featured atau terbaru
        if (!aData || aData.length === 0) {
          let aFallbackQuery = supabase
            .from('agenda')
            .select('*')
            .order('is_featured', { ascending: false })
            .order('tanggal', { ascending: false })
            .limit(3)

          // Filter fallback juga berdasarkan RW
          if (activeRW !== 'all') {
            aFallbackQuery = aFallbackQuery.contains('rw', [activeRW])
          }

          const { data: aFallback } = await aFallbackQuery
          
          if (aFallback) setAgenda(aFallback)
        } else {
          setAgenda(aData)
        }

        // Fetch stats
        const { data: sData, error: sError } = await supabase
          .from('site_stats')
          .select('*')
          .single()

        if (sError) console.error('Stats error:', sError)

        if (pData) setPengumuman(pData)
        if (sData) setStats(sData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [activeRW]) // Re-fetch ketika activeRW berubah

  return (
    <div id="sec-beranda" className="section active">

      {/* ── Hero ── */}
      <div className="hero">
        <div className="hero-inner">
          <div className="hero-eyebrow">
            <span className="dot" /> Website Resmi Karang Taruna
          </div>
          <h1>Bersatu untuk <em>Duri Selatan</em><br />yang Lebih Baik</h1>
          <p>
            Pusat informasi, agenda kegiatan, dan aspirasi warga Kelurahan Duri Selatan
            — meliputi 6 Rukun Warga yang bergerak bersama.
          </p>
          <div className="hero-buttons">
            <Link to="/pengumuman" className="btn-primary">Lihat Pengumuman</Link>
            <Link to="/agenda"     className="btn-outline">Agenda Kegiatan</Link>
          </div>
          <div className="hero-rw-badges">
            <span className="rw-badge kel">🏙 Kelurahan</span>
            {RW_BADGES.map((rw) => (
              <span key={rw} className="rw-badge">RW {rw}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="stats-bar">
        <div className="stats-inner">
          <StatItem num={stats?.rw_aktif  ?? '6'}      label="Rukun Warga Aktif" />
          <StatItem num={stats?.kegiatan  ?? '24'}     label="Kegiatan Tahun Ini" />
          <StatItem num={stats?.anggota   ?? '180+'}   label="Anggota Aktif" />
          <StatItem num={stats?.warga     ?? '2.400+'} label="Warga Terlayani" />
        </div>
      </div>

      {/* ── Pengumuman Terbaru ── */}
      <div className="home-section" style={{ background: 'var(--white)' }}>
        <div className="home-section-inner">
          <div className="section-header">
            <h2>
              Pengumuman Terbaru
              {activeRW !== 'all' && (
                <span className="filter-badge-inline">
                  {activeRW.replace('rw', 'RW ')}
                </span>
              )}
            </h2>
            <Link to="/pengumuman" className="see-all">Lihat semua →</Link>
          </div>
          {loading ? (
            <p style={{ color: 'var(--text-light)', padding: '20px 0' }}>Memuat pengumuman...</p>
          ) : pengumuman.length > 0 ? (
            <div className="grid-3">
              {pengumuman.map((item) => <PengumumanCard key={item.id} {...item} />)}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '40px 24px' }}>
              <div className="icon">📢</div>
              <h4>Belum Ada Pengumuman</h4>
              <p>
                {activeRW === 'all' 
                  ? 'Belum ada pengumuman tersedia saat ini.'
                  : `Belum ada pengumuman untuk ${activeRW.replace('rw', 'RW ')}.`
                }
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="section-divider" />

      {/* ── Agenda Terdekat ── */}
      <div className="home-section">
        <div className="home-section-inner">
          <div className="section-header">
            <h2>
              Agenda Terdekat
              {activeRW !== 'all' && (
                <span className="filter-badge-inline">
                  {activeRW.replace('rw', 'RW ')}
                </span>
              )}
            </h2>
            <Link to="/agenda" className="see-all">Lihat semua →</Link>
          </div>
          {loading ? (
            <p style={{ color: 'var(--text-light)', padding: '20px 0' }}>Memuat agenda...</p>
          ) : agenda.length > 0 ? (
            <div className="agenda-list-beranda">
              {agenda.map((item) => <AgendaCard key={item.id} {...item} />)}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '40px 24px' }}>
              <div className="icon">📅</div>
              <h4>Belum Ada Agenda</h4>
              <p>
                {activeRW === 'all' 
                  ? 'Belum ada agenda terjadwal saat ini.'
                  : `Belum ada agenda untuk ${activeRW.replace('rw', 'RW ')}.`
                }
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}