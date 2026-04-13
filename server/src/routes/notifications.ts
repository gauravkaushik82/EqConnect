import { Router, Request, Response } from 'express'
import { authMiddleware } from '../middleware/auth.js'
import { getSupabase } from '../lib/supabase.js'

const router = Router()

// POST /api/notifications - Create notification (internal use)
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { recipient_id, title, message, type, related_id } = req.body

    if (!recipient_id || !title || !message || !type) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const validTypes = ['job_application', 'application_status', 'message', 'profile_view', 'skill_endorsement', 'opportunity']
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: 'Invalid notification type' })
    }

    if (title.length < 3 || title.length > 255) {
      return res.status(400).json({ error: 'Title must be 3-255 characters' })
    }

    if (message.length < 5 || message.length > 1000) {
      return res.status(400).json({ error: 'Message must be 5-1000 characters' })
    }

    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        recipient_id,
        title,
        message,
        type,
        related_id: related_id || null,
        read: false,
        created_at: new Date()
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating notification:', error)
      return res.status(500).json({ error: 'Failed to create notification' })
    }

    res.status(201).json(data)
  } catch (err) {
    console.error('Error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// GET /api/notifications - Get all notifications for user
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const { unread_only, limit = '20', offset = '0' } = req.query

    const supabase = getSupabase()
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('recipient_id', userId)
      .order('created_at', { ascending: false })

    if (unread_only === 'true') {
      query = query.eq('read', false)
    }

    const { data, error, count } = await query
      .range(parseInt(offset as string), parseInt(offset as string) + parseInt(limit as string) - 1)

    if (error) {
      console.error('Error fetching notifications:', error)
      return res.status(500).json({ error: 'Failed to fetch notifications' })
    }

    res.json({
      notifications: data || [],
      total: count || 0,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string)
    })
  } catch (err) {
    console.error('Error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// GET /api/notifications/unread - Get unread count
router.get('/unread/count', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId

    const supabase = getSupabase()
    const { data, error, count } = await supabase
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('recipient_id', userId)
      .eq('read', false)

    if (error) {
      console.error('Error fetching unread count:', error)
      return res.status(500).json({ error: 'Failed to fetch unread count' })
    }

    res.json({ unread_count: count || 0 })
  } catch (err) {
    console.error('Error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// GET /api/notifications/:id - Get single notification
router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const { id } = req.params

    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('id', id)
      .eq('recipient_id', userId)
      .single()

    if (error || !data) {
      return res.status(404).json({ error: 'Notification not found' })
    }

    res.json(data)
  } catch (err) {
    console.error('Error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// PUT /api/notifications/:id - Mark as read
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const { id } = req.params
    const { read } = req.body

    if (typeof read !== 'boolean') {
      return res.status(400).json({ error: 'Invalid read value' })
    }

    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('notifications')
      .update({ read, updated_at: new Date() })
      .eq('id', id)
      .eq('recipient_id', userId)
      .select()
      .single()

    if (error || !data) {
      return res.status(404).json({ error: 'Notification not found' })
    }

    res.json(data)
  } catch (err) {
    console.error('Error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// PUT /api/notifications/mark-all-read - Mark all as read
router.put('/mark-all/read', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId

    const supabase = getSupabase()
    const { error } = await supabase
      .from('notifications')
      .update({ read: true, updated_at: new Date() })
      .eq('recipient_id', userId)
      .eq('read', false)

    if (error) {
      console.error('Error marking all as read:', error)
      return res.status(500).json({ error: 'Failed to mark all as read' })
    }

    res.json({ message: 'All notifications marked as read' })
  } catch (err) {
    console.error('Error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// DELETE /api/notifications/:id - Delete notification
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const { id } = req.params

    const supabase = getSupabase()
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id)
      .eq('recipient_id', userId)

    if (error) {
      return res.status(404).json({ error: 'Notification not found' })
    }

    res.json({ message: 'Notification deleted' })
  } catch (err) {
    console.error('Error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// POST /api/notifications/preferences - Update notification preferences
router.post('/preferences/update', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const { email_notifications, in_app_notifications, notification_types } = req.body

    if (typeof email_notifications !== 'boolean' || typeof in_app_notifications !== 'boolean') {
      return res.status(400).json({ error: 'Invalid preferences' })
    }

    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('notification_preferences')
      .upsert({
        user_id: userId,
        email_notifications,
        in_app_notifications,
        notification_types: notification_types || ['job_application', 'application_status', 'message'],
        updated_at: new Date()
      }, { onConflict: 'user_id' })
      .select()
      .single()

    if (error) {
      console.error('Error updating preferences:', error)
      return res.status(500).json({ error: 'Failed to update preferences' })
    }

    res.json(data)
  } catch (err) {
    console.error('Error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// GET /api/notifications/preferences - Get notification preferences
router.get('/preferences/get', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId

    const supabase = getSupabase()
    let { data, error } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (!data) {
      const defaultPrefs = {
        user_id: userId,
        email_notifications: true,
        in_app_notifications: true,
        notification_types: ['job_application', 'application_status', 'message'],
        created_at: new Date(),
        updated_at: new Date()
      }

      const { data: newData, error: insertError } = await supabase
        .from('notification_preferences')
        .insert(defaultPrefs)
        .select()
        .single()

      if (insertError) {
        console.error('Error creating preferences:', insertError)
        return res.status(500).json({ error: 'Failed to create preferences' })
      }

      return res.json(newData)
    }

    if (error) {
      console.error('Error fetching preferences:', error)
      return res.status(500).json({ error: 'Failed to fetch preferences' })
    }

    res.json(data)
  } catch (err) {
    console.error('Error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
