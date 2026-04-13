# EqConnect — India's Fair Student Ecosystem

**Version:** 0.1.0 | **Status:** Prototype Showcase for Ideathon

EqConnect is a full-stack web application designed to unify credential verification, opportunity discovery, skill-based matching, and secure communication for the Indian student ecosystem (ages 18–28). This is a **UI/UX prototype** with real Google integrations and a fully functional admin dashboard.

---

## 🎯 Project Overview

### Core Users
- **Students** (primary — 18–28 years, pan-India)
- **Universities / Institutions** (secondary)
- **Recruiters / Companies** (tertiary)
- **Platform Admins** (internal dashboard)

### Key Features
- ✅ Credential verification (mocked for prototype)
- ✅ Opportunity discovery & skill-based matching
- ✅ AI-powered candidate search
- ✅ Secure in-app messaging (real-time via Supabase)
- ✅ Google Calendar & Meet integration
- ✅ Institutional anonymity toggle (fair hiring)
- ✅ Production-ready admin dashboard
- ✅ Dark mode support
- ✅ Mobile-responsive design
- ✅ Smooth Framer Motion animations

---

## 🛠 Tech Stack

### Frontend
- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS v4** + OKLCH design tokens
- **Framer Motion** (page transitions & micro-interactions)
- **Recharts** (admin analytics)
- **React Router v6** (hash-based for static hosting)
- **React Hook Form** + **Zod** (form validation)
- **Zustand** (global state)
- **Supabase JS Client** (auth, realtime, storage)
- **Fonts:** Satoshi (body) + Instrument Serif (display)

### Backend
- **Node.js** + **Express.js** (TypeScript)
- **PostgreSQL** (via Supabase free tier)
- **Supabase Auth** (Google OAuth + email/password)
- **Supabase Storage** (profile photos, documents)
- **Supabase Realtime** (messaging)
- **Google APIs** (Calendar, Meet)

### Deployment (Prototype)
- **Frontend:** Vercel (free tier)
- **Backend:** Railway or Render (free tier)
- **Database:** Supabase (free tier)

---

## 📁 Project Structure

```
eqconnect/
├── client/                              # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                      # Design system (Button, Card, Badge, etc.)
│   │   │   ├── layout/                  # AppShell, Sidebar, Topbar
│   │   │   ├── student/                 # Student-specific components
│   │   │   ├── recruiter/               # Recruiter-specific components
│   │   │   └── admin/                   # Admin components (StatCard, UserTable, etc.)
│   │   ├── pages/
│   │   │   ├── Landing.tsx
│   │   │   ├── auth/                    # Login, Register, Onboarding
│   │   │   ├── student/                 # Dashboard, Profile, Opportunities, Messages
│   │   │   ├── recruiter/               # Dashboard, PostJob, CandidateSearch
│   │   │   ├── university/              # Dashboard, Students, Events, Analytics
│   │   │   └── admin/                   # AdminDashboard, UserManagement, Verification, etc.
│   │   ├── hooks/                       # useAuth, useGoogleCalendar, useRealtime
│   │   ├── store/                       # Zustand stores (authStore, opportunityStore)
│   │   ├── lib/                         # supabase.ts, googleCalendar.ts, api.ts
│   │   └── types/                       # Shared type definitions
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── server/                              # Express backend
│   ├── src/
│   │   ├── routes/                      # API routes (auth, users, opportunities, etc.)
│   │   ├── middleware/                  # authMiddleware, roleMiddleware, rateLimiter
│   │   ├── services/                    # matchingEngine, verificationService, etc.
│   │   ├── lib/                         # supabase.ts, googleCalendar.ts, validation.ts
│   │   ├── db/                          # schema.sql, seed.sql
│   │   └── index.ts                     # Main Express app
│   ├── package.json
│   └── tsconfig.json
│
└── shared/                              # Shared types
    └── types/                           # user.ts, opportunity.ts, application.ts
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ and **npm** 9+
- **Supabase account** (free tier)
- **Google Cloud project** (for OAuth + Calendar API)

### 1. Clone & Setup

```bash
cd /Users/adityachaturvedi/Documents/EqConnect
npm install --workspace=client --workspace=server
```

### 2. Configure Supabase

1. Create a free Supabase project at [supabase.com](https://supabase.com)
2. Get your **Project URL** and **Anon Key**
3. Run the schema in `server/src/db/schema.sql` in Supabase's SQL editor
4. Enable Google OAuth in Supabase Authentication settings

### 3. Configure Google OAuth

1. Create a Google Cloud project
2. Enable **Google Calendar API** and **Google Meet API**
3. Create OAuth 2.0 credentials (Web Application)
4. Add redirect URIs:
   - `http://localhost:5173` (frontend dev)
   - `http://localhost:3001/api/calendar/callback` (backend)
5. Get your **Client ID**, **Client Secret**

### 4. Create Environment Files

**`client/.env`:**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_API_BASE_URL=http://localhost:3001
```

**`server/.env`:**
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3001/api/calendar/callback
JWT_SECRET=dev-jwt-secret
PORT=3001
NODE_ENV=development
```

### 5. Run Development Servers

**Terminal 1 — Frontend (Vite dev server):**
```bash
cd client
npm run dev
# Opens http://localhost:5173
```

**Terminal 2 — Backend (Express):**
```bash
cd server
npm run dev
# Runs on http://localhost:3001
```

---

## 🎨 Design System

### Color Palette — "EqConnect Indigo"

**Light Mode (default):**
```css
--color-primary: #4f46e5;        /* Indigo-600 */
--color-success: #059669;        /* Emerald-600 */
--color-warning: #d97706;        /* Amber-600 */
--color-error: #dc2626;          /* Red-600 */
--color-accent: #f59e0b;         /* Saffron — India-inspired */
```

**Dark Mode:**
Set `data-theme="dark"` on `<html>` element. See `client/src/index.css` for full palette.

### Typography
- **Display:** Instrument Serif (24px+) — headings
- **Body:** Satoshi / Inter (16px+) — all UI text
- Fluid type scale using `clamp()`

### Spacing & Radius
- Border radius: `sm` (6px), `md` (8px), `lg` (12px), `xl` (16px), `2xl` (24px)
- Shadows: `sm`, `md`, `lg`, `card` — all with Indigo-tinted opacity
- No pure black shadows — all use `rgba(79, 70, 229, opacity)`

### Component Library
All reusable components in `client/src/components/ui/`:
- **Button** — primary, secondary, outline, ghost variants
- **Card** — hoverable, elevated surfaces
- **Badge** — status indicators (success, warning, error)
- **Input** — with labels, errors, helper text
- **VerificationBadge** — Green/Yellow/Red trust indicators
- **Avatar** — with online/offline status
- **Skeleton** — shimmer loaders (no spinners)
- **Modal, Toast** (coming soon)

---

## 🔐 Authentication & Authorization

### User Roles
1. **student** — Can apply to opportunities, message recruiters, see verification status
2. **university** — Can manage enrolled students, post events, verify students
3. **recruiter** — Can post jobs, search candidates, message students
4. **admin** — Full platform access (user management, verification queue, analytics)

### Implementation
- Supabase Auth (Google OAuth + email/password)
- JWT tokens stored in Supabase
- Role-based middleware on backend (`roleMiddleware.ts`)
- Protected routes on frontend (check `useAuth()` hook)

---

## 🤖 Skill-Based Matching

**Algorithm:** Cosine similarity (no external AI required)

```typescript
// In server/src/services/matchingEngine.ts
function skillMatchScore(studentSkills: string[], requiredSkills: string[]): number
// Returns 0-100 match percentage
```

**Usage:**
- GET `/api/opportunities/recommended` returns top 10 opportunities sorted by match score
- Match score displayed as circular progress ring on Opportunity cards

---

## ✓ Mock Verification Flow

### Project Phases

**Phase 1:** Authentication & GitHub OAuth ✅ Complete  
**Phase 2:** Student Dashboard, GitHub Integration ✅ Complete  
**Phase 3A:** Skills & Messaging System ✅ Complete  
**Phase 3B:** Job Postings & Applications ✅ Complete  
**Phase 3C:** Notifications System ✅ Complete  
**Phase 4:** University Verification System ✅ Complete

---

## 🎓 University Verification System

A complete verification system ensuring only legitimate universities can recruit on the platform.

### How It Works
1. **University Registration** → Account created
2. **Document Upload** → Upload 3 required documents (UGC Letter, Accreditation Certificate, Degree Certificate)
3. **Account Locked** → Dashboard inaccessible until verified
4. **7-Day Deadline** → Admin must review within 7 days
5. **Admin Review** → Super admin approves or rejects with reason
6. **Account Unlock** → On approval, dashboard becomes accessible
7. **Resubmission** → If rejected, university can resubmit documents

### Features
- ✅ Multi-document upload (base64 encoded)
- ✅ Automatic account locking during verification
- ✅ 7-day verification deadline with countdown
- ✅ Super admin review interface
- ✅ Approval/rejection with notes
- ✅ Document resubmission capability
- ✅ Complete audit trail
- ✅ Notification system for users
- ✅ RLS database security policies

### Routes
- **University:** `/university/verify` → Upload documents
- **University:** `/university/verification-pending` → Check status
- **Admin:** `/admin/verifications` → Review pending requests

### Documentation
See `UNIVERSITY_VERIFICATION_SYSTEM.md` for complete documentation including API endpoints, database schema, and workflows.

---

## 📅 Google Integrations

### Google OAuth
- Handled by **Supabase Auth**
- Scopes: `email`, `profile`, `calendar.events`, `calendar.readonly`
- Frontend: `supabase.auth.signInWithOAuth({ provider: 'google' })`

### Google Calendar API
```typescript
// In server/src/lib/googleCalendar.ts
createCalendarEvent(tokens, { title, description, startTime, endTime, meetLink?: true })
// Creates event + optional Meet link
```

**Where used:**
- "Add to Calendar" on opportunity cards → creates event with deadline
- Interview scheduling in messages → creates event with Meet link
- University event posting → creates calendar event, shares link

### Google Meet
- Generated via Google Calendar API's `conferenceData`
- Automatically included when `meetLink: true`
- Display "Join Interview" button in messages when Meet link exists

---

## 📊 Admin Dashboard Features

### 1. Overview (`/admin/dashboard`)
- **6 KPI cards:** Total users, new registrations, pending verifications, active opportunities, total applications, flagged content
- **Charts (Recharts):**
  - User growth (30-day line chart by role)
  - Verification rate (donut chart)
  - Opportunity types (stacked bar chart)
  - Geographic distribution
  - Daily activity heatmap (GitHub-style)
- **Recent activity feed** — real-time platform events
- **Quick actions** — verify, review, notify

### 2. User Management (`/admin/users`)
- Paginated table (20/page) with sorting & filtering
- Columns: Avatar, Name, Email, Role, Verification Status, Joined, Last Active, Actions
- Search bar (debounced 300ms)
- Bulk select + actions (verify, suspend, delete)
- User detail drawer (slides from right)

### 3. Verification Queue (`/admin/verification`)
- Sorted by submission date (oldest first)
- Document viewer (mock PDF/image preview)
- Checklist: Government ID ✓, University Data ✓, Profile Consistency ✓
- Trust level dropdown
- Approve / Reject buttons

### 4. Reports & Analytics (`/admin/analytics`)
- Date range picker (7d / 30d / 90d / custom)
- Expanded charts from dashboard
- Top skills in demand
- Match score distribution (histogram)
- Application funnel
- University performance table

### 5. Flagged Content (`/admin/flagged`)
- Reported users/opportunities
- Report reason, reporter, date
- Quick actions: Warn / Suspend / Dismiss

### 6. System Settings (`/admin/settings`)
- Platform stats (readonly)
- Feature flags (toggles — mock)
- Email template preview
- Google API connection status

---

## 📱 Responsive Design

All layouts stack gracefully at **375px** (mobile):
- Sidebar collapses to bottom tab bar
- Grid → single column
- Modals slide up from bottom
- Tables → card layout
- Charts → smaller font sizes

**Breakpoints:**
- Mobile: 0–640px
- Tablet: 640–1024px
- Desktop: 1024px+

---

## 🎬 Animation Specifications (Framer Motion)

### Page Transitions
```typescript
initial: { opacity: 0, y: 20 }
animate: { opacity: 1, y: 0 }
duration: 300ms, ease: easeOut
```

### Staggered Lists
- Children fade in with 50ms delay between items
- Used in: opportunity cards, user tables, notification feeds

### Card Hovers
```typescript
whileHover: { scale: 1.02, boxShadow: 'var(--shadow-lg)' }
whileTap: { scale: 0.98 }
duration: 180ms
```

### Verified Badge
```typescript
initial: { scale: 0, rotate: -180 }
animate: { scale: 1, rotate: 0 }
spring animation (stiffness: 260, damping: 20)
```

### Skeleton Loaders
- CSS keyframe shimmer (no spinners)
- 2-second loop

### Success Actions
- Confetti burst on first successful application (canvas-confetti)
- 100 particles, 70° spread, Indigo + Saffron colors

---

## 🧪 Demo Credentials (Prototype)

```
Admin:      admin@eqconnect.in     / Admin@123
Student1:   student@demo.com       / Demo@123  (Verified, Tier-2 college)
Student2:   student2@demo.com      / Demo@123  (Unverified, Tier-3 college)
Recruiter:  recruiter@demo.com     / Demo@123  (Verified company)
University: univ@demo.com          / Demo@123  (Verified institution)
```

---

## 📚 API Endpoints

### Auth (`/api/auth`)
- `POST /register` — Create user + role profile
- `POST /login` — Email/password login
- `POST /google` — Google OAuth callback
- `GET /me` — Current user
- `POST /logout`
- `PATCH /onboard` — Save onboarding data

### Users (`/api/users`)
- `GET /:id` — Public profile
- `PATCH /:id/profile` — Update profile
- `POST /:id/avatar` — Upload avatar
- `GET /:id/notifications`
- `PATCH /:id/notifications/read-all`

### Opportunities (`/api/opportunities`)
- `GET /` — List with filters (type, skills, location, sort, pagination)
- `POST /` — Create (recruiter/university only)
- `GET /:id` — Single opportunity
- `PATCH /:id` — Update
- `DELETE /:id` — Delete
- `GET /recommended` — AI-matched for student
- `POST /:id/apply` — Submit application
- `POST /:id/calendar` — Add to Google Calendar

### Applications (`/api/applications`)
- `GET /` — List (auth-filtered)
- `PATCH /:id/status` — Update status
- `DELETE /:id` — Withdraw

### Messages (`/api/messages`)
- `GET /conversations` — List user's conversations
- `POST /conversations` — Start new conversation
- `GET /conversations/:id/messages` — Message history
- `POST /conversations/:id/messages` — Send message
- `POST /conversations/:id/meet` — Generate Google Meet link

### Verification (`/api/verification`)
- `POST /submit` — Submit verification request
- `GET /status` — Current user's status
- `GET /queue` — Admin: pending requests
- `PATCH /:id/review` — Admin: approve/reject

### Calendar (`/api/calendar`)
- `GET /auth-url` — Get Google OAuth URL
- `POST /callback` — Store calendar tokens
- `POST /events` — Create event
- `GET /events` — List upcoming events

### Admin (`/api/admin`)
- `GET /stats` — Platform KPIs
- `GET /users` — Paginated user list
- `PATCH /users/:id` — Update user
- `DELETE /users/:id` — Delete user
- `GET /verifications` — Verification queue
- `GET /activity-feed` — Real-time activity log
- `GET /analytics` — Detailed analytics
- `GET /flagged` — Flagged content
- `PATCH /flagged/:id` — Resolve flag
- `POST /notifications/broadcast` — Send platform notification

---

## ✨ Final Polish Checklist

- [ ] Dark mode toggle in navbar (smooth transition)
- [ ] Loading skeleton on every data fetch
- [ ] Empty states with action CTAs
- [ ] Error boundary with friendly error screen
- [ ] 404 page with animated illustration
- [ ] Mobile responsive (375px+)
- [ ] Consistent border radius (use CSS variables)
- [ ] No pure black shadows
- [ ] No colored card borders (use elevation only)
- [ ] No gradient buttons (solid primary color)
- [ ] Confetti on first application
- [ ] Smooth scroll behavior
- [ ] Page title updates on route change
- [ ] Focus visible rings (accessibility)
- [ ] WCAG AA color contrast
- [ ] 44×44px touch targets (mobile)
- [ ] Reduced motion support (`prefers-reduced-motion`)
- [ ] Semantic HTML (`<main>`, `<nav>`, `<section>`)
- [ ] Form labels with all inputs
- [ ] Keyboard navigation throughout

---

## 🚫 Out of Scope (Prototype Only)

- ❌ Real Aadhaar API integration
- ❌ Blockchain / distributed ledger
- ❌ Real payment processing
- ❌ SMS/OTP verification
- ❌ Real LinkedIn/GitHub data fetching
- ❌ Mobile apps (web-only for now)
- ❌ Production-scale infrastructure

---

## 📝 License

EqConnect v0.1 — Built for the Ideathon by Byte Bandits.

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m 'Add feature'`
3. Push: `git push origin feature/your-feature`
4. Open a Pull Request

---

## 📞 Support

For issues, questions, or feedback:
- GitHub Issues: [Create an issue](https://github.com/byte-bandits/eqconnect)
- Email: hello@eqconnect.in

---

**EqConnect — Your skills. Verified. Connected. Fair.** ✨
