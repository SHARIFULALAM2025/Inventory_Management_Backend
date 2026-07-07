import { Router } from 'express'
import { protect } from '../../middlewares/authMiddleware'
import { authorizeRoles } from '../../middlewares/roleMiddleware'
import { createSale, getSales } from './sale.controller'

const router = Router()

// Admin, Manager, Employee — সবাই sale create করতে পারবে (requirement অনুযায়ী)
router.post(
  '/',
  protect,
  authorizeRoles('Admin', 'Manager', 'Employee'),
  createSale
)

// Sale history দেখা (সবার জন্য উন্মুক্ত রাখছি, চাইলে Admin/Manager এ সীমাবদ্ধ করা যায়)
router.get('/', protect, getSales)

export default router
