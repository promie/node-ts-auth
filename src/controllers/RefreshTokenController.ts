import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import { catchAsync } from '../utils'

const renewAccessToken = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    return res.status(httpStatus.OK).json({
      message: 'Get access token success',
    })
  },
)

export default { renewAccessToken }
