# AGENTS.md - Mortgage Calculator Project

This document provides guidelines for AI agents working on this codebase.

## Project Overview

A mortgage calculator built with **Astro 5.x**, **React 19**, **TypeScript**, and **Tailwind CSS 4**. Uses Nano Stores for state management and Chart.js for data visualization.

## Build Commands

```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview
```

## Code Style Guidelines

### General Principles
- Write clean, self-documenting code with minimal comments
- Prefer explicit over implicit
- Keep functions small and focused on a single responsibility
- Use functional components and hooks in React
- Avoid premature optimization

### TypeScript
- Enable strict mode (inferred by default in Astro)
- Use explicit types for function parameters and return values
- Define interfaces for all data structures in `/src/types/`
- Avoid `any` type; use `unknown` if necessary with proper type guards
- Use discriminated unions for variant types (e.g., interestType: 'fixed' | 'variable' | 'mixed')

### Imports & File Organization
```
src/
  ├── components/
  │   ├── react/        # React components (client:load islands)
  │   ├── astro/        # Astro components
  │   └── ui/           # Reusable UI primitives (FormField, Card, etc.)
  ├── stores/           # Nano Stores for state management
  ├── utils/            # Pure functions and utilities
  ├── types/            # TypeScript type definitions
  └── pages/            # Astro pages
```

- Use path aliases if configured (check astro.config.mjs)
- Group imports: React imports → external libraries → internal modules
- Avoid default exports; use named exports consistently

### Naming Conventions
- **Components**: PascalCase (e.g., `MortgageCalculator.tsx`)
- **Files**: camelCase for utilities (e.g., `mortgageCalculations.ts`)
- **Constants**: SCREAMING_SNAKE_CASE for config values
- **Store atoms**: Use suffix pattern (e.g., `mortgageData`, `products`)
- **IDs**: Use `crypto.randomUUID()` for unique identifiers

### React Patterns
- Use `@nanostores/react` for cross-component state
- Prefer `useStore()` over `useEffect` for deriving computed values
- Extract reusable form fields to `/src/components/ui/`
- Use TypeScript interfaces for component props
- Memoize expensive computations with `useMemo` when needed

### Tailwind CSS
- Use Tailwind 4.x utility classes
- Consistent color palette: `slate-*` for neutrals, `blue-*` for primary
- Responsive design: `grid-cols-1 md:grid-cols-2 lg:grid-cols-12`
- State variants: `hover:`, `focus:`, `active:`
- Use `rounded-xl`, `shadow-sm`, `border-slate-100` for card styling

### Error Handling
- Validate inputs with Zod (already installed)
- Handle edge cases in calculations (e.g., zero interest rate)
- Display user-friendly error messages in UI
- Log errors to console with context

### Utilities
- Use `/src/utils/format.ts` for currency/percent formatting:
  - `formatCurrency(value)` - full precision
  - `formatCurrencyCompact(value)` - compact display
  - `formatPercent(value)` - percentage values
- Reuse existing utilities before creating new ones

### State Management (Nano Stores)
- Store definitions in `/src/stores/mortgageStore.ts`
- Use `atom()` for state and `computed()` for derived values
- Keep business logic in stores, not in components
- Export update functions alongside atoms

### Testing
- Create test files with `.test.ts` or `.test.tsx` extension
- Place tests alongside source files or in `__tests__/` directory
- Test utility functions with various inputs including edge cases
- Mock Chart.js components for testing

## Architecture Notes

### Mortgage Calculation Logic
- `/src/utils/mortgageCalculations.ts` - Core mortgage formulas
- `/src/utils/productAnalysis.ts` - Bank product analysis
- Calculations should be pure functions with no side effects

### Component Hierarchy
```
index.astro (page)
  ├── MainLayout
  ├── Header (Astro)
  ├── MortgageCalculator (React - form inputs)
  ├── ProductManager (React - bank products)
  ├── Charts (React - Chart.js)
  │   ├── EvolutionChart
  │   └── ComparisonChart
  └── AmortizationTable (React - data display)
```

### Client Hydration
- React components use `client:load` for immediate interactivity
- Static Astro components render on server

## Key Files

- `src/stores/mortgageStore.ts` - Central state definition
- `src/utils/mortgageCalculations.ts` - Core business logic
- `src/types/index.ts` - TypeScript definitions
- `astro.config.mjs` - Astro configuration with React/Tailwind

## Common Tasks

### Adding a New Bank Product
1. Define type in `src/types/index.ts`
2. Add to default products array in `src/stores/mortgageStore.ts`
3. Update `calculateWithSelectedProducts()` in `src/utils/productAnalysis.ts`

### Adding a New Calculation
1. Create pure function in `/src/utils/`
2. Add tests for edge cases
3. Import and use in components or stores

### Modifying the Form
1. Edit `src/components/react/MortgageCalculator.tsx`
2. Use existing `FormField`, `SelectField`, `Card` from `/src/components/ui/`
3. Update store with `updateMortgageData()`
