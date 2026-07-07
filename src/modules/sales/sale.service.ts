import mongoose from 'mongoose'
import Sale from './sale.model'
import Product from '../product/product.model'
import ApiError from '../../utils/apiError'

interface SaleItemInput {
  productId: string
  quantity: number
}

export const createSaleService = async (
  items: SaleItemInput[],
  userId: string
) => {
  if (!items || items.length === 0) {
    throw new ApiError(400, 'At least one product is required to create a sale')
  }

  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    let grandTotal = 0
    const saleItems = []

    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity <= 0) {
        throw new ApiError(400, 'Invalid product or quantity')
      }

      // Atomic operation: stock চেক এবং কমানো একই সাথে
      // যাতে race condition এড়ানো যায়
      const updatedProduct = await Product.findOneAndUpdate(
        {
          _id: item.productId,
          stockQuantity: { $gte: item.quantity }, // যথেষ্ট stock থাকলেই শুধু match হবে
        },
        {
          $inc: { stockQuantity: -item.quantity }, // stock কমানো
        },
        { new: true, session }
      )

      if (!updatedProduct) {
        // হয় product নেই, অথবা stock অপর্যাপ্ত
        const product = await Product.findById(item.productId).session(session)
        if (!product) {
          throw new ApiError(404, `Product not found: ${item.productId}`)
        }
        throw new ApiError(
          400,
          `Insufficient stock for product: ${product.name}. Available: ${product.stockQuantity}`
        )
      }

      const itemTotal = updatedProduct.sellingPrice * item.quantity
      grandTotal += itemTotal

      saleItems.push({
        product: updatedProduct._id,
        quantity: item.quantity,
        priceAtSale: updatedProduct.sellingPrice,
      })
    }

    const sale = await Sale.create(
      [
        {
          items: saleItems,
          grandTotal,
          createdBy: userId,
        },
      ],
      { session }
    )

    await session.commitTransaction()
    session.endSession()

    return sale[0]
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    throw error
  }
}

export const getSalesService = async () => {
  const sales = await Sale.find()
    .populate('items.product', 'name sku')
    .populate('createdBy', 'name email role')
    .sort({ createdAt: -1 })

  return sales
}
