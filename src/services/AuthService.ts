import jwt from 'jsonwebtoken'
import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { AuthRepository } from '../repositories'
import { IUser } from '../types/user'
import { refreshTokens, removeToken } from '../redis-store'

const register = async (user: IUser) => {
  // Hash the password
  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(user.password, salt)

  const accessToken = await generateAccessToken(user.username)
  const refreshToken = await generateRefreshToken(user.username)

  // Decode the JWT to get the exp value
  const decodedToken: any = jwt.decode(accessToken)
  let ttl: number | undefined

  if (decodedToken && decodedToken.exp) {
    ttl = Math.round(
      (new Date(decodedToken.exp * 1000).getTime() - new Date().getTime()) /
        1000,
    )
  }

  await AuthRepository.register(user)

  return {
    accessToken,
    refreshToken,
    ttl,
  }
}
const login = async (user: IUser) => {
  const accessToken = await generateAccessToken(user.username)
  const refreshToken = await generateRefreshToken(user.username)

  // Decode the JWT to get the exp value
  const decodedToken: any = jwt.decode(accessToken)
  let ttl: number | undefined

  if (decodedToken && decodedToken.exp) {
    ttl = Math.round(
      (new Date(decodedToken.exp * 1000).getTime() - new Date().getTime()) /
        1000,
    )
  }

  const dbUser = await AuthRepository.login(user)

  // Compare the password
  const isMatch = await bcrypt.compare(user.password, dbUser.password)

  if (!isMatch) {
    throw new Error('Invalid credentials')
  }

  return {
    accessToken,
    refreshToken,
    ttl,
  }
}

const logout = async (username: string) => {
  removeToken(username)

  return {
    success: true,
  }
}

const generateAccessToken = async (username: string) => {
  return jwt.sign({ username }, process.env.JWT_ACCESS_SECRET as string, {
    expiresIn: process.env.JWT_ACCESS_TIME,
  })
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
  register,
  login,
  logout,
  generateAccessToken,
  generateRefreshToken,
}
