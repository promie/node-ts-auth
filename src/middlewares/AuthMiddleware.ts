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
  let token = req.headers.authorization?.split(' ')[1]

  // Check if the token is not found in the Authorization header.
  // If not found, try to get it from the query string parameters
  if (!token) {
    token = req.query.token as string
  }

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
