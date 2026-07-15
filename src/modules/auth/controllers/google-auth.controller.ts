// src/modules/auth/controllers/google-auth.controller.ts
import { Request, Response } from 'express'
import { getGoogleAuthUrl } from '../infra/google-oauth.client'
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
    const useCase = new AuthenticateWithGoogleUseCase(new UserRepository())
    const { user, token } = await useCase.execute(code)

    // opção A: redireciona pro front com o token na URL/cookie
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`)

    // opção B: retorna JSON direto (se for API pura)
    // res.json({ user, token })
  } catch (error) {
    res.status(401).json({ message: 'Falha na autenticação com Google' })
  }
}