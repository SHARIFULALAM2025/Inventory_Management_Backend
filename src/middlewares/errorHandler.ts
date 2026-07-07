import { Request, Response, NextFunction } from 'express'


const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500
  let message = err.message || 'Internal Server Error'
  let errors = err.errors || []

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400
    message = 'Validation Error'
    errors = Object.values(err.errors).map((e: any) => e.message)
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 409
    message = `Duplicate value entered for field: ${Object.keys(err.keyValue)}`
  }

  // Mongoose invalid ObjectId
  if (err.name === 'CastError') {
    statusCode = 400
    message = `Invalid ${err.path}: ${err.value}`
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errors,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}

export default errorHandler
