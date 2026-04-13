# 🎯 Quick Action Plan - Deploy Now

**Follow these steps in order to deploy the verification system**

---

## ⚡ 5-Minute Quick Start

### Step 1: Apply Database Migration (Using Supabase Dashboard - Easiest!)

```bash
# Open this file in your editor:
cat /Users/adityachaturvedi/Documents/EqConnect/server/src/migrations/04_university_verification.sql
```

**Then:**
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Click **SQL Editor** → **New Query**
4. Copy the entire migration file content
5. Paste into Supabase query editor
6. Click **Run**
7. ✅ Done! Tables created

### Step 2: Create Super Admin (2 minutes)

**In Supabase SQL Editor:**

```sql
-- First, find your admin user ID
SELECT id, email FROM auth.users WHERE email='YOUR_ADMIN_EMAIL' LIMIT 1;

-- Then create super admin (replace the UUID)
INSERT INTO super_admin_accounts (
  user_id,
  admin_level,
  created_at
) VALUES (
  'ADMIN_UUID_FROM_ABOVE',
  'super_admin',
  NOW()
);
```

✅ Done! Super admin created

### Step 3: Start Development Servers (2 minutes)

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

✅ Done! Both servers running

### Step 4: Test the System (10 minutes)

Open http://localhost:5173 and:

1. **Register as University**
   - Click Register
   - Select "University" role
   - Fill in details
   - Submit

2. **Upload Documents**
   - Go to /university/verify
   - Upload 3 PDFs
   - Click Submit

3. **Check Status**
   - Go to /university/verification-pending
   - See "Under Review" status
   - See 7-day countdown

4. **Admin Approval**
   - Logout
   - Login as admin
   - Go to /admin/verifications
   - Click Approve
   - Success!

5. **Verify Unlock**
   - Logout
   - Login as university
   - Dashboard is now unlocked!

✅ Done! System working

---

## 📋 Step-by-Step Instructions

### STEP 1: DATABASE MIGRATION

**What it does:** Creates 4 tables for verification system

**How to do it:**

**Option A: Using Supabase Dashboard (Recommended)**
```
1. Open https://app.supabase.com
2. Login → select your project (lkieeqieyzksjwgbrjku)
3. Click "SQL Editor" in left sidebar
4. Click "New Query"
5. Open this file: server/src/migrations/04_university_verification.sql
6. Copy ALL contents
7. Paste into Supabase query editor
8. Click "Run" button (top right)
9. Wait for success message
10. Close query
```

**Option B: Using Terminal**
```bash
# Copy migration file
cat /Users/adityachaturvedi/Documents/EqConnect/server/src/migrations/04_university_verification.sql

# Paste and run in Supabase dashboard
# (Easier than terminal commands)
```

**Verify success:**
```bash
# In Supabase SQL Editor, run:
SELECT * FROM information_schema.tables 
WHERE table_name LIKE 'university_%' OR table_name LIKE 'verification_%';
```

Expected: 4 tables shown ✅

---

### STEP 2: CREATE SUPER ADMIN

**What it does:** Makes an admin account able to review verifications

**How to do it:**

**Find your admin user ID:**

In Supabase Dashboard → **Table Editor** → **users** → Find your row → Copy the **id** field

**Then in SQL Editor, run:**

```sql
INSERT INTO super_admin_accounts (
  user_id,
  admin_level,
  created_at
) VALUES (
  'PASTE_YOUR_ID_HERE',
  'super_admin',
  NOW()
);
```

Replace `PASTE_YOUR_ID_HERE` with the admin ID you copied.

Click **Run**

You should see: "1 row inserted" ✅

---

### STEP 3: START SERVERS

**Terminal 1 - Start Backend:**
```bash
cd /Users/adityachaturvedi/Documents/EqConnect/server
npm run dev
```

Wait for: `Server running on port 3001` ✅

**Terminal 2 - Start Frontend:**
```bash
cd /Users/adityachaturvedi/Documents/EqConnect/client
npm run dev
```

Wait for: `Local: http://localhost:5173` ✅

---

### STEP 4: TEST REGISTRATION

**Open http://localhost:5173**

1. Click **Register**
2. Select role: **University**
3. Fill in:
   - Email: `test@university.com`
   - Password: `Test123!Pass`
   - University Name: `Test University`
   - Street: `123 Main St`
   - City: `New York`
   - State: `NY`
   - Country: `USA`
   - Established Year: `2000`
4. Click **Register**
5. You should see: "Verification Pending" message

Dashboard should show locked/verification pending ✅

---

### STEP 5: TEST DOCUMENT UPLOAD

1. Click **Upload Documents** button (or go to /university/verify)
2. You'll see upload form with 3 document types:
   - UGC Recognition Letter
   - Accreditation Certificate
   - Degree Certificate
3. Upload any 3 PDF files (or JPG/PNG)
4. Click **Submit Documents**
5. Success message appears

Status should change to "Under Review" ✅

---

### STEP 6: CHECK VERIFICATION STATUS

1. Go to /university/verification-pending
2. You should see:
   - Status: "Under Review"
   - Countdown timer: "7 days remaining"
   - 3 checkmarks for submitted documents
   - Timeline
   - Submitted date

Scroll and see details ✅

---

### STEP 7: LOGIN AS ADMIN & REVIEW

1. Click profile icon → **Logout**
2. Login with your **admin account** credentials
3. Go to **/admin/verifications**
4. You should see:
   - "Test University" in pending list
   - Submitted date
   - "Review" button

✅ Click "Review"

---

### STEP 8: APPROVE UNIVERSITY

1. On review page, you should see:
   - University name
   - Email
   - 3 uploaded documents
   - "View Document" buttons
   - Approval form with textarea for notes

2. In textarea, type: `Documents verified successfully`
3. Click **APPROVE** button
4. Success message appears

✅ University approved

---

### STEP 9: VERIFY ACCOUNT UNLOCKED

1. Logout as admin (profile → Logout)
2. Login with **university account** (test@university.com)
3. Dashboard should now be **FULLY UNLOCKED**
4. Status should show: **"Approved"**
5. Can now access all features

✅ System working perfectly!

---

## 🧪 Quick Test Scenarios

### Scenario 1: Rejection & Resubmission
```
1. Create another university account (test2@university.com)
2. Upload documents
3. Login as admin
4. Click Reject with reason: "Documents unclear"
5. Logout, login as university
6. See rejection reason
7. Click "Resubmit Documents"
8. Upload corrected documents
9. Admin can approve again
```

### Scenario 2: Multiple Admin Reviews
```
1. Create multiple university accounts
2. Upload documents for each
3. Admin can see all pending
4. Can approve/reject each one
5. Each university sees correct status
```

### Scenario 3: 7-Day Deadline
```
1. Upload documents
2. Check status page
3. See countdown timer showing days remaining
4. After 7 days, system can auto-delete if configured
```

---

## 🚨 If Something Goes Wrong

### Problem: "Tables not found" error
**Solution:** Run the migration again (Step 1)

### Problem: Can't login as admin to see verifications
**Solution:** Make sure super admin account was created (Step 2)

### Problem: Upload button doesn't work
**Solution:** 
- Clear browser cache (Cmd+Shift+Delete)
- Restart both servers
- Check browser console for errors

### Problem: Status not updating
**Solution:**
- Refresh page (Cmd+R)
- Clear cache and refresh
- Check backend logs for errors

### Problem: Admin can see list but not approve
**Solution:**
- Verify user is super admin in database
- Check backend logs
- Restart backend server

---

## ✅ Completion Checklist

After following all steps, verify:

- [ ] Database migration applied (4 tables created)
- [ ] Super admin account created
- [ ] Backend server running on 3001
- [ ] Frontend server running on 5173
- [ ] Can register as university
- [ ] Dashboard shows "Verification Pending"
- [ ] Can upload documents
- [ ] Status updates to "Under Review"
- [ ] Can see countdown timer
- [ ] Can login as admin
- [ ] Admin can see pending verifications
- [ ] Admin can approve university
- [ ] University account unlocks after approval
- [ ] Rejection workflow works
- [ ] Can resubmit documents

**If all checked: ✅ SYSTEM IS COMPLETE AND WORKING!**

---

## 🎉 Success!

**You have successfully:**
✅ Set up the database  
✅ Created admin accounts  
✅ Deployed the verification system  
✅ Tested the complete workflow  
✅ Verified the system works end-to-end  

**System is now ready for:**
- Further testing
- Production deployment
- Real university verifications
- Scale to multiple users

**Next: Deploy to production!**

---

**Last Updated:** April 12, 2026  
**Status:** Ready to Deploy  
**Time Estimate:** 45 minutes total  
**Difficulty:** Moderate (mostly copy-paste)

**Start with Step 1 - Open Supabase Dashboard Now!**
