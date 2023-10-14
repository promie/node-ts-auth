import express, { Application } from 'express'
import cors from 'cors'
import { AuthRoute, DashboardRoute, RefreshTokenRoute } from './routes'

const app: Application = express()

app.use(express.json())
app.use(cors())

app.use('/api/auth', AuthRoute)
app.use('/api/dashboard', DashboardRoute)
app.use('/api/refresh-token', RefreshTokenRoute)

export default app
