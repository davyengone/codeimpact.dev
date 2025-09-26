const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

// First, let's check the current table structure
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing environment variables')
  process.exit(1)
}

console.log('⚠️  Using anon key - limited operations available')
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function inspectCurrentStructure() {
  console.log('🔍 Inspecting current database structure...')

  try {
    // Try to get some sample data to understand the current structure
    const { data: techSample, error: techError } = await supabase
      .from('technologies')
      .select('*')
      .limit(3)

    if (techError) {
      console.log('❌ Error fetching technologies:', techError.message)
    } else {
      console.log('📊 Current technologies sample:')
      console.log(JSON.stringify(techSample, null, 2))
    }

    const { data: votesSample, error: votesError } = await supabase
      .from('votes')
      .select('*')
      .limit(3)

    if (votesError) {
      console.log('❌ Error fetching votes:', votesError.message)
    } else {
      console.log('📊 Current votes sample:')
      console.log(JSON.stringify(votesSample, null, 2))
    }

    // Check if there are any existing technologies
    const { count: techCount } = await supabase
      .from('technologies')
      .select('*', { count: 'exact', head: true })

    const { count: voteCount } = await supabase
      .from('votes')
      .select('*', { count: 'exact', head: true })

    console.log(`📊 Current database state:`)
    console.log(`   - Technologies: ${techCount || 0}`)
    console.log(`   - Votes: ${voteCount || 0}`)

  } catch (error) {
    console.error('💥 Error inspecting database:', error)
  }
}

inspectCurrentStructure()