# Eros — Copilot Instructions

Recruitment platform built with TanStack Start, React 19, Supabase, and Tailwind CSS v4. Deployed on Netlify.

## Quick Reference

| Action           | Command                             |
| ---------------- | ----------------------------------- |
| Dev server       | `npm run dev`                       |
| Build & deploy   | `npm run build`                     |
| Test             | `npm run test`                      |
| Lint             | `npm run lint`                      |
| Format           | `npm run format`                    |
| Fix all          | `npm run check`                     |
| Add UI component | `pnpm dlx shadcn@latest add <name>` |

## Tech Stack

- **Framework**: TanStack Start (Vite + Nitro SSR)
- **UI**: React 19, Tailwind CSS v4 (OKLCH color system), Shadcn (new-york style, no RSC)
- **Routing**: TanStack Router — file-based routes in `src/routes/`
- **Data fetching**: TanStack React Query v5 — `queryOptions()` factories + `useSuspenseQuery()`
- **Forms**: TanStack React Form — `useAppForm()` hook with `form.AppField` render-prop pattern
- **Backend**: Supabase (browser client via `@supabase/ssr`)
- **Tables**: TanStack React Table v8
- **Animation**: Framer Motion
- **Drag & drop**: dnd-kit
- **Validation**: Zod
- **Icons**: Lucide React + Heroicons
- **UI primitives**: Headless UI

## Project Structure

```
src/
├── components/          # Feature-based component folders
│   ├── hooks/           # Form hook factories (useAppForm, form-context)
│   ├── jobs/            # Job management (CreateJob/, EditJob, etc.)
│   ├── seekers/         # Candidate display components
│   ├── discover/        # Discovery/matching UI
│   ├── navigation/      # Navbar, RecruiterSidebar
│   ├── ui/              # Reusable UI primitives (buttons/, form/, inputs/, icons/)
│   └── ...
├── routes/              # File-based route definitions (auto-generates routeTree.gen.ts)
├── server/              # Supabase query functions organized by domain
│   ├── recruiter/       # jobs-queries.ts, discover-queries.ts
│   ├── seeker/          # seeker-api.ts
│   └── general/         # chat-queries.ts, general-api.ts
├── shared/              # Cross-cutting concerns
│   ├── types/           # .d.ts type definition files
│   ├── constants/       # Shared constants
│   ├── mapping/         # Data transformers (flatten nested Supabase data)
│   └── configurations/  # App configuration
├── utils/               # Utilities (supabase.ts, helpers.ts, filters.ts, transformers.ts)
├── hooks/               # App-level React hooks
├── integrations/        # Third-party setup (tanstack-query/)
├── lib/                 # Internal utilities (cn())
└── assets/              # Static assets and custom icons
```

## Code Conventions

### Imports & Paths

- Always use the `@/` path alias for imports (maps to `src/`).
- Never use relative paths outside the current directory.

### Naming

- **Components & types**: PascalCase files and exports (`CandidateCard.tsx`)
- **Hooks**: camelCase with `use` prefix (`useAppForm.tsx`)
- **Utilities/queries**: camelCase (`jobs-queries.ts`, `helpers.ts`)
- **Type definitions**: `.d.ts` files in `src/shared/types/` — types only, no implementations

### Exports

- Prefer **named exports** for components and utilities.
- Use barrel `index.ts` files for UI component groups.
- Default exports are only used for route components.

### Formatting (Prettier)

- 2 spaces, no tabs, single quotes, trailing commas, semicolons.

### TypeScript

- Strict mode enabled. No unused locals or parameters.
- Define component props as `interface` types above the component.

## Patterns

### Data Fetching

1. Define `queryOptions()` factories in `src/server/<domain>/` files.
2. Pre-fetch in route `loader` via `queryClient.ensureQueryData()`.
3. Consume in components with `useSuspenseQuery()`.

```tsx
// src/server/recruiter/jobs-queries.ts
export const jobsQueryOptions = (search: JobSearch) =>
  queryOptions({
    queryKey: ['jobs', search],
    queryFn: async () => {
      /* Supabase query */
    },
  });

// src/routes/recruiter/jobs.tsx (loader)
loader: ({ context }) =>
  context.queryClient.ensureQueryData(jobsQueryOptions({}));

// Component
const { data } = useSuspenseQuery(jobsQueryOptions(search));
```

### Forms (TanStack Form)

- Use `useAppForm()` from `@/components/hooks/useAppForm`.
- Render fields with `form.AppField` + children render prop.
- Available field components: `TextField`, `Checkbox`, `Toggle`.

```tsx
const form = useAppForm({ defaultValues: { jobTitle: '' } });

<form.AppField
  name="jobTitle"
  children={(field) => (
    <field.TextField label="Job Title" placeholder="Type here" />
  )}
/>;
```

### Styling

- Use Tailwind utility classes directly in JSX.
- Use `cn()` from `@/lib/utils` to merge conditional classes (wraps clsx + twMerge).
- Shadcn components follow the `new-york` style. No RSC — set `rsc: false`.
- Color tokens use CSS variables with OKLCH (e.g., `--primary`, `--secondary`).

### Components

- Props interface defined above the component.
- Accept `className` prop and merge with `cn()` or `twMerge()`.
- Multi-step flows use a context provider + steps array pattern (see `CreateJob/`).

### Supabase Queries

- Use `createBrowserClient()` from `@supabase/ssr`.
- Relation queries use dot-notation with `!inner` for required joins.
- Flatten nested Supabase responses into flat types via mapping functions in `src/shared/mapping/`.

## Pitfalls

- **Route tree**: `src/routeTree.gen.ts` is auto-generated — never edit manually.
- **Supabase joins**: Use `!inner` suffix for required relation joins (e.g., `table_ref!inner(column)`).
- **SSR externals**: React Query, Headless UI, Framer Motion, and MUI are externalized in SSR — don't add server-only logic that depends on their internals.
- **Form render props**: `form.AppField` requires a `children` function — do not pass JSX directly.
- **Environment variables**: Must be prefixed with `VITE_` to be available client-side.
