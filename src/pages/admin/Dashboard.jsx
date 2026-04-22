import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import AdminSidebar from '../../components/layout/AdminSidebar'
import '../../admin.css'

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    pengumuman: 0,
    agenda: 0,
    galeri: 0,
    aspirasi: 0
  })
  const [activities, setActivities] = useState([])

  useEffect(() => {
    fetchStats()
    fetchActivities()
  }, [])

  async function fetchStats() {
    try {
      const [pengumumanRes, agendaRes, galeriRes, aspirasiRes] = await Promise.all([
        supabase.from('pengumuman').select('id', { count: 'exact', head: true }),
        supabase.from('agenda').select('id', { count: 'exact', head: true }),
        supabase.from('galeri').select('id', { count: 'exact', head: true }),
        supabase.from('aspirasi').select('id', { count: 'exact', head: true })
      ])

      setStats({
        pengumuman: pengumumanRes.count || 0,
        agenda: agendaRes.count || 0,
        galeri: galeriRes.count || 0,
        aspirasi: aspirasiRes.count || 0
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
      // Set default values even on error
      setStats({
        pengumuman: 0,
        agenda: 0,
        galeri: 0,
        aspirasi: 0
      })
    }
  }

  async function fetchActivities() {
    // Simulasi aktivitas terbaru - bisa diganti dengan data real dari database
    setActivities([
      {
        waktu: new Date().toLocaleString('id-ID', { 
          day: '2-digit', 
          month: 'short', 
          year: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        aktivitas: 'Login ke admin panel',
        user: user?.email?.split('@')[0] || 'Admin KT'
      }
    ])
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <h1>Dashboard</h1>
            <p>Kelola konten website Karang Taruna</p>
          </div>
        </header>

        <div className="admin-content">
          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#fce4ec' }}>
                <span style={{ color: '#e91e63' }}>📢</span>
              </div>
              <div className="stat-info">
                <h3>{stats.pengumuman}</h3>
                <p>Total Pengumuman</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#e3f2fd' }}>
                <span style={{ color: '#2196f3' }}>📅</span>
              </div>
              <div className="stat-info">
                <h3>{stats.agenda}</h3>
                <p>Agenda Kegiatan</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#fff9c4' }}>
                <span style={{ color: '#f57f17' }}>🖼</span>
              </div>
              <div className="stat-info">
                <h3>{stats.galeri}</h3>
                <p>Foto Galeri</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#f3e5f5' }}>
                <span style={{ color: '#9c27b0' }}>✉️</span>
              </div>
              <div className="stat-info">
                <h3>{stats.aspirasi}</h3>
                <p>Aspirasi Masuk</p>
              </div>
            </div>
          </div>

          {/* Welcome Section */}
          <div className="welcome-section">
            <h2>Selamat Datang di Admin Panel</h2>
            <p>
              Gunakan menu di sebelah kiri untuk mengelola konten website Karang Taruna Duri Selatan. 
              Anda dapat menambah, mengedit, atau menghapus pengumuman, agenda, galeri, dan struktur organisasi.
            </p>
            <div className="info-box">
              <span className="info-icon">ℹ️</span>
              <p>
                <strong>Catatan:</strong> Ini adalah simulasi admin panel. Semua perubahan hanya tersimpan di browser dan akan hilang saat halaman di-refresh.
              </p>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="activities-section">
            <h2>Aktivitas Terbaru</h2>
            <div className="activities-table">
              <table>
                <thead>
                  <tr>
                    <th>WAKTU</th>
                    <th>AKTIVITAS</th>
                    <th>USER</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((activity, index) => (
                    <tr key={index}>
                      <td>{activity.waktu}</td>
                      <td>{activity.aktivitas}</td>
                      <td>{activity.user}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
