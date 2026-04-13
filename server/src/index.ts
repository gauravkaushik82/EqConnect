import express, { Express } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './routes/auth.js'
import githubRoutes from './routes/github.js'
import studentRoutes from './routes/students.js'
import skillsRoutes from './routes/skills.js'
import messagesRoutes from './routes/messages.js'
import jobsRoutes from './routes/jobs.js'
import applicationsRoutes from './routes/applications.js'
import notificationsRoutes from './routes/notifications.js'
import verificationRoutes from './routes/verification.js'
import superAdminRoutes from './routes/superAdmin.js'

// Load environment variables
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../../server/.env') })

const app: Express = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/github', githubRoutes)
app.use('/api/students', studentRoutes)
app.use('/api/skills', skillsRoutes)
app.use('/api/messages', messagesRoutes)
app.use('/api/jobs', jobsRoutes)
app.use('/api/applications', applicationsRoutes)
app.use('/api/notifications', notificationsRoutes)
app.use('/api/verification', verificationRoutes)
app.use('/api/super-admin', superAdminRoutes)

app.use('/api/users', (req, res) => {
  res.json({ message: 'Users routes — coming soon' })
})

app.use('/api/opportunities', (req, res) => {
  res.json({ message: 'Opportunities routes — coming soon' })
})

app.use('/api/calendar', (req, res) => {
  res.json({ message: 'Calendar routes — coming soon' })
})

app.use('/api/admin', (req, res) => {
  res.json({ message: 'Admin routes — coming soon' })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' })
})

// Error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err)
  res.status(500).json({ error: 'Internal Server Error' })
})

app.listen(PORT, () => {
  console.log(`✨ EqConnect server running on http://localhost:${PORT}`)
})

export default app
