import { Request, Response } from 'express'
import { getGoogleAuthUrl, getGoogleUserFromCode } from '../infra/google-oauth.client'
import { AuthenticateWithGoogleUseCase } from '../use-cases/authenticate-with-google.use-case'
import { UserRepository } from '../../user/user.repository'

export function redirectToGoogle(req: Request, res: Response) {
  const url = getGoogleAuthUrl()
  res.redirect(url)
}

export async function googleCallback(req: Request, res: Response) {
  const code = req.query.code as string

  if (!code) {
    return res.status(400).json({ message: 'Código de autorização ausente' })
  }

  try {
    // Passo que faltava: trocar o code pelo payload do usuário do Google
    // antes de passar pro use case (ele espera GoogleUserPayload, não a code)
    const googleUser = await getGoogleUserFromCode(code)

    const useCase = new AuthenticateWithGoogleUseCase(new UserRepository())
    const { user, token } = await useCase.execute(googleUser)

    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`)
  } catch (error) {
    // Log real do erro — essencial pra debugar OAuth, o 401 genérico escondia a causa
    console.error('[googleCallback] falha na autenticação com Google:', error)
    res.status(401).json({ message: 'Falha na autenticação com Google' })
  }
}