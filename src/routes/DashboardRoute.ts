import express from 'express'
import { DashboardController } from '../controllers'
import { AuthMiddleware } from '../middlewares'

const router = express.Router()

router.get(
  '/user',
  AuthMiddleware.verifyToken,
  DashboardController.getUserDetails,
)

export default router
