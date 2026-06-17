import { ITransactionRepository } from "../../interfaces/ITransectionRepository"

export class ReadTransectionService {
    constructor(private categoryRepository: ITransactionRepository) { }

    async execute(userId: string) {
        return this.categoryRepository.findAll(userId);
    }
}