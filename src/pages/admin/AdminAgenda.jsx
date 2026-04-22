import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import AdminSidebar from '../../components/layout/AdminSidebar'
import '../../admin.css'

export default function AdminAgenda() {
  const [agenda, setAgenda] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  
  const [formData, setFormData] = useState({
    judul: '',
    deskripsi: '',
    kategori: 'Sosial',
    tag_color: 'blue',
    rw: ['all'],
    tanggal: new Date().toISOString().split('T')[0],
    waktu: '',
    lokasi: '',
    is_featured: false
  })

  useEffect(() => {
    fetchAgenda()
  }, [])

  async function fetchAgenda() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('agenda')
        .select('*')
        .order('tanggal', { ascending: true })
      
      if (error) throw error
      setAgenda(data || [])
    } catch (error) {
      console.error('Error:', error)
      alert('Gagal memuat data')
    } finally {
      setLoading(false)
    }
  }

  function handleInputChange(e) {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  function handleRWChange(e) {
    const options = Array.from(e.target.selectedOptions, option => option.value)
    setFormData(prev => ({ ...prev, rw: options }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    
    try {
      if (editingId) {
        const { error } = await supabase
          .from('agenda')
          .update(formData)
          .eq('id', editingId)
        
        if (error) throw error
        alert('Agenda berhasil diupdate')
      } else {
        const { error } = await supabase
          .from('agenda')
          .insert([formData])
        
        if (error) throw error
        alert('Agenda berhasil ditambahkan')
      }
      
      resetForm()
      fetchAgenda()
    } catch (error) {
      console.error('Error:', error)
      alert('Gagal menyimpan data')
    }
  }

  function handleEdit(item) {
    setFormData({
      judul: item.judul,
      deskripsi: item.deskripsi || '',
      kategori: item.kategori,
      tag_color: item.tag_color,
      rw: item.rw,
      tanggal: item.tanggal,
      waktu: item.waktu || '',
      lokasi: item.lokasi || '',
      is_featured: item.is_featured
    })
    setEditingId(item.id)
    setShowForm(true)
  }

  async function handleDelete(id) {
    if (!confirm('Yakin ingin menghapus agenda ini?')) return
    
    try {
      const { error } = await supabase
        .from('agenda')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      alert('Agenda berhasil dihapus')
      fetchAgenda()
    } catch (error) {
      console.error('Error:', error)
      alert('Gagal menghapus data')
    }
  }

  function resetForm() {
    setFormData({
      judul: '',
      deskripsi: '',
      kategori: 'Sosial',
      tag_color: 'blue',
      rw: ['all'],
      tanggal: new Date().toISOString().split('T')[0],
      waktu: '',
      lokasi: '',
      is_featured: false
    })
    setEditingId(null)
    setShowForm(false)
  }

  const getRWLabel = (rwArray) => {
    if (rwArray.includes('all')) return 'Semua RW'
    return rwArray.map(rw => rw.replace('rw', 'RW ')).join(', ')
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <h1>Kelola Agenda</h1>
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
          <div className="content-header">
            <h2>Kelola Agenda</h2>
            <button 
              onClick={() => setShowForm(!showForm)} 
              className="btn btn-add"
            >
              + Tambah Agenda
            </button>
          </div>

          {showForm && (
            <div className="admin-form-card">
              <h3>{editingId ? 'Edit Agenda' : 'Tambah Agenda Baru'}</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Judul *</label>
                  <input
                    type="text"
                    name="judul"
                    value={formData.judul}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Deskripsi</label>
                  <textarea
                    name="deskripsi"
                    value={formData.deskripsi}
                    onChange={handleInputChange}
                    rows="3"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Kategori *</label>
                    <select name="kategori" value={formData.kategori} onChange={handleInputChange}>
                      <option>Sosial</option>
                      <option>Event</option>
                      <option>Pelatihan</option>
                      <option>Kesehatan</option>
                      <option>Olahraga</option>
                      <option>Pendidikan</option>
                      <option>Lingkungan</option>
                      <option>Organisasi</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Warna Tag *</label>
                    <select name="tag_color" value={formData.tag_color} onChange={handleInputChange}>
                      <option value="blue">Blue</option>
                      <option value="gold">Gold</option>
                      <option value="green">Green</option>
                      <option value="red">Red</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Tanggal *</label>
                    <input
                      type="date"
                      name="tanggal"
                      value={formData.tanggal}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Waktu</label>
                    <input
                      type="text"
                      name="waktu"
                      value={formData.waktu}
                      onChange={handleInputChange}
                      placeholder="07.00 WIB"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Lokasi</label>
                  <input
                    type="text"
                    name="lokasi"
                    value={formData.lokasi}
                    onChange={handleInputChange}
                    placeholder="Jl. Melati RW 002"
                  />
                </div>

                <div className="form-group">
                  <label>Wilayah RW * (Ctrl+Click untuk pilih banyak)</label>
                  <select 
                    multiple 
                    value={formData.rw} 
                    onChange={handleRWChange}
                    style={{ height: '120px' }}
                  >
                    <option value="all">Semua Wilayah</option>
                    <option value="rw001">RW 001</option>
                    <option value="rw002">RW 002</option>
                    <option value="rw003">RW 003</option>
                    <option value="rw004">RW 004</option>
                    <option value="rw005">RW 005</option>
                    <option value="rw006">RW 006</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      name="is_featured"
                      checked={formData.is_featured}
                      onChange={handleInputChange}
                    />
                    {' '}Tampilkan di Beranda (Featured)
                  </label>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    {editingId ? 'Update' : 'Simpan'}
                  </button>
                  <button type="button" onClick={resetForm} className="btn btn-secondary">
                    Batal
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="data-table-card">
            {loading ? (
              <p>Loading...</p>
            ) : agenda.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#666' }}>
                <p style={{ fontSize: '1rem', margin: 0 }}>Belum ada data agenda</p>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>JUDUL KEGIATAN</th>
                      <th>TANGGAL</th>
                      <th>WAKTU</th>
                      <th>LOKASI</th>
                      <th>RW</th>
                      <th>AKSI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agenda.map(item => (
                      <tr key={item.id}>
                        <td>{item.judul}</td>
                        <td>{new Date(item.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                        <td>{item.waktu || '—'}</td>
                        <td>{item.lokasi || '—'}</td>
                        <td>{getRWLabel(item.rw)}</td>
                        <td>
                          <div className="action-buttons">
                            <button onClick={() => handleEdit(item)} className="btn-icon btn-edit">
                              ✏️ Edit
                            </button>
                            <button onClick={() => handleDelete(item.id)} className="btn-icon btn-delete">
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
                  {agenda.map(item => (
                    <div key={item.id} className="mobile-card">
                      <div className="mobile-card-header">
                        <div className="mobile-card-title">{item.judul}</div>
                      </div>
                      <div className="mobile-card-body">
                        <div className="mobile-card-row">
                          <span className="mobile-card-label">📅 Tanggal</span>
                          <span className="mobile-card-value">
                            {new Date(item.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        <div className="mobile-card-row">
                          <span className="mobile-card-label">🕐 Waktu</span>
                          <span className="mobile-card-value">{item.waktu || '—'}</span>
                        </div>
                        <div className="mobile-card-row">
                          <span className="mobile-card-label">📍 Lokasi</span>
                          <span className="mobile-card-value">{item.lokasi || '—'}</span>
                        </div>
                        <div className="mobile-card-row">
                          <span className="mobile-card-label">🏘️ RW</span>
                          <span className="mobile-card-value">{getRWLabel(item.rw)}</span>
                        </div>
                      </div>
                      <div className="mobile-card-actions">
                        <button onClick={() => handleEdit(item)} className="btn-icon btn-edit">
                          ✏️ Edit
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="btn-icon btn-delete">
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
