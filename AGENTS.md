# AGENTS.md - Developer Guidelines for fe-kalimasada

This is a React + TypeScript + Vite application with shadcn/ui components, Tailwind CSS v4, TanStack Query, React Router, and Zustand. It features role-based authentication (admin, ustadz, ortu, santri).

## Build, Lint, and Test Commands

**Package Manager:** pnpm (use `npm` commands as shown, but pnpm is recommended)

```bash
npm run dev        # Start Vite development server
npm run build      # TypeScript check + Vite build (production-optimized)
npm run lint       # Run ESLint on all files
npm run preview    # Preview production build locally
npx tsc --noEmit   # Standalone type checking
```

**Testing:** This project does not currently have a test suite. To add tests in the future, use Vitest as the test runner with test files named `*.test.ts` or `*.spec.ts`.

## Code Style Guidelines

### General Principles
- Use functional components with hooks
- Prefer arrow functions
- TypeScript strict mode enabled
- Keep components focused (< 200 lines)

### Imports

**Order (top to bottom):**
1. External libraries (React, React Router, TanStack Query)
2. shadcn/ui and Radix components
3. Internal features/modules
4. Store (Zustand)
5. Hooks
6. Utils
7. Types
8. Assets

**Path aliases:** `@/*` resolves to `./src/*`

```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import useUser from '@/store/useUser';
import { useLoginMutation } from '@/features/authentication/hooks/useLoginMutation';
import { formatDate } from '@/utils/formatDate';
import type { User } from '@/types/user';
```

### Formatting

Prettier settings (no config file found, use these):
```json
{
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "arrowParens": "always",
  "printWidth": 80,
  "endOfLine": "lf"
}
```

### TypeScript

- Explicit types for function params and return types
- Use `type` for unions, `interface` for objects
- Use `zod` for runtime validation (already installed)
- Unused variables trigger build errors (prefix with `_`)

```typescript
interface User {
  id: string;
  name: string;
  role: 'admin' | 'ustadz' | 'santri' | 'ortu';
}

const getUserName = (user: User): string => user.name;

// Ignore unused params
const handleClick = (_event: React.MouseEvent) => {
  console.log('clicked');
};
```

### Naming Conventions

- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Files**: kebab-case utilities, PascalCase components (e.g., `format-date.ts`, `LoginForm.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useLoginMutation.ts`)
- **Store**: camelCase (e.g., `useUser.ts`)
- **Types**: PascalCase (e.g., `UserType.ts`)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `USER_ROLES`)

### Component Structure

Order within files:
1. Imports
2. Type definitions
3. Zod schemas (if any)
4. Component function
5. Export

```typescript
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [email, setEmail] = useState('');
  return (
    <form>
      <Input value={email} onChange={(e) => setEmail(e.target.value)} />
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

### Error Handling

- Use try/catch for async operations
- Display errors via `react-hot-toast`
- Prefix unused errors with `_`

```typescript
try {
  const data = await fetchUser(id);
  setUser(data);
} catch (_err) {
  toast.error('Gagal memuat data pengguna');
}
```

### State Management

- **Local state**: `useState`
- **Global state**: Zustand stores in `src/store/`
- **Server state**: TanStack Query

```typescript
import { create } from 'zustand';

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
```

### UI Components

- Use shadcn/ui from `@/components/ui/`
- Use Tailwind CSS with `@tailwindcss/vite`
- Use `cn()` for conditional classes

```typescript
import { cn } from '@/lib/utils';
<Button className={cn('base', isActive && 'active')} />
```

### API Calls

- Use TanStack Query (`useQuery`, `useMutation`)
- Create services in `features/*/service/`
- Create hooks in `features/*/hooks/`

### Folder Structure

```
src/
├── app/              # App configuration and routing
├── components/       # Shared UI components
│   └── ui/          # shadcn/ui components
├── features/        # Feature-based modules
│   ├── authentication/
│   ├── admin/
│   ├── ortu/
│   ├── ustadz/
│   └── santri/
├── hooks/           # Shared custom hooks
├── lib/             # Utility functions
├── middleware/      # Route guards
├── store/           # Zustand stores
├── types/           # Global types
└── utils/           # Utility functions
```

### ESLint Rules

Key rules (from `eslint.config.js`):
- `@typescript-eslint/no-unused-vars`: warn (use `_` prefix)
- react-hooks rules (recommended-latest)
- react-refresh rules for Vite HMR

### Common Patterns

**React Router:**
```typescript
const navigate = useNavigate();
navigate('/path');
```

**React Hook Form + Zod:**
```typescript
const form = useForm<FormValues>({ resolver: zodResolver(schema) });
```

## Additional Notes

- Tailwind CSS 4.1.11 with `@tailwindcss/vite` plugin
- JWT authentication stored in localStorage with `jwt-decode`
- Role-based routing implemented in `src/middleware/RoleRedirect.tsx`

## Key Dependencies

**Core Framework:**
- React 18.2.0, React DOM 18.2.0
- Vite 7.0.4 (build tool)
- TypeScript ~5.8.3

**UI & Components:**
- shadcn/ui (built on Radix UI)
- Tailwind CSS 4.1.11
- lucide-react (icons)
- recharts (data visualization)

**State & Data:**
- TanStack Query 5.85.5 (server state)
- Zustand 5.0.7 (local state)
- React Hook Form 7.62.0 (form management)
- Zod 4.0.17 (runtime validation)

**Routing & Navigation:**
- React Router DOM 7.7.1
- React Helmet Async 2.0.5 (head management)

**Development Tools:**
- ESLint 9.30.1 with typescript-eslint
- TypeScript ESLint 8.35.1
- Globals 16.3.0
