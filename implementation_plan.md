# Implementation Plan - EcoSphere ESG Management Platform

This document reviews the current codebase state against the problem statement requirements and outlines a plan to complete all missing frontend pages, transactional features, business rules, dashboard charts, gamification features, and the custom report builder.

---

## 1. Codebase Current State & Gap Analysis

### Backend (`apps/api`)
- **Status**: **Highly Complete**. The Prisma database schema has all 22 suggested models. The NestJS controllers/services exist for almost all endpoints.
- **Gaps**:
  1. No settings API endpoint to fetch/update Organization settings (`esgWeightE`, `esgWeightS`, `esgWeightG`, `autoCalcEmission`, `autoAwardBadge`, `evidenceRequired`).
  2. The `@OnEvent` listener logic is missing. We should make sure business rules like auto-badge awards and status change notifications are fully wired in backend services.

### Frontend (`apps/web`)
- **Status**: **Partially Built**. Master data configuration tables (`departments`, `categories`, `emission-factors`, `product-profiles`, `goals`, `policies`) and gamification master data (`badges`, `rewards`) are implemented.
- **Gaps**:
  1. **Sidebar Navigation**: Links point to placeholder pages (e.g. Environmental, Social, and Governance dashboards and reports all redirect to master data tables).
  2. **Dashboards**: Environmental, Social, Governance, and Organization ESG dashboards are not implemented.
  3. **Transactions**: No screens for logging Carbon Transactions, CSR Activities, Employee CSR Participation, Challenges, Challenge Participations, Policy Acknowledgements, Audits, or Compliance Issues.
  4. **Gamification Hub**: No interface for employees to view their progress, see active challenges, redeem rewards (catalog), or view the global Leaderboard.
  5. **Reports**: No preset report viewers or Custom Report Builder (combining filters and exporting to CSV/Excel/PDF).
  6. **ESG Configuration**: No UI to configure organization weights, toggles, or notification settings.

---

## 2. Proposed Changes

### Backend Enhancements (`apps/api`)

#### [NEW] [organization.controller.ts](file:///c:/Users/gadoy/OneDrive/Desktop/ESG/apps/api/src/modules/organization/organization.controller.ts) & [organization.service.ts](file:///c:/Users/gadoy/OneDrive/Desktop/ESG/apps/api/src/modules/organization/organization.service.ts)
Create a module to fetch and update organization settings (toggles and weights).

#### [MODIFY] [app.module.ts](file:///c:/Users/gadoy/OneDrive/Desktop/ESG/apps/api/src/app.module.ts)
Register the new `OrganizationModule`.

#### [MODIFY] [user-badges.service.ts](file:///c:/Users/gadoy/OneDrive/Desktop/ESG/apps/api/src/modules/user-badges/user-badges.service.ts) & [employee-participations.service.ts](file:///c:/Users/gadoy/OneDrive/Desktop/ESG/apps/api/src/modules/employee-participations/employee-participations.service.ts)
Ensure that when a user gets XP or completes a challenge:
- If `autoAwardBadge` is toggled on, check unlock conditions (`XP_THRESHOLD` or `CHALLENGE_COUNT`) and auto-award matching badges.
- Send an in-app Notification to the user on badge unlock or CSR approval/rejection.

---

### Frontend Features (`apps/web`)

#### [MODIFY] [sidebar.tsx](file:///c:/Users/gadoy/OneDrive/Desktop/ESG/apps/web/src/components/layout/sidebar.tsx)
Update routing paths to point to the new dedicated pages:
- Dashboards: `/environmental`, `/social`, `/governance`
- Transactions: `/transactions/carbon`, `/transactions/csr`, `/transactions/participation`, `/transactions/challenges`, `/transactions/audits`, `/transactions/compliance`
- Gamification: `/gamification/hub`, `/gamification/leaderboard`
- Reports: `/reports/presets`, `/reports/custom`
- Settings: `/settings/esg-config`, `/settings/notifications`

#### [NEW] Dashboards

##### 1. Environmental Dashboard (`/environmental`)
- **Visuals**: Recharts carbon trend line chart, carbon by department bar chart, and sustainability goal progress bars.
- **Table**: Carbon transactions summary table, with a quick action dialog to log a new carbon transaction (manual or auto-calculated based on emission factors).

##### 2. Social Dashboard (`/social`)
- **Visuals**: CSR participation stats (approved vs pending), monthly volunteering engagement charts, and diversity representation metrics.
- **Table**: Employee participation approval queue (for managers/admins) to review proof files and approve/reject entries.

##### 3. Governance Dashboard (`/governance`)
- **Visuals**: Policy acknowledgement rates, audit status timeline (planned, in progress, completed), and compliance issues severity breakdown (Low, Medium, High, Critical).
- **Table**: Active compliance issues table with owner assignment and due date countdown.

#### [NEW] Transactions Management Pages
Build unified, table-based CRUD pages with form dialogs for:
- **Carbon Transactions** (`/transactions/carbon`)
- **CSR Activities** (`/transactions/csr`)
- **Employee Participation** (`/transactions/participation`)
- **Challenges Lifecycle** (`/transactions/challenges`) (Draft $\to$ Active $\to$ Under Review $\to$ Completed $\to$ Archived)
- **Governance Audits** (`/transactions/audits`)
- **Compliance Issues** (`/transactions/compliance`)

#### [NEW] Gamification Hub & Leaderboard

##### 1. Gamification Hub (`/gamification/hub`)
- **User Progress Card**: Displays current XP, level, and next-level target.
- **Badges Catalog**: Grid of badges showing which are unlocked (colored) and locked (grayscale/blur with unlock rules).
- **Rewards Store**: Redeemable rewards catalog with cost in points/XP. Clicking "Redeem" calls the API, validates stock, and updates the user's XP/points balance.
- **My Challenges**: List of active challenges with progress bars and proof-upload buttons.

##### 2. Global Leaderboard (`/gamification/leaderboard`)
- Top-ranking list showing Rank, Avatar, Name, Department, Badge Count, and XP. Highlight the top 3 with Gold, Silver, and Bronze cups.

#### [NEW] Reports Builder (`/reports/custom`)
- Filter selectors: Department, Date Range, Module, Employee, Challenge, ESG Category.
- A "Generate Report" button that displays a preview of matching records.
- Export options: CSV, Excel (JSON-to-CSV helper), and PDF (using clean standard CSS browser print formats).

#### [NEW] ESG Configuration Page (`/settings/esg-config`)
- Weight sliders for Environmental, Social, and Governance scores (summing to 100%).
- Toggles for:
  - `Auto Emission Calculation`
  - `Evidence Requirement`
  - `Badge Auto-Award`
- Saves configurations to the organization endpoint.

---

## 3. Verification Plan

### Automated Tests
- We will verify backend API endpoints using direct HTTP calls (curl / axios requests) after starting the API server.
- Run type-checks on the frontend:
  ```bash
  npm run build
  ```

### Manual Verification
1. Log in as `admin@ecosphere.com` with password `admin123`.
2. Open the ESG Configuration page and set custom weights.
3. Add a new carbon transaction, verifying that it automatically calculates the CO2 amount when a matching emission factor is selected.
4. Participate in a challenge, upload a proof URL, approve it from the Social approval queue, and verify that the employee earns XP and receives an auto-awarded badge.
5. Generate a report in the Custom Reports Builder, apply filters, and test exporting to CSV/PDF.
