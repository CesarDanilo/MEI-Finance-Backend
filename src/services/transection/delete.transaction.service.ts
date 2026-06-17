import { ITransactionRepository } from "../../interfaces/ITransectionRepository";


export class DeleteTransectionService {
    constructor(private transectionRepository: ITransactionRepository) { }

    async execute(id: string) {
        return this.transectionRepository.delete(id);
    }
}