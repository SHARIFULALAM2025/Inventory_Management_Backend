import Product from '../product/product.model'
import Sale from '../sales/sale.model'

export const getDashboardStatsService = async () => {
  const totalProducts = await Product.countDocuments()
  const totalSales = await Sale.countDocuments()
  const lowStockProducts = await Product.find({ stockQuantity: { $lt: 5 } })

  return {
    totalProducts,
    totalSales,
    lowStockCount: lowStockProducts.length,
    lowStockProducts,
  }
}
