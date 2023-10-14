import express from 'express'
import { RefreshTokenController } from '../controllers'

const router = express.Router()

router.post('/', RefreshTokenController.renewAccessToken)

export default router
