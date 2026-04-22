import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import AdminSidebar from '../../components/layout/AdminSidebar'
import '../../admin.css'

export default function AdminAspirasi() {
  const [aspirasi, setAspirasi] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAspirasi()
  }, [])

  async function fetchAspirasi() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('aspirasi')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setAspirasi(data || [])
    } catch (error) {
      console.error('Error:', error)
      alert('Gagal memuat data')
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdateStatus(id, newStatus) {
    try {
      const { error } = await supabase
        .from('aspirasi')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error
      alert('Status berhasil diupdate')
      fetchAspirasi()
    } catch (error) {
      console.error('Error:', error)
      alert('Gagal update status')
    }
  }

  async function handleDelete(id) {
    if (!confirm('Yakin ingin menghapus aspirasi ini?')) return

    try {
      const { error } = await supabase
        .from('aspirasi')
        .delete()
        .eq('id', id)

      if (error) throw error
      alert('Aspirasi berhasil dihapus')
      fetchAspirasi()
    } catch (error) {
      console.error('Error:', error)
      alert('Gagal menghapus data')
    }
  }

  function getStatusBadge(status) {
    const badges = {
      baru: { color: 'blue', text: 'BARU' },
      diproses: { color: 'gold', text: 'DIPROSES' },
      selesai: { color: 'green', text: 'SELESAI' }
    }
    const badge = badges[status] || badges.baru
    return <span className={`badge badge-${badge.color}`}>{badge.text}</span>
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <h1>Aspirasi Warga</h1>
            <p>Kelola konten website Karang Taruna</p>
          </div>
          <div className="admin-user">
            <div className="user-info">
              <div className="user-name">Admin KT</div>
              <div className="user-role">Administrator</div>
            </div>
            <div className="user-avatar">A</div>
          </div>
        </header>

        <div className="admin-content">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#333', marginBottom: '1.5rem' }}>
            Aspirasi Warga
          </h2>

          {aspirasi.length === 0 && (
            <div className="alert-info-box">
              <span className="info-icon">ℹ️</span>
              <p>
                Belum ada aspirasi yang masuk. Aspirasi dari warga akan muncul di sini.
              </p>
            </div>
          )}

          <div className="data-table-card">
            {loading ? (
              <p>Loading...</p>
            ) : aspirasi.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                <p style={{ fontSize: '1rem', margin: 0 }}>Belum ada data aspirasi</p>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>TANGGAL</th>
                      <th>NAMA</th>
                      <th>RW</th>
                      <th>KATEGORI</th>
                      <th>ISI ASPIRASI</th>
                      <th>STATUS</th>
                      <th>AKSI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aspirasi.map(item => (
                      <tr key={item.id}>
                        <td>{new Date(item.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{item.nama}</div>
                          {item.no_hp && <div style={{ fontSize: '0.85rem', color: '#666' }}>{item.no_hp}</div>}
                        </td>
                        <td>{item.rw.toUpperCase().replace('RW', 'RW ')}</td>
                        <td>{item.kategori}</td>
                        <td style={{ maxWidth: '300px' }}>
                          <div style={{ 
                            maxHeight: '60px', 
                            overflow: 'auto', 
                            fontSize: '0.9rem',
                            lineHeight: '1.4'
                          }}>
                            {item.isi}
                          </div>
                        </td>
                        <td>{getStatusBadge(item.status)}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {item.status !== 'diproses' && (
                              <button 
                                onClick={() => handleUpdateStatus(item.id, 'diproses')}
                                className="btn-icon"
                                style={{ 
                                  fontSize: '11px', 
                                  padding: '4px 10px',
                                  background: '#ff9800',
                                  color: 'white',
                                  border: 'none'
                                }}
                              >
                                Proses
                              </button>
                            )}
                            {item.status !== 'selesai' && (
                              <button 
                                onClick={() => handleUpdateStatus(item.id, 'selesai')}
                                className="btn-icon"
                                style={{ 
                                  fontSize: '11px', 
                                  padding: '4px 10px',
                                  background: '#4caf50',
                                  color: 'white',
                                  border: 'none'
                                }}
                              >
                                Selesai
                              </button>
                            )}
                            <button 
                              onClick={() => handleDelete(item.id)} 
                              className="btn-icon btn-delete"
                              style={{ fontSize: '11px', padding: '4px 10px' }}
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Mobile Card View */}
                <div className="mobile-data-cards">
                  {aspirasi.map(item => (
                    <div key={item.id} className="mobile-card">
                      <div className="mobile-card-header">
                        <div style={{ flex: 1 }}>
                          <div className="mobile-card-title">{item.nama}</div>
                          {item.no_hp && (
                            <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '2px' }}>
                              📞 {item.no_hp}
                            </div>
                          )}
                        </div>
                        {getStatusBadge(item.status)}
                      </div>
                      <div className="mobile-card-body">
                        <div className="mobile-card-row">
                          <span className="mobile-card-label">📅 Tanggal</span>
                          <span className="mobile-card-value">
                            {new Date(item.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        <div className="mobile-card-row">
                          <span className="mobile-card-label">🏘️ RW</span>
                          <span className="mobile-card-value">{item.rw.toUpperCase().replace('RW', 'RW ')}</span>
                        </div>
                        <div className="mobile-card-row">
                          <span className="mobile-card-label">📋 Kategori</span>
                          <span className="mobile-card-value">{item.kategori}</span>
                        </div>
                        <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                          <div className="mobile-card-label" style={{ marginBottom: '0.5rem' }}>💬 Isi Aspirasi</div>
                          <div style={{ 
                            fontSize: '0.85rem', 
                            color: '#333', 
                            lineHeight: '1.5',
                            maxHeight: '80px',
                            overflow: 'auto'
                          }}>
                            {item.isi}
                          </div>
                        </div>
                      </div>
                      <div className="mobile-card-actions">
                        {item.status !== 'diproses' && (
                          <button 
                            onClick={() => handleUpdateStatus(item.id, 'diproses')}
                            className="btn-icon"
                            style={{ 
                              flex: 1,
                              background: '#ff9800',
                              color: 'white',
                              border: 'none',
                              justifyContent: 'center'
                            }}
                          >
                            ⏳ Proses
                          </button>
                        )}
                        {item.status !== 'selesai' && (
                          <button 
                            onClick={() => handleUpdateStatus(item.id, 'selesai')}
                            className="btn-icon"
                            style={{ 
                              flex: 1,
                              background: '#4caf50',
                              color: 'white',
                              border: 'none',
                              justifyContent: 'center'
                            }}
                          >
                            ✅ Selesai
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(item.id)} 
                          className="btn-icon btn-delete"
                          style={{ flex: 1, justifyContent: 'center' }}
                        >
                          🗑️ Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
