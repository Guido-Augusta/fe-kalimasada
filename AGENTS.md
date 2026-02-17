# AGENTS.md - Developer Guidelines for fe-kalimasada

This document provides guidelines for agentic coding agents working on this codebase.

## Project Overview

This is a React + TypeScript + Vite application with shadcn/ui components, Tailwind CSS, TanStack Query, React Router, and Zustand for state management. It features role-based authentication (admin, ustadz, ortu, siswa) with different dashboards for each role.

## Build, Lint, and Test Commands

### Development
```bash
npm run dev        # Start development server (Vite)
npm run preview    # Preview production build
```

### Build
```bash
npm run build      # TypeScript check + Vite build
```

### Linting
```bash
npm run lint       # Run ESLint on all files
```

### Type Checking
TypeScript is checked as part of `npm run build`. For standalone type checking:
```bash
npx tsc --noEmit   # Run TypeScript compiler without emitting files
```

**Note:** This project currently has no test suite. When adding tests:
- Use Vitest as the test runner (consistent with Vite)
- Test files should be named `*.test.ts` or `*.spec.ts`
- Run a single test: `npx vitest run --test-name-pattern="testName"`

## Code Style Guidelines

### General Principles
- Use functional components with hooks
- Prefer arrow functions for components and callbacks
- Use TypeScript for all new code (strict mode enabled)
- Keep components focused and small (< 200 lines preferred)

### Imports

**Order imports groups (top to bottom):**
1. External libraries (React, React Router, TanStack Query, etc.)
2. UI/components from shadcn/ui and Radix primitives
3. Internal features/modules
4. Store (Zustand)
5. Hooks
6. Utils
7. Types
8. Assets/images

**Use path aliases:**
- `@/*` resolves to `./src/*`
- Example: `import { cn } from '@/lib/utils'`

```typescript
// Good import order
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import useUser from '@/store/useUser';
import { useLoginMutation } from '@/features/authentication/hooks/useLoginMutation';
import { formatDate } from '@/utils/formatDate';
import type { User } from '@/types/user';
```

### Formatting (Prettier)

The project uses Prettier with these settings:
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

**Format on save is recommended.**

### TypeScript

- Enable `strict: true` in tsconfig
- Use explicit types for function parameters and return types
- Use `type` for unions, interfaces for objects
- Prefer `zod` for runtime validation (already installed)
- Unused variables trigger build errors (prefix with `_` if intentional)

```typescript
// Good
interface User {
  id: string;
  name: string;
  role: 'admin' | 'ustadz' | 'santri' | 'ortu';
}

const getUserName = (user: User): string => {
  return user.name;
};

// Good - ignore unused params
const handleClick = (_event: React.MouseEvent) => {
  console.log('clicked');
};
```

### Naming Conventions

- **Components**: PascalCase (e.g., `UserProfile.tsx`, `LoginForm.tsx`)
- **Files**: kebab-case for utilities, PascalCase for components (e.g., `format-date.ts`, `UserProfile.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useLoginMutation.ts`, `useFetchData.ts`)
- **Store**: camelCase (e.g., `useUser.ts`, `useAppStore.ts`)
- **Types**: PascalCase (e.g., `UserType.ts`, `AuthResponse.ts`)
- **Constants**: SCREAMING_SNAKE_CASE for values, PascalCase for objects (e.g., `USER_ROLES`, `SortOptions`)

### Component Structure

Follow this order within component files:
1. Imports
2. Type definitions (if component-specific)
3. Zod schemas for validation (if any)
4. Component function
5. Export default

```typescript
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [email, setEmail] = useState('');
  
  const handleSubmit = (values: LoginFormValues) => {
    // ...
  };

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
- Display user-friendly error messages via `react-hot-toast`
- Prefix unused error variables with `_`

```typescript
try {
  const data = await fetchUser(id);
  setUser(data);
} catch (_err) {
  toast.error('Gagal memuat data pengguna');
}
```

### State Management

- **Local state**: `useState` for component-local state
- **Global state**: Zustand stores in `src/store/`
- **Server state**: TanStack Query for API calls

```typescript
// Zustand store example
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

- Use shadcn/ui components from `@/components/ui/`
- Use Tailwind CSS for styling with `@tailwindcss/vite`
- Use `cn()` utility for conditional class merging

```typescript
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

<Button className={cn('base-class', isActive && 'active-class')} />
```

### API Calls

- Use TanStack Query (`useQuery`, `useMutation`) for all API calls
- Create service files in `features/*/service/` directory
- Create hooks that wrap the service calls in `features/*/hooks/`

### Folder Structure

```
src/
├── app/              # App configuration and routing
├── components/       # Shared UI components
│   └── ui/          # shadcn/ui components
├── features/        # Feature-based modules
│   ├── authentication/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── service/
│   │   ├── validation/
│   │   └── index.tsx
│   ├── admin/
│   ├── ortu/
│   ├── ustadz/
│   └── santri/
├── hooks/           # Shared custom hooks
├── lib/             # Utility functions (utils.ts)
├── middleware/      # Route guards and middleware
├── store/           # Zustand stores
├── types/           # Global type definitions
└── utils/           # Utility functions
```

### ESLint Rules

Key rules enforced:
- `@typescript-eslint/no-unused-vars`: warn (prefix unused with `_`)
- react-hooks rules (recommended-latest)
- react-refresh rules for Vite HMR

### Common Patterns

**Conditional class names:**
```typescript
import { cn } from '@/lib/utils';
<div className={cn('base', condition && 'conditional')} />
```

**React Router navigation:**
```typescript
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();
navigate('/path');
```

**Form handling with React Hook Form + Zod:**
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
const form = useForm<FormValues>({ resolver: zodResolver(schema) });
```

## Additional Notes

- No existing test suite - consider adding Vitest for unit tests
- Tailwind CSS v4 is used (configured with `@tailwindcss/vite`)
- Authentication uses JWT stored in localStorage
- Role-based routing with redirects in `src/middleware/RoleRedirect.tsx`
