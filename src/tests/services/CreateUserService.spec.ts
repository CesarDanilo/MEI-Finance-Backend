import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryUserRepository } from '../../repository/inMemory/InMemoryUserRepository'
import { CreateUserService } from '../../services/user/create.user.service'

let userRepository: InMemoryUserRepository
let createUserService: CreateUserService

describe('CreateUserService', () => {

  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    createUserService = new CreateUserService(userRepository)
  })

  it('should be able to create a new user', async () => {
    const user = await createUserService.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      passwordHash: '12345678'
    })

    expect(user).toBeDefined()
    expect(user.id).toBeDefined()
    expect(user.email).toBe('johndoe@email.com')
  })

  it('should not be able to create a user with duplicate email', async () => {
    await createUserService.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      passwordHash: '12345678'
    })

    await expect(
      createUserService.execute({
        name: 'John Doe',
        email: 'johndoe@email.com',
        passwordHash: '12345678'
      })
    ).rejects.toThrow('Email already in use')
  })

  it('should hash password before saving', async () => {
    const user = await createUserService.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      passwordHash: '12345678'
    })

    expect(user.passwordHash).not.toBe('12345678')
  })

})