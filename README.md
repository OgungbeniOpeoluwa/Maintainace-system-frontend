# University Maintenance Request System — Frontend

React (Vite) single-page app for the University Maintenance Request Management System — the student-facing web interface for MIT 8333 (Advanced Web Application Development).

This is the **frontend only**. The backend (Spring Boot REST API) lives in a separate repository: **[link your backend repo here]**.

---

## 1. Tech Stack

- **React 18** (with Vite) — UI library and build tool
- **React Router v6** — client-side routing and protected routes
- **Axios** — HTTP client, with a JWT-attaching interceptor
- **React Context API** — session/auth state (`AuthContext`)
- **lucide-react** — icon set
- **Custom CSS design system** — hand-built "work order / ticket" visual identity, fully responsive with a mobile hamburger nav
- **Vitest + React Testing Library** — automated tests

---

## 2. Project Structure

```
frontend/
├── vercel.json           # SPA rewrite so client-side routes don't 404 on direct load/refresh
└── src/
    ├── pages/            # Login, RoleSelect, Register, StudentDashboard, StaffDashboard,
    │                     # OfficerDashboard, AdminDashboard, SubmitRequest, ChangePassword
    ├── components/       # Navbar, PrivateRoute, StatusBadge, PriorityChip, WelcomeBanner,
    │                     # EmptyState, TicketSkeleton, HistoryModal
    ├── context/          # AuthContext (JWT + logged-in user state)
    ├── api/              # axios instance with JWT interceptor
    └── utils.js          # ticketCode, initials, fileUrl helpers
```

---

## 3. Prerequisites

- **Node.js 18+** and npm
- A running backend API (local or deployed) — see the backend repo for setup

---

## 4. Local Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Opens on **http://localhost:5173**.

### Environment variable

| Variable       | Description                                   | Example                                                                                   |
| -------------- | --------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `VITE_API_URL` | Base URL of the backend API, including `/api` | `http://localhost:8080/api` (local) or `https://your-backend.onrender.com/api` (deployed) |

⚠️ Vite bakes environment variables in at **build time**, not runtime. If you change `VITE_API_URL` after already building/deploying, you must rebuild — just saving the variable isn't enough.

---

## 5. Available Scripts

```bash
npm run dev       # start local dev server
npm run build     # production build (outputs to dist/)
npm run preview   # preview the production build locally
npm test          # run the Vitest test suite
```

---

## 6. Testing

Run with `npm test`. Covers:

| Test File               | Covers                                                                                   |
| ----------------------- | ---------------------------------------------------------------------------------------- |
| `StatusBadge.test.jsx`  | Correct label rendered for each request status                                           |
| `PriorityChip.test.jsx` | Correct label rendered for each priority level                                           |
| `utils.test.js`         | Ticket-code formatting, name-initials helper, and the Cloudinary-vs-local-disk URL logic |
| `PrivateRoute.test.jsx` | Unauthenticated users redirect to login; role-restricted routes allow/deny correctly     |

No backend connection is required — all API calls are mocked.

---

## 7. Deployment (Vercel)

1. Vercel → **New Project** → import this repo.
2. Framework preset: **Vite**.
3. Add environment variable: `VITE_API_URL = https://your-backend.onrender.com/api`
4. Deploy.

### ⚠️ Required: `vercel.json` (already included)

Without it, directly loading or refreshing any client-side route (`/login`, `/register/staff`, `/my-requests`, etc.) returns a `404: NOT_FOUND` from Vercel — because no actual file exists at that path; only React Router, running inside `index.html`, knows how to handle it. This file tells Vercel to serve `index.html` for every path and let React Router take over:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### CORS

The backend must have this app's deployed URL in its `CORS_ORIGINS` environment variable, or every API request will be blocked by the browser. See the backend repo's README for that setting.

---

## 8. Roles & What Each Dashboard Shows

| Role    | Dashboard                                                                                                       |
| ------- | --------------------------------------------------------------------------------------------------------------- |
| Student | Submit/track/delete (while pending) their own requests                                                          |
| Staff   | Same as Student, plus a **Department Requests** tab (read-only view of everyone's requests in their department) |
| Officer | **Assigned to Me** and **Available in My Category** (self-claim) tabs                                           |
| Admin   | **All Requests**, **Manage Officers**, **All Users**, **Reports** tabs                                          |

Registration starts at a role-selection page ("Are you a Student or Staff?") before showing the matching form. Officer and Admin accounts are not self-registered — see the backend README for how those are created.
