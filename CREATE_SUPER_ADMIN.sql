-- CREATE SUPER ADMIN ACCOUNT
-- Replace YOUR_ADMIN_UUID with your actual admin user ID from auth.users table

INSERT INTO super_admin_accounts (user_id, admin_level, created_at)
VALUES ('YOUR_ADMIN_UUID', 'super_admin', NOW());


-- After running the INSERT above, verify it worked by running this:
SELECT user_id, admin_level FROM super_admin_accounts;

-- Expected result:
-- user_id                              | admin_level
-- ------------------------------------+-------------
-- 8f3c2a1d-4e5f-6g7h-8i9j-0k1l2m3n4o5p | super_admin


-- ========================================================================
-- HOW TO GET YOUR ADMIN USER ID:
-- ========================================================================
-- 
-- 1. Go to Supabase Dashboard: https://app.supabase.com
-- 2. Select your project (lkieeqieyzksjwgbrjku)
-- 3. Click "Table Editor" in left sidebar
-- 4. Click "auth.users" table
-- 5. Find your admin account row
-- 6. Copy the "id" field (UUID format)
-- 7. Replace 'YOUR_ADMIN_UUID' with that value
-- 8. Run this query in SQL Editor
-- 9. You should see: "1 row inserted"
--
-- ========================================================================
