import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useRW } from '../context/RWContext'

export default function Galeri() {
  const { activeRW } = useRW()
  const [galeri, setGaleri] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGaleri()
  }, [activeRW])

  async function fetchGaleri() {
    setLoading(true)
    try {
      let query = supabase
        .from('galeri')
        .select('*')
        .order('urutan', { ascending: true })

      if (activeRW !== 'all') {
        query = query.contains('rw', [activeRW])
      }

      const { data, error } = await query
      if (error) throw error
      setGaleri(data || [])
    } catch (error) {
      console.error('Error fetching galeri:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <>
        <div className="page-banner-galeri">
          <div className="page-banner-inner">
            <h1>Galeri Kegiatan</h1>
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
      <div className="page-banner-galeri">
        <div className="page-banner-inner">
          <h1>Galeri Kegiatan</h1>
          <p>Dokumentasi kegiatan Karang Taruna Duri Selatan</p>
          <div className="filter-badge">
            Menampilkan: {activeRW === 'all' ? 'Semua Wilayah' : activeRW.toUpperCase().replace('RW', 'RW ')}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="content-wrap">
        <div className="galeri-grid-page">
          {galeri.length === 0 ? (
            <div className="empty-state">
              <p>Tidak ada galeri untuk wilayah ini.</p>
            </div>
          ) : (
            galeri.map((item) => (
              <article key={item.id} className="galeri-card-page">
                <div 
                  className="galeri-image-page"
                  style={{ 
                    background: item.foto_url 
                      ? `url(${item.foto_url}) center/cover` 
                      : item.bg_gradient 
                  }}
                >
                  {!item.foto_url && (
                    <span className="galeri-icon-page">{item.icon_emoji}</span>
                  )}
                </div>
                <div className="galeri-info-page">
                  <h3>{item.judul}</h3>
                  <p>{item.deskripsi}</p>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </>
  )
}
