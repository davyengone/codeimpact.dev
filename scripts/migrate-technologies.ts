import { createClient } from '@supabase/supabase-js'
import { technologies } from './technologies-data'
import { generateTechnologyId } from '../src/lib/technologyId'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY! // You'll need to add this to your .env.local

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function migrateTechnologies() {
  console.log('🚀 Starting technologies migration...')

  try {
    // Step 1: Add the new 'slug' column to technologies table
    console.log('📝 Adding slug column to technologies table...')
    const { error: alterError } = await supabase.rpc('exec_sql', {
      sql: `
        DO $$
        BEGIN
          -- Add slug column if it doesn't exist
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                        WHERE table_name='technologies' AND column_name='slug') THEN
            ALTER TABLE technologies ADD COLUMN slug TEXT;
          END IF;

          -- Create unique index on slug if it doesn't exist
          IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'technologies_slug_idx') THEN
            CREATE UNIQUE INDEX technologies_slug_idx ON technologies(slug);
          END IF;
        END $$;
      `
    })

    if (alterError) {
      console.error('❌ Error altering table:', alterError)
      return
    }

    // Step 2: Get existing technologies to update their slugs
    console.log('📖 Reading existing technologies...')
    const { data: existingTechnologies, error: fetchError } = await supabase
      .from('technologies')
      .select('id, name')

    if (fetchError) {
      console.error('❌ Error fetching existing technologies:', fetchError)
      return
    }

    // Step 3: Update existing technologies with slugs
    console.log('🔄 Updating existing technologies with slugs...')
    for (const tech of existingTechnologies || []) {
      const slug = generateTechnologyId(tech.name)
      const { error: updateError } = await supabase
        .from('technologies')
        .update({ slug })
        .eq('id', tech.id)

      if (updateError) {
        console.error(`❌ Error updating ${tech.name}:`, updateError)
      } else {
        console.log(`✅ Updated ${tech.name} -> ${slug}`)
      }
    }

    // Step 4: Clear existing technologies and insert new ones
    console.log('🗑️  Clearing existing technologies...')
    const { error: deleteError } = await supabase
      .from('technologies')
      .delete()
      .neq('id', 0) // Delete all

    if (deleteError) {
      console.error('❌ Error clearing technologies:', deleteError)
      return
    }

    // Step 5: Insert new technologies
    console.log('📥 Inserting new technologies...')
    const technologiesToInsert = technologies.map(tech => ({
      slug: tech.id,
      name: tech.name,
      description: tech.description,
      category: tech.category,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }))

    // Insert in batches to avoid hitting limits
    const batchSize = 20
    for (let i = 0; i < technologiesToInsert.length; i += batchSize) {
      const batch = technologiesToInsert.slice(i, i + batchSize)
      const { error: insertError } = await supabase
        .from('technologies')
        .insert(batch)

      if (insertError) {
        console.error(`❌ Error inserting batch ${i / batchSize + 1}:`, insertError)
        continue
      }

      console.log(`✅ Inserted batch ${i / batchSize + 1} (${batch.length} technologies)`)
    }

    // Step 6: Update the technology_rankings view to use slug
    console.log('🔄 Updating technology_rankings view...')
    const { error: viewError } = await supabase.rpc('exec_sql', {
      sql: `
        DROP VIEW IF EXISTS technology_rankings;
        CREATE OR REPLACE VIEW technology_rankings AS
        SELECT
          t.id,
          t.slug,
          t.name,
          t.description,
          t.category,
          COALESCE(v.vote_count, 0) as vote_count,
          COALESCE(v.average_impact, 0) as average_impact,
          COALESCE(v.total_impact, 0) as total_impact,
          t.created_at,
          t.updated_at
        FROM technologies t
        LEFT JOIN (
          SELECT
            technology_id,
            COUNT(*) as vote_count,
            AVG(impact_value) as average_impact,
            SUM(impact_value) as total_impact
          FROM votes
          GROUP BY technology_id
        ) v ON t.id = v.technology_id
        ORDER BY total_impact DESC, vote_count DESC, t.name ASC;
      `
    })

    if (viewError) {
      console.error('❌ Error updating view:', viewError)
    } else {
      console.log('✅ Updated technology_rankings view')
    }

    console.log('🎉 Migration completed successfully!')
    console.log(`📊 Total technologies: ${technologies.length}`)

    // Verify the migration
    const { data: finalCount, error: countError } = await supabase
      .from('technologies')
      .select('*', { count: 'exact', head: true })

    if (!countError) {
      console.log(`✅ Verification: ${finalCount} technologies in database`)
    }

  } catch (error) {
    console.error('💥 Migration failed:', error)
  }
}

// Only run if this script is executed directly
if (require.main === module) {
  migrateTechnologies()
}