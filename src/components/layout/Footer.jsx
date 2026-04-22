// components/layout/Footer.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
export default function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-grid">

          <div className="footer-brand">
            <div className="l1">Karang Taruna Duri Selatan</div>
            <p style={{ marginTop: '8px' }}>
              Kelurahan Duri Selatan, Kecamatan Tambora,<br />
              Kota Jakarta Barat.<br />
              Bergerak bersama untuk kemajuan masyarakat.
            </p>
          </div>

          <div className="footer-col">
            <h4>Menu</h4>
            <Link to="/">Beranda</Link>
            <Link to="/pengumuman">Pengumuman</Link>
            <Link to="/agenda">Agenda</Link>
            <Link to="/galeri">Galeri</Link>
            <Link to="/profil">Profil</Link>
          </div>

          <div className="footer-col">
            <h4>Wilayah</h4>
            {['001', '002', '003', '004', '005', '006'].map((rw) => (
              <p key={rw}>RW {rw}</p>
            ))}
          </div>

          <div className="footer-col">
            <h4>Kontak</h4>
            <p>📱 0898-9625-550</p>
            <p>📧 kt.duriselatan@gmail.com</p>
            <p>📍 Kelurahan Duri Selatan</p>
            <p style={{ marginTop: '10px' }}>
              🕐 Senin–Sabtu<br />
              &nbsp;&nbsp;&nbsp;&nbsp;09.00–17.00 WIB
            </p>
          </div>

        </div>

        <div className="footer-bottom">
          <p>© 2025 Karang Taruna Kelurahan Duri Selatan · Dibuat oleh Sie TIK Unit 05</p>
          <p>Duri Selatan Connect</p>
        </div>
      </div>
    </footer>
  )
}