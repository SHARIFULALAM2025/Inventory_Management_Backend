import { Response } from 'express'
import asyncHandler from '../../utils/asyncHandler'
import ApiResponse from '../../utils/apiResponse'
import ApiError from '../../utils/apiError'
import { AuthRequest } from '../../middlewares/authMiddleware'
import { createSaleService, getSalesService } from './sale.service'

export const createSale = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { items } = req.body

    if (!req.user?.id) {
      throw new ApiError(401, 'Not authorized')
    }

    const sale = await createSaleService(items, req.user.id)

    const response = new ApiResponse(201, sale, 'Sale created successfully')
    res.status(response.statusCode).json(response)
  }
)

export const getSales = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const sales = await getSalesService()
    const response = new ApiResponse(200, sales, 'Sales fetched successfully')
    res.status(response.statusCode).json(response)
  }
)
