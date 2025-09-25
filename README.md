# CodeImpact.dev

A minimalist open source impact tracker built with Next.js and TypeScript. Track and visualize the economic impact of open source technologies through community contributions.

## Features

- 🏆 **Technology Rankings**: Clean, visually appealing ranking of open-source technologies
- 🔐 **GitHub Authentication**: Secure login using Clerk with GitHub OAuth
- 💰 **Impact Voting**: Authenticated users can contribute value assessments
- 🎨 **Minimalist Design**: White background with subtle blue accents using shadcn/ui
- 📱 **Responsive**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 15.5.4, React 19, TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Clerk with GitHub OAuth
- **Styling**: Tailwind CSS, shadcn/ui components
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Clerk account for authentication
- Supabase account for database

### Environment Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file and add your configuration:
   ```env
   # Clerk Configuration
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
   CLERK_SECRET_KEY=your_clerk_secret_key_here

   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

4. Set up Supabase database:
   - Create a new Supabase project
   - Copy your project URL and anon key to the `.env.local` file
   - Run the SQL schema from `supabase/schema.sql` in your Supabase SQL editor
   - This will create the necessary tables, views, and sample data

5. Configure Clerk for GitHub authentication:
   - Go to your Clerk dashboard
   - Navigate to "Social Login" settings
   - Enable GitHub OAuth
   - Add your GitHub OAuth app credentials

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build

```bash
npm run build
npm start
```

## User Stories

### 1. Technology Ranking Display
**As a user visiting the platform,** I want to see a clean, visually appealing ranking of open-source technologies, so that I can understand the economic impact contributed by each technology based on community input.

### 2. Social Authentication
**As a contributor,** I want to log in using GitHub, so that I can easily verify my identity and contribute the amount of value I believe a technology has brought to me.

### 3. Minimalist Platform Design
**As a platform owner,** I want the tool to be built using Next.js and TypeScript with a minimalistic design using white backgrounds and subtle blue accents, so that the interface is simple, modern, and easy to navigate.

## Project Structure

```
src/
├── app/
│   ├── sign-in/
│   │   └── page.tsx
│   ├── sign-up/
│   │   └── page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/           # shadcn/ui components
│   ├── Header.tsx    # Navigation header
│   └── VoteDialog.tsx # Voting modal
├── hooks/
│   ├── useTechnologies.ts # Technology data fetching
│   └── useVotes.ts   # Vote management
├── lib/
│   ├── supabase.ts   # Supabase client and types
│   └── utils.ts      # Utility functions
├── middleware.ts     # Clerk authentication middleware
└── supabase/
    └── schema.sql    # Database schema and seed data
```

## Database Schema

The application uses the following main tables:

- **technologies**: Stores open source technologies with categories
- **votes**: User impact assessments for technologies
- **technology_rankings**: View combining technologies with aggregated vote data

## Features

### Real-time Voting System
- Users can vote on technology impact values
- Existing votes can be updated
- Rankings update automatically based on community input

### Data Persistence
- All votes are stored in Supabase PostgreSQL database
- Row Level Security (RLS) ensures data integrity
- Real-time synchronization across users

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).
