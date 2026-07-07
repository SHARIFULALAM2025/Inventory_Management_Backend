import { Router } from 'express'
import { protect } from '../../middlewares/authMiddleware'
import { authorizeRoles } from '../../middlewares/roleMiddleware'
import upload from '../../middlewares/multer'
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from './product.controller'

const router = Router()

// সব role (Admin, Manager, Employee) view করতে পারবে
router.get('/', protect, getProducts)
router.get('/:id', protect, getProductById)

// শুধু Admin আর Manager create/update/delete করতে পারবে
router.post(
  '/',
  protect,
  authorizeRoles('Admin', 'Manager'),
  upload.single('image'),
  createProduct
)
router.put(
  '/:id',
  protect,
  authorizeRoles('Admin', 'Manager'),
  upload.single('image'),
  updateProduct
)
router.delete(
  '/:id',
  protect,
  authorizeRoles('Admin', 'Manager'),
  deleteProduct
)

export default router
