import mongoose, { Schema, Document } from 'mongoose'

export type UserRole = 'Admin' | 'Manager' | 'Employee'

export interface IUser extends Document {
  name: string
  email: string
  password: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false, // query তে by default password আসবে না
    },
    role: {
      type: String,
      enum: ['Admin', 'Manager', 'Employee'],
      default: 'Employee',
    },
  },
  { timestamps: true }
)

const User = mongoose.model<IUser>('User', userSchema)
export default User
