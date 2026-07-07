import { Response } from 'express'
import asyncHandler from '../../utils/asyncHandler'
import ApiResponse from '../../utils/apiResponse'
import { AuthRequest } from '../../middlewares/authMiddleware'
import { getDashboardStatsService } from './dashboard.service'

export const getDashboardStats = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const stats = await getDashboardStatsService()
    const response = new ApiResponse(
      200,
      stats,
      'Dashboard stats fetched successfully'
    )
    res.status(response.statusCode).json(response)
  }
)
