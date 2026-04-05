# MoneyMap Finance Dashboard

A frontend-first personal finance dashboard built for internship evaluation. The goal is to demonstrate clean UI thinking, component structure, and practical state management in a realistic but backend-free scenario.

## Project Links

* Repository: https://github.com/yadavav2006/intern-task
* Deployment: https://intern-task-sigma.vercel.app/

## What This Project Demonstrates

* A clear dashboard overview with key financial KPIs.
* Transaction exploration with search, filter, sorting, and empty states.
* Simulated role-based behavior in the UI (Viewer and Admin).
* Lightweight insight generation from client-side data.
* Responsive layout with polished interactions and persistence.

## Feature Highlights

### Dashboard Overview

* Summary cards for Total Balance, Income, and Expenses.
* Time-based chart for month-over-month balance trend.
* Category-based chart for spending breakdown.

### Transactions

* Displays date, description, category, type, and amount.
* Search by description and category.
* Filter by type and category.
* Sort by newest, oldest, highest amount, and lowest amount.
* Admin-only editing controls.
* Friendly empty states with filter reset actions.

### Role-Based UI (Frontend Simulation)

* Viewer: read-only access to dashboard and transactions.
* Admin: add and edit transaction records.
* Role switcher included for demonstration.

### Insights

* Highest spending category.
* Month-over-month expense comparison.
* Savings health observation generated from current data.

## Tech Stack

* React + TypeScript + Vite
* Tailwind CSS v4
* Recharts
* LocalStorage (role and transaction persistence)

## Getting Started

### Prerequisites

* Node.js 18+ (Node.js 20+ recommended)
* npm

### Install and Run

```bash
npm install
npm run dev
```

### Build for Production

```bash
npm run build
npm run preview
```

## Available Scripts

* `npm run dev`: Start the Vite development server.
* `npm run build`: Run TypeScript checks and create a production build.
* `npm run preview`: Preview the production build locally.

## Project Structure

```text
src/
  components/
    BalanceTrendChart.tsx
    EmptyState.tsx
    InsightsPanel.tsx
    SpendingBreakdownChart.tsx
    SummaryCards.tsx
    TransactionForm.tsx
    TransactionsSection.tsx
  data/
    mockTransactions.ts
  types/
    finance.ts
  utils/
    finance.ts
  App.tsx
  index.css
  main.tsx
```

## State Management Approach

* Local state is managed with React hooks in App.
* Derived data (summary, trend, category breakdown, insights) is memoized with `useMemo`.
* UI and data persistence use `useEffect` with LocalStorage.
* Data transformation logic is centralized in `src/utils/finance.ts` for clarity and reuse.

## Requirement Coverage

* Dashboard overview: Complete (summary cards + trend + category charts)
* Transactions section: Complete (list, search, filters, sorting, empty state)
* Basic role-based UI: Complete (Viewer/Admin behavior in frontend only)
* Insights section: Complete (highest spend, monthly comparison, observation)
* State management: Complete (React hooks + memoized derivations)
* UI/UX expectations: Complete (responsive, readable, and polished)
* Documentation: Complete (setup, architecture, and feature mapping)

## Assumptions and Scope

* Frontend-only implementation, no backend integration.
* Uses mock transaction data as seed data.
* Currency format is USD for demonstration.
* Designed for evaluation of approach, readability, and interaction quality.

## Optional Enhancements Already Included

* Dark mode toggle with LocalStorage persistence.
* Transaction and role persistence.
* Subtle animation and transition effects.
* Filter-aware analytics updates.

## Future Improvements

* CSV and JSON export.
* Mock API integration.
* Advanced filtering (date range and amount bands).
* Unit tests for utility logic and component behavior.

