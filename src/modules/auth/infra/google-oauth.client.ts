import { OAuth2Client } from 'google-auth-library'

export const googleOAuthClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
)

export function getGoogleAuthUrl(): string {
  return googleOAuthClient.generateAuthUrl({
    access_type: 'offline',
    scope: ['profile', 'email'],
    prompt: 'consent',
  })
}

export interface GoogleUserPayload {
  googleId: string
  email: string
  name: string
  avatarUrl?: string
}

export async function getGoogleUserFromCode(code: string): Promise<GoogleUserPayload> {
  const { tokens } = await googleOAuthClient.getToken(code)

  if (!tokens.id_token) {
    throw new Error('Google não retornou um id_token válido')
  }

  const ticket = await googleOAuthClient.verifyIdToken({
    idToken: tokens.id_token,
    audience: process.env.GOOGLE_CLIENT_ID,
  })

  const payload = ticket.getPayload()

  if (!payload || !payload.email) {
    throw new Error('Não foi possível obter os dados do usuário do Google')
  }

  return {
    googleId: payload.sub,
    email: payload.email,
    name: payload.name ?? '',
    avatarUrl: payload.picture,
  }
}