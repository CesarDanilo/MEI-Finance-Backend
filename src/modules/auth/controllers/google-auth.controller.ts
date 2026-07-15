import { Request, Response } from 'express'
import { getGoogleAuthUrl, getGoogleUserFromCode } from '../infra/google-oauth.client'
import { AuthenticateWithGoogleUseCase } from '../use-cases/authenticate-with-google.use-case'
import { UserRepository } from '../../user/user.repository'

export function redirectToGoogle(req: Request, res: Response) {
  const url = getGoogleAuthUrl()
  res.redirect(url)
}

// google-auth.controller.ts
export async function googleCallback(req: Request, res: Response) {
  const code = req.query.code as string
  console.log('[googleCallback] FRONTEND_URL =', process.env.FRONTEND_URL)
  if (!code) {
    return res.status(400).json({ message: 'Código de autorização ausente' })
  }

  const frontendUrl = process.env.FRONTEND_URL
  if (!frontendUrl) {
    console.error('[googleCallback] FRONTEND_URL não configurada no ambiente')
    return res.status(500).json({ message: 'Configuração do servidor incompleta' })
  }

  try {
    const googleUser = await getGoogleUserFromCode(code)
    const useCase = new AuthenticateWithGoogleUseCase(new UserRepository())
    const { user, token } = await useCase.execute(googleUser)

    res.redirect(`${frontendUrl}/auth/callback?token=${token}`)
  } catch (error) {
    console.error('[googleCallback] falha na autenticação com Google:', error)
    res.status(401).json({ message: 'Falha na autenticação com Google' })
  }
}