// Test script untuk cek data agenda
// Jalankan di browser console atau buat file test

import { supabase } from './src/lib/supabase'

async function testAgenda() {
  console.log('🔍 Testing Agenda Data...')
  
  // Test 1: Cek semua agenda
  const { data: allAgenda, error: allError } = await supabase
    .from('agenda')
    .select('*')
  
  console.log('📊 Total agenda di database:', allAgenda?.length || 0)
  if (allError) console.error('❌ Error:', allError)
  
  // Test 2: Cek agenda hari ini atau mendatang
  const today = new Date().toISOString().split('T')[0]
  console.log('📅 Hari ini:', today)
  
  const { data: upcomingAgenda, error: upcomingError } = await supabase
    .from('agenda')
    .select('*')
    .gte('tanggal', today)
    .order('tanggal', { ascending: true })
  
  console.log('📅 Agenda mendatang:', upcomingAgenda?.length || 0)
  if (upcomingAgenda) {
    upcomingAgenda.forEach(a => {
      console.log(`  - ${a.judul} (${a.tanggal})`)
    })
  }
  if (upcomingError) console.error('❌ Error:', upcomingError)
  
  // Test 3: Cek agenda featured
  const { data: featuredAgenda, error: featuredError } = await supabase
    .from('agenda')
    .select('*')
    .eq('is_featured', true)
  
  console.log('⭐ Agenda featured:', featuredAgenda?.length || 0)
  if (featuredError) console.error('❌ Error:', featuredError)
  
  // Rekomendasi
  if (!upcomingAgenda || upcomingAgenda.length === 0) {
    console.log('⚠️ MASALAH: Tidak ada agenda dengan tanggal >= hari ini')
    console.log('💡 SOLUSI: Tambah agenda baru dengan tanggal mendatang di /admin/agenda')
  } else {
    console.log('✅ Data agenda OK!')
  }
}

// Uncomment untuk test
// testAgenda()
