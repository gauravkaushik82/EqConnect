-- University Verification System
-- Handles document uploads, verification tracking, and account locking

-- Add verification fields to users table if not exists
ALTER TABLE IF EXISTS users 
ADD COLUMN IF NOT EXISTS verification_status VARCHAR(50) DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
ADD COLUMN IF NOT EXISTS verification_submitted_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS verification_approved_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS verification_notes TEXT,
ADD COLUMN IF NOT EXISTS is_account_locked BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS lock_reason VARCHAR(255),
ADD COLUMN IF NOT EXISTS account_locked_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS verification_deadline TIMESTAMP;

-- Create university verification documents table
CREATE TABLE IF NOT EXISTS university_verification_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  document_type VARCHAR(100) NOT NULL CHECK (document_type IN ('ugc_recognition', 'accreditation_certificate', 'degree_certificate')),
  document_url TEXT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  uploaded_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_university_verification_documents_user_id 
  ON university_verification_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_university_verification_documents_type 
  ON university_verification_documents(document_type);

-- Create super admin accounts table
CREATE TABLE IF NOT EXISTS super_admin_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  admin_level VARCHAR(50) NOT NULL DEFAULT 'admin' CHECK (admin_level IN ('admin', 'super_admin')),
  permissions VARCHAR[] DEFAULT '{"manage_verifications", "manage_admins", "view_reports"}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_super_admin_accounts_user_id 
  ON super_admin_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_super_admin_accounts_admin_level 
  ON super_admin_accounts(admin_level);

-- Create verification audit logs table
CREATE TABLE IF NOT EXISTS verification_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  admin_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL CHECK (action IN ('submitted', 'approved', 'rejected', 'resubmitted', 'locked', 'unlocked')),
  reason TEXT,
  previous_status VARCHAR(50),
  new_status VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_verification_audit_logs_user_id 
  ON verification_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_audit_logs_admin_id 
  ON verification_audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_verification_audit_logs_created_at 
  ON verification_audit_logs(created_at DESC);

-- Create verification notifications table
CREATE TABLE IF NOT EXISTS verification_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('submission_received', 'under_review', 'approved', 'rejected', 'expiring_soon', 'account_locked', 'account_unlocked')),
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_verification_notifications_user_id 
  ON verification_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_notifications_created_at 
  ON verification_notifications(created_at DESC);

-- Set up Row-Level Security (RLS) for verification documents
ALTER TABLE university_verification_documents ENABLE ROW LEVEL SECURITY;

-- Users can only see their own documents
CREATE POLICY university_verification_documents_select_policy 
  ON university_verification_documents FOR SELECT
  USING (user_id = auth.uid());

-- Users can only insert their own documents
CREATE POLICY university_verification_documents_insert_policy 
  ON university_verification_documents FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Enable RLS for super admin accounts
ALTER TABLE super_admin_accounts ENABLE ROW LEVEL SECURITY;

-- Super admin accounts are only visible to other super admins or the user themselves
CREATE POLICY super_admin_accounts_select_policy 
  ON super_admin_accounts FOR SELECT
  USING (user_id = auth.uid() OR (SELECT COUNT(*) FROM super_admin_accounts WHERE user_id = auth.uid()) > 0);

-- Enable RLS for verification audit logs
ALTER TABLE verification_audit_logs ENABLE ROW LEVEL SECURITY;

-- Users can see their own audit logs, admins can see all
CREATE POLICY verification_audit_logs_select_policy 
  ON verification_audit_logs FOR SELECT
  USING (user_id = auth.uid() OR (SELECT COUNT(*) FROM super_admin_accounts WHERE user_id = auth.uid()) > 0);

-- Enable RLS for verification notifications
ALTER TABLE verification_notifications ENABLE ROW LEVEL SECURITY;

-- Users can only see their own notifications
CREATE POLICY verification_notifications_select_policy 
  ON verification_notifications FOR SELECT
  USING (user_id = auth.uid());
