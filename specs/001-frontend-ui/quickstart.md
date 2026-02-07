# Quickstart Guide: Todo App Frontend UI

**Feature**: 001-frontend-ui
**Date**: 2025-12-26
**Purpose**: Step-by-step guide for setting up and running the frontend UI development environment

---

## Prerequisites

Before starting, ensure you have:

- **Node.js**: v18.17.0 or later (LTS recommended)
- **npm**: v9.0.0 or later (comes with Node.js)
- **Git**: For version control
- **Code Editor**: VS Code recommended (with TypeScript and Tailwind CSS extensions)
- **Modern Browser**: Chrome, Firefox, Safari, or Edge for testing

**Check versions**:
```bash
node --version   # Should be >= 18.17.0
npm --version    # Should be >= 9.0.0
git --version
```

---

## 1. Project Setup

### 1.1 Create Next.js 14 Application

```bash
# Navigate to project root
cd /path/to/todo_app

# Create frontend directory and initialize Next.js
npx create-next-app@latest frontend --typescript --tailwind --app --src-dir --import-alias "@/*"

# Options selected during setup:
# ✓ Would you like to use TypeScript? Yes
# ✓ Would you like to use ESLint? Yes
# ✓ Would you like to use Tailwind CSS? Yes
# ✓ Would you like to use `src/` directory? Yes
# ✓ Would you like to use App Router? Yes
# ✓ Would you like to customize the default import alias? Yes (@/*)
```

### 1.2 Navigate to Frontend Directory

```bash
cd frontend
```

### 1.3 Install Additional Dependencies

```bash
# Install Lucide React for icons
npm install lucide-react

# Dev dependencies (should already be installed)
# typescript, @types/node, @types/react, tailwindcss, postcss, autoprefixer
```

### 1.4 Verify Installation

```bash
npm run dev
```

Open http://localhost:3000 in your browser. You should see the Next.js welcome page.

**Stop the dev server** (Ctrl+C) before continuing with setup.

---

## 2. Project Structure Setup

### 2.1 Create Directory Structure

```bash
# Navigate to src directory
cd src

# Create component directories
mkdir -p components/ui
mkdir -p components/layout
mkdir -p components/tasks
mkdir -p components/auth

# Create other directories
mkdir -p lib
mkdir -p contexts
mkdir -p hooks
mkdir -p types
mkdir -p styles

cd ..
```

### 2.2 Expected Structure

After setup, your `frontend/src` directory should look like:

```
src/
├── app/              # Next.js App Router (auto-created)
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/           # Base UI components (Button, Input, Modal, etc.)
│   ├── layout/       # Layout components (Header, MobileNav)
│   ├── tasks/        # Task-specific components (TaskList, TaskCard, etc.)
│   └── auth/         # Auth components (LoginForm, SignupForm)
├── lib/              # Utilities and API client
├── contexts/         # React Context providers
├── hooks/            # Custom React hooks
├── types/            # TypeScript type definitions
└── styles/           # Additional stylesheets (if needed)
```

---

## 3. Configuration Files

### 3.1 TypeScript Configuration (`tsconfig.json`)

Verify your `tsconfig.json` has these settings:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 3.2 Tailwind Configuration (`tailwind.config.js`)

Update for custom theme (mobile-first breakpoints, colors):

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3b82f6', // blue-500
          hover: '#2563eb',   // blue-600
        },
        pending: {
          DEFAULT: '#f59e0b', // amber-500
          light: '#fef3c7',   // amber-50
        },
        completed: {
          DEFAULT: '#10b981', // green-500
          light: '#d1fae5',   // green-50
        },
        danger: {
          DEFAULT: '#ef4444', // red-500
          hover: '#dc2626',   // red-600
        },
      },
    },
  },
  plugins: [],
}
```

### 3.3 Next.js Configuration (`next.config.js`)

Basic configuration (default should work):

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig
```

---

## 4. Development Workflow

### 4.1 Start Development Server

```bash
# From frontend directory
npm run dev
```

**Server runs on**: http://localhost:3000

**Features**:
- Hot module replacement (HMR) - changes reflect instantly
- Fast Refresh - preserves component state
- TypeScript type-checking in real-time
- Tailwind CSS compilation on-the-fly

### 4.2 Recommended VS Code Extensions

Install these for better DX:

1. **ES7+ React/Redux/React-Native snippets** (dsznajder.es7-react-js-snippets)
2. **Tailwind CSS IntelliSense** (bradlc.vscode-tailwindcss)
3. **TypeScript + JavaScript** (already built-in)
4. **Prettier - Code formatter** (esbenp.prettier-vscode)
5. **ESLint** (dbaeumer.vscode-eslint)

### 4.3 Run Type Checking

```bash
# Check TypeScript errors without running dev server
npm run build

# Or use tsc directly
npx tsc --noEmit
```

### 4.4 Run Linter

```bash
# Run ESLint
npm run lint

# Auto-fix issues
npm run lint -- --fix
```

---

## 5. Implementation Order

Follow this sequence to build the UI (aligned with plan.md):

### Phase 1: Core Infrastructure
1. Create TypeScript types (`/types/task.ts`, `/types/user.ts`, `/types/ui.ts`)
2. Build base UI components (`Button`, `Input`, `Modal`, `Toast`, `Skeleton`, `Badge`)
3. Implement contexts (`AuthContext`, `TaskContext`, `ToastContext`)
4. Create mock API client (`/lib/api.ts`)
5. Create Server Actions (`/lib/actions.ts`)

### Phase 2: Layout & Navigation
6. Build `RootLayout` with `Header`
7. Add `MobileNav` with hamburger menu
8. Test responsive breakpoints

### Phase 3: Authentication Pages (P3)
9. Create `/login` page with `LoginForm`
10. Create `/signup` page with `SignupForm`
11. Implement form validation
12. Add mock auth logic
13. Test redirect flow (/ → /login or /tasks)

### Phase 4: Task Management UI (P1)
14. Build `/tasks` page (Server Component)
15. Create `TaskList` (Client Component with useOptimistic)
16. Build `TaskCard` with actions
17. Add `TaskForm` modal (create/edit modes)
18. Add `DeleteConfirm` modal
19. Implement `EmptyState`
20. Add toast notifications

### Phase 5: Filtering & Sorting (P2)
21. Build `TaskFilters` (All/Pending/Completed)
22. Build `TaskSort` (Date/Title)
23. Implement URL search params logic
24. Test filter/sort combinations

### Phase 6: Responsive Design (P2)
25. Test all breakpoints (320px, 375px, 768px, 1024px, 1440px)
26. Add mobile-specific elements (bottom add button, hamburger)
27. Verify touch targets (min 44px)
28. Test keyboard navigation

### Phase 7: Polish & Edge Cases
29. Add skeleton loading states
30. Handle empty filter results
31. Implement text truncation
32. Add animations/transitions
33. Test rapid clicks and double-submission prevention

---

## 6. Testing Checklist

### Manual Testing (Phase 2)

**Authentication Flow**:
- [ ] Visit / redirects to /login when not authenticated
- [ ] Login form validates email and password (required, format)
- [ ] Successful login redirects to /tasks
- [ ] Signup form validates all fields (name, email, password strength)
- [ ] Successful signup redirects to /tasks
- [ ] Logout clears auth state and redirects to /login

**Task Management (P1)**:
- [ ] /tasks displays empty state when no tasks
- [ ] "Add New Task" button opens modal
- [ ] Task creation form validates title (required, 1-200 chars)
- [ ] New task appears immediately with success toast
- [ ] Task toggle (pending ↔ completed) updates instantly
- [ ] Edit button opens pre-filled modal
- [ ] Task updates reflect immediately with toast
- [ ] Delete button opens confirmation modal
- [ ] Confirmed deletion removes task with toast

**Filtering & Sorting (P2)**:
- [ ] "All" button shows all tasks
- [ ] "Pending" button shows only incomplete tasks
- [ ] "Completed" button shows only completed tasks
- [ ] "Sort by Date" orders by creation date (newest first)
- [ ] "Sort by Title" orders alphabetically
- [ ] URL updates with filter/sort params
- [ ] Shared URL loads with correct filter/sort applied

**Responsive Design (P2)**:
- [ ] Mobile (< 768px): Hamburger menu, stacked layout, bottom add button
- [ ] Tablet (768px - 1024px): Two-column layout, proper spacing
- [ ] Desktop (> 1024px): Full layout, max-width content area
- [ ] All interactive elements >= 44px touch targets on mobile
- [ ] Keyboard navigation works (Tab, Enter, Escape)

**Edge Cases**:
- [ ] Long task titles truncate with ellipsis
- [ ] Long descriptions truncate in card view
- [ ] Empty filter results show "No tasks found" message
- [ ] Skeleton loading visible on initial load
- [ ] Rapid clicks don't cause double submissions
- [ ] Modal closes on Escape or outside click
- [ ] Toasts auto-dismiss after 3 seconds

### Accessibility Testing

- [ ] All images/icons have alt text or aria-labels
- [ ] Proper heading hierarchy (h1 → h2 → h3)
- [ ] Form inputs have associated labels
- [ ] Color contrast meets WCAG AA (4.5:1 minimum)
- [ ] Keyboard navigation works throughout
- [ ] Focus indicators visible on all interactive elements
- [ ] Screen reader announces toast notifications (aria-live)

---

## 7. Common Issues & Troubleshooting

### Issue: "Module not found" errors

**Cause**: Incorrect import paths or missing dependencies

**Fix**:
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Verify import aliases in tsconfig.json
# Should have: "paths": { "@/*": ["./src/*"] }
```

### Issue: Tailwind styles not applying

**Cause**: Content paths missing in `tailwind.config.js`

**Fix**:
```javascript
// Ensure all component paths are included
content: [
  './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
  './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  './src/app/**/*.{js,ts,jsx,tsx,mdx}',
],
```

### Issue: TypeScript errors on useOptimistic

**Cause**: `useOptimistic` is experimental in React 18

**Fix**:
```typescript
// Add to top of component file
// @ts-ignore - useOptimistic is experimental
import { useOptimistic } from 'react';
```

### Issue: Dev server not hot-reloading

**Cause**: File watcher limit exceeded (Linux/WSL)

**Fix** (Linux/WSL):
```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

---

## 8. Useful Commands

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build + type check
npm run start        # Serve production build (after npm run build)
npm run lint         # Run ESLint
npm run lint -- --fix # Auto-fix ESLint errors

# Package management
npm install <package>       # Add dependency
npm install -D <package>    # Add dev dependency
npm update                  # Update dependencies
npm outdated                # Check for outdated packages

# Clean slate (if things break)
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

---

## 9. Next Steps

After setup is complete:

1. **Run `/sp.tasks`**: Generate atomic implementation tasks from plan.md
2. **Run `/sp.implement`**: Execute tasks with Claude Code in dependency order
3. **Manual Testing**: Follow testing checklist above
4. **Phase 2b (Future)**: Backend integration with FastAPI, PostgreSQL, JWT

---

## 10. Resources

**Official Documentation**:
- Next.js 14: https://nextjs.org/docs
- React 18: https://react.dev
- Tailwind CSS: https://tailwindcss.com/docs
- TypeScript: https://www.typescriptlang.org/docs
- Lucide Icons: https://lucide.dev/guide/packages/lucide-react

**Project Files**:
- Spec: [spec.md](./spec.md)
- Plan: [plan.md](./plan.md)
- Research: [research.md](./research.md)
- Data Model: [data-model.md](./data-model.md)
- Contracts: [contracts/mock-api.md](./contracts/mock-api.md)

---

## Status

✅ **Complete** - Quickstart guide ready. Development environment setup documented.

**Ready for**: `/sp.tasks` to generate implementation task list.
