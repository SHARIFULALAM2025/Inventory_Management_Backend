import Product from './product.model'
import ApiError from '../../utils/apiError'
import { uploadToImgbb } from '../../utils/uploadToImgbb'

interface CreateProductInput {
  name: string
  sku: string
  category: string
  purchasePrice: number
  sellingPrice: number
  stockQuantity: number
}

export const createProductService = async (
  data: CreateProductInput,
  fileBuffer: Buffer | undefined
) => {
  if (!fileBuffer) {
    throw new ApiError(400, 'Product image is required')
  }

  const existingProduct = await Product.findOne({ sku: data.sku })
  if (existingProduct) {
    throw new ApiError(409, 'Product with this SKU already exists')
  }

  const imageUrl = await uploadToImgbb(fileBuffer)

  const product = await Product.create({
    ...data,
    imageUrl,
  })

  return product
}

interface GetProductsQuery {
  search?: string
  page?: number
  limit?: number
}

export const getProductsService = async (query: GetProductsQuery) => {
  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 10
  const skip = (page - 1) * limit

  const filter: any = {}

  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: 'i' } },
      { sku: { $regex: query.search, $options: 'i' } },
      { category: { $regex: query.search, $options: 'i' } },
    ]
  }

  const totalProducts = await Product.countDocuments(filter)
  const products = await Product.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)

  return {
    products,
    pagination: {
      totalProducts,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      limit,
    },
  }
}

export const getProductByIdService = async (id: string) => {
  const product = await Product.findById(id)
  if (!product) {
    throw new ApiError(404, 'Product not found')
  }
  return product
}

export const updateProductService = async (
  id: string,
  data: Partial<CreateProductInput>,
  fileBuffer: Buffer | undefined
) => {
  const product = await Product.findById(id)
  if (!product) {
    throw new ApiError(404, 'Product not found')
  }

  if (fileBuffer) {
    const imageUrl = await uploadToImgbb(fileBuffer)
    product.imageUrl = imageUrl
  }

  Object.assign(product, data)
  await product.save()

  return product
}

export const deleteProductService = async (id: string) => {
  const product = await Product.findById(id)
  if (!product) {
    throw new ApiError(404, 'Product not found')
  }

  await product.deleteOne()
  return product
}
