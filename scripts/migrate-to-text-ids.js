const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

// Technology data with proper text IDs
const technologies = [
  // Frontend Frameworks & Libraries
  { id: 'react', name: 'React', description: 'A JavaScript library for building user interfaces', category: 'Frontend Framework' },
  { id: 'vuejs', name: 'Vue.js', description: 'Progressive JavaScript framework for building UIs', category: 'Frontend Framework' },
  { id: 'angular', name: 'Angular', description: 'TypeScript-based web application framework', category: 'Frontend Framework' },
  { id: 'svelte', name: 'Svelte', description: 'Cybernetically enhanced web apps framework', category: 'Frontend Framework' },
  { id: 'nextjs', name: 'Next.js', description: 'React framework for production applications', category: 'Frontend Framework' },
  { id: 'nuxtjs', name: 'Nuxt.js', description: 'Vue.js framework for universal applications', category: 'Frontend Framework' },
  { id: 'gatsby', name: 'Gatsby', description: 'Static site generator for React', category: 'Frontend Framework' },
  { id: 'remix', name: 'Remix', description: 'Full-stack web framework focused on web standards', category: 'Frontend Framework' },
  { id: 'solidjs', name: 'SolidJS', description: 'Simple and performant reactive JavaScript framework', category: 'Frontend Framework' },
  { id: 'alpinejs', name: 'Alpine.js', description: 'Minimal framework for composing JavaScript behavior', category: 'Frontend Framework' },

  // Backend Frameworks
  { id: 'nodejs', name: 'Node.js', description: 'JavaScript runtime built on Chrome V8 engine', category: 'Backend Runtime' },
  { id: 'express', name: 'Express', description: 'Fast, unopinionated web framework for Node.js', category: 'Backend Framework' },
  { id: 'fastify', name: 'Fastify', description: 'Fast and low overhead web framework for Node.js', category: 'Backend Framework' },
  { id: 'nestjs', name: 'NestJS', description: 'Progressive Node.js framework for building scalable server-side applications', category: 'Backend Framework' },
  { id: 'django', name: 'Django', description: 'High-level Python web framework', category: 'Backend Framework' },
  { id: 'flask', name: 'Flask', description: 'Lightweight Python web framework', category: 'Backend Framework' },
  { id: 'fastapi', name: 'FastAPI', description: 'Modern, fast web framework for Python APIs', category: 'Backend Framework' },
  { id: 'rails', name: 'Ruby on Rails', description: 'Web application framework written in Ruby', category: 'Backend Framework' },
  { id: 'laravel', name: 'Laravel', description: 'PHP web framework with expressive, elegant syntax', category: 'Backend Framework' },
  { id: 'symfony', name: 'Symfony', description: 'PHP framework for web applications', category: 'Backend Framework' },
  { id: 'spring', name: 'Spring Framework', description: 'Java application framework and inversion of control container', category: 'Backend Framework' },
  { id: 'springboot', name: 'Spring Boot', description: 'Java framework that makes it easy to create stand-alone applications', category: 'Backend Framework' },
  { id: 'gin', name: 'Gin', description: 'HTTP web framework written in Go', category: 'Backend Framework' },
  { id: 'fiber', name: 'Fiber', description: 'Express inspired web framework for Go', category: 'Backend Framework' },
  { id: 'aspnetcore', name: 'ASP.NET Core', description: 'Cross-platform web framework for .NET', category: 'Backend Framework' },

  // Programming Languages
  { id: 'python', name: 'Python', description: 'High-level programming language', category: 'Programming Language' },
  { id: 'javascript', name: 'JavaScript', description: 'Programming language for web development', category: 'Programming Language' },
  { id: 'typescript', name: 'TypeScript', description: 'Typed superset of JavaScript', category: 'Programming Language' },
  { id: 'rust', name: 'Rust', description: 'Systems programming language focused on safety and performance', category: 'Programming Language' },
  { id: 'go', name: 'Go', description: 'Open source programming language by Google', category: 'Programming Language' },
  { id: 'java', name: 'Java', description: 'Object-oriented programming language', category: 'Programming Language' },
  { id: 'csharp', name: 'C#', description: 'Object-oriented programming language by Microsoft', category: 'Programming Language' },
  { id: 'cpp', name: 'C++', description: 'General-purpose programming language', category: 'Programming Language' },
  { id: 'ruby', name: 'Ruby', description: 'Dynamic, object-oriented programming language', category: 'Programming Language' },
  { id: 'php', name: 'PHP', description: 'Server-side scripting language', category: 'Programming Language' },
  { id: 'kotlin', name: 'Kotlin', description: 'Modern programming language that runs on the JVM', category: 'Programming Language' },
  { id: 'swift', name: 'Swift', description: 'Programming language for iOS and macOS development', category: 'Programming Language' },
  { id: 'dart', name: 'Dart', description: 'Programming language optimized for building mobile, desktop, server, and web applications', category: 'Programming Language' },

  // Databases
  { id: 'postgresql', name: 'PostgreSQL', description: 'Advanced open source relational database', category: 'Database' },
  { id: 'mysql', name: 'MySQL', description: 'Open source relational database management system', category: 'Database' },
  { id: 'mongodb', name: 'MongoDB', description: 'Document-oriented NoSQL database', category: 'Database' },
  { id: 'redis', name: 'Redis', description: 'In-memory data structure store', category: 'Database' },
  { id: 'sqlite', name: 'SQLite', description: 'Lightweight, serverless SQL database engine', category: 'Database' },
  { id: 'elasticsearch', name: 'Elasticsearch', description: 'Distributed search and analytics engine', category: 'Database' },
  { id: 'mariadb', name: 'MariaDB', description: 'Community-developed fork of MySQL', category: 'Database' },
  { id: 'cassandra', name: 'Apache Cassandra', description: 'Distributed NoSQL database', category: 'Database' },
  { id: 'couchdb', name: 'CouchDB', description: 'Document-oriented NoSQL database', category: 'Database' },
  { id: 'supabase', name: 'Supabase', description: 'Open source Firebase alternative', category: 'Database' },

  // DevOps & Infrastructure
  { id: 'docker', name: 'Docker', description: 'Containerization platform', category: 'DevOps' },
  { id: 'kubernetes', name: 'Kubernetes', description: 'Container orchestration platform', category: 'DevOps' },
  { id: 'terraform', name: 'Terraform', description: 'Infrastructure as Code tool', category: 'DevOps' },
  { id: 'ansible', name: 'Ansible', description: 'IT automation and configuration management tool', category: 'DevOps' },
  { id: 'jenkins', name: 'Jenkins', description: 'Open source automation server', category: 'DevOps' },
  { id: 'nginx', name: 'Nginx', description: 'Web server and reverse proxy', category: 'DevOps' },
  { id: 'apache', name: 'Apache HTTP Server', description: 'Open source web server', category: 'DevOps' },
  { id: 'prometheus', name: 'Prometheus', description: 'Monitoring and alerting toolkit', category: 'DevOps' },
  { id: 'grafana', name: 'Grafana', description: 'Analytics and monitoring platform', category: 'DevOps' },
  { id: 'gitlab', name: 'GitLab', description: 'DevOps platform for the entire software development lifecycle', category: 'DevOps' },

  // Mobile Development
  { id: 'reactnative', name: 'React Native', description: 'Framework for building native mobile apps using React', category: 'Mobile Framework' },
  { id: 'flutter', name: 'Flutter', description: 'UI toolkit for building natively compiled applications', category: 'Mobile Framework' },
  { id: 'ionic', name: 'Ionic', description: 'Cross-platform mobile app development framework', category: 'Mobile Framework' },
  { id: 'xamarin', name: 'Xamarin', description: 'Cross-platform mobile development framework', category: 'Mobile Framework' },
  { id: 'cordova', name: 'Apache Cordova', description: 'Mobile application development framework', category: 'Mobile Framework' },

  // Machine Learning & AI
  { id: 'tensorflow', name: 'TensorFlow', description: 'Machine learning framework by Google', category: 'Machine Learning' },
  { id: 'pytorch', name: 'PyTorch', description: 'Deep learning framework by Facebook', category: 'Machine Learning' },
  { id: 'scikitlearn', name: 'Scikit-learn', description: 'Machine learning library for Python', category: 'Machine Learning' },
  { id: 'keras', name: 'Keras', description: 'High-level neural networks API', category: 'Machine Learning' },
  { id: 'pandas', name: 'Pandas', description: 'Data analysis and manipulation library for Python', category: 'Machine Learning' },
  { id: 'numpy', name: 'NumPy', description: 'Fundamental package for scientific computing with Python', category: 'Machine Learning' },
  { id: 'jupyter', name: 'Jupyter', description: 'Interactive computing environment', category: 'Machine Learning' },
  { id: 'opencv', name: 'OpenCV', description: 'Computer vision and machine learning software library', category: 'Machine Learning' },
  { id: 'huggingface', name: 'Hugging Face', description: 'Platform for machine learning models and datasets', category: 'Machine Learning' },

  // CSS Frameworks & Tools
  { id: 'tailwindcss', name: 'Tailwind CSS', description: 'Utility-first CSS framework', category: 'CSS Framework' },
  { id: 'bootstrap', name: 'Bootstrap', description: 'Popular CSS framework for responsive design', category: 'CSS Framework' },
  { id: 'bulma', name: 'Bulma', description: 'Modern CSS framework based on Flexbox', category: 'CSS Framework' },
  { id: 'materialui', name: 'Material-UI', description: 'React components for faster and easier web development', category: 'CSS Framework' },
  { id: 'sass', name: 'Sass', description: 'CSS extension language', category: 'CSS Framework' },

  // Build Tools & Bundlers
  { id: 'webpack', name: 'Webpack', description: 'Module bundler for JavaScript applications', category: 'Build Tool' },
  { id: 'vite', name: 'Vite', description: 'Fast build tool for modern web projects', category: 'Build Tool' },
  { id: 'rollup', name: 'Rollup', description: 'Module bundler for JavaScript', category: 'Build Tool' },
  { id: 'parcel', name: 'Parcel', description: 'Zero configuration build tool', category: 'Build Tool' },
  { id: 'esbuild', name: 'esbuild', description: 'Extremely fast JavaScript bundler', category: 'Build Tool' },
  { id: 'turbo', name: 'Turbo', description: 'High-performance build system for JavaScript and TypeScript codebases', category: 'Build Tool' },

  // Testing Frameworks
  { id: 'jest', name: 'Jest', description: 'JavaScript testing framework', category: 'Testing' },
  { id: 'cypress', name: 'Cypress', description: 'End-to-end testing framework', category: 'Testing' },
  { id: 'playwright', name: 'Playwright', description: 'End-to-end testing framework by Microsoft', category: 'Testing' },
  { id: 'selenium', name: 'Selenium', description: 'Web browser automation framework', category: 'Testing' },
  { id: 'vitest', name: 'Vitest', description: 'Fast unit testing framework powered by Vite', category: 'Testing' },
  { id: 'mocha', name: 'Mocha', description: 'JavaScript test framework running on Node.js', category: 'Testing' },
  { id: 'pytest', name: 'pytest', description: 'Testing framework for Python', category: 'Testing' },
  { id: 'junit', name: 'JUnit', description: 'Testing framework for Java', category: 'Testing' },

  // Version Control & Collaboration
  { id: 'git', name: 'Git', description: 'Distributed version control system', category: 'Version Control' },
  { id: 'github', name: 'GitHub', description: 'Web-based Git repository hosting service', category: 'Version Control' },

  // Content Management
  { id: 'wordpress', name: 'WordPress', description: 'Open source content management system', category: 'CMS' },
  { id: 'drupal', name: 'Drupal', description: 'Open source content management framework', category: 'CMS' },
  { id: 'strapi', name: 'Strapi', description: 'Open source headless CMS', category: 'CMS' },
  { id: 'ghost', name: 'Ghost', description: 'Open source publishing platform', category: 'CMS' },

  // Game Development
  { id: 'godot', name: 'Godot', description: 'Open source game engine', category: 'Game Development' },

  // Cloud Native & Microservices
  { id: 'istio', name: 'Istio', description: 'Service mesh for microservices', category: 'Cloud Native' },
  { id: 'envoy', name: 'Envoy', description: 'Cloud-native high-performance edge/middle/service proxy', category: 'Cloud Native' },
  { id: 'helm', name: 'Helm', description: 'Package manager for Kubernetes', category: 'Cloud Native' },
  { id: 'kustomize', name: 'Kustomize', description: 'Kubernetes native configuration management', category: 'Cloud Native' },

  // Message Queuing & Streaming
  { id: 'kafka', name: 'Apache Kafka', description: 'Distributed streaming platform', category: 'Message Queue' },
  { id: 'rabbitmq', name: 'RabbitMQ', description: 'Message broker software', category: 'Message Queue' },
  { id: 'activemq', name: 'Apache ActiveMQ', description: 'Message broker written in Java', category: 'Message Queue' },

  // GraphQL
  { id: 'graphql', name: 'GraphQL', description: 'Query language and runtime for APIs', category: 'API Technology' },
  { id: 'apollo', name: 'Apollo GraphQL', description: 'GraphQL implementation and tooling', category: 'API Technology' },

  // Search & Analytics
  { id: 'solr', name: 'Apache Solr', description: 'Enterprise search platform', category: 'Search Engine' }
]

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL in .env.local')
  process.exit(1)
}

// Try service key first, fallback to anon key
const supabaseKey = supabaseServiceKey || supabaseAnonKey
if (!supabaseKey) {
  console.error('❌ Missing both SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local')
  process.exit(1)
}

if (supabaseServiceKey) {
  console.log('✅ Using service role key for migration')
} else {
  console.log('⚠️  Using anon key - some operations might be restricted')
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function executeSQL(sql, description) {
  console.log(`📝 ${description}...`)
  try {
    const { error } = await supabase.rpc('exec_sql', { sql })
    if (error) {
      console.error(`❌ Error: ${error.message}`)
      return false
    }
    console.log(`✅ ${description} completed`)
    return true
  } catch (err) {
    console.error(`❌ Error: ${err.message}`)
    return false
  }
}

async function migrateTechnologies() {
  console.log('🚀 Starting migration to text-based technology IDs...')
  console.log(`📊 Will migrate to ${technologies.length} technologies with text IDs`)

  try {
    // Step 1: Backup existing votes (just show count)
    console.log('📊 Checking existing votes...')
    const { count: voteCount } = await supabase
      .from('votes')
      .select('*', { count: 'exact', head: true })

    console.log(`📊 Found ${voteCount || 0} existing votes`)

    if (voteCount > 0) {
      console.log('⚠️  Warning: Existing votes will be cleared. In production, you would want to migrate these.')
    }

    // Step 2: Drop dependent views and constraints
    await executeSQL(`
      DROP VIEW IF EXISTS technology_rankings CASCADE;
    `, 'Dropping technology_rankings view')

    // Step 3: Clear votes (since they reference technologies)
    console.log('🗑️  Clearing existing votes...')
    const { error: deleteVotesError } = await supabase
      .from('votes')
      .delete()
      .neq('id', 0)

    if (deleteVotesError) {
      console.error('❌ Error clearing votes:', deleteVotesError)
    } else {
      console.log('✅ Cleared existing votes')
    }

    // Step 4: Drop and recreate technologies table with text ID
    await executeSQL(`
      DROP TABLE IF EXISTS technologies CASCADE;

      CREATE TABLE technologies (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        category TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- Create indexes
      CREATE INDEX idx_technologies_category ON technologies(category);
      CREATE INDEX idx_technologies_name ON technologies(name);
    `, 'Recreating technologies table with text-based IDs')

    // Step 5: Recreate votes table to reference text IDs
    await executeSQL(`
      DROP TABLE IF EXISTS votes CASCADE;

      CREATE TABLE votes (
        id BIGSERIAL PRIMARY KEY,
        user_id TEXT NOT NULL,
        technology_id TEXT NOT NULL REFERENCES technologies(id) ON DELETE CASCADE,
        impact_value BIGINT NOT NULL CHECK (impact_value >= 0),
        reasoning TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(user_id, technology_id)
      );

      -- Create indexes
      CREATE INDEX idx_votes_user_id ON votes(user_id);
      CREATE INDEX idx_votes_technology_id ON votes(technology_id);
      CREATE INDEX idx_votes_impact_value ON votes(impact_value);
    `, 'Recreating votes table with text-based technology references')

    // Step 6: Insert technologies with text IDs
    console.log('📥 Inserting technologies with text-based IDs...')
    const batchSize = 50
    let successCount = 0

    for (let i = 0; i < technologies.length; i += batchSize) {
      const batch = technologies.slice(i, i + batchSize)

      const technologiesToInsert = batch.map(tech => ({
        id: tech.id,
        name: tech.name,
        description: tech.description,
        category: tech.category,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }))

      const { error: insertError } = await supabase
        .from('technologies')
        .insert(technologiesToInsert)

      if (insertError) {
        console.error(`❌ Error inserting batch ${Math.floor(i / batchSize) + 1}:`, insertError)
        continue
      }

      successCount += batch.length
      console.log(`✅ Inserted batch ${Math.floor(i / batchSize) + 1}: ${batch.length} technologies (${batch[0].id} - ${batch[batch.length - 1].id})`)
    }

    // Step 7: Recreate the technology_rankings view with text IDs
    await executeSQL(`
      CREATE OR REPLACE VIEW technology_rankings AS
      SELECT
        t.id,
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
    `, 'Recreating technology_rankings view with text-based IDs')

    console.log(`🎉 Migration completed successfully!`)
    console.log(`📊 Successfully migrated to ${successCount}/${technologies.length} technologies with text-based IDs`)

    // Verify the migration
    const { data: sample } = await supabase
      .from('technologies')
      .select('id, name, category')
      .limit(10)

    console.log('📋 Sample of technologies with text IDs:')
    sample?.forEach(tech => {
      console.log(`   - ${tech.id} → ${tech.name} (${tech.category})`)
    })

    // Show some examples of the new URL-friendly IDs
    console.log('\n🔗 URL-friendly examples:')
    console.log('   - /react → React')
    console.log('   - /vuejs → Vue.js')
    console.log('   - /nodejs → Node.js')
    console.log('   - /cpp → C++')
    console.log('   - /rails → Ruby on Rails')

  } catch (error) {
    console.error('💥 Migration failed:', error)
    process.exit(1)
  }
}

migrateTechnologies()