import { IUserRepository } from "../../interfaces/IUserRepository";

export class FindUserByEmailService {
    constructor(private userRepository: IUserRepository) { }

    async execute(id: string) {
        const user = await this.userRepository.findByEmail(id);
        return user;
    }
}