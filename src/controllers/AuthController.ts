import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import { catchAsync } from '../utils'
import { AuthService } from '../services'

const register = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { username, password } = req.body
    if (!username || !password) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: 'Username and password are required',
      })
    }

    const data = await AuthService.register({ username, password })

    return res.json({
      data,
      message: 'Registration success',
    })
  },
)

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

const logout = catchAsync(
  async (req: Request | any, res: Response, _next: NextFunction) => {
    const username = req.userData.sub

    await AuthService.logout(username)

    return res.json({
      message: 'Logout success',
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

export default { register, login, logout, token }
