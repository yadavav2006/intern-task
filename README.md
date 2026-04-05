# MoneyMap Finance Dashboard

A frontend-only finance dashboard built for the internship assignment. It focuses on clean UI, component structure, frontend state management, and interactive data exploration.

## Submission Links

- Repository: Add your repository URL here
- Deployment: Add your live URL here (or mention Not deployed)

If you are reusing a similar previously built project, keep this README section and add a short note about what was adjusted to match this assignment.

## Tech Stack

- React + TypeScript (Vite)
- Tailwind CSS v4
- Recharts (time-based and categorical charts)
- LocalStorage for lightweight persistence

## Setup

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Assignment Requirement Coverage

### 1) Dashboard Overview

Implemented:

- Summary cards: Total Balance, Income, Expenses
- Time-based visualization: Balance Trend (Area chart by month)
- Categorical visualization: Spending Breakdown (Pie chart by expense category)

### 2) Transactions Section

Implemented transaction list with:

- Date
- Amount
- Category
- Type (income/expense)
- Description

Implemented interactions:

- Search (description/category)
- Filters (type + category)
- Sorting (newest, oldest, highest amount, lowest amount)
- Graceful empty state with a clear-filters action

### 3) Basic Role-Based UI (Frontend Simulation)

Implemented role switcher in UI:

- Viewer:
  - Can view dashboard, charts, insights, and transactions
  - Cannot add or edit transactions
- Admin:
  - Can add transactions
  - Can edit existing transactions

No backend RBAC is used, as requested.

### 4) Insights Section

Implemented insights panel showing:

- Highest spending category
- Monthly comparison (latest month expense vs previous month)
- Savings health observation based on current data

### 5) State Management

Managed in React with hooks and memoized derived data:

- Transactions data
- Filters
- Sorting
- Selected role
- Form visibility/edit mode

Derived calculations are centralized in utility functions for maintainability.

### 6) UI/UX Expectations

Implemented:

- Responsive layout for desktop/tablet/mobile
- Clean, readable typography and spacing
- Visual hierarchy through cards, charts, and sections
- Empty states for no-data/no-results scenarios

## Optional Enhancements Included

- LocalStorage persistence (role + transactions)
- Subtle entry animations and hover transitions
- Filter-aware analytics (charts/summary/insights respond to active filters)

## Data Source and Assumptions

- Uses static/mock finance transactions
- No backend/API dependency
- Currency formatted in USD for demonstration

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

## Notes for Evaluation

- This implementation intentionally prioritizes clarity and interaction over backend complexity.
- The code is modularized so each dashboard concern (data transforms, charts, table interactions, role behavior) is easy to review.
