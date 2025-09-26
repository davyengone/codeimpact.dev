# Technologies Database Migration

This migration updates the technologies table with 100+ open-source technologies and introduces proper slug-based IDs.

## What This Migration Does

1. **Clears existing technologies** from the database
2. **Inserts 100 new open-source technologies** with proper categorization
3. **Uses clean slug IDs** like:
   - React → `react`
   - Vue.js → `vuejs`
   - Node.js → `nodejs`
   - C++ → `cpp`
   - ASP.NET Core → `aspnetcore`

## Categories Included

- **Frontend Frameworks** (React, Vue.js, Angular, Svelte, Next.js, etc.)
- **Backend Frameworks** (Express, Django, Rails, Spring Boot, etc.)
- **Programming Languages** (Python, JavaScript, TypeScript, Rust, Go, etc.)
- **Databases** (PostgreSQL, MongoDB, Redis, Elasticsearch, etc.)
- **DevOps Tools** (Docker, Kubernetes, Terraform, Jenkins, etc.)
- **Mobile Frameworks** (React Native, Flutter, Ionic, etc.)
- **Machine Learning** (TensorFlow, PyTorch, Scikit-learn, etc.)
- **CSS Frameworks** (Tailwind CSS, Bootstrap, Sass, etc.)
- **Build Tools** (Webpack, Vite, Rollup, etc.)
- **Testing Frameworks** (Jest, Cypress, Playwright, etc.)
- **And more...**

## Prerequisites

You need a Supabase service role key to run this migration. Add it to your `.env.local`:

```bash
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

You can find this key in your Supabase dashboard under Settings → API → Service Role Key.

## Running the Migration

```bash
npm run migrate:technologies
```

## What Happens After Migration

- The database will contain 100 professionally curated open-source technologies
- Each technology has a clean slug ID for better URLs
- Technologies are properly categorized
- The app will show these technologies in the rankings
- Users can vote on all these technologies

## Backup Recommendation

Since this migration clears existing data, ensure you have a backup if you have important technology data you want to preserve.

## Verification

After running the migration, you should see:
- Confirmation that all technologies were inserted
- A sample list of the inserted technologies
- The total count in the database

The migration will insert technologies in batches for reliability and provide detailed progress information.