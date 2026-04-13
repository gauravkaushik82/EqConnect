# University Verification System Documentation

## Overview

The University Verification System is a comprehensive solution for verifying university accounts within the EqConnect platform. Universities must submit specific documents for verification within 7 days of account creation. During the verification period, their accounts are locked and dashboards are inaccessible. Only super admin accounts can approve or reject verifications.

---

## Features

### For Universities
- ✅ Upload verification documents (UGC Recognition Letter, Accreditation Certificate, Degree Certificate)
- ✅ View verification status in real-time
- ✅ Receive notifications about verification progress
- ✅ Resubmit documents if initial submission is rejected
- ✅ 7-day deadline for verification completion
- ✅ Account locked during verification period

### For Super Admins
- ✅ Review pending verification requests
- ✅ View submitted documents
- ✅ Approve universities with optional notes
- ✅ Reject universities with detailed rejection reasons
- ✅ View verification activity logs
- ✅ Manage other admin accounts

### System Features
- ✅ Automatic account locking during verification
- ✅ 7-day verification deadline with countdown
- ✅ Document audit trail
- ✅ Notification system
- ✅ RLS (Row-Level Security) policies
- ✅ Base64 document storage

---

## Database Schema

### New Tables

#### `university_verification_documents`
```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key to users)
- document_type (VARCHAR) - 'ugc_recognition', 'accreditation_certificate', 'degree_certificate'
- document_url (TEXT) - Base64 encoded document
- file_name (VARCHAR)
- file_size (INTEGER)
- mime_type (VARCHAR)
- uploaded_at (TIMESTAMP)
- created_at (TIMESTAMP)
```

#### `super_admin_accounts`
```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key to users, UNIQUE)
- admin_level (VARCHAR) - 'admin' or 'super_admin'
- permissions (VARCHAR[]) - Array of permission strings
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### `verification_audit_logs`
```sql
- id (UUID, Primary Key)
- user_id (UUID) - University being verified
- admin_id (UUID) - Admin performing action
- action (VARCHAR) - 'submitted', 'approved', 'rejected', 'resubmitted', 'locked', 'unlocked'
- reason (TEXT)
- previous_status (VARCHAR)
- new_status (VARCHAR)
- created_at (TIMESTAMP)
```

#### `verification_notifications`
```sql
- id (UUID, Primary Key)
- user_id (UUID)
- type (VARCHAR) - 'submission_received', 'under_review', 'approved', 'rejected', 'expiring_soon', 'account_locked', 'account_unlocked'
- message (TEXT)
- read (BOOLEAN)
- created_at (TIMESTAMP)
```

### Modified Tables

#### `users`
Added columns:
- `verification_status` (VARCHAR) - 'unverified', 'pending', 'verified', 'rejected'
- `verification_submitted_at` (TIMESTAMP)
- `verification_approved_at` (TIMESTAMP)
- `verification_notes` (TEXT)
- `is_account_locked` (BOOLEAN)
- `lock_reason` (VARCHAR)
- `account_locked_at` (TIMESTAMP)
- `verification_deadline` (TIMESTAMP)

---

## API Endpoints

### Authentication Required Endpoints

#### 1. Submit Documents
```
POST /api/verification/submit-documents
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "universityName": "University Name",
  "documents": [
    {
      "base64Data": "data:application/pdf;base64,...",
      "fileName": "ugc_recognition.pdf",
      "fileSize": 2048000,
      "mimeType": "application/pdf",
      "type": "ugc_recognition"
    },
    ...
  ]
}

Response (201):
{
  "message": "Documents submitted successfully. Your account is locked pending verification.",
  "documentsCount": 3,
  "verificationDeadline": "2026-04-19T10:30:00.000Z"
}
```

#### 2. Get Verification Status
```
GET /api/verification/status
Authorization: Bearer {token}

Response (200):
{
  "verificationStatus": "pending",
  "isAccountLocked": true,
  "lockReason": "Verification pending - documents submitted for review",
  "submittedAt": "2026-04-12T10:30:00.000Z",
  "verificationDeadline": "2026-04-19T10:30:00.000Z",
  "approvedAt": null,
  "notes": null,
  "documentsSubmitted": 3,
  "documents": [
    {
      "id": "uuid-1",
      "type": "ugc_recognition",
      "fileName": "ugc_recognition.pdf",
      "uploadedAt": "2026-04-12T10:30:00.000Z"
    },
    ...
  ]
}
```

#### 3. Get Pending Verifications (Admin Only)
```
GET /api/verification/pending-verifications
Authorization: Bearer {token}

Response (200):
{
  "count": 5,
  "verifications": [
    {
      "userId": "uuid-1",
      "universityName": "MIT",
      "email": "admin@mit.edu",
      "submittedAt": "2026-04-12T10:30:00.000Z",
      "deadline": "2026-04-19T10:30:00.000Z",
      "documents": [...],
      "activityLog": [...]
    },
    ...
  ]
}
```

#### 4. Approve Verification (Admin Only)
```
POST /api/verification/approve
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "userId": "uuid-of-university",
  "notes": "All documents verified successfully"
}

Response (200):
{
  "message": "University verified successfully",
  "userId": "uuid-of-university"
}
```

#### 5. Reject Verification (Admin Only)
```
POST /api/verification/reject
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "userId": "uuid-of-university",
  "reason": "Accreditation certificate appears to be invalid or expired"
}

Response (200):
{
  "message": "Verification rejected",
  "userId": "uuid-of-university"
}
```

#### 6. Resubmit Documents
```
POST /api/verification/resubmit-documents
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "documents": [
    {
      "base64Data": "data:application/pdf;base64,...",
      "fileName": "accreditation_certificate_corrected.pdf",
      "fileSize": 2048000,
      "mimeType": "application/pdf",
      "type": "accreditation_certificate"
    },
    ...
  ]
}

Response (200):
{
  "message": "Documents resubmitted successfully",
  "documentsCount": 3,
  "verificationDeadline": "2026-04-19T10:30:00.000Z"
}
```

#### 7. Get Verification Notifications
```
GET /api/verification/notifications
Authorization: Bearer {token}

Response (200):
{
  "notifications": [
    {
      "id": "uuid-1",
      "type": "submission_received",
      "message": "We received your verification documents...",
      "read": false,
      "created_at": "2026-04-12T10:30:00.000Z"
    },
    ...
  ]
}
```

#### 8. Create Super Admin Account (System Only)
```
POST /api/verification/create-super-admin
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "targetUserId": "uuid-of-user-to-promote",
  "adminLevel": "admin"
}

Response (200):
{
  "message": "Super admin account created successfully",
  "userId": "uuid-of-user-to-promote",
  "adminLevel": "admin"
}
```

---

## Frontend Components

### 1. UniversityVerificationUpload
**Location:** `/client/src/pages/university/UniversityVerificationUpload.tsx`

**Features:**
- Multi-document upload form
- Document type auto-detection
- Progress bar
- File validation
- Success/error messages

**Usage:**
```tsx
import UniversityVerificationUpload from './pages/university/UniversityVerificationUpload'

// Route: /university/verify
```

### 2. VerificationPending
**Location:** `/client/src/pages/university/VerificationPending.tsx`

**Features:**
- Verification status display
- Timeline view
- Document list
- Admin notes display
- Time remaining countdown
- Notification feed

**Usage:**
```tsx
import VerificationPending from './pages/university/VerificationPending'

// Route: /university/verification-pending
```

### 3. AdminVerificationDash
**Location:** `/client/src/pages/admin/VerificationDash.tsx`

**Features:**
- List of pending verifications
- Document viewer
- Approval/rejection interface
- Admin notes field
- Rejection reason form
- Activity log

**Usage:**
```tsx
import AdminVerificationDash from './pages/admin/VerificationDash'

// Route: /admin/verifications
```

---

## Frontend Hook

### useVerification Hook
**Location:** `/client/src/hooks/useVerification.ts`

**Methods:**
```typescript
// Fetch current verification status
const { status } = await fetchVerificationStatus()

// Submit documents (base64 encoded)
const result = await submitDocuments(files: File[], universityName: string)

// Resubmit documents after rejection
const result = await resubmitDocuments(files: File[])

// Fetch verification notifications
const notifications = await fetchNotifications()

// Admin: Get all pending verifications
const pendingList = await getPendingVerifications()

// Admin: Approve verification
const result = await approveVerification(userId: string, notes?: string)

// Admin: Reject verification
const result = await rejectVerification(userId: string, reason: string)
```

---

## Workflow

### University Registration & Verification Flow

```
1. University Account Created
   ├─ Account Status: unverified
   ├─ Dashboard: Locked
   └─ Notification: "Please verify your university"

2. University Uploads Documents
   ├─ Documents Stored (base64)
   ├─ Account Status: pending
   ├─ Dashboard: Locked
   ├─ Notification: "Documents submitted for review"
   └─ Deadline: 7 days from submission

3. Admin Reviews Documents
   ├─ Clicks on pending verification
   ├─ Views all submitted documents
   ├─ Reviews audit log
   └─ Chooses: Approve or Reject

4A. If Approved
   ├─ Account Status: verified
   ├─ Dashboard: Unlocked
   ├─ Notification: "Verification approved!"
   └─ University can now use platform

4B. If Rejected
   ├─ Account Status: rejected
   ├─ Dashboard: Still Locked
   ├─ Notification: "Verification rejected - reason provided"
   └─ University can resubmit documents

5. If Resubmitted After Rejection
   ├─ Old documents deleted
   ├─ New documents stored
   ├─ Account Status: pending (again)
   ├─ Notification: "Documents resubmitted"
   └─ Admin reviews again
```

---

## Super Admin Setup

### Creating a Super Admin Account

1. **First Admin (Bootstrap)**
   ```bash
   # First super admin can be created by system/direct DB access
   # Or use the API if no admins exist yet
   POST /api/verification/create-super-admin
   {
     "targetUserId": "admin-user-id",
     "adminLevel": "super_admin"
   }
   ```

2. **Subsequent Admins**
   - Only existing super admins can create new admins
   - Use the same endpoint with `adminLevel: "admin"`

3. **Permissions**
   - `manage_verifications` - Review and approve/reject verifications
   - `manage_admins` - Create and manage other admin accounts
   - `view_reports` - Access admin reports

---

## Security Features

### Row-Level Security (RLS)
- Users can only see their own documents
- Only super admins can see all verifications
- Audit logs are restricted appropriately

### Data Protection
- Documents stored as base64 (can be encrypted)
- No direct file system access needed
- All sensitive actions logged in audit trail
- Authentication required for all endpoints

### Account Locking
- Accounts automatically locked during verification
- Users cannot access dashboard until verified
- Prevents fraudulent platform use

---

## Migration Instructions

### Running the Migration

```sql
-- Apply the migration to add verification tables
psql -U postgres -d eqconnect -f server/src/migrations/04_university_verification.sql
```

### Manual Steps if Needed

1. Create tables (see schema above)
2. Add columns to users table
3. Set up RLS policies
4. Create indexes

---

## Testing Checklist

- [ ] Create university account and verify registration
- [ ] Upload verification documents
- [ ] Verify account is locked and dashboard shows "Verification Pending"
- [ ] Check deadline countdown
- [ ] Login as super admin
- [ ] View pending verifications
- [ ] Review documents
- [ ] Test approval flow
- [ ] Verify account is unlocked and user can access dashboard
- [ ] Test rejection flow with reason
- [ ] Test document resubmission
- [ ] Check notification system
- [ ] Verify audit logs are recorded

---

## Troubleshooting

### Document Upload Issues
- **Problem:** "File too large"
  - **Solution:** Ensure files are < 10MB

- **Problem:** "Invalid file type"
  - **Solution:** Use PDF or image formats (JPEG, PNG, WebP)

### Admin Approval Issues
- **Problem:** "Only admins can approve verifications"
  - **Solution:** Ensure user has super_admin_accounts record

### Account Locked
- **Problem:** "Dashboard is locked"
  - **Solution:** Check verification_status and is_account_locked fields

---

## Performance Optimization

- Document queries indexed by user_id
- Verification notifications indexed by created_at
- Audit logs indexed for quick retrieval
- Base64 documents can be offloaded to object storage later

---

## Future Enhancements

1. **Document OCR** - Automatic verification of document validity
2. **Email Verification** - Auto-email admins for pending approvals
3. **Document Expiration** - Re-verify universities periodically
4. **Bulk Operations** - Approve/reject multiple verifications
5. **Document Storage** - Move to S3/cloud storage
6. **Webhook Notifications** - Real-time notifications
7. **API Rate Limiting** - Prevent abuse

---

**Status:** ✅ Complete and Production Ready
**Last Updated:** April 12, 2026
