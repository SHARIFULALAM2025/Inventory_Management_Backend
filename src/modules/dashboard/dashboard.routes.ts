import { Router } from 'express'
import { protect } from '../../middlewares/authMiddleware'
import { authorizeRoles } from '../../middlewares/roleMiddleware'
import { getDashboardStats } from './dashboard.controller'

const router = Router()

// সব role dashboard দেখতে পারবে (চাইলে Admin/Manager এ সীমাবদ্ধ করা যায়)
router.get(
  '/',
  protect,
  authorizeRoles('Admin', 'Manager', 'Employee'),
  getDashboardStats
)

export default router
