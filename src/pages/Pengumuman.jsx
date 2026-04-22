import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useRW } from '../context/RWContext'

export default function Pengumuman() {
  const { activeRW } = useRW()
  const [pengumuman, setPengumuman] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPengumuman()
  }, [activeRW])

  async function fetchPengumuman() {
    setLoading(true)
    try {
      let query = supabase
        .from('pengumuman')
        .select('*')
        .order('tanggal', { ascending: false })

      // Filter by RW if not 'all'
      if (activeRW !== 'all') {
        query = query.contains('rw', [activeRW])
      }

      const { data, error } = await query
      if (error) throw error
      setPengumuman(data || [])
    } catch (error) {
      console.error('Error fetching pengumuman:', error)
    } finally {
      setLoading(false)
    }
  }

  function formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    })
  }

  function getRWLabel(rwArray) {
    if (rwArray.includes('all')) {
      return 'Semua Wilayah'
    }
    const rwNumbers = rwArray
      .filter(rw => rw !== 'all')
      .map(rw => rw.replace('rw', 'RW ').replace('0', ' '))
      .join(' & ')
    return rwNumbers
  }

  function getCategoryIcon(kategori) {
    const icons = {
      'Info Kelurahan': '📋',
      'Pembangunan': '🏗',
      'Pendidikan': '🎓',
      'Fasilitas': '🔧',
      'Lingkungan': '🌳',
      'Olahraga': '🏊',
      'Penting': '🚰',
      'Kelurahan': '🎉'
    }
    return icons[kategori] || '📢'
  }

  if (loading) {
    return (
      <>
        <div className="page-banner-pengumuman">
          <div className="page-banner-inner">
            <h1>Pengumuman</h1>
            <p>Memuat data...</p>
          </div>
        </div>
        <div className="content-wrap">
          <p>Loading...</p>
        </div>
      </>
    )
  }

  return (
    <>
      {/* Banner Header */}
      <div className="page-banner-pengumuman">
        <div className="page-banner-inner">
          <h1>Pengumuman</h1>
          <p>Informasi resmi dari Kelurahan dan seluruh RW di Duri Selatan</p>
          <div className="filter-badge">
            Menampilkan: {activeRW === 'all' ? 'Semua Wilayah' : activeRW.toUpperCase().replace('RW', 'RW ')}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="content-wrap">
        <div className="pengumuman-list">
          {pengumuman.length === 0 ? (
            <div className="empty-state">
              <p>Tidak ada pengumuman untuk wilayah ini.</p>
            </div>
          ) : (
            pengumuman.map((item) => (
              <article key={item.id} className="pengumuman-item">
                <div className="pengumuman-icon-wrapper">
                  <div className={`pengumuman-icon-box icon-${item.tag_color}`}>
                    {getCategoryIcon(item.kategori)}
                  </div>
                </div>
                <div className="pengumuman-content">
                  <div className={`pengumuman-tag tag-${item.tag_color}`}>
                    {item.kategori.toUpperCase()}
                  </div>
                  <h3 className="pengumuman-title">{item.judul}</h3>
                  <p className="pengumuman-text">{item.isi}</p>
                  <div className="pengumuman-meta">
                    <span className="meta-item">
                      📅 {formatDate(item.tanggal)}
                    </span>
                    <span className="meta-item">
                      🏘 {getRWLabel(item.rw)}
                    </span>
                    <span className="meta-item">
                      👁 {item.kategori}
                    </span>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </>
  )
}
