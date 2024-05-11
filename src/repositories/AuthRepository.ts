import { IUser } from '../types/user'

const register = async (user: IUser) => {
  // save to user to the database
  return user
}

const login = async (user: IUser) => {
  // retrieve user from the database
  return user
}

export default { register, login }
