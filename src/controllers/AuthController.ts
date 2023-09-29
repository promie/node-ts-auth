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

    const hello = await AuthService.login({ username, password })

    res.json({
      hello,
      message: 'Login success',
    })
  },
)

export default {
  login,
}
