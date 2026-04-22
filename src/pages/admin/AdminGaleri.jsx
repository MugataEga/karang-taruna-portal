import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import AdminSidebar from '../../components/layout/AdminSidebar'
import '../../admin.css'

export default function AdminGaleri() {
  const [galeri, setGaleri] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  
  const [formData, setFormData] = useState({
    judul: '',
    deskripsi: '',
    rw: ['all'],
    bulan_tahun: '',
    bg_gradient: 'linear-gradient(135deg,#c8e6c9,#a5d6a7)',
    icon_emoji: '🖼',
    urutan: 0
  })

  useEffect(() => {
    fetchGaleri()
  }, [])

  async function fetchGaleri() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('galeri')
        .select('*')
        .order('urutan', { ascending: true })
      
      if (error) throw error
      setGaleri(data || [])
    } catch (error) {
      console.error('Error:', error)
      alert('Gagal memuat data')
    } finally {
      setLoading(false)
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'urutan' ? parseInt(value) || 0 : value
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
          .from('galeri')
          .update(formData)
          .eq('id', editingId)
        
        if (error) throw error
        alert('Galeri berhasil diupdate')
      } else {
        const { error } = await supabase
          .from('galeri')
          .insert([formData])
        
        if (error) throw error
        alert('Galeri berhasil ditambahkan')
      }
      
      resetForm()
      fetchGaleri()
    } catch (error) {
      console.error('Error:', error)
      alert('Gagal menyimpan data')
    }
  }

  function handleEdit(item) {
    setFormData({
      judul: item.judul,
      deskripsi: item.deskripsi || '',
      rw: item.rw,
      bulan_tahun: item.bulan_tahun || '',
      bg_gradient: item.bg_gradient,
      icon_emoji: item.icon_emoji,
      urutan: item.urutan
    })
    setEditingId(item.id)
    setShowForm(true)
  }

  async function handleDelete(id) {
    if (!confirm('Yakin ingin menghapus galeri ini?')) return
    
    try {
      const { error } = await supabase
        .from('galeri')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      alert('Galeri berhasil dihapus')
      fetchGaleri()
    } catch (error) {
      console.error('Error:', error)
      alert('Gagal menghapus data')
    }
  }

  function resetForm() {
    setFormData({
      judul: '',
      deskripsi: '',
      rw: ['all'],
      bulan_tahun: '',
      bg_gradient: 'linear-gradient(135deg,#c8e6c9,#a5d6a7)',
      icon_emoji: '🖼',
      urutan: 0
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
            <h1>Kelola Galeri</h1>
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
            <h2>Kelola Galeri</h2>
            <button 
              onClick={() => setShowForm(!showForm)} 
              className="btn btn-add"
            >
              + Upload Foto
            </button>
          </div>

          {showForm && (
            <div className="admin-form-card">
              <h3>{editingId ? 'Edit Galeri' : 'Tambah Galeri Baru'}</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Judul *</label>
                  <input
                    type="text"
                    name="judul"
                    value={formData.judul}
                    onChange={handleInputChange}
                    required
                    placeholder="Kerja Bakti RW 001"
                  />
                </div>

                <div className="form-group">
                  <label>Deskripsi</label>
                  <input
                    type="text"
                    name="deskripsi"
                    value={formData.deskripsi}
                    onChange={handleInputChange}
                    placeholder="RW 001 · April 2025"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Bulan & Tahun</label>
                    <input
                      type="text"
                      name="bulan_tahun"
                      value={formData.bulan_tahun}
                      onChange={handleInputChange}
                      placeholder="April 2025"
                    />
                  </div>

                  <div className="form-group">
                    <label>Urutan</label>
                    <input
                      type="number"
                      name="urutan"
                      value={formData.urutan}
                      onChange={handleInputChange}
                      min="0"
                    />
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
                      placeholder="🖼"
                    />
                  </div>

                  <div className="form-group">
                    <label>Background Gradient</label>
                    <input
                      type="text"
                      name="bg_gradient"
                      value={formData.bg_gradient}
                      onChange={handleInputChange}
                      placeholder="linear-gradient(135deg,#c8e6c9,#a5d6a7)"
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

          <div className="galeri-grid">
            {loading ? (
              <p>Loading...</p>
            ) : (
              galeri.map(item => (
                <div key={item.id} className="galeri-card">
                  <div 
                    className="galeri-image"
                    style={{ background: item.bg_gradient }}
                  >
                    <span className="galeri-icon">{item.icon_emoji}</span>
                  </div>
                  <div className="galeri-info">
                    <h4>{item.judul}</h4>
                    <p>{getRWLabel(item.rw)} · {item.bulan_tahun}</p>
                    <div className="action-buttons">
                      <button onClick={() => handleEdit(item)} className="btn-icon btn-edit">
                        ✏️ Edit
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="btn-icon btn-delete">
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
