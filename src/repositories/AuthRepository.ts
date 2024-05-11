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
  const dbUser = await prismadb.user.findUnique({
    where: {
      username: user.username,
    },
  })

  return dbUser
}

export default { register, login }
