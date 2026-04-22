import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useRW } from '../context/RWContext'

export default function Agenda() {
  const { activeRW } = useRW()
  const [agenda, setAgenda] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAgenda()
  }, [activeRW])

  async function fetchAgenda() {
    setLoading(true)
    try {
      let query = supabase
        .from('agenda')
        .select('*')
        .order('tanggal', { ascending: true })

      if (activeRW !== 'all') {
        query = query.contains('rw', [activeRW])
      }

      const { data, error } = await query
      if (error) throw error
      setAgenda(data || [])
    } catch (error) {
      console.error('Error fetching agenda:', error)
    } finally {
      setLoading(false)
    }
  }

  function formatDate(dateString) {
    const date = new Date(dateString)
    const day = date.getDate()
    const month = date.toLocaleDateString('id-ID', { month: 'short' }).toUpperCase()
    return { day, month }
  }

  function getRWLabel(rwArray) {
    if (rwArray.includes('all')) {
      return 'Semua RW'
    }
    const rwNumbers = rwArray
      .filter(rw => rw !== 'all')
      .map(rw => rw.replace('rw', 'RW ').replace('0', ' '))
      .join(' & ')
    return rwNumbers
  }

  if (loading) {
    return (
      <>
        <div className="page-banner-agenda">
          <div className="page-banner-inner">
            <h1>Agenda Kegiatan</h1>
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
      <div className="page-banner-agenda">
        <div className="page-banner-inner">
          <h1>Agenda Kegiatan</h1>
          <p>Jadwal kegiatan Karang Taruna Duri Selatan — seluruh RW</p>
          <div className="filter-badge">
            Menampilkan: {activeRW === 'all' ? 'Semua Wilayah' : activeRW.toUpperCase().replace('RW', 'RW ')}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="content-wrap">
        <div className="agenda-list-page">
          {agenda.length === 0 ? (
            <div className="empty-state">
              <p>Tidak ada agenda untuk wilayah ini.</p>
            </div>
          ) : (
            agenda.map((item) => {
              const { day, month } = formatDate(item.tanggal)
              return (
                <article key={item.id} className="agenda-item-page">
                  <div className="agenda-date-box">
                    <div className="date-day">{day}</div>
                    <div className="date-month">{month}</div>
                  </div>
                  <div className="agenda-content-page">
                    <div className={`agenda-tag tag-${item.tag_color}`}>
                      {item.kategori.toUpperCase()}
                    </div>
                    <h3 className="agenda-title">{item.judul}</h3>
                    <p className="agenda-text">{item.deskripsi}</p>
                    <div className="agenda-meta-page">
                      {item.waktu && (
                        <span className="meta-item">
                          ⏰ {item.waktu}
                        </span>
                      )}
                      {item.lokasi && (
                        <span className="meta-item">
                          📍 {item.lokasi}
                        </span>
                      )}
                      <span className="meta-item">
                        🏘 {getRWLabel(item.rw)}
                      </span>
                    </div>
                  </div>
                </article>
              )
            })
          )}
        </div>
      </div>
    </>
  )
}
