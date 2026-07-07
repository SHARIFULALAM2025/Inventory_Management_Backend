import jwt from 'jsonwebtoken'

interface TokenPayload {
  id: string
  role: string
}

export const generateToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_SECRET as string
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d'

  if (!secret) {
    throw new Error('JWT_SECRET is not defined in .env file')
  }

  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions)
}
