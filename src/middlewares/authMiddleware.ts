import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import ApiError from '../utils/apiError'
import asyncHandler from '../utils/asyncHandler'

export interface AuthRequest extends Request {
  user?: {
    id: string
    role: string
  }
}

interface JwtPayload {
  id: string
  role: string
}

export const protect = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token: string | undefined

    const authHeader = req.headers.authorization

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1]
    }

    if (!token) {
      throw new ApiError(401, 'Not authorized, no token provided')
    }

    try {
      const secret = process.env.JWT_SECRET as string
      const decoded = jwt.verify(token, secret) as JwtPayload

      req.user = {
        id: decoded.id,
        role: decoded.role,
      }

      next()
    } catch (error) {
      throw new ApiError(401, 'Not authorized, invalid or expired token')
    }
  }
)
