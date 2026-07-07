import { Request, Response } from 'express'
import asyncHandler from '../../utils/asyncHandler'
import ApiResponse from '../../utils/apiResponse'
import ApiError from '../../utils/apiError'
import { loginService } from './auth.service'

export const loginController = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = req.body

    if (!email || !password) {
      throw new ApiError(400, 'Email and password are required')
    }

    const result = await loginService(email, password)

    const response = new ApiResponse(200, result, 'Login successful')
    res.status(response.statusCode).json(response)
  }
)
