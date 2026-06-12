import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryUserRepository } from "../../repository/inMemory/InMemoryUserRepository"
import { FindUserByEmailService } from '../../services/user/findByEmail.user.service'
import { CreateUserService } from '../../services/user/create.user.service'

let userRepository: InMemoryUserRepository
let findUserByEmailService: FindUserByEmailService
let createUserService: CreateUserService

describe('FindUserByEmailService', () => {

    beforeEach(() => {
        userRepository = new InMemoryUserRepository()
        findUserByEmailService = new FindUserByEmailService(userRepository)
        createUserService = new CreateUserService(userRepository)
    })

    it('should be able to find a user by id', async () => {
        const created = await createUserService.execute({
            name: 'John Doe',
            email: 'johndoe@email.com',
            passwordHash: '12345678'
        })

        const user = await findUserByEmailService.execute(created.email)

        expect(user).toBeDefined()
        expect(user?.id).toBe(created.id)
        expect(user?.email).toBe('johndoe@email.com')
    })

    it('should not be able to find a non-existing user', async () => {
        await expect(
            findUserByEmailService.execute('non-existing-id')
        ).rejects.toThrow('User not found')
    })

})