import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import { catchAsync } from '../utils'
import { AuthService } from '../services'

const login = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { username, password } = req.body
    if (!username || !password) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: 'Username and password are required',
      })
    }

    const data = await AuthService.login({ username, password })

    return res.json({
      data,
      message: 'Login success',
    })
  },
)

const token = catchAsync(
  async (req: Request | any, res: Response, _next: NextFunction) => {
    const username = req.userData.sub

    const accessToken = await AuthService.generateAccessToken(username)
    const refreshToken = await AuthService.generateRefreshToken(username)

    return res.json({
      data: {
        accessToken,
        refreshToken,
      },
      message: 'Login success',
    })
  },
)

export default { login, token }
