import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface ExtendedRequest extends Request {
  userData?: any
  token?: string
}

const verifyToken = (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization
  const token = authHeader?.split(' ')[1]

  if (!token) {
    return res.status(401).json({
      message: 'Token not found',
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string)
    req.userData = decoded
    req.token = token

    next()
  } catch (error) {
    return res.status(401).json({
      status: false,
      message: 'Your session is not valid',
      data: error,
    })
  }
}

export default { verifyToken }
