-- Fix Agenda Dates - Update ke tanggal mendatang
-- Jalankan di Supabase SQL Editor

-- Update agenda yang sudah lewat ke tanggal mendatang
UPDATE agenda 
SET tanggal = CURRENT_DATE + INTERVAL '5 days'
WHERE judul = 'Kerja Bakti Massal RW 002';

UPDATE agenda 
SET tanggal = CURRENT_DATE + INTERVAL '11 days'
WHERE judul = 'Turnamen Futsal Antar-RW';

UPDATE agenda 
SET tanggal = CURRENT_DATE + INTERVAL '18 days'
WHERE judul = 'Workshop Kewirausahaan Pemuda';

UPDATE agenda 
SET tanggal = CURRENT_DATE + INTERVAL '13 days'
WHERE judul = 'Rapat Koordinasi Bulanan RW 001';

UPDATE agenda 
SET tanggal = CURRENT_DATE + INTERVAL '21 days'
WHERE judul = 'Posyandu Balita & Lansia RW 003';

UPDATE agenda 
SET tanggal = CURRENT_DATE + INTERVAL '23 days'
WHERE judul = 'Perayaan Hari Jadi Kelurahan ke-42';

-- Atau tambah agenda baru
INSERT INTO agenda (judul, deskripsi, kategori, tag_color, rw, tanggal, waktu, lokasi, is_featured) VALUES
  (
    'Senam Pagi Bersama',
    'Senam pagi rutin bersama warga RW 001 setiap hari Minggu.',
    'Olahraga', 'green', '{"all","rw001"}',
    CURRENT_DATE + INTERVAL '3 days', '06.30 WIB', 'Lapangan RW 001', true
  ),
  (
    'Bazar Ramadan',
    'Bazar makanan dan minuman untuk berbuka puasa bersama.',
    'Event', 'gold', '{"all","rw002","rw003"}',
    CURRENT_DATE + INTERVAL '7 days', '15.00 WIB', 'Jl. Melati RW 002', true
  ),
  (
    'Donor Darah',
    'Kegiatan donor darah bekerjasama dengan PMI Jakarta Barat.',
    'Kesehatan', 'red', '{"all","rw001","rw002","rw003","rw004","rw005","rw006"}',
    CURRENT_DATE + INTERVAL '14 days', '08.00 WIB', 'Aula Kelurahan', true
  );

-- Cek hasil
SELECT judul, tanggal, is_featured 
FROM agenda 
WHERE tanggal >= CURRENT_DATE 
ORDER BY tanggal ASC;
