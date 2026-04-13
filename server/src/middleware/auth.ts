import { Request, Response, NextFunction } from 'express'
import { verifyJWT } from '../services/authService.js'

// Extend Express Request to include user info
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string
        email: string
        role: string
      }
    }
  }
}

// Middleware to verify JWT token
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const decoded = verifyJWT(token)
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }

    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' })
  }
}

// Middleware to check role
export function roleMiddleware(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' })
    }

    next()
  }
}
