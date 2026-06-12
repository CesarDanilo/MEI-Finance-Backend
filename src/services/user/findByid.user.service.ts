import { IUserRepository } from "../../interfaces/IUserRepository";

export class FindUserByIdService {
    constructor(private userRepository: IUserRepository) { }

    async execute(id: string) {
        const user = await this.userRepository.findById(id);
        return user;
    }
}