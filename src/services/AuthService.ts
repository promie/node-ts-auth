import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { AuthRepository } from '../repositories'
import { IUser } from '../types/user'

const login = async (user: IUser) => {
  const accessToken = jwt.sign(
    { username: user.username },
    process.env.JWT_ACCESS_SECRET as string,
    {
      expiresIn: process.env.JWT_ACCESS_TIME,
    },
  )
  const refreshToken = jwt.sign(
    { username: user.username },
    process.env.JWT_REFRESH_SECRET as string,
    {
      expiresIn: process.env.JWT_REFRESH_TIME,
    },
  )

  // Put the refreshToken in the redis store

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

export default {
  login,
}
