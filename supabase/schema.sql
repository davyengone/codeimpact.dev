-- Create technologies table
CREATE TABLE IF NOT EXISTS technologies (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create votes table
CREATE TABLE IF NOT EXISTS votes (
  id BIGSERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL, -- Clerk user ID
  technology_id BIGINT NOT NULL REFERENCES technologies(id) ON DELETE CASCADE,
  impact_value BIGINT NOT NULL CHECK (impact_value >= 0),
  reasoning TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, technology_id) -- One vote per user per technology
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON votes(user_id);
CREATE INDEX IF NOT EXISTS idx_votes_technology_id ON votes(technology_id);
CREATE INDEX IF NOT EXISTS idx_technologies_category ON technologies(category);

-- Create a view for technology rankings with aggregated data
CREATE OR REPLACE VIEW technology_rankings AS
SELECT
  t.id,
  t.name,
  t.description,
  t.category,
  COALESCE(COUNT(v.id), 0) as vote_count,
  COALESCE(AVG(v.impact_value), 0) as average_impact,
  COALESCE(SUM(v.impact_value), 0) as total_impact,
  t.created_at,
  t.updated_at
FROM technologies t
LEFT JOIN votes v ON t.id = v.technology_id
GROUP BY t.id, t.name, t.description, t.category, t.created_at, t.updated_at
ORDER BY total_impact DESC, vote_count DESC;

-- Insert initial technologies
INSERT INTO technologies (name, description, category) VALUES
('React', 'A JavaScript library for building user interfaces', 'Web Development'),
('Node.js', 'JavaScript runtime built on Chrome''s V8 JavaScript engine', 'Backend Development'),
('TypeScript', 'Typed superset of JavaScript that compiles to plain JavaScript', 'Programming Languages'),
('Python', 'High-level programming language for general-purpose programming', 'Programming Languages'),
('Docker', 'Platform for developing, shipping, and running applications', 'DevOps & Infrastructure'),
('Kubernetes', 'Container orchestration platform for automating deployment', 'DevOps & Infrastructure'),
('Vue.js', 'Progressive JavaScript framework for building user interfaces', 'Web Development'),
('PostgreSQL', 'Open source relational database management system', 'Data & Analytics'),
('Angular', 'Platform for building mobile and desktop web applications', 'Web Development'),
('Django', 'High-level Python web framework', 'Web Development'),
('Flask', 'Lightweight WSGI web application framework', 'Web Development'),
('Redis', 'In-memory data structure store', 'Data & Analytics'),
('Nginx', 'Web server and reverse proxy server', 'DevOps & Infrastructure'),
('Git', 'Distributed version control system', 'Development Tools'),
('Visual Studio Code', 'Source code editor developed by Microsoft', 'Development Tools'),
('TensorFlow', 'Open source machine learning framework', 'Machine Learning'),
('PyTorch', 'Open source machine learning library', 'Machine Learning'),
('React Native', 'Framework for building mobile apps using React', 'Mobile Development'),
('Flutter', 'UI toolkit for building natively compiled applications', 'Mobile Development')
ON CONFLICT (name) DO NOTHING;

-- Disable Row Level Security for now since we're using Clerk authentication
-- We'll handle permissions in the application layer
ALTER TABLE technologies DISABLE ROW LEVEL SECURITY;
ALTER TABLE votes DISABLE ROW LEVEL SECURITY;

-- Create technology suggestions table
CREATE TABLE IF NOT EXISTS technology_suggestions (
  id BIGSERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL, -- Clerk user ID of suggester
  name VARCHAR(100) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  suggested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  reviewed_by VARCHAR(255), -- Clerk user ID of admin who reviewed
  reviewed_at TIMESTAMP WITH TIME ZONE,
  -- Initial vote data (stored until approval)
  initial_impact_value BIGINT CHECK (initial_impact_value >= 0),
  initial_vote_reasoning TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_technology_suggestions_status ON technology_suggestions(status);
CREATE INDEX IF NOT EXISTS idx_technology_suggestions_user_id ON technology_suggestions(user_id);
CREATE INDEX IF NOT EXISTS idx_technology_suggestions_suggested_at ON technology_suggestions(suggested_at DESC);

-- Create a view for pending suggestions (for admin interface)
CREATE OR REPLACE VIEW pending_suggestions AS
SELECT
  ts.*,
  COUNT(*) OVER() as total_pending
FROM technology_suggestions ts
WHERE ts.status = 'pending'
ORDER BY ts.suggested_at DESC;

-- Disable Row Level Security for suggestions table
ALTER TABLE technology_suggestions DISABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Technologies are viewable by everyone" ON technologies;
DROP POLICY IF EXISTS "Authenticated users can insert technologies" ON technologies;
DROP POLICY IF EXISTS "Votes are viewable by everyone" ON votes;
DROP POLICY IF EXISTS "Users can insert their own votes" ON votes;
DROP POLICY IF EXISTS "Users can update their own votes" ON votes;
DROP POLICY IF EXISTS "Users can delete their own votes" ON votes;