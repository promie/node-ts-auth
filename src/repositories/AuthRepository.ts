import { IUser } from '../types/user'
import prismadb from '../utils/prisma'

const register = async (user: IUser) => {
  // save to user to the database
  await prismadb.user.create({
    data: {
      username: user.username,
      password: user.password,
    },
  })

  return user
}

const login = async (user: IUser) => {
  // retrieve user from the database
  return user
}

export default { register, login }
