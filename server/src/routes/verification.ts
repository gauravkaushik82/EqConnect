import { Router, Request, Response } from 'express'
import { getSupabase } from '../lib/supabase.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

/**
 * POST /api/verification/submit-documents
 * Submit university verification documents (base64 encoded)
 */
router.post('/submit-documents', authMiddleware, async (req: Request, res: Response) => {
  try {
    const supabase = getSupabase()
    const userId = (req as any).user.userId
    const { universityName, documents } = req.body

    if (!documents || !Array.isArray(documents) || documents.length === 0) {
      return res.status(400).json({ error: 'No documents provided' })
    }

    // Check if user is a university and not already verified
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .eq('role', 'university')
      .single()

    if (userError || !user) {
      return res.status(403).json({ error: 'Only university accounts can submit verification documents' })
    }

    if (user.verification_status === 'verified') {
      return res.status(400).json({ error: 'University is already verified' })
    }

    // Store documents in database (base64 encoded)
    for (const doc of documents) {
      const { error: insertError } = await supabase
        .from('university_verification_documents')
        .insert({
          user_id: userId,
          document_type: doc.type || 'other',
          document_url: doc.base64Data, // Storing base64 encoded data
          file_name: doc.fileName,
          file_size: doc.fileSize,
          mime_type: doc.mimeType
        })

      if (insertError) throw insertError
    }

    // Update user verification status
    const verificationDeadline = new Date()
    verificationDeadline.setDate(verificationDeadline.getDate() + 7)

    const { error: updateError } = await supabase
      .from('users')
      .update({
        verification_status: 'pending',
        verification_submitted_at: new Date().toISOString(),
        verification_deadline: verificationDeadline.toISOString(),
        is_account_locked: true,
        lock_reason: 'Verification pending - documents submitted for review',
        account_locked_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (updateError) throw updateError

    // Create verification notification
    await supabase
      .from('verification_notifications')
      .insert({
        user_id: userId,
        type: 'submission_received',
        message: `We received your verification documents. An admin will review them within 24-48 hours.`
      })

    // Create audit log
    await supabase
      .from('verification_audit_logs')
      .insert({
        user_id: userId,
        admin_id: userId,
        action: 'submitted',
        new_status: 'pending'
      })

    res.status(201).json({
      message: 'Documents submitted successfully. Your account is locked pending verification.',
      documentsCount: documents.length,
      verificationDeadline: verificationDeadline.toISOString()
    })
  } catch (error: any) {
    console.error('Submit documents error:', error)
    res.status(500).json({ error: 'Failed to submit documents', details: error.message })
  }
})

/**
 * GET /api/verification/status
 * Get current verification status for user
 */
router.get('/status', authMiddleware, async (req: Request, res: Response) => {
  try {
    const supabase = getSupabase()
    const userId = (req as any).user.userId

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (userError) throw userError

    // Get documents for this user
    const { data: documents, error: docsError } = await supabase
      .from('university_verification_documents')
      .select('*')
      .eq('user_id', userId)

    if (docsError) throw docsError

    res.json({
      verificationStatus: user.verification_status,
      isAccountLocked: user.is_account_locked,
      lockReason: user.lock_reason,
      submittedAt: user.verification_submitted_at,
      verificationDeadline: user.verification_deadline,
      approvedAt: user.verification_approved_at,
      notes: user.verification_notes,
      documentsSubmitted: documents?.length || 0,
      documents: documents?.map((doc: any) => ({
        id: doc.id,
        type: doc.document_type,
        fileName: doc.file_name,
        uploadedAt: doc.uploaded_at
      }))
    })
  } catch (error: any) {
    console.error('Get verification status error:', error)
    res.status(500).json({ error: 'Failed to get verification status', details: error.message })
  }
})

/**
 * GET /api/verification/pending-verifications (ADMIN ONLY)
 * Get all pending verification requests for admin review
 */
router.get('/pending-verifications', authMiddleware, async (req: Request, res: Response) => {
  try {
    const supabase = getSupabase()
    const adminId = (req as any).user.userId

    // Check if user is super admin
    const { data: adminAccount, error: adminError } = await supabase
      .from('super_admin_accounts')
      .select('*')
      .eq('user_id', adminId)
      .single()

    if (adminError || !adminAccount) {
      return res.status(403).json({ error: 'Only admins can access pending verifications' })
    }

    // Get all pending verifications with document info
    const { data: pendingUsers, error: usersError } = await supabase
      .from('users')
      .select('*')
      .eq('verification_status', 'pending')
      .eq('role', 'university')
      .order('verification_submitted_at', { ascending: true })

    if (usersError) throw usersError

    // Get documents for each pending user
    const pendingVerifications = await Promise.all(
      (pendingUsers || []).map(async (user: any) => {
        const { data: documents } = await supabase
          .from('university_verification_documents')
          .select('*')
          .eq('user_id', user.id)

        const { data: logs } = await supabase
          .from('verification_audit_logs')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5)

        return {
          userId: user.id,
          universityName: user.full_name,
          email: user.email,
          submittedAt: user.verification_submitted_at,
          deadline: user.verification_deadline,
          documents: documents || [],
          activityLog: logs || []
        }
      })
    )

    res.json({
      count: pendingVerifications.length,
      verifications: pendingVerifications
    })
  } catch (error: any) {
    console.error('Get pending verifications error:', error)
    res.status(500).json({ error: 'Failed to get pending verifications', details: error.message })
  }
})

/**
 * POST /api/verification/approve (ADMIN ONLY)
 * Approve university verification
 */
router.post('/approve', authMiddleware, async (req: Request, res: Response) => {
  try {
    const supabase = getSupabase()
    const adminId = (req as any).user.userId
    const { userId, notes } = req.body

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' })
    }

    // Check if user is super admin
    const { data: adminAccount, error: adminError } = await supabase
      .from('super_admin_accounts')
      .select('*')
      .eq('user_id', adminId)
      .single()

    if (adminError || !adminAccount) {
      return res.status(403).json({ error: 'Only admins can approve verifications' })
    }

    // Approve the verification
    const { error: updateError } = await supabase
      .from('users')
      .update({
        verification_status: 'verified',
        verification_approved_at: new Date().toISOString(),
        verification_notes: notes || '',
        is_account_locked: false,
        lock_reason: null,
        account_locked_at: null
      })
      .eq('id', userId)

    if (updateError) throw updateError

    // Create audit log
    await supabase
      .from('verification_audit_logs')
      .insert({
        user_id: userId,
        admin_id: adminId,
        action: 'approved',
        reason: notes,
        previous_status: 'pending',
        new_status: 'verified'
      })

    // Create notification for user
    await supabase
      .from('verification_notifications')
      .insert({
        user_id: userId,
        type: 'approved',
        message: `Congratulations! Your university has been verified. Your account is now fully active.`
      })

    res.json({
      message: 'University verified successfully',
      userId
    })
  } catch (error: any) {
    console.error('Approve verification error:', error)
    res.status(500).json({ error: 'Failed to approve verification', details: error.message })
  }
})

/**
 * POST /api/verification/reject (ADMIN ONLY)
 * Reject university verification
 */
router.post('/reject', authMiddleware, async (req: Request, res: Response) => {
  try {
    const supabase = getSupabase()
    const adminId = (req as any).user.userId
    const { userId, reason } = req.body

    if (!userId || !reason) {
      return res.status(400).json({ error: 'userId and reason are required' })
    }

    // Check if user is super admin
    const { data: adminAccount, error: adminError } = await supabase
      .from('super_admin_accounts')
      .select('*')
      .eq('user_id', adminId)
      .single()

    if (adminError || !adminAccount) {
      return res.status(403).json({ error: 'Only admins can reject verifications' })
    }

    // Reject the verification
    const { error: updateError } = await supabase
      .from('users')
      .update({
        verification_status: 'rejected',
        verification_notes: reason,
        is_account_locked: true,
        lock_reason: `Verification rejected: ${reason}`,
        account_locked_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (updateError) throw updateError

    // Create audit log
    await supabase
      .from('verification_audit_logs')
      .insert({
        user_id: userId,
        admin_id: adminId,
        action: 'rejected',
        reason: reason,
        previous_status: 'pending',
        new_status: 'rejected'
      })

    // Create notification for user
    await supabase
      .from('verification_notifications')
      .insert({
        user_id: userId,
        type: 'rejected',
        message: `Your verification was rejected. Reason: ${reason}. You can resubmit documents for re-review.`
      })

    res.json({
      message: 'Verification rejected',
      userId
    })
  } catch (error: any) {
    console.error('Reject verification error:', error)
    res.status(500).json({ error: 'Failed to reject verification', details: error.message })
  }
})

/**
 * POST /api/verification/resubmit-documents
 * Allow users to resubmit documents after rejection
 */
router.post('/resubmit-documents', authMiddleware, async (req: Request, res: Response) => {
  try {
    const supabase = getSupabase()
    const userId = (req as any).user.userId
    const { documents } = req.body

    if (!documents || !Array.isArray(documents) || documents.length === 0) {
      return res.status(400).json({ error: 'No documents provided' })
    }

    // Check if user is a university and rejected
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .eq('role', 'university')
      .single()

    if (userError || !user) {
      return res.status(403).json({ error: 'Only university accounts can resubmit documents' })
    }

    if (user.verification_status !== 'rejected') {
      return res.status(400).json({ error: 'You can only resubmit if your verification was rejected' })
    }

    // Delete old documents
    await supabase
      .from('university_verification_documents')
      .delete()
      .eq('user_id', userId)

    // Store new documents
    for (const doc of documents) {
      await supabase
        .from('university_verification_documents')
        .insert({
          user_id: userId,
          document_type: doc.type || 'other',
          document_url: doc.base64Data,
          file_name: doc.fileName,
          file_size: doc.fileSize,
          mime_type: doc.mimeType
        })
    }

    // Update user status back to pending
    const verificationDeadline = new Date()
    verificationDeadline.setDate(verificationDeadline.getDate() + 7)

    await supabase
      .from('users')
      .update({
        verification_status: 'pending',
        verification_submitted_at: new Date().toISOString(),
        verification_deadline: verificationDeadline.toISOString(),
        verification_notes: null
      })
      .eq('id', userId)

    // Create audit log
    await supabase
      .from('verification_audit_logs')
      .insert({
        user_id: userId,
        admin_id: userId,
        action: 'resubmitted',
        new_status: 'pending'
      })

    // Create notification
    await supabase
      .from('verification_notifications')
      .insert({
        user_id: userId,
        type: 'submission_received',
        message: `Your resubmitted documents have been received. We'll review them again within 24-48 hours.`
      })

    res.json({
      message: 'Documents resubmitted successfully',
      documentsCount: documents.length,
      verificationDeadline: verificationDeadline.toISOString()
    })
  } catch (error: any) {
    console.error('Resubmit documents error:', error)
    res.status(500).json({ error: 'Failed to resubmit documents', details: error.message })
  }
})

/**
 * GET /api/verification/notifications
 * Get verification-related notifications
 */
router.get('/notifications', authMiddleware, async (req: Request, res: Response) => {
  try {
    const supabase = getSupabase()
    const userId = (req as any).user.userId

    const { data: notifications, error } = await supabase
      .from('verification_notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    res.json({
      notifications: notifications || []
    })
  } catch (error: any) {
    console.error('Get verification notifications error:', error)
    res.status(500).json({ error: 'Failed to get notifications', details: error.message })
  }
})

/**
 * POST /api/admin/create-super-admin (SYSTEM ONLY)
 * Create a super admin account (requires system key or existing super admin)
 */
router.post('/create-super-admin', authMiddleware, async (req: Request, res: Response) => {
  try {
    const supabase = getSupabase()
    const adminId = (req as any).user.userId
    const { targetUserId, adminLevel } = req.body

    if (!targetUserId) {
      return res.status(400).json({ error: 'targetUserId is required' })
    }

    // Check if requester is already a super admin
    const { data: requesterAdmin } = await supabase
      .from('super_admin_accounts')
      .select('*')
      .eq('user_id', adminId)
      .single()

    // Allow if requester is super admin or if no super admin exists yet (bootstrap)
    const { data: allAdmins } = await supabase
      .from('super_admin_accounts')
      .select('count', { count: 'exact' })

    if ((allAdmins && allAdmins.length > 0) && !requesterAdmin) {
      return res.status(403).json({ error: 'Only super admins can create new admins' })
    }

    // Create super admin account
    const { error: insertError } = await supabase
      .from('super_admin_accounts')
      .insert({
        user_id: targetUserId,
        admin_level: adminLevel || 'admin',
        permissions: ['manage_verifications', 'manage_admins', 'view_reports']
      })

    if (insertError) throw insertError

    // Update user role to admin
    await supabase
      .from('users')
      .update({ role: 'admin' })
      .eq('id', targetUserId)

    res.json({
      message: 'Super admin account created successfully',
      userId: targetUserId,
      adminLevel: adminLevel || 'admin'
    })
  } catch (error: any) {
    console.error('Create super admin error:', error)
    res.status(500).json({ error: 'Failed to create super admin', details: error.message })
  }
})

export default router
