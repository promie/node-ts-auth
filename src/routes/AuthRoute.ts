import express from 'express'
import { AuthController } from '../controllers'

const router = express.Router()

router.post('/login', AuthController.login)
router.post('/token', AuthController.token)

export default router
