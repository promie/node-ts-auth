import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface ExtendedRequest extends Request {
  userData?: any
  token?: string
}

// Temporary storage for refresh tokens. Will be replaced with Redis
const refreshTokens: { username: string; token: string }[] = []

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
      status: false,
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

const verifyRefreshToken = (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.body.token

  if (!token) {
    return res.status(401).json({
      status: false,
      message: 'Token not found',
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string)
    req.userData = decoded
    req.token = token

    // Verify if token is in store or not
    const storedRefreshToken = refreshTokens.find(
      (x: any) => x.username === decoded.sub,
    )

    if (!storedRefreshToken) {
      return res.status(401).json({
        status: false,
        message: 'Your session is not valid',
      })
    }

    if (storedRefreshToken.token !== token) {
      return res.status(401).json({
        status: false,
        message: 'Your session is not valid',
      })
    }

    next()
  } catch (error) {
    return res.status(401).json({
      status: false,
      message: 'Your session is not valid',
      data: error,
    })
  }
}

export default { verifyToken, verifyRefreshToken }
