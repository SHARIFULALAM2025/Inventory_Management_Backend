import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import errorHandler from './middlewares/errorHandler'
import ApiResponse from './utils/apiResponse'
import authRoutes from './modules/auth/auth.routes'
import productRoutes from './modules/product/product.routes'
import salesRoutes from './modules/sales/sale.routes'
import dashboardRoutes from './modules/dashboard/dashboard.routes'

const app: Application = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req: Request, res: Response) => {
  const response = new ApiResponse(200, null, 'Server is running')
  res.status(response.statusCode).json(response)
})

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/sales', salesRoutes)
app.use('/api/dashboard', dashboardRoutes)

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  })
})

app.use(errorHandler)

export default app
