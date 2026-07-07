import { Response } from 'express'
import asyncHandler from '../../utils/asyncHandler'
import ApiResponse from '../../utils/apiResponse'
import ApiError from '../../utils/apiError'
import { AuthRequest } from '../../middlewares/authMiddleware'
import {
  createProductService,
  getProductsService,
  getProductByIdService,
  updateProductService,
  deleteProductService,
} from './product.service'

export const createProduct = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { name, sku, category, purchasePrice, sellingPrice, stockQuantity } =
      req.body

    if (!name || !sku || !category || !purchasePrice || !sellingPrice) {
      throw new ApiError(400, 'All required fields must be provided')
    }

    const product = await createProductService(
      {
        name,
        sku,
        category,
        purchasePrice: Number(purchasePrice),
        sellingPrice: Number(sellingPrice),
        stockQuantity: Number(stockQuantity) || 0,
      },
      req.file?.buffer
    )

    const response = new ApiResponse(
      201,
      product,
      'Product created successfully'
    )
    res.status(response.statusCode).json(response)
  }
)

export const getProducts = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { search, page, limit } = req.query

    const result = await getProductsService({
      search: search as string,
      page: Number(page),
      limit: Number(limit),
    })

    const response = new ApiResponse(
      200,
      result,
      'Products fetched successfully'
    )
    res.status(response.statusCode).json(response)
  }
)

export const getProductById = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const product = await getProductByIdService(req.params.id as string)
    const response = new ApiResponse(
      200,
      product,
      'Product fetched successfully'
    )
    res.status(response.statusCode).json(response)
  }
)

export const updateProduct = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const product = await updateProductService(
      req.params.id as string,
      req.body,
      req.file?.buffer
    )
    const response = new ApiResponse(
      200,
      product,
      'Product updated successfully'
    )
    res.status(response.statusCode).json(response)
  }
)

export const deleteProduct = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    await deleteProductService(req.params.id as string)
    const response = new ApiResponse(200, null, 'Product deleted successfully')
    res.status(response.statusCode).json(response)
  }
)
