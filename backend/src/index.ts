import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import { env } from './config/env.js'
import healthRouter from './routes/health.js'
import avatarsRouter from './routes/avatars.js'
import translateRouter from './routes/translate.js'
import profilesRouter from './routes/profiles.js'
import usageRouter from './routes/usage.js'
import { errorHandler } from './middleware/error.js'

const app = express()

app.use(helmet())
app.use(cors({ origin: true, credentials: true }))
app.use(express.json({ limit: '10mb' }))
app.use(morgan('tiny'))

const limiter = rateLimit({ windowMs: 60_000, max: 120, standardHeaders: true, legacyHeaders: false })
app.use('/api', limiter)

app.get('/', (_req, res) => res.json({ name: 'FACE-CAM AI API', version: '1.0.0', docs: '/api/health' }))
app.use('/api/health', healthRouter)
app.use('/api/avatars', avatarsRouter)
app.use('/api/translate', translateRouter)
app.use('/api/profiles', profilesRouter)
app.use('/api/usage', usageRouter)

app.use(errorHandler)

app.listen(env.port, '0.0.0.0', () => {
  console.log(`[backend] FACE-CAM AI API listening on http://0.0.0.0:${env.port}`)
})
