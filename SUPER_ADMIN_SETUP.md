# 🎯 Super Admin Role Setup Guide

## What's New

✅ **Completely separate `super_admin` role** - No conflicts with student/university/recruiter roles  
✅ **Dedicated Super Admin Dashboard** - Full verification system management  
✅ **Admin Management System** - Create and manage super admins  
✅ **Enhanced Security** - Super admin specific policies and permissions  
✅ **Audit Logging** - Track all super admin actions  

---

## 📋 Step-by-Step Setup (15 minutes)

### Step 1: Apply Database Migration (5 min)

The new super admin role system requires two migrations:

**Migration 1 (Already Applied):**
- `04_university_verification.sql` - Creates super_admin_accounts table

**Migration 2 (Apply Now):**
- `05_super_admin_role.sql` - Adds super admin audit logging and functions

**To Apply:**

1. Go to Supabase Dashboard → SQL Editor
2. Click "New Query"
3. Copy entire file: `server/src/migrations/05_super_admin_role.sql`
4. Paste into SQL Editor
5. Click "Run"
6. Expected: "Query completed successfully" ✅

### Step 2: Create Your First Super Admin (5 min)

Two options:

**Option A: Direct Insert (Fastest)**

```sql
INSERT INTO super_admin_accounts (user_id, admin_level, created_at)
VALUES ('YOUR_ADMIN_UUID', 'super_admin', NOW());
```

To get YOUR_ADMIN_UUID:
1. Go to Supabase → Authentication → Users
2. Find your admin account
3. Copy the UUID from the `id` column
4. Replace `YOUR_ADMIN_UUID` with it
5. Run in SQL Editor

**Option B: Using Registration Endpoint (Better for Future)**

```bash
# First, login with your original admin account to get token
# Then create a new super admin:

curl -X POST http://localhost:3001/api/super-admin/register \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@example.com",
    "password": "SecurePassword123!",
    "fullName": "Super Administrator"
  }'
```

### Step 3: Restart Backend & Test (5 min)

Kill the existing backend:
```bash
lsof -ti:3001 | xargs kill -9
```

Start fresh:
```bash
cd server && npm run dev
```

### Step 4: Login & Access Dashboard

1. Go to http://localhost:5176
2. Click "Login"
3. Email: Your super admin email
4. Password: Your super admin password
5. You'll be redirected to `/super-admin/dashboard` ✅

---

## 📊 Super Admin Dashboard Features

### Overview Tab
- **Total Universities** counter
- **Pending Review** count (yellow)
- **Approved** count (green)
- **Rejected** count (red)

### Charts
- **Bar Chart**: Shows verification status overview
- **Pie Chart**: Displays status distribution

### Verification Management Tabs

#### Pending Tab
- Shows universities awaiting verification
- Click "Review" to go to detailed view
- See uploaded documents
- Approve or reject with notes

#### Verified Tab
- Shows all approved universities
- View approval date and notes
- Audit trail available

#### Rejected Tab
- Shows all rejected universities
- See rejection reason
- Option to reopen if needed

### Search & Filter
- Search by university name or ID
- Filter by status
- Pagination support

---

## 🔑 Super Admin Capabilities

| Feature | Capability |
|---------|------------|
| **View Verifications** | See all pending university verifications |
| **Review Documents** | View uploaded UGC, Accreditation, Degree docs |
| **Approve Universities** | Unlock university accounts upon approval |
| **Reject Universities** | Reject with detailed feedback |
| **Add Notes** | Document approval/rejection reasons |
| **View Audit Trail** | See complete history of all actions |
| **Manage Other Super Admins** | Create additional super admins |
| **Access Dashboard** | Full analytics and statistics |

---

## 🔐 Security Details

### Super Admin Isolation
- Super admins have their own **role type** (`super_admin`)
- **No conflicts** with student, university, or recruiter roles
- Completely **separate** from admin role
- **Cannot register as student** or university

### Database Security
- Row-Level Security (RLS) policies enabled
- Super admins can only:
  - View their own permissions
  - View all verification records
  - Create new super admins
  - Access audit logs

### Access Control
```
Routes Protected:
✅ /super-admin/dashboard → Only role: 'super_admin'
✅ /api/super-admin/* → Only role: 'super_admin'
```

---

## 📝 API Endpoints

### Super Admin Management

**POST /api/super-admin/register**
- Create a new super admin
- Requires: existing super admin authentication
- Body: `{ email, password, fullName }`

**GET /api/super-admin/verify**
- Check if current user is super admin
- Returns: `{ isSuperAdmin, adminLevel, createdAt }`

**GET /api/super-admin/all-admins**
- List all super admins
- Requires: super admin auth
- Returns: List of all super admin accounts

---

## 🧪 Complete Test Workflow

### Test 1: Super Admin Dashboard Access
```
1. Login as super admin
2. Verify redirected to /super-admin/dashboard
3. Check stats load correctly
4. Navigate between tabs (Pending, Verified, Rejected)
5. Expected: Dashboard fully functional ✅
```

### Test 2: University Verification
```
1. Register as university (separate browser tab)
2. Upload documents
3. Logout and login as super admin
4. See university in "Pending" list
5. Click "Review" button
6. View documents
7. Click "Approve" with notes
8. Verify audit log entry created ✅
```

### Test 3: Admin Management
```
1. As super admin, call /api/super-admin/all-admins
2. See list of all super admins
3. Create new super admin via /api/super-admin/register
4. Verify new admin can login
5. Expected: Multiple super admins working ✅
```

### Test 4: Role Isolation
```
1. Try registering as "super_admin" role via /register
2. Verify it's accepted (new feature!)
3. Cannot access student dashboard
4. Cannot access university verification
5. Only /super-admin/dashboard accessible ✅
```

---

## ⚙️ Configuration

### Environment Variables (if needed)
```
# Add to .env if using super admin specific settings
SUPER_ADMIN_DASHBOARD_REFRESH_INTERVAL=30000  # 30 seconds
SUPER_ADMIN_AUDIT_LOG_RETENTION=90  # days
```

### Database Settings
- All policies configured in migrations
- Indexes created for performance
- RLS enabled on all tables

---

## 🚨 Troubleshooting

### Issue: "User is not a super admin"
**Solution:** 
1. Verify user UUID in super_admin_accounts table
2. Confirm database migration applied
3. Check auth token is valid

### Issue: Super Admin dashboard empty
**Solution:**
1. Verify backend running on port 3001
2. Check browser console for errors
3. Verify super_admin role set in database

### Issue: Can't create university account
**Solution:**
1. This is expected - use separate super_admin role
2. For testing: Register as "university" role from /register
3. Super admin role is only for dashboard access

### Issue: Audit logs not appearing
**Solution:**
1. Check if 05_super_admin_role.sql migration applied
2. Verify RLS policies on super_admin_audit_logs table
3. Check user permissions

---

## 📚 File Structure

```
server/
├── src/
│   ├── routes/
│   │   ├── superAdmin.ts          ← New super admin endpoints
│   │   └── verification.ts         ← University verification
│   └── migrations/
│       ├── 04_university_verification.sql
│       └── 05_super_admin_role.sql  ← New migration
│
client/
└── src/
    └── pages/
        └── admin/
            ├── SuperAdminDashboard.tsx    ← New dashboard
            ├── VerificationDash.tsx
            └── Dashboard.tsx
```

---

## ✅ Verification Checklist

- [ ] Migration 04 applied (already done)
- [ ] Migration 05 applied (just did)
- [ ] Super admin user created
- [ ] Backend restarted
- [ ] Can login as super admin
- [ ] Dashboard accessible at /super-admin/dashboard
- [ ] Can see pending verifications
- [ ] Can approve/reject universities
- [ ] Audit logs creating properly
- [ ] Role completely isolated from other roles

---

## 🎯 Next Steps

1. **Apply Migration 05** in Supabase
2. **Create first super admin** user
3. **Restart backend** server
4. **Test super admin dashboard**
5. **Test complete verification workflow**
6. **Deploy to production**

---

## 💡 Pro Tips

- Super admin role is **completely separate** - no conflicts!
- Use migration 05 for all super admin setup
- Dashboard auto-refreshes every 30 seconds
- All super admin actions logged in audit table
- Can create multiple super admins if needed

---

**Everything is ready! Follow the steps above and you'll have a fully functional super admin system! 🚀**
