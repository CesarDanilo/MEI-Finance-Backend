import { IUserRepository, UpdateUserDTO } from "../../interfaces/IUserRepository";

export class UpdateUserService {
    constructor(private userRepository: IUserRepository) { }

    async execute(id: string, data: UpdateUserDTO) {

        const userAlreadyExists = await this.userRepository.findById(id);
        if (!userAlreadyExists) throw new Error('User not found');

        if (data.email) {
            const emailAlreadyInUse = await this.userRepository.findByEmail(data.email);
            if (emailAlreadyInUse && emailAlreadyInUse.id !== id) {
                throw new Error('Email already in use')
            }
        }

        const user = await this.userRepository.update(id, data);
        return user;
    }

}