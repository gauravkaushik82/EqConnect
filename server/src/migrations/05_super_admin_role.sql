-- Add super_admin role support to the system
-- This migration adds the super_admin role as a distinct role type

-- 1. Update users table to allow super_admin role
-- Note: In Supabase, we use CHECK constraints to validate enum values
-- The users table already has a role column, so we just need to ensure it can accept 'super_admin'

-- 2. Add super_admin_accounts table (if not exists from previous migration)
-- This was already created in 04_university_verification.sql

-- 3. Create RLS policies for super_admin_accounts
-- These policies should already be in place from 04_university_verification.sql

-- 4. Add a function to check if user is super admin
CREATE OR REPLACE FUNCTION is_super_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM super_admin_accounts WHERE super_admin_accounts.user_id = user_id) > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Add audit log for super admin creation
CREATE TABLE IF NOT EXISTS super_admin_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action text NOT NULL,
  performed_by uuid NOT NULL REFERENCES auth.users(id),
  performed_on uuid REFERENCES auth.users(id),
  details jsonb,
  created_at timestamp with time zone DEFAULT now(),
  FOREIGN KEY (performed_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Enable RLS
ALTER TABLE super_admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policy: Only super admins can view audit logs
CREATE POLICY super_admin_audit_logs_select_policy ON super_admin_audit_logs
  FOR SELECT
  USING (
    (SELECT COUNT(*) FROM super_admin_accounts WHERE user_id = auth.uid()) > 0
  );

-- Create policy: Only super admins can insert audit logs
CREATE POLICY super_admin_audit_logs_insert_policy ON super_admin_audit_logs
  FOR INSERT
  WITH CHECK (
    performed_by = auth.uid() AND
    (SELECT COUNT(*) FROM super_admin_accounts WHERE user_id = auth.uid()) > 0
  );

-- 6. Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_super_admin_accounts_user_id ON super_admin_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_super_admin_audit_logs_performed_by ON super_admin_audit_logs(performed_by);
CREATE INDEX IF NOT EXISTS idx_super_admin_audit_logs_created_at ON super_admin_audit_logs(created_at DESC);

-- 7. Grant necessary permissions
GRANT EXECUTE ON FUNCTION is_super_admin TO authenticated;

-- Done! The super_admin role is now fully integrated into the system
