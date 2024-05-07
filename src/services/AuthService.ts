import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { AuthRepository } from '../repositories'
import { IUser } from '../types/user'

// Temporary storage for refresh tokens. Will be replaced with Redis
const refreshTokens: { username: string; token: string }[] = []

const login = async (user: IUser) => {
  const accessToken = jwt.sign(
    { username: user.username },
    process.env.JWT_ACCESS_SECRET as string,
    {
      expiresIn: process.env.JWT_ACCESS_TIME,
    },
  )
  const refreshToken = generateRefreshToken(user.username)

  // Decode the JWT to get the exp value
  const decodedToken: any = jwt.decode(accessToken)
  let ttl: number | undefined

  if (decodedToken && decodedToken.exp) {
    ttl = Math.round(
      (new Date(decodedToken.exp * 1000).getTime() - new Date().getTime()) /
        1000,
    )
  }

  await AuthRepository.login(user)

  return {
    accessToken,
    refreshToken,
    ttl,
  }
}

const generateRefreshToken = async (username: string) => {
  const refreshToken = jwt.sign(
    { sub: username },
    process.env.JWT_REFRESH_SECRET as string,
    {
      expiresIn: process.env.JWT_REFRESH_TIME,
    },
  )

  // Check if there is a token related to that user
  const storedRefreshToken = refreshTokens.find(
    (x: any) => x.username === username,
  )

  if (!storedRefreshToken) {
    // add the token to the refreshTokens redis store
    refreshTokens.push({
      username,
      token: refreshToken,
    })
  } else {
    // Update it
    refreshTokens[refreshTokens.findIndex(x => x.username === username)].token =
      refreshToken
  }

  return refreshToken
}

export default {
  login,
  generateRefreshToken,
}
