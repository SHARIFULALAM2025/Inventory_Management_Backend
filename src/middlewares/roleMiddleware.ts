import { Response, NextFunction } from 'express'
import ApiError from '../utils/apiError'
import { AuthRequest } from './authMiddleware'

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ApiError(401, 'Not authorized')
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(
        403,
        `Role '${req.user.role}' is not allowed to access this resource`
      )
    }

    next()
  }
}
