-- ============================================================
--  ADD MISSING COLUMNS TO PENGURUS TABLE
--  Menambahkan kolom foto_url dan kontak
--  Update kolom inisial menjadi nullable
-- ============================================================

-- Tambah kolom foto_url (opsional, untuk foto profil)
ALTER TABLE pengurus 
ADD COLUMN IF NOT EXISTS foto_url TEXT;

-- Tambah kolom kontak (opsional, untuk nomor HP/WA)
ALTER TABLE pengurus 
ADD COLUMN IF NOT EXISTS kontak TEXT;

-- Update kolom inisial menjadi nullable (tidak wajib)
ALTER TABLE pengurus 
ALTER COLUMN inisial DROP NOT NULL;

-- Verifikasi kolom sudah ditambahkan
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns 
-- WHERE table_name = 'pengurus';
