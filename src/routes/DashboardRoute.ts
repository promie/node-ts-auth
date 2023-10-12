import express from 'express'
import { DashboardController } from '../controllers'

const router = express.Router()

router.get('/user', DashboardController.getUserDetails)

export default router
