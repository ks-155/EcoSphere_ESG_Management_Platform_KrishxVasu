# EcoSphere ESG Management Platform

> Full-stack SaaS platform for tracking Environmental, Social, and Governance (ESG) metrics — built for Odoo Hackathon 2026 by **Krish (Frontend)** and **Vasu (Backend)**.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, Tailwind CSS, shadcn/ui, Recharts, TanStack Table, Zustand, React Query |
| Backend | NestJS, Prisma 6, SQLite, Socket.IO, BullMQ, EventEmitter2 |
| Auth | JWT (access + refresh tokens), bcrypt password hashing |
| API Docs | Swagger/OpenAPI at `/api/docs` |

## Quick Start

```bash
# Clone
git clone https://github.com/ks-155/EcoSphere_ESG_Management_Platform_KrishxVasu.git
cd EcoSphere_ESG_Management_Platform_KrishxVasu

# Backend
cd apps/api
pnpm install
npx prisma generate
npx prisma db push
npx prisma db seed
npx nest build
node dist/src/main.js
# API runs at http://localhost:4000

# Frontend (new terminal)
cd apps/web
pnpm install
pnpm dev
# Frontend runs at http://localhost:3000
```

**Login:** `admin@ecosphere.com` / `admin123`

## Architecture

```
EcoSphere/
├── apps/
│   ├── api/                    # NestJS Backend (port 4000)
│   │   ├── src/
│   │   │   ├── auth/           # JWT auth (login, register, refresh, profile)
│   │   │   ├── modules/
│   │   │   │   ├── carbon-transactions/    # CO₂ tracking + auto-calc
│   │   │   │   ├── csr-activities/         # CSR initiative management
│   │   │   │   ├── challenges/             # Challenge lifecycle management
│   │   │   │   ├── challenge-participations/ # Approve/reject + badge auto-award
│   │   │   │   ├── employee-participations/ # CSR participation + notifications
│   │   │   │   ├── audits/                 # Audit scheduling
│   │   │   │   ├── compliance-issues/      # Compliance tracking + overdue detection
│   │   │   │   ├── dashboard/              # 6 aggregate dashboard endpoints
│   │   │   │   ├── reports/                # Custom report builder API
│   │   │   │   ├── organization/           # ESG config (weights + toggles)
│   │   │   │   ├── gamification/           # Badges, rewards, XP, leaderboard
│   │   │   │   └── notifications/          # In-app notifications
│   │   │   └── prisma/         # Prisma schema (22 models) + service
│   │   └── prisma/
│   │       └── schema.prisma   # Full data model
│   └── web/                    # Next.js Frontend (port 3000)
│       └── src/
│           ├── app/(dashboard)/ # 31 page routes
│           ├── components/     # shadcn/ui + shared components
│           ├── lib/            # API client, hooks, utilities
│           └── store/          # Zustand auth store
└── docker-compose.yml          # PostgreSQL + Redis + MinIO (production)
```

## Features (37+ implemented)

### Environmental
- Carbon transaction logging with auto CO₂ calculation
- Emission factor management
- Net zero target tracking
- Environmental dashboard with Recharts (bar, line, pie charts)
- Department-level emission breakdowns

### Social
- CSR activity management
- Employee participation with approval workflow
- Social dashboard with participation trends
- Top employee rankings by XP

### Governance
- Policy management with version tracking
- Policy acknowledgement tracking
- Audit scheduling and reporting
- Compliance issue tracking with severity levels and overdue detection
- Governance dashboard with compliance trends

### Gamification
- XP-based gamification system
- Badge auto-award on XP thresholds and challenge counts
- Reward store with XP redemption
- Challenge lifecycle (Draft → Active → Under Review → Completed)
- Global leaderboard with gold/silver/bronze rankings
- Gamification hub with user progress tracking

### Automation
- Auto CO₂ calculation from emission factors
- Auto badge awards on challenge completion
- In-app notifications for approvals, badge unlocks, rewards
- EventEmitter2 event system (`challenge.completed`, `csr.approved`)

### Reports
- Custom report builder with module/department/date filters
- 6 report sections: Carbon, CSR, Challenges, Audits, Compliance, Gamification
- CSV and JSON export

### ESG Configuration
- Adjustable E/S/G weight sliders (sum to 100%)
- Auto-calculate emissions toggle
- Auto-award badges toggle
- Evidence requirement toggle

## API Endpoints (28)

| Module | Endpoint | Method |
|--------|----------|--------|
| Auth | `/auth/login`, `/auth/register`, `/auth/logout`, `/auth/refresh`, `/auth/me` | POST/GET |
| Dashboard | `/api/dashboard/overview\|environmental\|social\|governance\|scores\|leaderboard` | GET |
| Reports | `/api/reports/generate` | POST |
| Organization | `/api/organization/settings` | GET/PUT |
| Master Data | `/api/departments\|categories\|emission-factors\|product-profiles\|goals\|policies\|badges\|rewards` | CRUD |
| Carbon | `/api/carbon-transactions` | CRUD |
| CSR | `/api/csr-activities\|employee-participations` | CRUD + approve/reject |
| Challenges | `/api/challenges\|challenge-participations` | CRUD + approve/reject + leaderboard |
| Audits | `/api/audits\|compliance-issues` | CRUD |
| Gamification | `/api/user-badges\|reward-redemptions` | CRUD + auto-award |
| Notifications | `/api/notifications` | CRUD + by-user + mark-read |

## Frontend Pages (31)

| Section | Pages |
|---------|-------|
| Dashboard | Overview, Environmental, Social, Governance |
| Master Data | Departments, Categories, Emission Factors, Product Profiles, Goals, Policies |
| Carbon | Entries, Net Zero |
| CSR | Initiatives, Participation |
| Challenges | Templates, Submissions |
| Audits | Schedules, Compliance, Reports |
| ESG | Department Scores |
| Gamification | Hub, Badges, User Badges, Rewards, Redemptions, Leaderboard |
| Reports | Custom Builder |
| Settings | ESG Config, Policy Acknowledgements, Notifications |

## Demo Data

Pre-seeded with:
- 1 organization (EcoSphere Corp) with ESG weights
- 6 departments, 6 categories, 6 emission factors, 5 product profiles
- 4 goals, 4 policies, 5 badges, 4 rewards
- 11 carbon transactions across departments
- CSR activities with participations and approvals
- Challenges with participation tracking
- 3 audits, 3 compliance issues
- 4 users with XP and badge awards
- 10+ notifications from event-driven system
