const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testSchema() {
  console.log('🧪 Testing current schema structure...')

  // Test 1: Try inserting with a numeric ID
  console.log('📝 Test 1: Inserting with numeric ID...')
  const { data: test1, error: error1 } = await supabase
    .from('technologies')
    .insert({
      id: 1,
      name: 'Test React',
      description: 'Test description',
      category: 'Test Category'
    })
    .select()

  if (error1) {
    console.log('❌ Test 1 failed:', error1.message)
  } else {
    console.log('✅ Test 1 succeeded:', test1)
  }

  // Test 2: Try inserting with a text ID
  console.log('📝 Test 2: Inserting with text ID...')
  const { data: test2, error: error2 } = await supabase
    .from('technologies')
    .insert({
      id: 'react',
      name: 'Test React 2',
      description: 'Test description 2',
      category: 'Test Category 2'
    })
    .select()

  if (error2) {
    console.log('❌ Test 2 failed:', error2.message)
  } else {
    console.log('✅ Test 2 succeeded:', test2)
  }

  // Clean up test data
  console.log('🧹 Cleaning up test data...')
  await supabase.from('technologies').delete().neq('id', 0)
}

testSchema()