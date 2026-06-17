import { ITransactionRepository } from "../../interfaces/ITransectionRepository";


export class FindByIdTransectionService {
    constructor(private transectionRepository: ITransactionRepository) { }

    async execute(id: string) {
        return this.transectionRepository.findById(id);
    }
}