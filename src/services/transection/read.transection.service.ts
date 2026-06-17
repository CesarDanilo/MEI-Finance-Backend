import { ITransactionRepository } from "../../interfaces/ITransectionRepository"

export class ReadTransectionService {
    constructor(private transectionRepository: ITransactionRepository) { }

    async execute(userId: string) {
        return this.transectionRepository.findAll(userId);
    }
}