import express from 'express'
import { AuthController } from '../controllers'
import { AuthMiddleware } from '../middlewares'

const router = express.Router()

router.post('/login', AuthController.login)
router.post('/logout', AuthMiddleware.verifyToken, AuthController.logout)
router.post('/token', AuthMiddleware.verifyRefreshToken, AuthController.token)

export default router
