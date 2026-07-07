import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import User from '../modules/auth/user.model'

type Role = 'Admin' | 'Manager' | 'Employee'

interface SeedUser {
  name: string
  email: string
  password: string
  role: Role
}

const usersToSeed: SeedUser[] = [
  {
    name: 'Super Admin',
    email: 'admin@erp.com',
    password: 'Admin@123',
    role: 'Admin',
  },
  {
    name: 'Manager User',
    email: 'manager@erp.com',
    password: 'Manager@123',
    role: 'Manager',
  },
  {
    name: 'Employee User',
    email: 'employee@erp.com',
    password: 'Employee@123',
    role: 'Employee',
  },
]

const seedUsers = async () => {
  try {
    const mongoUri = process.env.MONGO_URI as string
    await mongoose.connect(mongoUri)
    console.log('Connected to MongoDB for seeding...')

    for (const u of usersToSeed) {
      const existing = await User.findOne({ email: u.email })

      if (existing) {
        console.log(`${u.role} already exists (${u.email}). Skipping.`)
        continue
      }

      const hashedPassword = await bcrypt.hash(u.password, 10)

      await User.create({
        name: u.name,
        email: u.email,
        password: hashedPassword,
        role: u.role,
      })

      console.log(
        `${u.role} created: ${u.email} / ${u.password} (before hashing)`
      )
    }

    process.exit(0)
  } catch (error) {
    console.error('Seeding failed:', error)
    process.exit(1)
  }
}

seedUsers()
