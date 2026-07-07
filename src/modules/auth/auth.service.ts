import bcrypt from 'bcryptjs'
import User from './user.model'
import ApiError from '../../utils/apiError'
import { generateToken } from '../../utils/generateToken'

export const loginService = async (email: string, password: string) => {
 
  const user = await User.findOne({ email }).select('+password')

  if (!user) {
    throw new ApiError(401, 'Invalid email or password')
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password)

  if (!isPasswordMatch) {
    throw new ApiError(401, 'Invalid email or password')
  }

  const token = generateToken({
    id: user._id.toString(),
    role: user.role,
  })

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  }
}
