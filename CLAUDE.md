# CodeImpact.dev - Claude Code Instructions

## Project Overview
CodeImpact.dev is a minimalist open source impact tracker built with Next.js and TypeScript. It allows users to track and visualize the economic impact of open source technologies through community voting and contributions.

## Technology Stack

### Core Framework
- **Next.js 15.5.4** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript 5** - Static typing
- **Tailwind CSS 4** - Styling framework with custom theme
- **shadcn/ui** - Component library (New York variant)

### Authentication & Database
- **Clerk** - Authentication provider with GitHub OAuth
- **Supabase** - PostgreSQL database and real-time features
- **Vercel Analytics** - Website analytics

### Key Libraries
- **Lucide React** - Icon library
- **Sonner** - Toast notifications
- **class-variance-authority** - Component variant management
- **clsx** & **tailwind-merge** - Utility class management

## Project Structure

```
/Users/davyengone/Documents/davyengone/codeimpact/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/             # Admin panel pages
│   │   │   ├── categories/    # Category management
│   │   │   ├── suggestions/   # Technology suggestions
│   │   │   ├── technologies/  # Technology management
│   │   │   └── users/         # User management
│   │   ├── sign-in/          # Authentication pages
│   │   ├── sign-up/
│   │   ├── layout.tsx        # Root layout with providers
│   │   ├── page.tsx          # Main homepage
│   │   └── globals.css       # Global styles with Tailwind
│   ├── components/           # React components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── Header.tsx       # Navigation header
│   │   ├── Footer.tsx       # Page footer
│   │   ├── VoteDialog.tsx   # Voting modal
│   │   ├── SuggestTechnologyDialog.tsx
│   │   ├── AdminNav.tsx     # Admin navigation
│   │   └── ThemeToggle.tsx  # Dark/light mode toggle
│   ├── contexts/
│   │   └── ThemeContext.tsx # Theme provider
│   ├── hooks/               # Custom React hooks
│   │   ├── useTechnologies.ts    # Technology data fetching
│   │   ├── useVotes.ts          # Vote management
│   │   ├── useOptimisticUpdates.ts # UI optimistic updates
│   │   └── useAdminTechnologies.ts # Admin functionality
│   ├── lib/                 # Utility libraries
│   │   ├── supabase.ts      # Supabase client & types
│   │   ├── utils.ts         # General utilities
│   │   ├── admin.ts         # Admin utilities
│   │   └── formatRevenue.ts # Currency formatting
│   └── middleware.ts        # Clerk auth middleware
├── supabase/
│   └── schema.sql          # Database schema & seed data
├── public/                 # Static assets
├── .claude/                # Claude Code settings
├── components.json         # shadcn/ui configuration
├── tsconfig.json          # TypeScript configuration
├── next.config.ts         # Next.js configuration
├── eslint.config.mjs      # ESLint configuration
└── package.json           # Dependencies & scripts
```

## Key Configuration Files

### Environment Variables (.env.local)
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key_here
CLERK_SECRET_KEY=your_secret_key_here
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### TypeScript Configuration
- Uses path aliases: `@/*` maps to `./src/*`
- Target: ES2017
- Strict mode enabled
- Next.js plugin configured

### Tailwind Configuration
- Uses Tailwind CSS 4 with `@theme inline` syntax
- Custom design system with CSS variables
- shadcn/ui integration with neutral base color
- Dark mode support with custom variant
- Uses Geist fonts (sans & mono)

## Development Commands

```bash
# Development
npm run dev          # Start development server (localhost:3000)
npm run build        # Build for production
npm start           # Start production server
npm run lint        # Run ESLint

# Package management
npm install         # Install dependencies
npx shadcn-ui add   # Add shadcn/ui components
```

## Database Schema

### Main Tables
- **technologies**: Open source technologies with categories
- **votes**: User impact assessments for technologies
- **technology_suggestions**: Community suggestions for new technologies

### Key Views
- **technology_rankings**: Technologies with aggregated vote data
- **pending_suggestions**: Admin view for suggestion management

### Database Features
- Row Level Security disabled (auth handled in app layer)
- Optimistic locking with updated_at timestamps
- Comprehensive indexing for performance
- Real-time capabilities through Supabase

## Authentication & Authorization

### User Authentication
- Clerk handles all authentication flows
- GitHub OAuth integration
- Middleware protects non-public routes
- Public routes: `/`, `/sign-in`, `/sign-up`

### Admin System
- Admin status stored in Supabase user metadata
- Admin routes under `/admin/*`
- Separate admin navigation component
- Admin can manage technologies, categories, and suggestions

## Key Features & Patterns

### Voting System
- Users can vote on technology impact values
- Optimistic UI updates for smooth UX
- One vote per user per technology (database constraint)
- Real-time ranking updates

### Technology Management
- Community can suggest new technologies
- Admin approval workflow for suggestions
- Categorized technology organization
- Search and filtering capabilities

### UI/UX Patterns
- Minimalist design with white background and blue accents
- Responsive design for mobile and desktop
- Toast notifications for user feedback
- Modal dialogs for voting and suggestions
- Dark/light mode toggle

### Custom Hooks Architecture
- `useTechnologies`: Fetch and manage technology data
- `useVotes`: Handle voting operations
- `useOptimisticUpdates`: Smooth UI updates before server sync
- `useAdminTechnologies`: Admin-specific operations

## Code Style & Standards

### Component Patterns
- Functional components with hooks
- TypeScript interfaces for props and data
- shadcn/ui component composition
- Consistent file naming (PascalCase for components)

### State Management
- React hooks for local state
- Custom hooks for shared logic
- Optimistic updates for better UX
- Context for theme management

### Styling Approach
- Tailwind utility classes
- CSS variables for theming
- Component variants with class-variance-authority
- Responsive design patterns

## Common Development Tasks

### Adding New Technologies
1. Use the suggest technology dialog (user flow)
2. Or directly insert via admin panel
3. Database automatically updates rankings view

### Adding New Components
1. Create in `/src/components/`
2. Use shadcn/ui as base when possible
3. Follow TypeScript interface patterns
4. Import utilities from `/src/lib/utils`

### Database Changes
1. Update `/supabase/schema.sql`
2. Apply changes in Supabase dashboard
3. Update TypeScript interfaces in `/src/lib/supabase.ts`
4. Update related hooks and components

### Adding New Routes
1. Create page in `/src/app/` directory
2. Update middleware if authentication required
3. Add navigation links as needed

## Testing & Quality

### Linting
- ESLint with Next.js and TypeScript rules
- Configured to ignore build directories
- Run with `npm run lint`

### Code Quality Practices
- TypeScript strict mode enabled
- Consistent import organization
- Error handling in async operations
- Optimistic UI patterns for better UX

## Deployment Considerations

### Build Process
- Next.js static optimization
- TypeScript compilation
- Tailwind CSS purging
- Environment variable validation

### Performance Features
- Server-side rendering with App Router
- Image optimization (Next.js built-in)
- Database indexing for queries
- Optimistic updates to reduce perceived latency

This codebase follows modern React/Next.js patterns with a focus on user experience, performance, and maintainable code structure. The voting system and admin panel provide a complete solution for community-driven technology impact tracking.