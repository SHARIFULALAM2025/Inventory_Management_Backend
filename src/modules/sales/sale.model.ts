import mongoose, { Schema, Document, Types } from 'mongoose'

interface SaleItem {
  product: Types.ObjectId
  quantity: number
  priceAtSale: number // sale করার সময়কার selling price (history অক্ষত রাখার জন্য)
}

export interface ISale extends Document {
  items: SaleItem[]
  grandTotal: number
  createdBy: Types.ObjectId
  createdAt: Date
}

const saleItemSchema = new Schema<SaleItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
    },
    priceAtSale: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
)

const saleSchema = new Schema<ISale>(
  {
    items: {
      type: [saleItemSchema],
      required: true,
      validate: {
        validator: (items: SaleItem[]) => items.length > 0,
        message: 'Sale must contain at least one product',
      },
    },
    grandTotal: {
      type: Number,
      required: true,
      min: 0,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
)

const Sale = mongoose.model<ISale>('Sale', saleSchema)
export default Sale
