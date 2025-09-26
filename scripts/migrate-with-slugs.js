const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

// Technology data with numeric IDs and slug fields
const technologies = [
  // Frontend Frameworks & Libraries
  { id: 1, slug: 'react', name: 'React', description: 'A JavaScript library for building user interfaces', category: 'Frontend Framework' },
  { id: 2, slug: 'vuejs', name: 'Vue.js', description: 'Progressive JavaScript framework for building UIs', category: 'Frontend Framework' },
  { id: 3, slug: 'angular', name: 'Angular', description: 'TypeScript-based web application framework', category: 'Frontend Framework' },
  { id: 4, slug: 'svelte', name: 'Svelte', description: 'Cybernetically enhanced web apps framework', category: 'Frontend Framework' },
  { id: 5, slug: 'nextjs', name: 'Next.js', description: 'React framework for production applications', category: 'Frontend Framework' },
  { id: 6, slug: 'nuxtjs', name: 'Nuxt.js', description: 'Vue.js framework for universal applications', category: 'Frontend Framework' },
  { id: 7, slug: 'gatsby', name: 'Gatsby', description: 'Static site generator for React', category: 'Frontend Framework' },
  { id: 8, slug: 'remix', name: 'Remix', description: 'Full-stack web framework focused on web standards', category: 'Frontend Framework' },
  { id: 9, slug: 'solidjs', name: 'SolidJS', description: 'Simple and performant reactive JavaScript framework', category: 'Frontend Framework' },
  { id: 10, slug: 'alpinejs', name: 'Alpine.js', description: 'Minimal framework for composing JavaScript behavior', category: 'Frontend Framework' },

  // Backend Frameworks
  { id: 11, slug: 'nodejs', name: 'Node.js', description: 'JavaScript runtime built on Chrome V8 engine', category: 'Backend Runtime' },
  { id: 12, slug: 'express', name: 'Express', description: 'Fast, unopinionated web framework for Node.js', category: 'Backend Framework' },
  { id: 13, slug: 'fastify', name: 'Fastify', description: 'Fast and low overhead web framework for Node.js', category: 'Backend Framework' },
  { id: 14, slug: 'nestjs', name: 'NestJS', description: 'Progressive Node.js framework for building scalable server-side applications', category: 'Backend Framework' },
  { id: 15, slug: 'django', name: 'Django', description: 'High-level Python web framework', category: 'Backend Framework' },
  { id: 16, slug: 'flask', name: 'Flask', description: 'Lightweight Python web framework', category: 'Backend Framework' },
  { id: 17, slug: 'fastapi', name: 'FastAPI', description: 'Modern, fast web framework for Python APIs', category: 'Backend Framework' },
  { id: 18, slug: 'rails', name: 'Ruby on Rails', description: 'Web application framework written in Ruby', category: 'Backend Framework' },
  { id: 19, slug: 'laravel', name: 'Laravel', description: 'PHP web framework with expressive, elegant syntax', category: 'Backend Framework' },
  { id: 20, slug: 'symfony', name: 'Symfony', description: 'PHP framework for web applications', category: 'Backend Framework' },
  { id: 21, slug: 'spring', name: 'Spring Framework', description: 'Java application framework and inversion of control container', category: 'Backend Framework' },
  { id: 22, slug: 'springboot', name: 'Spring Boot', description: 'Java framework that makes it easy to create stand-alone applications', category: 'Backend Framework' },
  { id: 23, slug: 'gin', name: 'Gin', description: 'HTTP web framework written in Go', category: 'Backend Framework' },
  { id: 24, slug: 'fiber', name: 'Fiber', description: 'Express inspired web framework for Go', category: 'Backend Framework' },
  { id: 25, slug: 'aspnetcore', name: 'ASP.NET Core', description: 'Cross-platform web framework for .NET', category: 'Backend Framework' },

  // Programming Languages
  { id: 26, slug: 'python', name: 'Python', description: 'High-level programming language', category: 'Programming Language' },
  { id: 27, slug: 'javascript', name: 'JavaScript', description: 'Programming language for web development', category: 'Programming Language' },
  { id: 28, slug: 'typescript', name: 'TypeScript', description: 'Typed superset of JavaScript', category: 'Programming Language' },
  { id: 29, slug: 'rust', name: 'Rust', description: 'Systems programming language focused on safety and performance', category: 'Programming Language' },
  { id: 30, slug: 'go', name: 'Go', description: 'Open source programming language by Google', category: 'Programming Language' },
  { id: 31, slug: 'java', name: 'Java', description: 'Object-oriented programming language', category: 'Programming Language' },
  { id: 32, slug: 'csharp', name: 'C#', description: 'Object-oriented programming language by Microsoft', category: 'Programming Language' },
  { id: 33, slug: 'cpp', name: 'C++', description: 'General-purpose programming language', category: 'Programming Language' },
  { id: 34, slug: 'ruby', name: 'Ruby', description: 'Dynamic, object-oriented programming language', category: 'Programming Language' },
  { id: 35, slug: 'php', name: 'PHP', description: 'Server-side scripting language', category: 'Programming Language' },
  { id: 36, slug: 'kotlin', name: 'Kotlin', description: 'Modern programming language that runs on the JVM', category: 'Programming Language' },
  { id: 37, slug: 'swift', name: 'Swift', description: 'Programming language for iOS and macOS development', category: 'Programming Language' },
  { id: 38, slug: 'dart', name: 'Dart', description: 'Programming language optimized for building mobile, desktop, server, and web applications', category: 'Programming Language' },

  // Databases
  { id: 39, slug: 'postgresql', name: 'PostgreSQL', description: 'Advanced open source relational database', category: 'Database' },
  { id: 40, slug: 'mysql', name: 'MySQL', description: 'Open source relational database management system', category: 'Database' },
  { id: 41, slug: 'mongodb', name: 'MongoDB', description: 'Document-oriented NoSQL database', category: 'Database' },
  { id: 42, slug: 'redis', name: 'Redis', description: 'In-memory data structure store', category: 'Database' },
  { id: 43, slug: 'sqlite', name: 'SQLite', description: 'Lightweight, serverless SQL database engine', category: 'Database' },
  { id: 44, slug: 'elasticsearch', name: 'Elasticsearch', description: 'Distributed search and analytics engine', category: 'Database' },
  { id: 45, slug: 'mariadb', name: 'MariaDB', description: 'Community-developed fork of MySQL', category: 'Database' },
  { id: 46, slug: 'cassandra', name: 'Apache Cassandra', description: 'Distributed NoSQL database', category: 'Database' },
  { id: 47, slug: 'couchdb', name: 'CouchDB', description: 'Document-oriented NoSQL database', category: 'Database' },
  { id: 48, slug: 'supabase', name: 'Supabase', description: 'Open source Firebase alternative', category: 'Database' },

  // DevOps & Infrastructure
  { id: 49, slug: 'docker', name: 'Docker', description: 'Containerization platform', category: 'DevOps' },
  { id: 50, slug: 'kubernetes', name: 'Kubernetes', description: 'Container orchestration platform', category: 'DevOps' },
  { id: 51, slug: 'terraform', name: 'Terraform', description: 'Infrastructure as Code tool', category: 'DevOps' },
  { id: 52, slug: 'ansible', name: 'Ansible', description: 'IT automation and configuration management tool', category: 'DevOps' },
  { id: 53, slug: 'jenkins', name: 'Jenkins', description: 'Open source automation server', category: 'DevOps' },
  { id: 54, slug: 'nginx', name: 'Nginx', description: 'Web server and reverse proxy', category: 'DevOps' },
  { id: 55, slug: 'apache', name: 'Apache HTTP Server', description: 'Open source web server', category: 'DevOps' },
  { id: 56, slug: 'prometheus', name: 'Prometheus', description: 'Monitoring and alerting toolkit', category: 'DevOps' },
  { id: 57, slug: 'grafana', name: 'Grafana', description: 'Analytics and monitoring platform', category: 'DevOps' },
  { id: 58, slug: 'gitlab', name: 'GitLab', description: 'DevOps platform for the entire software development lifecycle', category: 'DevOps' },

  // Mobile Development
  { id: 59, slug: 'reactnative', name: 'React Native', description: 'Framework for building native mobile apps using React', category: 'Mobile Framework' },
  { id: 60, slug: 'flutter', name: 'Flutter', description: 'UI toolkit for building natively compiled applications', category: 'Mobile Framework' },
  { id: 61, slug: 'ionic', name: 'Ionic', description: 'Cross-platform mobile app development framework', category: 'Mobile Framework' },
  { id: 62, slug: 'xamarin', name: 'Xamarin', description: 'Cross-platform mobile development framework', category: 'Mobile Framework' },
  { id: 63, slug: 'cordova', name: 'Apache Cordova', description: 'Mobile application development framework', category: 'Mobile Framework' },

  // Machine Learning & AI
  { id: 64, slug: 'tensorflow', name: 'TensorFlow', description: 'Machine learning framework by Google', category: 'Machine Learning' },
  { id: 65, slug: 'pytorch', name: 'PyTorch', description: 'Deep learning framework by Facebook', category: 'Machine Learning' },
  { id: 66, slug: 'scikitlearn', name: 'Scikit-learn', description: 'Machine learning library for Python', category: 'Machine Learning' },
  { id: 67, slug: 'keras', name: 'Keras', description: 'High-level neural networks API', category: 'Machine Learning' },
  { id: 68, slug: 'pandas', name: 'Pandas', description: 'Data analysis and manipulation library for Python', category: 'Machine Learning' },
  { id: 69, slug: 'numpy', name: 'NumPy', description: 'Fundamental package for scientific computing with Python', category: 'Machine Learning' },
  { id: 70, slug: 'jupyter', name: 'Jupyter', description: 'Interactive computing environment', category: 'Machine Learning' },
  { id: 71, slug: 'opencv', name: 'OpenCV', description: 'Computer vision and machine learning software library', category: 'Machine Learning' },
  { id: 72, slug: 'huggingface', name: 'Hugging Face', description: 'Platform for machine learning models and datasets', category: 'Machine Learning' },

  // CSS Frameworks & Tools
  { id: 73, slug: 'tailwindcss', name: 'Tailwind CSS', description: 'Utility-first CSS framework', category: 'CSS Framework' },
  { id: 74, slug: 'bootstrap', name: 'Bootstrap', description: 'Popular CSS framework for responsive design', category: 'CSS Framework' },
  { id: 75, slug: 'bulma', name: 'Bulma', description: 'Modern CSS framework based on Flexbox', category: 'CSS Framework' },
  { id: 76, slug: 'materialui', name: 'Material-UI', description: 'React components for faster and easier web development', category: 'CSS Framework' },
  { id: 77, slug: 'sass', name: 'Sass', description: 'CSS extension language', category: 'CSS Framework' },

  // Build Tools & Bundlers
  { id: 78, slug: 'webpack', name: 'Webpack', description: 'Module bundler for JavaScript applications', category: 'Build Tool' },
  { id: 79, slug: 'vite', name: 'Vite', description: 'Fast build tool and development server', category: 'Build Tool' },
  { id: 80, slug: 'rollup', name: 'Rollup', description: 'Module bundler for JavaScript', category: 'Build Tool' },
  { id: 81, slug: 'parcel', name: 'Parcel', description: 'Zero configuration web application bundler', category: 'Build Tool' },
  { id: 82, slug: 'gulp', name: 'Gulp', description: 'Task runner and build system', category: 'Build Tool' },

  // Testing Frameworks
  { id: 83, slug: 'jest', name: 'Jest', description: 'JavaScript testing framework', category: 'Testing Framework' },
  { id: 84, slug: 'cypress', name: 'Cypress', description: 'End-to-end testing framework', category: 'Testing Framework' },
  { id: 85, slug: 'playwright', name: 'Playwright', description: 'Browser automation testing framework', category: 'Testing Framework' },
  { id: 86, slug: 'selenium', name: 'Selenium', description: 'Web browser automation framework', category: 'Testing Framework' },
  { id: 87, slug: 'mocha', name: 'Mocha', description: 'JavaScript test framework', category: 'Testing Framework' },

  // Version Control & CI/CD
  { id: 88, slug: 'git', name: 'Git', description: 'Distributed version control system', category: 'Version Control' },
  { id: 89, slug: 'githubactions', name: 'GitHub Actions', description: 'CI/CD platform by GitHub', category: 'CI/CD' },
  { id: 90, slug: 'circleci', name: 'CircleCI', description: 'Continuous integration and delivery platform', category: 'CI/CD' },
  { id: 91, slug: 'travisci', name: 'Travis CI', description: 'Continuous integration service', category: 'CI/CD' },

  // Game Development
  { id: 92, slug: 'unity', name: 'Unity', description: 'Cross-platform game engine', category: 'Game Development' },
  { id: 93, slug: 'unreal', name: 'Unreal Engine', description: 'Game engine by Epic Games', category: 'Game Development' },
  { id: 94, slug: 'godot', name: 'Godot', description: 'Open source game engine', category: 'Game Development' },

  // Package Managers & Tools
  { id: 95, slug: 'npm', name: 'npm', description: 'Package manager for Node.js', category: 'Package Manager' },
  { id: 96, slug: 'yarn', name: 'Yarn', description: 'Fast, reliable, and secure dependency management', category: 'Package Manager' },
  { id: 97, slug: 'pip', name: 'pip', description: 'Package installer for Python', category: 'Package Manager' },
  { id: 98, slug: 'helm', name: 'Helm', description: 'Package manager for Kubernetes', category: 'Package Manager' },

  // Operating Systems & Platforms
  { id: 99, slug: 'linux', name: 'Linux', description: 'Open source operating system', category: 'Operating System' },
  { id: 100, slug: 'ubuntu', name: 'Ubuntu', description: 'Popular Linux distribution', category: 'Operating System' },
  { id: 101, slug: 'debian', name: 'Debian', description: 'Stable Linux distribution', category: 'Operating System' },
  { id: 102, slug: 'centos', name: 'CentOS', description: 'Community-supported Linux distribution', category: 'Operating System' },

  // Cloud & Hosting
  { id: 103, slug: 'aws', name: 'Amazon Web Services', description: 'Cloud computing platform', category: 'Cloud Platform' },
  { id: 104, slug: 'gcp', name: 'Google Cloud Platform', description: 'Cloud computing services by Google', category: 'Cloud Platform' },
  { id: 105, slug: 'azure', name: 'Microsoft Azure', description: 'Cloud computing platform by Microsoft', category: 'Cloud Platform' },
  { id: 106, slug: 'vercel', name: 'Vercel', description: 'Frontend cloud platform', category: 'Cloud Platform' },
  { id: 107, slug: 'netlify', name: 'Netlify', description: 'Platform for modern web development', category: 'Cloud Platform' },

  // Communication & Messaging
  { id: 108, slug: 'rabbitmq', name: 'RabbitMQ', description: 'Message broker software', category: 'Messaging' },
  { id: 109, slug: 'kafka', name: 'Apache Kafka', description: 'Distributed event streaming platform', category: 'Messaging' }
]

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function migrateTechnologies() {
  console.log('🚀 Starting migration with numeric IDs and slug fields...')
  console.log(`📊 Will migrate to ${technologies.length} technologies with slugs`)

  try {
    // First, check if we need to add the slug column
    console.log('🧪 Testing if slug column exists...')
    const { data: testData, error: testError } = await supabase
      .from('technologies')
      .insert({
        name: 'Test Tech',
        description: 'Test',
        category: 'Test',
        slug: 'test'
      })
      .select()

    if (testError && testError.message.includes('column "slug" of relation "technologies" does not exist')) {
      console.log('❌ Slug column does not exist. You need to add it manually in the Supabase dashboard.')
      console.log('📝 Please run this SQL in your Supabase SQL editor:')
      console.log('   ALTER TABLE technologies ADD COLUMN slug TEXT UNIQUE;')
      console.log('   CREATE INDEX idx_technologies_slug ON technologies(slug);')
      return
    } else if (testError) {
      console.log('❌ Other error testing schema:', testError.message)
      return
    } else {
      console.log('✅ Slug column exists')
      // Clean up test data
      await supabase.from('technologies').delete().eq('name', 'Test Tech')
    }

    // Clear existing data
    const { count: techCount } = await supabase
      .from('technologies')
      .select('*', { count: 'exact', head: true })

    if (techCount > 0) {
      console.log('🗑️  Clearing existing technologies...')
      await supabase.from('technologies').delete().neq('id', 0)
      console.log('✅ Cleared existing technologies')
    }

    // Insert technologies with numeric IDs and slugs
    console.log('📥 Inserting technologies with numeric IDs and slug fields...')
    const batchSize = 25
    let successCount = 0

    for (let i = 0; i < technologies.length; i += batchSize) {
      const batch = technologies.slice(i, i + batchSize)

      const technologiesToInsert = batch.map(tech => ({
        name: tech.name,
        description: tech.description,
        category: tech.category,
        slug: tech.slug
      }))

      const { data, error: insertError } = await supabase
        .from('technologies')
        .insert(technologiesToInsert)
        .select()

      if (insertError) {
        console.error(`❌ Error inserting batch ${Math.floor(i / batchSize) + 1}:`, insertError)
        continue
      }

      successCount += batch.length
      console.log(`✅ Inserted batch ${Math.floor(i / batchSize) + 1}: ${batch.length} technologies`)
    }

    console.log(`🎉 Migration completed successfully!`)
    console.log(`📊 Successfully migrated ${successCount}/${technologies.length} technologies with slugs`)

    // Verify the migration
    const { data: sample } = await supabase
      .from('technologies')
      .select('id, name, slug, category')
      .limit(10)

    console.log('\n📋 Sample of technologies with slugs:')
    sample?.forEach(tech => {
      console.log(`   - ${tech.slug} (ID: ${tech.id}) → ${tech.name} (${tech.category})`)
    })

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