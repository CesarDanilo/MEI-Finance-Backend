import { IUserRepository, CreateUserDTO } from "../../interfaces/IUserRepository";
import { hash } from "bcryptjs"

export class CreateUserService {
    constructor(private userRepository: IUserRepository) { }

    async execute(data: CreateUserDTO) {

        const userAlreadyExists = await this.userRepository.findByEmail(data.email);
        if (userAlreadyExists) throw new Error('Email already in use');

        data.passwordHash = await hash(data.passwordHash, 10);

        const user = await this.userRepository.create({
            name: data.name,
            email: data.email,
            passwordHash: data.passwordHash
        })

        return user;
    }
}