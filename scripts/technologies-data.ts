export interface TechnologyData {
  id: string
  name: string
  description: string
  category: string
}

export const technologies: TechnologyData[] = [
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
  { id: 'materializeui', name: 'Material-UI', description: 'React components for faster and easier web development', category: 'CSS Framework' },
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
  { id: 'unity', name: 'Unity', description: 'Cross-platform game engine', category: 'Game Development' },
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
  { id: 'solr', name: 'Apache Solr', description: 'Enterprise search platform', category: 'Search Engine' },
  { id: 'algolia', name: 'Algolia', description: 'Search and discovery API platform', category: 'Search Engine' }
]