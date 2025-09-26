const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

// Technology data with the current schema (numeric IDs)
const technologies = [
  // Frontend Frameworks & Libraries
  { name: 'React', description: 'A JavaScript library for building user interfaces', category: 'Frontend Framework' },
  { name: 'Vue.js', description: 'Progressive JavaScript framework for building UIs', category: 'Frontend Framework' },
  { name: 'Angular', description: 'TypeScript-based web application framework', category: 'Frontend Framework' },
  { name: 'Svelte', description: 'Cybernetically enhanced web apps framework', category: 'Frontend Framework' },
  { name: 'Next.js', description: 'React framework for production applications', category: 'Frontend Framework' },
  { name: 'Nuxt.js', description: 'Vue.js framework for universal applications', category: 'Frontend Framework' },
  { name: 'Gatsby', description: 'Static site generator for React', category: 'Frontend Framework' },
  { name: 'Remix', description: 'Full-stack web framework focused on web standards', category: 'Frontend Framework' },
  { name: 'SolidJS', description: 'Simple and performant reactive JavaScript framework', category: 'Frontend Framework' },
  { name: 'Alpine.js', description: 'Minimal framework for composing JavaScript behavior', category: 'Frontend Framework' },

  // Backend Frameworks
  { name: 'Node.js', description: 'JavaScript runtime built on Chrome V8 engine', category: 'Backend Runtime' },
  { name: 'Express', description: 'Fast, unopinionated web framework for Node.js', category: 'Backend Framework' },
  { name: 'Fastify', description: 'Fast and low overhead web framework for Node.js', category: 'Backend Framework' },
  { name: 'NestJS', description: 'Progressive Node.js framework for building scalable server-side applications', category: 'Backend Framework' },
  { name: 'Django', description: 'High-level Python web framework', category: 'Backend Framework' },
  { name: 'Flask', description: 'Lightweight Python web framework', category: 'Backend Framework' },
  { name: 'FastAPI', description: 'Modern, fast web framework for Python APIs', category: 'Backend Framework' },
  { name: 'Ruby on Rails', description: 'Web application framework written in Ruby', category: 'Backend Framework' },
  { name: 'Laravel', description: 'PHP web framework with expressive, elegant syntax', category: 'Backend Framework' },
  { name: 'Symfony', description: 'PHP framework for web applications', category: 'Backend Framework' },
  { name: 'Spring Framework', description: 'Java application framework and inversion of control container', category: 'Backend Framework' },
  { name: 'Spring Boot', description: 'Java framework that makes it easy to create stand-alone applications', category: 'Backend Framework' },
  { name: 'Gin', description: 'HTTP web framework written in Go', category: 'Backend Framework' },
  { name: 'Fiber', description: 'Express inspired web framework for Go', category: 'Backend Framework' },
  { name: 'ASP.NET Core', description: 'Cross-platform web framework for .NET', category: 'Backend Framework' },

  // Programming Languages
  { name: 'Python', description: 'High-level programming language', category: 'Programming Language' },
  { name: 'JavaScript', description: 'Programming language for web development', category: 'Programming Language' },
  { name: 'TypeScript', description: 'Typed superset of JavaScript', category: 'Programming Language' },
  { name: 'Rust', description: 'Systems programming language focused on safety and performance', category: 'Programming Language' },
  { name: 'Go', description: 'Open source programming language by Google', category: 'Programming Language' },
  { name: 'Java', description: 'Object-oriented programming language', category: 'Programming Language' },
  { name: 'C#', description: 'Object-oriented programming language by Microsoft', category: 'Programming Language' },
  { name: 'C++', description: 'General-purpose programming language', category: 'Programming Language' },
  { name: 'Ruby', description: 'Dynamic, object-oriented programming language', category: 'Programming Language' },
  { name: 'PHP', description: 'Server-side scripting language', category: 'Programming Language' },
  { name: 'Kotlin', description: 'Modern programming language that runs on the JVM', category: 'Programming Language' },
  { name: 'Swift', description: 'Programming language for iOS and macOS development', category: 'Programming Language' },
  { name: 'Dart', description: 'Programming language optimized for building mobile, desktop, server, and web applications', category: 'Programming Language' },

  // Databases
  { name: 'PostgreSQL', description: 'Advanced open source relational database', category: 'Database' },
  { name: 'MySQL', description: 'Open source relational database management system', category: 'Database' },
  { name: 'MongoDB', description: 'Document-oriented NoSQL database', category: 'Database' },
  { name: 'Redis', description: 'In-memory data structure store', category: 'Database' },
  { name: 'SQLite', description: 'Lightweight, serverless SQL database engine', category: 'Database' },
  { name: 'Elasticsearch', description: 'Distributed search and analytics engine', category: 'Database' },
  { name: 'MariaDB', description: 'Community-developed fork of MySQL', category: 'Database' },
  { name: 'Apache Cassandra', description: 'Distributed NoSQL database', category: 'Database' },
  { name: 'CouchDB', description: 'Document-oriented NoSQL database', category: 'Database' },
  { name: 'Supabase', description: 'Open source Firebase alternative', category: 'Database' },

  // DevOps & Infrastructure
  { name: 'Docker', description: 'Containerization platform', category: 'DevOps' },
  { name: 'Kubernetes', description: 'Container orchestration platform', category: 'DevOps' },
  { name: 'Terraform', description: 'Infrastructure as Code tool', category: 'DevOps' },
  { name: 'Ansible', description: 'IT automation and configuration management tool', category: 'DevOps' },
  { name: 'Jenkins', description: 'Open source automation server', category: 'DevOps' },
  { name: 'Nginx', description: 'Web server and reverse proxy', category: 'DevOps' },
  { name: 'Apache HTTP Server', description: 'Open source web server', category: 'DevOps' },
  { name: 'Prometheus', description: 'Monitoring and alerting toolkit', category: 'DevOps' },
  { name: 'Grafana', description: 'Analytics and monitoring platform', category: 'DevOps' },
  { name: 'GitLab', description: 'DevOps platform for the entire software development lifecycle', category: 'DevOps' },

  // Mobile Development
  { name: 'React Native', description: 'Framework for building native mobile apps using React', category: 'Mobile Framework' },
  { name: 'Flutter', description: 'UI toolkit for building natively compiled applications', category: 'Mobile Framework' },
  { name: 'Ionic', description: 'Cross-platform mobile app development framework', category: 'Mobile Framework' },
  { name: 'Xamarin', description: 'Cross-platform mobile development framework', category: 'Mobile Framework' },
  { name: 'Apache Cordova', description: 'Mobile application development framework', category: 'Mobile Framework' },

  // Machine Learning & AI
  { name: 'TensorFlow', description: 'Machine learning framework by Google', category: 'Machine Learning' },
  { name: 'PyTorch', description: 'Deep learning framework by Facebook', category: 'Machine Learning' },
  { name: 'Scikit-learn', description: 'Machine learning library for Python', category: 'Machine Learning' },
  { name: 'Keras', description: 'High-level neural networks API', category: 'Machine Learning' },
  { name: 'Pandas', description: 'Data analysis and manipulation library for Python', category: 'Machine Learning' },
  { name: 'NumPy', description: 'Fundamental package for scientific computing with Python', category: 'Machine Learning' },
  { name: 'Jupyter', description: 'Interactive computing environment', category: 'Machine Learning' },
  { name: 'OpenCV', description: 'Computer vision and machine learning software library', category: 'Machine Learning' },
  { name: 'Hugging Face', description: 'Platform for machine learning models and datasets', category: 'Machine Learning' },

  // CSS Frameworks & Tools
  { name: 'Tailwind CSS', description: 'Utility-first CSS framework', category: 'CSS Framework' },
  { name: 'Bootstrap', description: 'Popular CSS framework for responsive design', category: 'CSS Framework' },
  { name: 'Bulma', description: 'Modern CSS framework based on Flexbox', category: 'CSS Framework' },
  { name: 'Material-UI', description: 'React components for faster and easier web development', category: 'CSS Framework' },
  { name: 'Sass', description: 'CSS extension language', category: 'CSS Framework' },

  // Build Tools & Bundlers
  { name: 'Webpack', description: 'Module bundler for JavaScript applications', category: 'Build Tool' },
  { name: 'Vite', description: 'Fast build tool and development server', category: 'Build Tool' },
  { name: 'Rollup', description: 'Module bundler for JavaScript', category: 'Build Tool' },
  { name: 'Parcel', description: 'Zero configuration web application bundler', category: 'Build Tool' },
  { name: 'Gulp', description: 'Task runner and build system', category: 'Build Tool' },

  // Testing Frameworks
  { name: 'Jest', description: 'JavaScript testing framework', category: 'Testing Framework' },
  { name: 'Cypress', description: 'End-to-end testing framework', category: 'Testing Framework' },
  { name: 'Playwright', description: 'Browser automation testing framework', category: 'Testing Framework' },
  { name: 'Selenium', description: 'Web browser automation framework', category: 'Testing Framework' },
  { name: 'Mocha', description: 'JavaScript test framework', category: 'Testing Framework' },

  // Version Control & CI/CD
  { name: 'Git', description: 'Distributed version control system', category: 'Version Control' },
  { name: 'GitHub Actions', description: 'CI/CD platform by GitHub', category: 'CI/CD' },
  { name: 'CircleCI', description: 'Continuous integration and delivery platform', category: 'CI/CD' },
  { name: 'Travis CI', description: 'Continuous integration service', category: 'CI/CD' },

  // Game Development
  { name: 'Unity', description: 'Cross-platform game engine', category: 'Game Development' },
  { name: 'Unreal Engine', description: 'Game engine by Epic Games', category: 'Game Development' },
  { name: 'Godot', description: 'Open source game engine', category: 'Game Development' },

  // Package Managers & Tools
  { name: 'npm', description: 'Package manager for Node.js', category: 'Package Manager' },
  { name: 'Yarn', description: 'Fast, reliable, and secure dependency management', category: 'Package Manager' },
  { name: 'pip', description: 'Package installer for Python', category: 'Package Manager' },
  { name: 'Helm', description: 'Package manager for Kubernetes', category: 'Package Manager' },

  // Operating Systems & Platforms
  { name: 'Linux', description: 'Open source operating system', category: 'Operating System' },
  { name: 'Ubuntu', description: 'Popular Linux distribution', category: 'Operating System' },
  { name: 'Debian', description: 'Stable Linux distribution', category: 'Operating System' },
  { name: 'CentOS', description: 'Community-supported Linux distribution', category: 'Operating System' },

  // Cloud & Hosting
  { name: 'Amazon Web Services', description: 'Cloud computing platform', category: 'Cloud Platform' },
  { name: 'Google Cloud Platform', description: 'Cloud computing services by Google', category: 'Cloud Platform' },
  { name: 'Microsoft Azure', description: 'Cloud computing platform by Microsoft', category: 'Cloud Platform' },
  { name: 'Vercel', description: 'Frontend cloud platform', category: 'Cloud Platform' },
  { name: 'Netlify', description: 'Platform for modern web development', category: 'Cloud Platform' },

  // Communication & Messaging
  { name: 'RabbitMQ', description: 'Message broker software', category: 'Messaging' },
  { name: 'Apache Kafka', description: 'Distributed event streaming platform', category: 'Messaging' }
]

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function populateTechnologies() {
  console.log('🚀 Starting population with current schema (numeric IDs)...')
  console.log(`📊 Will populate ${technologies.length} technologies`)

  try {
    // Clear existing data
    const { count: techCount } = await supabase
      .from('technologies')
      .select('*', { count: 'exact', head: true })

    if (techCount > 0) {
      console.log('🗑️  Clearing existing technologies...')
      await supabase.from('technologies').delete().neq('id', 0)
      console.log('✅ Cleared existing technologies')
    }

    // Insert technologies (database will auto-assign numeric IDs)
    console.log('📥 Inserting technologies with auto-generated numeric IDs...')
    const batchSize = 25
    let successCount = 0

    for (let i = 0; i < technologies.length; i += batchSize) {
      const batch = technologies.slice(i, i + batchSize)

      const { data, error: insertError } = await supabase
        .from('technologies')
        .insert(batch)
        .select()

      if (insertError) {
        console.error(`❌ Error inserting batch ${Math.floor(i / batchSize) + 1}:`, insertError)
        continue
      }

      successCount += batch.length
      console.log(`✅ Inserted batch ${Math.floor(i / batchSize) + 1}: ${batch.length} technologies`)
    }

    console.log(`🎉 Population completed successfully!`)
    console.log(`📊 Successfully populated ${successCount}/${technologies.length} technologies`)

    // Verify the migration
    const { data: sample } = await supabase
      .from('technologies')
      .select('id, name, category')
      .limit(10)

    console.log('\n📋 Sample of technologies:')
    sample?.forEach(tech => {
      console.log(`   - ID ${tech.id}: ${tech.name} (${tech.category})`)
    })

    console.log('\n🔗 The existing slug system will continue to work with name-based lookups')
    console.log('   - /react will find "React" by name')
    console.log('   - /vuejs will find "Vue.js" by name conversion')
    console.log('   - /cpp will find "C++" by name conversion')

  } catch (error) {
    console.error('💥 Population failed:', error)
    process.exit(1)
  }
}

populateTechnologies()