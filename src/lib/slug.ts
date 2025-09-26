const SLUG_TO_NAME_MAP: Record<string, string> = {
  // Frontend Frameworks & Libraries
  'react': 'React',
  'vuejs': 'Vue.js',
  'angular': 'Angular',
  'svelte': 'Svelte',
  'nextjs': 'Next.js',
  'nuxtjs': 'Nuxt.js',
  'gatsby': 'Gatsby',
  'remix': 'Remix',
  'solidjs': 'SolidJS',
  'alpinejs': 'Alpine.js',

  // Backend Frameworks
  'nodejs': 'Node.js',
  'express': 'Express',
  'fastify': 'Fastify',
  'nestjs': 'NestJS',
  'django': 'Django',
  'flask': 'Flask',
  'fastapi': 'FastAPI',
  'rails': 'Ruby on Rails',
  'laravel': 'Laravel',
  'symfony': 'Symfony',
  'spring': 'Spring Framework',
  'springboot': 'Spring Boot',
  'gin': 'Gin',
  'fiber': 'Fiber',
  'aspnetcore': 'ASP.NET Core',

  // Programming Languages
  'python': 'Python',
  'javascript': 'JavaScript',
  'typescript': 'TypeScript',
  'rust': 'Rust',
  'go': 'Go',
  'java': 'Java',
  'csharp': 'C#',
  'cpp': 'C++',
  'ruby': 'Ruby',
  'php': 'PHP',
  'kotlin': 'Kotlin',
  'swift': 'Swift',
  'dart': 'Dart',

  // Databases
  'postgresql': 'PostgreSQL',
  'mysql': 'MySQL',
  'mongodb': 'MongoDB',
  'redis': 'Redis',
  'sqlite': 'SQLite',
  'elasticsearch': 'Elasticsearch',
  'mariadb': 'MariaDB',
  'cassandra': 'Apache Cassandra',
  'couchdb': 'CouchDB',
  'supabase': 'Supabase',

  // DevOps & Infrastructure
  'docker': 'Docker',
  'kubernetes': 'Kubernetes',
  'terraform': 'Terraform',
  'ansible': 'Ansible',
  'jenkins': 'Jenkins',
  'nginx': 'Nginx',
  'apache': 'Apache HTTP Server',
  'prometheus': 'Prometheus',
  'grafana': 'Grafana',
  'gitlab': 'GitLab',

  // Mobile Development
  'reactnative': 'React Native',
  'flutter': 'Flutter',
  'ionic': 'Ionic',
  'xamarin': 'Xamarin',
  'cordova': 'Apache Cordova',

  // Machine Learning & AI
  'tensorflow': 'TensorFlow',
  'pytorch': 'PyTorch',
  'scikitlearn': 'Scikit-learn',
  'keras': 'Keras',
  'pandas': 'Pandas',
  'numpy': 'NumPy',
  'jupyter': 'Jupyter',
  'opencv': 'OpenCV',
  'huggingface': 'Hugging Face',

  // CSS Frameworks & Tools
  'tailwindcss': 'Tailwind CSS',
  'bootstrap': 'Bootstrap',
  'bulma': 'Bulma',
  'materialui': 'Material-UI',
  'sass': 'Sass',

  // Build Tools & Bundlers
  'webpack': 'Webpack',
  'vite': 'Vite',
  'rollup': 'Rollup',
  'parcel': 'Parcel',
  'gulp': 'Gulp',

  // Testing Frameworks
  'jest': 'Jest',
  'cypress': 'Cypress',
  'playwright': 'Playwright',
  'selenium': 'Selenium',
  'mocha': 'Mocha',

  // Version Control & CI/CD
  'git': 'Git',
  'githubactions': 'GitHub Actions',
  'circleci': 'CircleCI',
  'travisci': 'Travis CI',

  // Game Development
  'unity': 'Unity',
  'unreal': 'Unreal Engine',
  'godot': 'Godot',

  // Package Managers & Tools
  'npm': 'npm',
  'yarn': 'Yarn',
  'pip': 'pip',
  'helm': 'Helm',

  // Operating Systems & Platforms
  'linux': 'Linux',
  'ubuntu': 'Ubuntu',
  'debian': 'Debian',
  'centos': 'CentOS',

  // Cloud & Hosting
  'aws': 'Amazon Web Services',
  'gcp': 'Google Cloud Platform',
  'azure': 'Microsoft Azure',
  'vercel': 'Vercel',
  'netlify': 'Netlify',

  // Communication & Messaging
  'rabbitmq': 'RabbitMQ',
  'kafka': 'Apache Kafka'
}

export function createSlug(name: string): string {
  // Check if we have a reverse mapping first
  const existingSlug = Object.entries(SLUG_TO_NAME_MAP).find(
    ([, mappedName]) => mappedName === name
  )?.[0]

  if (existingSlug) {
    return existingSlug
  }

  // Fallback to generic slug creation
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim()
}

export function slugToName(slug: string): string {
  // Use the mapping first
  const mappedName = SLUG_TO_NAME_MAP[slug.toLowerCase()]
  if (mappedName) {
    return mappedName
  }

  // Fallback to generic name conversion
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}