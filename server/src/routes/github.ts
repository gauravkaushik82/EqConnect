import { Router, Request, Response } from 'express'
import { authMiddleware } from '../middleware/auth.js'
import {
  linkGitHubAccount,
  disconnectGitHubAccount,
  syncGitHubRepositories,
  getGitHubRepositories,
  getGitHubStats
} from '../services/githubService.js'
import { exchangeGitHubCode } from '../lib/github.js'

const router = Router()

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || ''
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || ''

/**
 * GET /api/github/connect
 * Redirect to GitHub OAuth
 */
router.get('/connect', (req: Request, res: Response) => {
  const redirectUri = `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/github/callback`
  const scope = 'public_repo,user'
  const state = Math.random().toString(36).substring(7)

  // Store state in session (in production, use Redis or database)
  res.cookie('github_oauth_state', state, {
    httpOnly: true,
    maxAge: 10 * 60 * 1000 // 10 minutes
  })

  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`

  res.redirect(githubAuthUrl)
})

/**
 * GET /api/github/callback
 * GitHub OAuth callback
 */
router.get('/callback', async (req: Request, res: Response) => {
  try {
    const { code, state } = req.query
    const storedState = req.cookies.github_oauth_state

    // Verify state
    if (state !== storedState) {
      return res.status(400).json({ error: 'Invalid state parameter' })
    }

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Missing authorization code' })
    }

    // Exchange code for token
    const token = await exchangeGitHubCode(code, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET)

    // Redirect back to frontend with token
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
    res.redirect(`${frontendUrl}/student/profile?github_token=${encodeURIComponent(token)}`)
  } catch (error: any) {
    console.error('GitHub OAuth error:', error)
    res.status(500).json({ error: 'Failed to authenticate with GitHub' })
  }
})

/**
 * POST /api/github/link
 * Link GitHub account to user
 */
router.post('/link', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    const { githubToken } = req.body

    if (!githubToken) {
      return res.status(400).json({ error: 'GitHub token required' })
    }

    const result = await linkGitHubAccount(req.user.userId, githubToken)

    if (!result.success) {
      return res.status(400).json({ error: result.error })
    }

    // Sync repositories
    await syncGitHubRepositories(req.user.userId)

    res.json({
      message: 'GitHub account linked successfully',
      user: result.user
    })
  } catch (error: any) {
    console.error('Link GitHub error:', error)
    res.status(500).json({ error: 'Failed to link GitHub account' })
  }
})

/**
 * POST /api/github/disconnect
 * Disconnect GitHub account
 */
router.post('/disconnect', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    const result = await disconnectGitHubAccount(req.user.userId)

    if (!result.success) {
      return res.status(400).json({ error: result.error })
    }

    res.json({ message: 'GitHub account disconnected' })
  } catch (error: any) {
    console.error('Disconnect GitHub error:', error)
    res.status(500).json({ error: 'Failed to disconnect GitHub account' })
  }
})

/**
 * POST /api/github/sync
 * Sync GitHub repositories
 */
router.post('/sync', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    const result = await syncGitHubRepositories(req.user.userId)

    if (!result.success) {
      return res.status(400).json({ error: result.error })
    }

    res.json({
      message: 'Repositories synced successfully',
      repositoryCount: result.repositoryCount
    })
  } catch (error: any) {
    console.error('Sync GitHub error:', error)
    res.status(500).json({ error: 'Failed to sync repositories' })
  }
})

/**
 * GET /api/github/repositories
 * Get user's GitHub repositories
 */
router.get('/repositories', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    const result = await getGitHubRepositories(req.user.userId)

    if (!result.success) {
      return res.status(400).json({ error: result.error })
    }

    res.json({ repositories: result.repositories })
  } catch (error: any) {
    console.error('Get repositories error:', error)
    res.status(500).json({ error: 'Failed to get repositories' })
  }
})

/**
 * GET /api/github/stats
 * Get user's GitHub stats
 */
router.get('/stats', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    const result = await getGitHubStats(req.user.userId)

    if (!result.success) {
      return res.status(400).json({ error: result.error })
    }

    res.json({ stats: result.stats })
  } catch (error: any) {
    console.error('Get stats error:', error)
    res.status(500).json({ error: 'Failed to get stats' })
  }
})

export default router
