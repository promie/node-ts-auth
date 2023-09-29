import { AuthRepository } from '../repositories'
import { IUser } from '../types/user'

const login = async (user: IUser) => {
  return AuthRepository.login(user)
}

export default {
  login,
}
