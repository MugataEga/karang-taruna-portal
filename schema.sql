-- ============================================================
--  SCHEMA.SQL — Karang Taruna Duri Selatan
--  Supabase / PostgreSQL
--  Sie TIK Unit 05
-- ============================================================


-- ============================================================
--  EXTENSIONS
-- ============================================================

create extension if not exists "uuid-ossp";


-- ============================================================
--  DROP TABLES (urutan terbalik karena foreign key)
--  Uncomment kalau mau reset schema dari awal
-- ============================================================

-- drop table if exists aspirasi      cascade;
-- drop table if exists galeri        cascade;
-- drop table if exists agenda        cascade;
-- drop table if exists pengumuman    cascade;
-- drop table if exists pengurus      cascade;
-- drop table if exists site_stats    cascade;
-- drop table if exists admin_users   cascade;


-- ============================================================
--  1. SITE_STATS
--  Angka di stats bar Beranda — selalu 1 baris
-- ============================================================

create table site_stats (
  id          int         primary key default 1,
  rw_aktif    int         not null default 6,
  kegiatan    int         not null default 24,
  anggota     text        not null default '180+',
  warga       text        not null default '2.400+',
  updated_at  timestamptz not null default now(),

  constraint site_stats_single_row check (id = 1)
);

-- Seed: satu baris default
insert into site_stats (id) values (1)
  on conflict (id) do nothing;


-- ============================================================
--  2. PENGUMUMAN
-- ============================================================

create table pengumuman (
  id          uuid        primary key default gen_random_uuid(),
  judul       text        not null,
  isi         text        not null,

  -- Kategori: 'Info Kelurahan' | 'Pembangunan' | 'Pendidikan'
  --           'Fasilitas' | 'Lingkungan' | 'Olahraga' | 'Penting' | 'Kelurahan'
  kategori    text        not null,

  -- Warna tag: 'blue' | 'gold' | 'green' | 'red'
  tag_color   text        not null default 'blue',

  -- Array RW: ['all'] untuk semua, atau ['rw001','rw003'] untuk spesifik
  rw          text[]      not null default '{"all"}',

  -- Emoji icon untuk card (sementara sebelum ada foto)
  icon_emoji  text        not null default '📢',

  tanggal     date        not null,
  is_pinned   boolean     not null default false,  -- untuk tampil di beranda
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Index untuk filter & sort
create index idx_pengumuman_tanggal on pengumuman (tanggal desc);
create index idx_pengumuman_rw      on pengumuman using gin (rw);
create index idx_pengumuman_pinned  on pengumuman (is_pinned) where is_pinned = true;

-- Seed Data
insert into pengumuman (judul, isi, kategori, tag_color, rw, icon_emoji, tanggal, is_pinned) values
  (
    'Jadwal Posyandu Bulan Mei 2025',
    'Posyandu balita dan lansia akan dilaksanakan setiap Selasa kedua dan keempat di Balai Warga RW 001. Harap membawa buku KIA dan kartu lansia.',
    'Info Kelurahan', 'blue', '{"all","rw001"}', '📋', '2025-04-20', true
  ),
  (
    'Lampu Jalan Gang Kenanga Diperbaiki',
    'Lampu jalan di 5 titik Gang Kenanga RW 002 akan segera diganti. Mohon warga memaklumi jika ada area yang gelap sementara.',
    'Fasilitas', 'gold', '{"all","rw002"}', '🔧', '2025-04-19', false
  ),
  (
    'Perbaikan Jalan Gang Mawar RW 003',
    'Perbaikan jalan di Gang Mawar akan dimulai tanggal 25 April selama kurang lebih 5 hari kerja. Akses kendaraan roda 4 dibatasi sementara.',
    'Pembangunan', 'gold', '{"all","rw003"}', '🏗', '2025-04-18', true
  ),
  (
    'Program Satu Rumah Satu Pohon RW 004',
    'Karang Taruna RW 004 membagikan bibit pohon gratis kepada seluruh warga sebagai bagian dari program penghijauan lingkungan.',
    'Lingkungan', 'green', '{"all","rw004"}', '🌳', '2025-04-16', false
  ),
  (
    'Bimbel Gratis untuk Pelajar RW 005',
    'Karang Taruna membuka kelas bimbingan belajar gratis untuk SD-SMP setiap Sabtu pukul 09.00–11.00 di Balai RW 005. Daftar via Ketua RT masing-masing.',
    'Pendidikan', 'green', '{"all","rw005"}', '🎓', '2025-04-15', true
  ),
  (
    'Gangguan Air PDAM Wilayah RW 006',
    'PDAM menginformasikan gangguan suplai air bersih di area RW 006 mulai 22–23 April 2025 untuk pekerjaan pemeliharaan pipa induk.',
    'Penting', 'red', '{"all","rw006"}', '🚰', '2025-04-21', false
  ),
  (
    'Peringatan Hari Jadi Kelurahan Duri Selatan ke-42',
    'Kelurahan Duri Selatan mengundang seluruh warga untuk hadir pada perayaan hari jadi ke-42 pada tanggal 15 Mei 2025 di Lapangan Kelurahan.',
    'Kelurahan', 'blue', '{"all","rw001","rw002","rw003","rw004","rw005","rw006"}', '🎉', '2025-04-14', false
  ),
  (
    'Pendaftaran Senam Pagi Bersama RW 002 & 003',
    'Dibuka pendaftaran senam pagi setiap Minggu pukul 06.30 WIB di area terbuka antara RW 002 dan RW 003. Gratis untuk warga setempat.',
    'Olahraga', 'green', '{"all","rw002","rw003"}', '🏊', '2025-04-12', false
  );


-- ============================================================
--  3. AGENDA
-- ============================================================

create table agenda (
  id          uuid        primary key default gen_random_uuid(),
  judul       text        not null,
  deskripsi   text,

  -- Kategori: 'Sosial' | 'Event' | 'Pelatihan' | 'Kesehatan'
  --           'Olahraga' | 'Pendidikan' | 'Lingkungan'
  kategori    text        not null,

  tag_color   text        not null default 'blue',
  rw          text[]      not null default '{"all"}',

  tanggal     date        not null,
  waktu       text,                     -- '07.00 WIB'
  lokasi      text,                     -- 'Jl. Melati RW 002'

  is_featured boolean     not null default false,  -- tampil di preview Beranda
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index idx_agenda_tanggal  on agenda (tanggal asc);
create index idx_agenda_rw       on agenda using gin (rw);
create index idx_agenda_featured on agenda (is_featured) where is_featured = true;

-- Seed Data
insert into agenda (judul, deskripsi, kategori, tag_color, rw, tanggal, waktu, lokasi, is_featured) values
  (
    'Kerja Bakti Massal RW 002',
    'Pembersihan selokan dan penghijauan lingkungan bersama warga.',
    'Sosial', 'green', '{"all","rw002"}',
    '2025-04-27', '07.00 WIB', 'Jl. Melati RW 002', true
  ),
  (
    'Turnamen Futsal Antar-RW',
    'Kompetisi futsal antar RW se-Kelurahan Duri Selatan, piala bergilir.',
    'Event', 'blue', '{"all","rw004"}',
    '2025-05-03', '08.00 WIB', 'Lapangan RW 004', true
  ),
  (
    'Workshop Kewirausahaan Pemuda',
    'Pelatihan membuat usaha mandiri bagi pemuda usia 17–30 tahun.',
    'Pelatihan', 'gold', '{"all","rw006"}',
    '2025-05-10', '09.00 WIB', 'Aula Kelurahan', true
  ),
  (
    'Rapat Koordinasi Bulanan RW 001',
    'Rapat rutin koordinasi pengurus dan ketua RT se-RW 001.',
    'Organisasi', 'blue', '{"all","rw001"}',
    '2025-05-05', '19.30 WIB', 'Balai Warga RW 001', false
  ),
  (
    'Posyandu Balita & Lansia RW 003',
    'Pemeriksaan kesehatan rutin bulanan untuk balita dan lansia.',
    'Kesehatan', 'green', '{"all","rw003"}',
    '2025-05-13', '09.00 WIB', 'Balai RW 003', false
  ),
  (
    'Perayaan Hari Jadi Kelurahan ke-42',
    'Serangkaian lomba dan hiburan untuk seluruh warga Kelurahan Duri Selatan.',
    'Event', 'gold', '{"all","rw001","rw002","rw003","rw004","rw005","rw006"}',
    '2025-05-15', '08.00 WIB', 'Lapangan Kelurahan', false
  );


-- ============================================================
--  4. GALERI
-- ============================================================

create table galeri (
  id          uuid        primary key default gen_random_uuid(),
  judul       text        not null,
  deskripsi   text,                     -- caption singkat, mis: 'RW 005 · April 2025'
  rw          text[]      not null default '{"all"}',
  bulan_tahun text,                     -- 'April 2025'

  -- URL foto dari Supabase Storage
  -- Kosong dulu, pakai icon_emoji sebagai placeholder
  foto_url    text,

  -- Warna background placeholder sebelum foto diupload
  bg_gradient text        default 'linear-gradient(135deg,#c8e6c9,#a5d6a7)',
  icon_emoji  text        default '🖼',

  urutan      int         not null default 0,  -- untuk sorting manual
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index idx_galeri_rw     on galeri using gin (rw);
create index idx_galeri_urutan on galeri (urutan asc);

-- Seed Data
insert into galeri (judul, deskripsi, rw, bulan_tahun, bg_gradient, icon_emoji, urutan) values
  ('Kerja Bakti RW 001',         'RW 001 · April 2025',      '{"all","rw001"}',                                           'April 2025',   'linear-gradient(135deg,#bbdefb,#90caf9)', '🧹', 1),
  ('Turnamen Voli RW 004',       'RW 004 · Maret 2025',      '{"all","rw004"}',                                           'Maret 2025',   'linear-gradient(135deg,#ffccbc,#ffab91)', '🏐', 2),
  ('Bimbel Gratis RW 005',       'RW 005 · April 2025',      '{"all","rw005"}',                                           'April 2025',   'linear-gradient(135deg,#e1bee7,#ce93d8)', '📚', 3),
  ('Program Penghijauan RW 006', 'RW 006 · Maret 2025',      '{"all","rw006"}',                                           'Maret 2025',   'linear-gradient(135deg,#ffe0b2,#ffcc80)', '🌱', 4),
  ('HUT RI ke-79 — Perlombaan',  'Semua RW · Agustus 2024',  '{"all","rw001","rw002","rw003","rw004","rw005","rw006"}',    'Agustus 2024', 'linear-gradient(135deg,#c8e6c9,#ffd54f)', '🎉', 5),
  ('Senam Bersama Antar-RW',     'RW 002 & 003 · April 2025','{"all","rw002","rw003"}',                                   'April 2025',   'linear-gradient(135deg,#b2dfdb,#80cbc4)', '🏅', 6),
  ('Posyandu Balita & Lansia',   'RW 001 · April 2025',      '{"all","rw001"}',                                           'April 2025',   'linear-gradient(135deg,#dcedc8,#aed581)', '💉', 7);


-- ============================================================
--  5. PENGURUS
-- ============================================================

create table pengurus (
  id          uuid        primary key default gen_random_uuid(),
  nama        text        not null,
  jabatan     text        not null,

  -- 'kelurahan' | 'rw001' | 'rw002' | 'rw003' | 'rw004' | 'rw005' | 'rw006'
  unit        text        not null,

  inisial     char(1)     not null,     -- huruf pertama nama untuk avatar
  asal_rw     text,                     -- khusus pengurus tingkat kelurahan
  avatar_color text       default '',   -- opsional: override warna avatar

  urutan      int         not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index idx_pengurus_unit   on pengurus (unit);
create index idx_pengurus_urutan on pengurus (unit, urutan asc);

-- Seed Data — Tingkat Kelurahan
insert into pengurus (nama, jabatan, unit, inisial, asal_rw, urutan) values
  ('Ahmad Fauzi',   'Ketua Umum',   'kelurahan', 'A', 'RW 001', 1),
  ('Siti Rahayu',   'Wakil Ketua',  'kelurahan', 'S', 'RW 003', 2),
  ('Budi Santoso',  'Sekretaris',   'kelurahan', 'B', 'RW 002', 3),
  ('Dewi Lestari',  'Bendahara',    'kelurahan', 'D', 'RW 005', 4),
  ('Rizky Pratama', 'Sie TIK',      'kelurahan', 'R', 'RW 004', 5),
  ('Nurul Hidayah', 'Sie Sosial',   'kelurahan', 'N', 'RW 006', 6);

-- Seed Data — RW 001
insert into pengurus (nama, jabatan, unit, inisial, urutan) values
  ('M. Iqbal',   'Ketua RW 001',  'rw001', 'M', 1),
  ('Fatimah Z.', 'Sekretaris',    'rw001', 'F', 2),
  ('Hendra K.',  'Bendahara',     'rw001', 'H', 3),
  ('Lina Sari',  'Sie Humas',     'rw001', 'L', 4),
  ('Yusuf A.',   'Sie Olahraga',  'rw001', 'Y', 5),
  ('Wulandari',  'Sie Sosial',    'rw001', 'W', 6);

-- Seed Data — RW 002
insert into pengurus (nama, jabatan, unit, inisial, urutan) values
  ('Prasetyo W.', 'Ketua RW 002',   'rw002', 'P', 1),
  ('Aisyah N.',   'Sekretaris',     'rw002', 'A', 2),
  ('Gunawan S.',  'Bendahara',      'rw002', 'G', 3),
  ('Reni Astuti', 'Sie Humas',      'rw002', 'R', 4),
  ('Tommy H.',    'Sie Olahraga',   'rw002', 'T', 5),
  ('Endang S.',   'Sie Lingkungan', 'rw002', 'E', 6);

-- Seed Data — RW 003
insert into pengurus (nama, jabatan, unit, inisial, urutan) values
  ('Kurniawan',   'Ketua RW 003',  'rw003', 'K', 1),
  ('Maya Indah',  'Sekretaris',    'rw003', 'M', 2),
  ('Darmawan',    'Bendahara',     'rw003', 'D', 3),
  ('Sri Wahyuni', 'Sie Humas',     'rw003', 'S', 4),
  ('Arif B.',     'Sie Pendidikan','rw003', 'A', 5),
  ('Indra P.',    'Sie Kesenian',  'rw003', 'I', 6);

-- Seed Data — RW 004
insert into pengurus (nama, jabatan, unit, inisial, urutan) values
  ('Joko Susilo', 'Ketua RW 004', 'rw004', 'J', 1),
  ('Nina R.',     'Sekretaris',   'rw004', 'N', 2),
  ('Hartono',     'Bendahara',    'rw004', 'H', 3),
  ('Vera Santi',  'Sie Humas',    'rw004', 'V', 4),
  ('Andi Putra',  'Sie Olahraga', 'rw004', 'A', 5),
  ('Zainal A.',   'Sie Sosial',   'rw004', 'Z', 6);

-- Seed Data — RW 005
insert into pengurus (nama, jabatan, unit, inisial, urutan) values
  ('Sulastri',    'Ketua RW 005',   'rw005', 'S', 1),
  ('Bambang W.',  'Sekretaris',     'rw005', 'B', 2),
  ('Udin Hakim',  'Bendahara',      'rw005', 'U', 3),
  ('Rina M.',     'Sie Pendidikan', 'rw005', 'R', 4),
  ('Fahmi Z.',    'Sie TIK',        'rw005', 'F', 5),
  ('Nana Surya',  'Sie Lingkungan', 'rw005', 'N', 6);

-- Seed Data — RW 006
insert into pengurus (nama, jabatan, unit, inisial, urutan) values
  ('Edwin P.',   'Ketua RW 006', 'rw006', 'E', 1),
  ('Kartini H.', 'Sekretaris',   'rw006', 'K', 2),
  ('Sutrisno',   'Bendahara',    'rw006', 'S', 3),
  ('Laila F.',   'Sie Humas',    'rw006', 'L', 4),
  ('Otto N.',    'Sie UMKM',     'rw006', 'O', 5),
  ('Putri A.',   'Sie Sosial',   'rw006', 'P', 6);


-- ============================================================
--  6. ASPIRASI
-- ============================================================

create table aspirasi (
  id          uuid        primary key default gen_random_uuid(),
  nama        text        not null,
  no_hp       text,                     -- opsional
  rw          text        not null,     -- 'rw001' dst

  -- 'Saran Program Kegiatan' | 'Keluhan Fasilitas' | 'Pertanyaan Organisasi'
  -- 'Usulan Kerja Sama' | 'Laporan Sosial' | 'Lainnya'
  kategori    text        not null,

  isi         text        not null,

  -- 'baru' | 'diproses' | 'selesai'
  status      text        not null default 'baru',

  -- Catatan balasan dari admin (opsional)
  catatan_admin text,

  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index idx_aspirasi_status     on aspirasi (status);
create index idx_aspirasi_rw         on aspirasi (rw);
create index idx_aspirasi_created_at on aspirasi (created_at desc);


-- ============================================================
--  ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Aktifkan RLS di semua tabel
alter table site_stats  enable row level security;
alter table pengumuman  enable row level security;
alter table agenda      enable row level security;
alter table galeri      enable row level security;
alter table pengurus    enable row level security;
alter table aspirasi    enable row level security;

-- ── Publik: READ semua tabel kecuali aspirasi ──────────────
create policy "publik baca site_stats"
  on site_stats for select using (true);

create policy "publik baca pengumuman"
  on pengumuman for select using (true);

create policy "publik baca agenda"
  on agenda for select using (true);

create policy "publik baca galeri"
  on galeri for select using (true);

create policy "publik baca pengurus"
  on pengurus for select using (true);

-- ── Publik: hanya bisa INSERT aspirasi ────────────────────
create policy "publik kirim aspirasi"
  on aspirasi for insert
  with check (true);

-- ── Admin (authenticated): full access semua tabel ────────
create policy "admin full access pengumuman"
  on pengumuman for all
  using (auth.role() = 'authenticated');

create policy "admin full access agenda"
  on agenda for all
  using (auth.role() = 'authenticated');

create policy "admin full access galeri"
  on galeri for all
  using (auth.role() = 'authenticated');

create policy "admin full access pengurus"
  on pengurus for all
  using (auth.role() = 'authenticated');

create policy "admin full access site_stats"
  on site_stats for all
  using (auth.role() = 'authenticated');

create policy "admin baca & update aspirasi"
  on aspirasi for all
  using (auth.role() = 'authenticated');


-- ============================================================
--  AUTO-UPDATE updated_at
--  Trigger untuk semua tabel yang punya kolom updated_at
-- ============================================================

create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_pengumuman_updated_at
  before update on pengumuman
  for each row execute function handle_updated_at();

create trigger trg_agenda_updated_at
  before update on agenda
  for each row execute function handle_updated_at();

create trigger trg_galeri_updated_at
  before update on galeri
  for each row execute function handle_updated_at();

create trigger trg_pengurus_updated_at
  before update on pengurus
  for each row execute function handle_updated_at();

create trigger trg_aspirasi_updated_at
  before update on aspirasi
  for each row execute function handle_updated_at();

create trigger trg_site_stats_updated_at
  before update on site_stats
  for each row execute function handle_updated_at();


-- ============================================================
--  STORAGE BUCKET (jalankan terpisah di Supabase dashboard
--  atau via API — tidak bisa lewat SQL editor biasa)
-- ============================================================

-- insert into storage.buckets (id, name, public)
--   values ('galeri', 'galeri', true);

-- create policy "publik lihat foto galeri"
--   on storage.objects for select
--   using (bucket_id = 'galeri');

-- create policy "admin upload foto galeri"
--   on storage.objects for insert
--   with check (bucket_id = 'galeri' and auth.role() = 'authenticated');

-- create policy "admin hapus foto galeri"
--   on storage.objects for delete
--   using (bucket_id = 'galeri' and auth.role() = 'authenticated');


-- ============================================================
--  SELESAI
-- ============================================================