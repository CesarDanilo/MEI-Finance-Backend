import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryUserRepository } from '../../repository/inMemory/InMemoryUserRepository'
import { CreateUserService } from '../../services/user/create.user.service'
import { UpdateUserService } from '../../services/user/update.user.service'

let userRepository: InMemoryUserRepository
let createUserService: CreateUserService
let updateUserService: UpdateUserService

describe('UpdateUserService', () => {

    beforeEach(() => {
        userRepository = new InMemoryUserRepository()
        createUserService = new CreateUserService(userRepository)
        updateUserService = new UpdateUserService(userRepository)
    })

    it('should be able to update a user', async () => {
        const created = await createUserService.execute({
            name: 'John Doe',
            email: 'johndoe@email.com',
            passwordHash: '12345678'
        })

        const updated = await updateUserService.execute(created.id, {
            name: 'John Updated'
        })

        expect(updated.name).toBe('John Updated')
        expect(updated.email).toBe('johndoe@email.com')
    })

    it('should not be able to update a non-existing user', async () => {
        await expect(
            updateUserService.execute('non-existing-id', { name: 'John' })
        ).rejects.toThrow('User not found')
    })

    it('should not be able to update email to one already in use', async () => {
        await createUserService.execute({
            name: 'John Doe',
            email: 'johndoe@email.com',
            passwordHash: '12345678'
        })

        const second = await createUserService.execute({
            name: 'Jane Doe',
            email: 'janedoe@email.com',
            passwordHash: '12345678'
        })

        await expect(
            updateUserService.execute(second.id, { email: 'johndoe@email.com' })
        ).rejects.toThrow('Email already in use')
    })

    it('should be able to update to own email', async () => {
        const created = await createUserService.execute({
            name: 'John Doe',
            email: 'johndoe@email.com',
            passwordHash: '12345678'
        })

        const updated = await updateUserService.execute(created.id, {
            email: 'johndoe@email.com'
        })

        expect(updated.email).toBe('johndoe@email.com')
    })

})