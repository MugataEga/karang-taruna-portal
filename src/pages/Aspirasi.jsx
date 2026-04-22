// pages/Aspirasi.jsx
import { useState } from 'react'
import { supabase } from '../lib/supabase'

const RW_OPTIONS = ['001', '002', '003', '004', '005', '006']

const KATEGORI_OPTIONS = [
  'Saran Program Kegiatan',
  'Keluhan Fasilitas',
  'Pertanyaan Organisasi',
  'Usulan Kerja Sama',
  'Laporan Sosial',
  'Lainnya',
]

const INITIAL_FORM = {
  nama: '',
  no_hp: '',
  rw: '',
  kategori: '',
  isi: '',
}

export default function Aspirasi() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    // Validasi field wajib
    if (!form.nama || !form.rw || !form.kategori || !form.isi) {
      setError('Harap isi semua field yang wajib (*)')
      return
    }

    setLoading(true)

    const { error: supabaseError } = await supabase
      .from('aspirasi')
      .insert([{
        nama:     form.nama,
        no_hp:    form.no_hp || null,
        rw:       form.rw,
        kategori: form.kategori,
        isi:      form.isi,
        status:   'baru',
      }])

    setLoading(false)

    if (supabaseError) {
      setError('Gagal mengirim aspirasi. Silakan coba lagi.')
      console.error(supabaseError)
      return
    }

    setSubmitted(true)
  }

  function handleReset() {
    setForm(INITIAL_FORM)
    setSubmitted(false)
    setError(null)
  }

  return (
    <>
      {/* Banner Header */}
      <div className="page-banner-aspirasi">
        <div className="page-banner-inner">
          <h1>Kotak Aspirasi</h1>
          <p>Sampaikan saran, kritik, atau pertanyaan Anda kepada Karang Taruna Duri Selatan</p>
        </div>
      </div>

      <div className="content-wrap">
        <div className="aspirasi-wrap">

          {/* ── Info Panel ── */}
          <div className="aspirasi-info">
            <h3>Suara Anda Penting</h3>
            <p>Karang Taruna Duri Selatan terbuka untuk menerima setiap masukan dari warga demi kemajuan bersama.</p>
            <ul>
              <li>Saran untuk program kegiatan</li>
              <li>Keluhan fasilitas lingkungan</li>
              <li>Pertanyaan seputar organisasi</li>
              <li>Usulan kerja sama</li>
              <li>Laporan permasalahan sosial</li>
            </ul>
            <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,.15)' }}>
              <p style={{ fontSize: '12px', marginBottom: '6px', color: 'rgba(255,255,255,.5)' }}>
                Bisa juga hubungi kami via
              </p>
              <p>📱 WhatsApp: <strong style={{ color: 'var(--gold-light)' }}>0898-9625-550</strong></p>
              <p style={{ marginTop: '6px' }}>📧 Email: <strong style={{ color: 'var(--gold-light)' }}>kt.duriselatan@gmail.com</strong></p>
            </div>
          </div>

          {/* ── Form Panel ── */}
          <div className="aspirasi-form">
            <h3>Kirim Aspirasi</h3>

            {/* Success State */}
            {submitted ? (
              <div className="form-success">
                <div className="checkmark">✅</div>
                <h4>Aspirasi Terkirim!</h4>
                <p>Terima kasih telah menyampaikan aspirasi Anda. Pengurus Karang Taruna akan menindaklanjuti dalam 3×24 jam.</p>
                <button
                  onClick={handleReset}
                  style={{
                    marginTop: '16px',
                    padding: '8px 24px',
                    borderRadius: '20px',
                    border: '1.5px solid var(--green-mid)',
                    background: 'transparent',
                    color: 'var(--green-mid)',
                    fontFamily: "'Karla', sans-serif",
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Kirim Lagi
                </button>
              </div>
            ) : (
              /* Form State */
              <form onSubmit={handleSubmit} noValidate>

                {error && (
                  <p style={{ color: 'salmon', marginBottom: '12px', fontSize: '14px' }}>
                    ⚠️ {error}
                  </p>
                )}

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="nama">Nama Lengkap *</label>
                    <input
                      id="nama"
                      name="nama"
                      type="text"
                      placeholder="Nama Anda"
                      value={form.nama}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="no_hp">No. HP / WhatsApp</label>
                    <input
                      id="no_hp"
                      name="no_hp"
                      type="text"
                      placeholder="08xx-xxxx-xxxx"
                      value={form.no_hp}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="rw">Wilayah RW *</label>
                    <select
                      id="rw"
                      name="rw"
                      value={form.rw}
                      onChange={handleChange}
                    >
                      <option value="">-- Pilih RW --</option>
                      {RW_OPTIONS.map((rw) => (
                        <option key={rw} value={`rw${rw}`}>RW {rw}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="kategori">Kategori *</label>
                    <select
                      id="kategori"
                      name="kategori"
                      value={form.kategori}
                      onChange={handleChange}
                    >
                      <option value="">-- Pilih Kategori --</option>
                      {KATEGORI_OPTIONS.map((kat) => (
                        <option key={kat} value={kat}>{kat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="isi">Isi Aspirasi *</label>
                  <textarea
                    id="isi"
                    name="isi"
                    placeholder="Tuliskan aspirasi, saran, atau pertanyaan Anda di sini..."
                    value={form.isi}
                    onChange={handleChange}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-submit"
                  disabled={loading}
                >
                  {loading ? 'Mengirim...' : 'Kirim Aspirasi ✉'}
                </button>

              </form>
            )}
          </div>

        </div>
      </div>
    </>
  )
}