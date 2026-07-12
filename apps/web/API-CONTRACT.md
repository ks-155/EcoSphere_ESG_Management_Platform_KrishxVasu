# Frontend ↔ Backend API Contract

## Base URL
```
Frontend expects: NEXT_PUBLIC_API_URL = http://localhost:4000
All endpoints prefixed with: /api
```

## Auth Endpoints

| Method | Path | Request Body | Response |
|--------|------|-------------|----------|
| POST | `/auth/login` | `{ email, password, rememberMe? }` | `{ user, tokens: { accessToken, refreshToken } }` |
| POST | `/auth/logout` | — | `{ success: true }` |
| POST | `/auth/refresh` | `{ refreshToken }` | `{ user, tokens }` |
| GET | `/auth/profile` | — | `{ id, email, name, role, departmentId, departmentName, avatarUrl }` |

## User Roles (enum)
```
SUPER_ADMIN | ESG_MANAGER | DEPT_HEAD | EMPLOYEE | AUDITOR
```

## Paginated Response Format
```json
{
  "data": [...],
  "meta": { "total": 50, "page": 1, "limit": 10, "totalPages": 5 }
}
```

## Query Parameters (GET list endpoints)
```
?search=&page=1&limit=10&status=&sortBy=name&sortOrder=asc
```

---

## Master Data CRUD Endpoints

Each resource follows this pattern:

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/{resource}` | List (paginated + filterable) |
| GET | `/api/{resource}/:id` | Get by ID |
| POST | `/api/{resource}` | Create |
| PATCH | `/api/{resource}/:id` | Update |
| DELETE | `/api/{resource}/:id` | Delete |

### Resources
1. **departments** — `{ id, name, description, code, status, headName, employeeCount, createdAt, updatedAt }`
2. **categories** — `{ id, name, description, type: CSR_ACTIVITY|CHALLENGE, status, createdAt, updatedAt }`
3. **emission-factors** — `{ id, name, category, value, unit: KG|TONNE|LITER|KWH|MWH, source, validFrom, validTo, status, createdAt, updatedAt }`
4. **product-profiles** — `{ id, name, sku, category: ELECTRONICS|FOOD|TEXTILE|PACKAGING|CHEMICAL|OTHER, carbonFootprint, waterUsage, recyclable, complianceStatus: COMPLIANT|NON_COMPLIANT|PENDING, description, status, createdAt, updatedAt }`
5. **goals** — `{ id, name, description, type: ENVIRONMENTAL|SOCIAL|GOVERNANCE, targetValue, currentValue, unit, deadline, status: NOT_STARTED|IN_PROGRESS|ACHIEVED|CANCELLED, departmentId, timeframe: QUARTERLY|ANNUAL|MULTI_YEAR, createdAt, updatedAt }`
6. **policies** — `{ id, title, description, category: ENVIRONMENTAL|SOCIAL|GOVERNANCE|GENERAL, content, version, status: DRAFT|ACTIVE|ARCHIVED, effectiveDate, departmentId, createdAt, updatedAt }`
7. **badges** — `{ id, name, description, iconUrl, category: ENVIRONMENTAL|SOCIAL|GOVERNANCE|GENERAL, unlockType: XP_THRESHOLD|CHALLENGE_COUNT|MANUAL, unlockValue, xpReward, status, createdAt, updatedAt }`
8. **rewards** — `{ id, name, description, imageUrl, pointCost, stock, category: ENVIRONMENTAL|SOCIAL|GOVERNANCE|GENERAL, status, createdAt, updatedAt }`

---

## Important Notes for Person B

1. **Use PATCH not PUT** for updates
2. **Snake_case on backend** is fine — return camelCase in JSON responses
3. **Status field** — boolean for simple, string enum for complex states
4. **Dates** — return ISO 8601 strings (`2024-01-15T00:00:00.000Z`)
5. **ID field** — always `id` (string/UUID)
6. **Soft deletes** preferred over hard deletes
7. **Error format**: `{ statusCode: 400, message: "...", error: "Bad Request" }`
8. **Search** — global `search` param searches across name/title/code/description fields
