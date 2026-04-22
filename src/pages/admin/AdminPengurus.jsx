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

                <div className="form-group">
                  <label>URL Foto (Opsional)</label>
                  <input
                    type="url"
                    name="foto_url"
                    value={formData.foto_url}
                    onChange={handleInputChange}
                    placeholder="https://example.com/foto.jpg"
                  />
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
            ) : pengurus.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
                Belum ada data pengurus untuk {getUnitLabel(selectedUnit)}
              </p>
            ) : (
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
                          <div className="user-avatar" style={{ width: '36px', height: '36px', fontSize: '0.9rem' }}>
                            {generateInitials(item.nama)}
                          </div>
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
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
