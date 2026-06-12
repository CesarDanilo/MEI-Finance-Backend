import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryUserRepository } from "../../repository/inMemory/InMemoryUserRepository"
import { FindUserByIdService } from '../../services/user/findByid.user.service'
import { CreateUserService } from '../../services/user/create.user.service'

let userRepository: InMemoryUserRepository
let findUserByIdService: FindUserByIdService
let createUserService: CreateUserService

describe('FindUserByIdService', () => {

    beforeEach(() => {
        userRepository = new InMemoryUserRepository()
        findUserByIdService = new FindUserByIdService(userRepository)
        createUserService = new CreateUserService(userRepository)
    })

    it('should be able to find a user by id', async () => {
        const created = await createUserService.execute({
            name: 'John Doe',
            email: 'johndoe@email.com',
            passwordHash: '12345678'
        })

        const user = await findUserByIdService.execute(created.id)

        expect(user).toBeDefined()
        expect(user?.id).toBe(created.id)
        expect(user?.email).toBe('johndoe@email.com')
    })

    it('should not be able to find a non-existing user', async () => {
        await expect(
            findUserByIdService.execute('non-existing-id')
        ).rejects.toThrow('User not found')
    })

})