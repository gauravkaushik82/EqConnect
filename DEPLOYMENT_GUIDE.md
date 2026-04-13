# 🚀 University Verification System - Deployment Guide

**Complete step-by-step guide to deploy the verification system**

---

## 📋 Deployment Checklist

- [ ] **Step 1:** Apply database migration (5 min)
- [ ] **Step 2:** Verify migration success (2 min)
- [ ] **Step 3:** Create first super admin (3 min)
- [ ] **Step 4:** Test end-to-end workflow (15 min)
- [ ] **Step 5:** Deploy to production (5 min)

---

## Step 1️⃣: Apply Database Migration (5 minutes)

### What This Does
Creates 4 new database tables, adds columns to users table, sets up security policies, and creates performance indexes.

### Prerequisites
- ✅ Supabase account configured
- ✅ `.env` file with `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
- ✅ psql (PostgreSQL client) installed

### Check PostgreSQL Installation

```bash
# Check if psql is installed
which psql

# If not found, install it (macOS):
brew install postgresql
```

### Apply Migration

**Option A: Using Supabase CLI (Recommended)**

```bash
# Install Supabase CLI if not already installed
brew install supabase/tap/supabase

# Link to your project (use credentials from Supabase dashboard)
supabase link --project-ref lkieeqieyzksjwgbrjku

# Apply migration
supabase db push
```

**Option B: Using psql (Direct)**

```bash
# Navigate to server directory
cd /Users/adityachaturvedi/Documents/EqConnect/server

# Run migration (replace PASSWORD with your Supabase password)
PGPASSWORD="your-supabase-password" psql \
  -h lkieeqieyzksjwgbrjku.supabase.co \
  -U postgres \
  -d postgres \
  -f ./src/migrations/04_university_verification.sql
```

**Option C: Using Supabase Dashboard (Easiest)**

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project (lkieeqieyzksjwgbrjku)
3. Go to **SQL Editor**
4. Click **New Query**
5. Copy contents of `server/src/migrations/04_university_verification.sql`
6. Paste into editor
7. Click **Run**

### What Gets Created

**Tables:**
- `university_verification_documents` - Stores uploaded documents
- `super_admin_accounts` - Tracks admin permissions
- `verification_audit_logs` - Immutable action log
- `verification_notifications` - User notifications

**User Table Updates:**
- `verification_status` - Current status (pending, approved, rejected)
- `verification_deadline` - 7-day deadline
- `document_submission_date` - When submitted
- `rejection_reason` - If rejected
- `account_locked` - Boolean for dashboard access
- `verification_notes` - Admin notes
- `verification_completed_date` - When decision made
- `verification_completed_by` - Admin ID

**Security:**
- 4 Row-Level Security (RLS) policies
- 8 performance indexes
- Complete data isolation

---

## Step 2️⃣: Verify Migration Success (2 minutes)

### Check Tables Created

```bash
cd /Users/adityachaturvedi/Documents/EqConnect/server

# Connect to Supabase
PGPASSWORD="your-password" psql \
  -h lkieeqieyzksjwgbrjku.supabase.co \
  -U postgres \
  -d postgres \
  -c "\dt university_*"
```

### Expected Output
```
                    List of relations
 Schema |              Name              | Type  |  Owner
--------+--------------------------------+-------+----------
 public | university_verification_documents | table | postgres
 public | super_admin_accounts           | table | postgres
 public | verification_audit_logs        | table | postgres
 public | verification_notifications     | table | postgres
(4 rows)
```

### Verify User Table Updates

```bash
PGPASSWORD="your-password" psql \
  -h lkieeqieyzksjwgbrjku.supabase.co \
  -U postgres \
  -d postgres \
  -c "\d users" | grep -E "verification|account_locked"
```

### Expected Output
```
verification_status | character varying
verification_deadline | timestamp with time zone
document_submission_date | timestamp with time zone
rejection_reason | text
account_locked | boolean
verification_notes | text
verification_completed_date | timestamp with time zone
verification_completed_by | uuid
```

---

## Step 3️⃣: Create First Super Admin (3 minutes)

### Why This Is Needed
Only a super admin can review and approve university verifications. You need to create the first one manually.

### Option A: Using API Endpoint

**Start the server first:**
```bash
cd /Users/adityachaturvedi/Documents/EqConnect/server
npm run dev
```

**In another terminal, create admin:**
```bash
# First, get an admin user token
# You may need to register an admin account first

curl -X POST http://localhost:3001/api/verification/create-super-admin \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "targetUserId": "admin-user-uuid",
    "adminLevel": "super_admin"
  }'
```

### Option B: Direct Database Insert (Easier)

```bash
# Get your admin user ID first
PGPASSWORD="password" psql \
  -h lkieeqieyzksjwgbrjku.supabase.co \
  -U postgres \
  -d postgres \
  -c "SELECT id, email, role FROM users WHERE role='admin' LIMIT 1;"
```

**Then insert super admin record:**
```bash
PGPASSWORD="password" psql \
  -h lkieeqieyzksjwgbrjku.supabase.co \
  -U postgres \
  -d postgres \
  -c "
INSERT INTO super_admin_accounts (
  user_id,
  admin_level,
  created_at
) VALUES (
  'YOUR_ADMIN_UUID_HERE',
  'super_admin',
  NOW()
);
"
```

### Option C: Using Supabase Dashboard

1. Go to **SQL Editor**
2. Run this query:
```sql
INSERT INTO super_admin_accounts (
  user_id,
  admin_level,
  created_at
) VALUES (
  'YOUR_ADMIN_UUID',
  'super_admin',
  NOW()
);
```

3. Replace `YOUR_ADMIN_UUID` with your admin user's ID from the `users` table

### Get Your Admin UUID

Go to Supabase Dashboard → **Table Editor** → **users** → Find your admin account → Copy the `id` field

---

## Step 4️⃣: Test End-to-End Workflow (15 minutes)

### Setup: Start Both Servers

**Terminal 1 - Backend:**
```bash
cd /Users/adityachaturvedi/Documents/EqConnect/server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd /Users/adityachaturvedi/Documents/EqConnect/client
npm run dev
```

### Test Scenario 1: University Registration & Document Upload

1. **Open http://localhost:5173** in browser
2. **Click Register** → Select "University" role
3. **Fill form with test data:**
   - Email: `testuniv@test.com`
   - Password: `Test123!Pass`
   - University Name: `Test University`
   - Other required fields
4. **Submit** → Account created
5. **You should see:** "Verification Pending" message on dashboard
6. **Verify:** Dashboard is locked (no access to main features)

### Test Scenario 2: Upload Documents

1. **Navigate to** `/university/verify`
2. **You should see:** Document upload form
3. **Upload test documents:**
   - UGC Recognition Letter (any PDF)
   - Accreditation Certificate (any PDF)
   - Degree Certificate (any PDF)
4. **Click Submit**
5. **You should see:** Success message
6. **Verify:** Status shows "Under Review"

### Test Scenario 3: Check Verification Status

1. **Navigate to** `/university/verification-pending`
2. **You should see:**
   - Current status: "Under Review"
   - 7-day countdown timer
   - Document icons showing submitted
   - Timeline view
   - Submission date
   - Expected completion date

### Test Scenario 4: Admin Review & Approval

1. **Logout** (click profile → logout)
2. **Login as admin account** (your super admin)
3. **Navigate to** `/admin/verifications`
4. **You should see:**
   - Pending verification list
   - Test University at top
   - Submission date
   - Number of documents
5. **Click on Test University**
6. **You should see:**
   - All 3 uploaded documents
   - Viewable document previews
   - Approval/Rejection buttons
   - Notes field
7. **Click APPROVE**
8. **Add optional notes:** "Documents verified successfully"
9. **Click Submit**
10. **You should see:** Success message

### Test Scenario 5: Verify Account Unlock

1. **Logout** as admin
2. **Login as university account** (testuniv@test.com)
3. **You should see:**
   - Dashboard now **UNLOCKED**
   - Can access all features
   - Status shows "Approved"
   - Can see approval date

### Test Scenario 6: Rejection & Resubmission

1. **Create new university account:** `testreject@test.com`
2. **Upload documents**
3. **Logout, login as admin**
4. **Go to verifications**
5. **Select the rejected one**
6. **Click REJECT**
7. **Add reason:** "UGC letter not valid"
8. **Submit**
9. **Logout, login as university again**
10. **You should see:** Rejection reason displayed
11. **Click Resubmit Documents**
12. **Upload new documents**
13. **Admin approves again**
14. **Account unlocks**

### Troubleshooting Issues

**Issue: Can't see /admin/verifications route**
- Solution: Make sure you're logged in as super admin
- Check: `super_admin_accounts` table has your user

**Issue: Documents won't upload**
- Solution: Check file size (max 10MB)
- Try: PDF, JPG, or PNG files
- Check: Browser console for errors

**Issue: Status doesn't update**
- Solution: Refresh browser (Ctrl+R or Cmd+R)
- Try: Clear browser cache
- Check: Backend logs for errors

**Issue: Account still locked after approval**
- Solution: Refresh page
- Try: Clear browser cache and cookies
- Check: Backend logs

---

## Step 5️⃣: Deploy to Production (5 minutes)

### Prerequisites
- ✅ All tests passing locally
- ✅ All code committed to git
- ✅ Database migration applied to production Supabase

### Deploy Backend

```bash
cd /Users/adityachaturvedi/Documents/EqConnect/server

# Ensure environment variables are set for production
# Update .env with production Supabase URL and keys

# Commit changes
git add -A
git commit -m "feat: add university verification system"

# Push to production
git push origin main
```

### Deploy Frontend

```bash
cd /Users/adityachaturvedi/Documents/EqConnect/client

# Build for production
npm run build

# This creates /dist folder with optimized code

# Deploy (push to origin, CI/CD will handle rest)
git push origin main
```

### Verify Production

```bash
# Check backend health
curl https://your-production-url.com/health

# Expected response:
# {"status":"ok"}

# Check admin dashboard
# Visit: https://your-production-url.com/admin/verifications
# Login with super admin credentials
```

---

## 📊 Post-Deployment Checklist

- [ ] Database migration applied
- [ ] Tables created successfully
- [ ] Super admin account created
- [ ] University registration working
- [ ] Document upload working
- [ ] Verification status displaying
- [ ] Admin dashboard showing pending
- [ ] Approval workflow functioning
- [ ] Account unlocking on approval
- [ ] Rejection with resubmission working
- [ ] All 3 test scenarios passing
- [ ] Backend deployed
- [ ] Frontend deployed
- [ ] Production URLs verified
- [ ] Admin can login
- [ ] Notifications working

---

## 🆘 Troubleshooting

### Database Issues

**Problem: Migration fails**
```bash
# Check syntax errors
psql -h lkieeqieyzksjwgbrjku.supabase.co \
  -U postgres \
  -d postgres \
  -c "\d university_verification_documents"
```

**Problem: Can't connect to Supabase**
```bash
# Verify credentials in .env
cat server/.env | grep SUPABASE

# Test connection
PGPASSWORD="your-password" psql \
  -h lkieeqieyzksjwgbrjku.supabase.co \
  -U postgres \
  -d postgres \
  -c "SELECT version();"
```

### Backend Issues

**Problem: Verification endpoints not working**
```bash
# Check if route is registered
grep -n "verification" server/src/index.ts

# Check TypeScript compilation
cd server && npm run build
```

**Problem: JWT errors on verification endpoints**
```bash
# Verify auth middleware is applied to all routes
grep -A 2 "router.post" server/src/routes/verification.ts
```

### Frontend Issues

**Problem: Routes not found**
```bash
# Verify routes are registered in App.tsx
grep -A 1 "/admin/verifications\|/university/verify" client/src/App.tsx

# Check if components exist
ls -la client/src/pages/admin/
ls -la client/src/pages/university/
```

**Problem: Can't upload documents**
```bash
# Check hook is properly imported
grep "useVerification" client/src/pages/university/UniversityVerificationUpload.tsx

# Clear browser cache and retry
```

---

## 📞 Quick Reference

### Important File Locations
- Database Migration: `server/src/migrations/04_university_verification.sql`
- Backend Routes: `server/src/routes/verification.ts`
- Frontend Hook: `client/src/hooks/useVerification.ts`
- University Pages: `client/src/pages/university/`
- Admin Pages: `client/src/pages/admin/`

### Key Endpoints
- POST `/api/verification/submit-documents` - Upload docs
- GET `/api/verification/status` - Check status
- GET `/api/verification/pending-verifications` - Admin list
- POST `/api/verification/approve` - Admin approve
- POST `/api/verification/reject` - Admin reject
- POST `/api/verification/resubmit-documents` - Resubmit

### Key Routes
- `/university/verify` - Upload page
- `/university/verification-pending` - Status page
- `/admin/verifications` - Admin dashboard

---

## ✅ Success Indicators

✅ **Migration successful**
- Tables exist in database
- User table has new columns
- RLS policies active

✅ **Super admin created**
- Can login to admin dashboard
- Can see pending verifications
- Can approve/reject

✅ **Workflow functioning**
- Universities can upload docs
- Dashboard locks during verification
- Status updates correctly
- Admin can review and approve
- Account unlocks on approval
- Rejection with resubmission works

✅ **Production ready**
- No errors in logs
- All endpoints responsive
- Frontend builds successfully
- Admin features working
- Security policies active

---

## 🎉 Next Steps After Deployment

1. **Monitor Logs**
   - Check backend logs for errors
   - Monitor verification submissions
   - Track admin approvals

2. **Gather Feedback**
   - Ask universities for feedback
   - Ask admins for UI suggestions
   - Monitor support tickets

3. **Plan Enhancements**
   - Auto-approvals for known universities
   - Document verification with AI
   - Email notifications
   - SMS alerts

4. **Scale Considerations**
   - Monitor database performance
   - Track document storage size
   - Plan for increased users

---

**Deployment Guide Complete**

**Status:** Ready to Deploy ✅  
**Time to Complete:** ~45 minutes  
**Difficulty:** Moderate  

**Start with Step 1 - Apply Database Migration!**
