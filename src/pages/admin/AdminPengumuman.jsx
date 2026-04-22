import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import AdminSidebar from '../../components/layout/AdminSidebar'
import '../../admin.css'

export default function AdminPengumuman() {
  const [pengumuman, setPengumuman] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  
  // Form state
  const [formData, setFormData] = useState({
    judul: '',
    isi: '',
    kategori: 'Info Kelurahan',
    tag_color: 'blue',
    rw: ['all'],
    icon_emoji: '📢',
    tanggal: new Date().toISOString().split('T')[0],
    is_pinned: false
  })

  useEffect(() => {
    fetchPengumuman()
  }, [])

  async function fetchPengumuman() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('pengumuman')
        .select('*')
        .order('tanggal', { ascending: false })
      
      if (error) throw error
      setPengumuman(data || [])
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
        // Update
        const { error } = await supabase
          .from('pengumuman')
          .update(formData)
          .eq('id', editingId)
        
        if (error) throw error
        alert('Pengumuman berhasil diupdate')
      } else {
        // Insert
        const { error } = await supabase
          .from('pengumuman')
          .insert([formData])
        
        if (error) throw error
        alert('Pengumuman berhasil ditambahkan')
      }
      
      resetForm()
      fetchPengumuman()
    } catch (error) {
      console.error('Error:', error)
      alert('Gagal menyimpan data')
    }
  }

  function handleEdit(item) {
    setFormData({
      judul: item.judul,
      isi: item.isi,
      kategori: item.kategori,
      tag_color: item.tag_color,
      rw: item.rw,
      icon_emoji: item.icon_emoji,
      tanggal: item.tanggal,
      is_pinned: item.is_pinned
    })
    setEditingId(item.id)
    setShowForm(true)
  }

  async function handleDelete(id) {
    if (!confirm('Yakin ingin menghapus pengumuman ini?')) return
    
    try {
      const { error } = await supabase
        .from('pengumuman')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      alert('Pengumuman berhasil dihapus')
      fetchPengumuman()
    } catch (error) {
      console.error('Error:', error)
      alert('Gagal menghapus data')
    }
  }

  function resetForm() {
    setFormData({
      judul: '',
      isi: '',
      kategori: 'Info Kelurahan',
      tag_color: 'blue',
      rw: ['all'],
      icon_emoji: '📢',
      tanggal: new Date().toISOString().split('T')[0],
      is_pinned: false
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
            <h1>Kelola Pengumuman</h1>
            <p>Kelola konten website Karang Taruna</p>
          </div>
        </header>

        <div className="admin-content">
          <div className="content-header">
            <h2>Kelola Pengumuman</h2>
            <button 
              onClick={() => setShowForm(!showForm)} 
              className="btn btn-add"
            >
              + Tambah Pengumuman
            </button>
          </div>

          {showForm && (
            <div className="admin-form-card">
              <h3>{editingId ? 'Edit Pengumuman' : 'Tambah Pengumuman Baru'}</h3>
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
                  <label>Isi *</label>
                  <textarea
                    name="isi"
                    value={formData.isi}
                    onChange={handleInputChange}
                    rows="4"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Kategori *</label>
                    <select name="kategori" value={formData.kategori} onChange={handleInputChange}>
                      <option>Info Kelurahan</option>
                      <option>Pembangunan</option>
                      <option>Pendidikan</option>
                      <option>Fasilitas</option>
                      <option>Lingkungan</option>
                      <option>Olahraga</option>
                      <option>Penting</option>
                      <option>Kelurahan</option>
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
                    <label>Icon Emoji</label>
                    <input
                      type="text"
                      name="icon_emoji"
                      value={formData.icon_emoji}
                      onChange={handleInputChange}
                      placeholder="📢"
                    />
                  </div>

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
                      name="is_pinned"
                      checked={formData.is_pinned}
                      onChange={handleInputChange}
                    />
                    {' '}Tampilkan di Beranda (Pinned)
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
            ) : pengumuman.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#666' }}>
                <p style={{ fontSize: '1rem', margin: 0 }}>Belum ada data pengumuman</p>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>JUDUL</th>
                      <th>KATEGORI</th>
                      <th>RW</th>
                      <th>TANGGAL</th>
                      <th>AKSI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pengumuman.map(item => (
                      <tr key={item.id}>
                        <td>{item.judul}</td>
                        <td>
                          <span className={`badge badge-${item.tag_color}`}>
                            {item.kategori.toUpperCase()}
                          </span>
                        </td>
                        <td>{getRWLabel(item.rw)}</td>
                        <td>{new Date(item.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                        <td>
                          <button onClick={() => handleEdit(item)} className="btn-icon btn-edit">
                            ✏️ Edit
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="btn-icon btn-delete">
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Mobile Card View */}
                <div className="mobile-data-cards">
                  {pengumuman.map(item => (
                    <div key={item.id} className="mobile-card">
                      <div className="mobile-card-header">
                        <div className="mobile-card-title">{item.judul}</div>
                        <span className={`badge badge-${item.tag_color}`}>
                          {item.kategori.toUpperCase()}
                        </span>
                      </div>
                      <div className="mobile-card-body">
                        <div className="mobile-card-row">
                          <span className="mobile-card-label">RW</span>
                          <span className="mobile-card-value">{getRWLabel(item.rw)}</span>
                        </div>
                        <div className="mobile-card-row">
                          <span className="mobile-card-label">Tanggal</span>
                          <span className="mobile-card-value">
                            {new Date(item.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
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
