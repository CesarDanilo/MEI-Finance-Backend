import { PublicUser, UserRepository } from '../../user/user.repository'
import { GoogleUserPayload } from '../infra/google-oauth.client'
import { sign } from 'jsonwebtoken'

export class AuthenticateWithGoogleUseCase {
  constructor(private usersRepository: UserRepository) {}

  async execute(googleUser: GoogleUserPayload) {
    let user: PublicUser | null = await this.usersRepository.findByEmail(googleUser.email)

    if (!user) {
      user = await this.usersRepository.create({
        email: googleUser.email,
        name: googleUser.name,
        googleId: googleUser.googleId,
        avatarUrl: googleUser.avatarUrl,
      })
    } else if (!user.googleId) {
      user = await this.usersRepository.update(user.id, {
        googleId: googleUser.googleId,
      })
    }

    const token = sign({ sub: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    })

    return { user, token }
  }
}