import { Router, Request, Response } from 'express'
import { authMiddleware } from '../middleware/auth.js'
import { getSupabase } from '../lib/supabase.js'

const router = Router()

/**
 * GET /api/messages/conversations
 * Get all conversations for authenticated user
 */
router.get('/conversations', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user
    const supabase = getSupabase()

    // Get all unique conversations
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching messages:', error)
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch conversations'
      })
    }

    // Group by conversation
    const conversationMap = new Map()

    for (const msg of messages || []) {
      const otherId = msg.sender_id === user.id ? msg.recipient_id : msg.sender_id
      
      if (!conversationMap.has(otherId)) {
        // Fetch other user info
        const { data: otherUser } = await supabase
          .from('users')
          .select('id, full_name, avatar_url, role')
          .eq('id', otherId)
          .single()

        conversationMap.set(otherId, {
          id: `${user.id}-${otherId}`,
          other_user_id: otherId,
          other_user_name: otherUser?.full_name || 'Unknown',
          other_user_avatar: otherUser?.avatar_url || null,
          is_recruiter: otherUser?.role === 'recruiter',
          last_message: msg.content,
          last_message_at: msg.created_at,
          unread_count: 0
        })
      }

      // Count unread messages
      if (msg.recipient_id === user.id && !msg.read) {
        const conv = conversationMap.get(otherId)
        conv.unread_count++
      }
    }

    const conversations = Array.from(conversationMap.values())
    
    res.json({
      success: true,
      data: conversations
    })
  } catch (err: any) {
    console.error('Error in GET /api/messages/conversations:', err)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message
    })
  }
})

/**
 * GET /api/messages/:userId
 * Get all messages between authenticated user and another user
 */
router.get('/:userId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user
    const { userId } = req.params
    const supabase = getSupabase()

    // Fetch all messages between users
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${user.id},recipient_id.eq.${userId}),and(sender_id.eq.${userId},recipient_id.eq.${user.id})`)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching messages:', error)
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch messages'
      })
    }

    res.json({
      success: true,
      data: data || []
    })
  } catch (err: any) {
    console.error('Error in GET /api/messages/:userId:', err)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message
    })
  }
})

/**
 * POST /api/messages/send
 * Send a message
 */
router.post('/send', authMiddleware, async (req: Request, res: Response) => {
  try {
    const sender = (req as any).user
    const { recipientId, content } = req.body

    if (!recipientId || !content) {
      return res.status(400).json({
        success: false,
        message: 'Recipient ID and content are required'
      })
    }

    if (content.trim().length === 0 || content.length > 5000) {
      return res.status(400).json({
        success: false,
        message: 'Message must be between 1 and 5000 characters'
      })
    }

    const supabase = getSupabase()

    // Verify recipient exists
    const { data: recipient } = await supabase
      .from('users')
      .select('id, full_name')
      .eq('id', recipientId)
      .single()

    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Recipient not found'
      })
    }

    // Create message
    const { data, error } = await supabase
      .from('messages')
      .insert({
        sender_id: sender.id,
        recipient_id: recipientId,
        sender_name: sender.full_name || 'User',
        content: content.trim(),
        read: false
      })
      .select()
      .single()

    if (error) {
      console.error('Error sending message:', error)
      return res.status(500).json({
        success: false,
        message: 'Failed to send message'
      })
    }

    res.json({
      success: true,
      data
    })
  } catch (err: any) {
    console.error('Error in POST /api/messages/send:', err)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message
    })
  }
})

/**
 * PUT /api/messages/:userId/read
 * Mark all messages from user as read
 */
router.put('/:userId/read', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user
    const { userId } = req.params
    const supabase = getSupabase()

    // Mark messages as read
    const { error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('sender_id', userId)
      .eq('recipient_id', user.id)

    if (error) {
      console.error('Error marking messages as read:', error)
      return res.status(500).json({
        success: false,
        message: 'Failed to mark messages as read'
      })
    }

    res.json({
      success: true,
      message: 'Messages marked as read'
    })
  } catch (err: any) {
    console.error('Error in PUT /api/messages/:userId/read:', err)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message
    })
  }
})

/**
 * DELETE /api/messages/:userId
 * Delete conversation with user
 */
router.delete('/:userId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user
    const { userId } = req.params
    const supabase = getSupabase()

    // Delete all messages between users
    const { error } = await supabase
      .from('messages')
      .delete()
      .or(`and(sender_id.eq.${user.id},recipient_id.eq.${userId}),and(sender_id.eq.${userId},recipient_id.eq.${user.id})`)

    if (error) {
      console.error('Error deleting conversation:', error)
      return res.status(500).json({
        success: false,
        message: 'Failed to delete conversation'
      })
    }

    res.json({
      success: true,
      message: 'Conversation deleted'
    })
  } catch (err: any) {
    console.error('Error in DELETE /api/messages/:userId:', err)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message
    })
  }
})

export default router
