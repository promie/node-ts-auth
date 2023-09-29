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

  const result = AuthRepository.login(user)

  return {
    result,
    accessToken,
  }
}

export default {
  login,
}
