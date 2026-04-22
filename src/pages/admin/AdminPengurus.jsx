import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import AdminSidebar from '../../components/layout/AdminSidebar'
import '../../admin.css'

export default function AdminPengurus() {
  const [pengurus, setPengurus] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [selectedUnit, setSelectedUnit] = useState('kelurahan')
  const [uploading, setUploading] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    nama: '',
    jabatan: '',
    unit: 'kelurahan',
    kontak: '',
    foto_url: '',
    urutan: 0
  })

  useEffect(() => {
    fetchPengurus()
  }, [selectedUnit])

  async function fetchPengurus() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('pengurus')
        .select('*')
        .eq('unit', selectedUnit)
        .order('urutan', { ascending: true })
      
      if (error) throw error
      setPengurus(data || [])
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
      [name]: value
    }))
  }

  function generateInitials(nama) {
    return nama
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  async function handleFileUpload(e) {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('File harus berupa gambar (JPG, PNG, dll)')
      return
    }

    // Validate file size (max 2MB for profile photos)
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file maksimal 2MB')
      return
    }

    setUploading(true)
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `pengurus/${fileName}`

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('galeri')
        .upload(filePath, file)

      if (error) throw error

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('galeri')
        .getPublicUrl(filePath)

      // Update form data with URL
      setFormData(prev => ({ ...prev, foto_url: publicUrl }))
      alert('Foto berhasil diupload!')
    } catch (error) {
      console.error('Error uploading:', error)
      alert('Gagal upload foto: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    
    try {
      const dataToSave = {
        ...formData,
        unit: selectedUnit
      }

      if (editingId) {
        // Update
        const { error } = await supabase
          .from('pengurus')
          .update(dataToSave)
          .eq('id', editingId)
        
        if (error) throw error
        alert('Pengurus berhasil diupdate')
      } else {
        // Insert
        const { error } = await supabase
          .from('pengurus')
          .insert([dataToSave])
        
        if (error) throw error
        alert('Pengurus berhasil ditambahkan')
      }
      
      resetForm()
      fetchPengurus()
    } catch (error) {
      console.error('Error:', error)
      alert('Gagal menyimpan data')
    }
  }

  function handleEdit(item) {
    setFormData({
      nama: item.nama,
      jabatan: item.jabatan,
      unit: item.unit,
      kontak: item.kontak,
      foto_url: item.foto_url || '',
      urutan: item.urutan
    })
    setEditingId(item.id)
    setShowForm(true)
  }

  async function handleDelete(id) {
    if (!confirm('Yakin ingin menghapus pengurus ini?')) return
    
    try {
      const { error } = await supabase
        .from('pengurus')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      alert('Pengurus berhasil dihapus')
      fetchPengurus()
    } catch (error) {
      console.error('Error:', error)
      alert('Gagal menghapus data')
    }
  }

  function resetForm() {
    setFormData({
      nama: '',
      jabatan: '',
      unit: selectedUnit,
      kontak: '',
      foto_url: '',
      urutan: 0
    })
    setEditingId(null)
    setShowForm(false)
  }

  const getUnitLabel = (unit) => {
    if (unit === 'kelurahan') return 'Kelurahan'
    return unit.replace('rw', 'RW ')
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <h1>Struktur Organisasi</h1>
            <p>Kelola pengurus Karang Taruna</p>
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
          <div className="alert-info-box">
            <span className="info-icon">ℹ️</span>
            <p>
              <strong>Kelola Struktur Organisasi:</strong> Pilih unit (Kelurahan atau RW) untuk mengelola pengurus di wilayah tersebut.
            </p>
          </div>

          <div className="content-header">
            <h2>Kelola Pengurus</h2>
            <button 
              onClick={() => setShowForm(!showForm)} 
              className="btn btn-add"
            >
              + Tambah Pengurus
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="filter-tabs">
            <button 
              className={`filter-tab ${selectedUnit === 'kelurahan' ? 'active' : ''}`}
              onClick={() => setSelectedUnit('kelurahan')}
            >
              Kelurahan
            </button>
            <button 
              className={`filter-tab ${selectedUnit === 'rw001' ? 'active' : ''}`}
              onClick={() => setSelectedUnit('rw001')}
            >
              RW 001
            </button>
            <button 
              className={`filter-tab ${selectedUnit === 'rw002' ? 'active' : ''}`}
              onClick={() => setSelectedUnit('rw002')}
            >
              RW 002
            </button>
            <button 
              className={`filter-tab ${selectedUnit === 'rw003' ? 'active' : ''}`}
              onClick={() => setSelectedUnit('rw003')}
            >
              RW 003
            </button>
            <button 
              className={`filter-tab ${selectedUnit === 'rw004' ? 'active' : ''}`}
              onClick={() => setSelectedUnit('rw004')}
            >
              RW 004
            </button>
            <button 
              className={`filter-tab ${selectedUnit === 'rw005' ? 'active' : ''}`}
              onClick={() => setSelectedUnit('rw005')}
            >
              RW 005
            </button>
            <button 
              className={`filter-tab ${selectedUnit === 'rw006' ? 'active' : ''}`}
              onClick={() => setSelectedUnit('rw006')}
            >
              RW 006
            </button>
          </div>

          {showForm && (
            <div className="admin-form-card">
              <h3>{editingId ? 'Edit Pengurus' : 'Tambah Pengurus Baru'}</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Upload Foto (Opsional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    style={{ 
                      padding: '0.5rem',
                      border: '2px dashed var(--border)',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  />
                  <small style={{ color: '#666', fontSize: '0.85rem', display: 'block', marginTop: '0.5rem' }}>
                    Max 2MB. Jika tidak diupload, akan menggunakan inisial nama.
                  </small>
                  {uploading && (
                    <small style={{ color: '#ff9800', display: 'block', marginTop: '0.5rem' }}>
                      ⏳ Uploading foto...
                    </small>
                  )}
                  {formData.foto_url && (
                    <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img 
                        src={formData.foto_url} 
                        alt="Preview" 
                        style={{ 
                          width: '80px', 
                          height: '80px', 
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '2px solid var(--border)'
                        }} 
                      />
                      <div>
                        <div style={{ fontSize: '0.85rem', color: '#4caf50', fontWeight: 600 }}>
                          ✅ Foto berhasil diupload
                        </div>
                        <button 
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, foto_url: '' }))}
                          style={{
                            fontSize: '0.8rem',
                            color: '#dc2626',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            marginTop: '0.25rem',
                            textDecoration: 'underline'
                          }}
                        >
                          Hapus foto
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Nama Lengkap *</label>
                  <input
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleInputChange}
                    required
                  />
                  {formData.nama && (
                    <small style={{ color: '#666', fontSize: '0.85rem' }}>
                      Inisial: {generateInitials(formData.nama)}
                    </small>
                  )}
                </div>

                <div className="form-group">
                  <label>Jabatan *</label>
                  <input
                    type="text"
                    name="jabatan"
                    value={formData.jabatan}
                    onChange={handleInputChange}
                    placeholder="Contoh: Ketua, Sekretaris, Bendahara"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Kontak (Opsional)</label>
                    <input
                      type="text"
                      name="kontak"
                      value={formData.kontak}
                      onChange={handleInputChange}
                      placeholder="08123456789"
                    />
                  </div>

                  <div className="form-group">
                    <label>Urutan Tampilan</label>
                    <input
                      type="number"
                      name="urutan"
                      value={formData.urutan}
                      onChange={handleInputChange}
                      min="0"
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary" disabled={uploading}>
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
            ) : pengurus.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#666' }}>
                <p style={{ fontSize: '1rem', margin: 0 }}>
                  Belum ada data pengurus untuk {getUnitLabel(selectedUnit)}
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>NAMA</th>
                      <th>JABATAN</th>
                      <th>WILAYAH</th>
                      <th>KONTAK</th>
                      <th>AKSI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pengurus.map(item => (
                      <tr key={item.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {item.foto_url ? (
                              <img 
                                src={item.foto_url} 
                                alt={item.nama}
                                style={{
                                  width: '36px',
                                  height: '36px',
                                  borderRadius: '50%',
                                  objectFit: 'cover',
                                  border: '2px solid var(--border)'
                                }}
                              />
                            ) : (
                              <div className="user-avatar" style={{ width: '36px', height: '36px', fontSize: '0.9rem' }}>
                                {generateInitials(item.nama)}
                              </div>
                            )}
                            <span>{item.nama}</span>
                          </div>
                        </td>
                        <td>{item.jabatan}</td>
                        <td>{getUnitLabel(item.unit)}</td>
                        <td>{item.kontak || '-'}</td>
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
                  {pengurus.map(item => (
                    <div key={item.id} className="mobile-card">
                      <div className="mobile-card-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                          {item.foto_url ? (
                            <img 
                              src={item.foto_url} 
                              alt={item.nama}
                              style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                border: '2px solid var(--border)'
                              }}
                            />
                          ) : (
                            <div className="user-avatar" style={{ width: '40px', height: '40px', fontSize: '1rem' }}>
                              {generateInitials(item.nama)}
                            </div>
                          )}
                          <div style={{ flex: 1 }}>
                            <div className="mobile-card-title">{item.nama}</div>
                            <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '2px' }}>
                              {item.jabatan}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mobile-card-body">
                        <div className="mobile-card-row">
                          <span className="mobile-card-label">🏘️ Wilayah</span>
                          <span className="mobile-card-value">{getUnitLabel(item.unit)}</span>
                        </div>
                        <div className="mobile-card-row">
                          <span className="mobile-card-label">📞 Kontak</span>
                          <span className="mobile-card-value">{item.kontak || '-'}</span>
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
