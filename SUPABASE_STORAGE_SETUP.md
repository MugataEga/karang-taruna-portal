# Setup Supabase Storage untuk Upload Foto

## 📦 Langkah-langkah Setup:

### 1. Buat Storage Bucket di Supabase

1. Login ke [Supabase Dashboard](https://supabase.com/dashboard)
2. Pilih project Anda
3. Klik **Storage** di sidebar
4. Klik **New bucket**
5. Isi form:
   - **Name**: `galeri`
   - **Public bucket**: ✅ **Centang** (agar foto bisa diakses publik)
   - **File size limit**: 5MB (opsional)
   - **Allowed MIME types**: `image/*` (opsional)
6. Klik **Create bucket**

**Note**: Bucket `galeri` digunakan untuk semua foto (galeri dan pengurus)

### 2. Setup Storage Policies (RLS)

Setelah bucket dibuat, setup policies untuk akses:

#### Policy 1: Public Read (Semua orang bisa lihat foto)
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'galeri' );
```

#### Policy 2: Authenticated Upload (Hanya admin yang login bisa upload)
```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'galeri' 
  AND auth.role() = 'authenticated'
);
```

#### Policy 3: Authenticated Update (Hanya admin yang login bisa update)
```sql
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'galeri' 
  AND auth.role() = 'authenticated'
);
```

#### Policy 4: Authenticated Delete (Hanya admin yang login bisa delete)
```sql
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'galeri' 
  AND auth.role() = 'authenticated'
);
```

### 3. Update Database Schema

Tambahkan kolom `foto_url` ke table `galeri` dan `pengurus`:

```sql
-- Untuk table galeri
ALTER TABLE galeri 
ADD COLUMN IF NOT EXISTS foto_url TEXT;

-- Untuk table pengurus (foto profil)
ALTER TABLE pengurus 
ADD COLUMN IF NOT EXISTS foto_url TEXT;

-- Hapus kolom bg_gradient jika tidak dipakai lagi (opsional)
-- ALTER TABLE galeri DROP COLUMN IF EXISTS bg_gradient;
```

### 4. Cara Menggunakan

#### Upload Foto Galeri
1. **Login sebagai admin** di `/admin/login`
2. Buka **Galeri** di `/admin/galeri`
3. Klik **+ Upload Foto**
4. **Upload foto** (max 5MB, format: JPG, PNG, dll)
5. Tunggu hingga muncul preview dan pesan "✅ Foto berhasil diupload"
6. Isi **Judul**, **Deskripsi**, **Bulan & Tahun**, dll
7. Klik **Simpan**

#### Upload Foto Pengurus (Opsional)
1. **Login sebagai admin** di `/admin/login`
2. Buka **Struktur Organisasi** di `/admin/struktur-organisasi`
3. Klik **+ Tambah Pengurus**
4. **Upload foto** (max 2MB, format: JPG, PNG, dll) - **OPSIONAL**
5. Jika tidak upload foto, akan menggunakan inisial nama
6. Isi **Nama**, **Jabatan**, **Kontak**, dll
7. Klik **Simpan**

### 5. Fitur Upload Foto

#### Galeri
✅ **Validasi File Type** - Hanya menerima gambar (JPG, PNG, GIF, dll)
✅ **Validasi File Size** - Maksimal 5MB
✅ **Preview Image** - Menampilkan preview setelah upload
✅ **Unique Filename** - Generate nama file unik dengan timestamp
✅ **Public URL** - Otomatis mendapatkan public URL
✅ **Loading State** - Menampilkan status "Uploading..."
✅ **Error Handling** - Alert jika upload gagal
✅ **Required** - Foto wajib diupload untuk galeri

#### Pengurus (Foto Profil)
✅ **Validasi File Type** - Hanya menerima gambar (JPG, PNG, GIF, dll)
✅ **Validasi File Size** - Maksimal 2MB (lebih kecil untuk foto profil)
✅ **Preview Image** - Menampilkan preview circular setelah upload
✅ **Unique Filename** - Generate nama file unik dengan timestamp
✅ **Public URL** - Otomatis mendapatkan public URL
✅ **Loading State** - Menampilkan status "Uploading..."
✅ **Error Handling** - Alert jika upload gagal
✅ **Optional** - Foto opsional, jika tidak ada akan pakai inisial nama
✅ **Remove Photo** - Tombol untuk hapus foto yang sudah diupload
✅ **Fallback Avatar** - Inisial nama jika tidak ada foto

### 6. Struktur File di Storage

```
galeri/ (bucket)
├── galeri/
│   ├── 1234567890-abc123.jpg
│   ├── 1234567891-def456.png
│   └── ...
├── pengurus/
│   ├── 1234567892-ghi789.jpg
│   ├── 1234567893-jkl012.png
│   └── ...
```

**Note**: Semua foto disimpan dalam satu bucket `galeri`, dengan subfolder berbeda untuk galeri dan pengurus

### 7. Troubleshooting

#### Error: "new row violates row-level security policy"
- Pastikan Anda sudah login sebagai admin
- Cek policies di Storage → Policies
- Pastikan policy untuk INSERT sudah dibuat

#### Error: "The resource already exists"
- Bucket `galeri` sudah ada
- Gunakan bucket yang sudah ada atau ganti nama bucket

#### Foto tidak muncul
- Pastikan bucket `galeri` adalah **public bucket**
- Cek URL foto di database apakah valid
- Cek browser console untuk error CORS

#### Upload lambat
- Compress foto sebelum upload
- Gunakan format WebP untuk ukuran lebih kecil
- Pastikan koneksi internet stabil

### 8. Tips Optimasi

1. **Compress foto** sebelum upload untuk performa lebih baik
2. **Gunakan WebP** format untuk ukuran file lebih kecil
3. **Set max file size** di form untuk mencegah upload file besar
4. **Tambahkan loading indicator** untuk UX lebih baik
5. **Implementasi image optimization** di backend jika perlu

---

## 🎉 Selesai!

Fitur upload foto sudah siap digunakan. Admin bisa upload foto langsung dari browser tanpa perlu FTP atau file manager.
