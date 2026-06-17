import { IUpdateTransactionDTO, ITransactionRepository } from "../../interfaces/ITransectionRepository";


export class UpdateTransectionService {
    constructor(private transectionRepository: ITransactionRepository) { }

    async execute(id: string, data: IUpdateTransactionDTO) {
        return this.transectionRepository.update(id, data);
    }
}