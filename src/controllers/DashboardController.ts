import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import { catchAsync } from '../utils'

const getUserDetails = catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
    return res.status(httpStatus.OK).json({
      message: 'Hello from Dashboard',
    })
  },
)

export default { getUserDetails }
