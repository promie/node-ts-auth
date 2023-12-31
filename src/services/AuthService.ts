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

  // Decode the JWT to get the exp value
  const decodedToken: any = jwt.decode(accessToken)
  let ttl: number | undefined

  if (decodedToken && decodedToken.exp) {
    ttl = Math.round(
      (new Date(decodedToken.exp * 1000).getTime() - new Date().getTime()) /
        1000,
    )
  }

  const result = AuthRepository.login(user)

  return {
    result,
    accessToken,
    ttl,
  }
}

export default {
  login,
}
