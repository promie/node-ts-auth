import express, { Application } from 'express'
import cors from 'cors'
import { AuthRoute } from './routes'

const app: Application = express()

app.use(express.json())
app.use(cors())

app.use('/api/auth', AuthRoute)

export default app
