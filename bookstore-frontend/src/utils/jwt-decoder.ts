/**
 * JWT Token Decoder Utility
 * Safely decodes JWT tokens and extracts user information
 */

export interface DecodedJwtPayload {
  sub: string // User ID
  email: string
  role: string
  iat?: number // Issued at
  exp?: number // Expiration
}

/**
 * Decodes a JWT token payload
 */
export const decodeJwtPayload = (token: string): DecodedJwtPayload | null => {
  try {
    // Split the token and get the payload part
    const parts = token.split('.')
    if (parts.length !== 3) {
      return null
    }

    // Decode the base64 payload
    const payload = parts[1]
    const decodedPayload = window.atob(
      payload.replace(/-/g, '+').replace(/_/g, '/'),
    )

    return JSON.parse(decodedPayload) as DecodedJwtPayload
  } catch {
    return null
  }
}

/**
 * Checks if a JWT token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  const payload = decodeJwtPayload(token)
  if (!payload) return true

  if (!payload.exp) return false

  const currentTime = Math.floor(Date.now() / 1000)
  return payload.exp < currentTime
}

/**
 * Extracts user information from JWT token
 */
export const getUserFromToken = (token: string) => {
  const payload = decodeJwtPayload(token)
  if (!payload) return null

  return {
    id: payload.sub,
    email: payload.email,
    role: payload.role,
  }
}
