import { ITransactionCreateDTO, ITransactionRepository } from "../../interfaces/ITransectionRepository";


export class CreateTransectionService {
    constructor(private transectionRepository: ITransactionRepository) { }

    async execute(data: ITransactionCreateDTO) {
        return this.transectionRepository.create(data);
    }
}