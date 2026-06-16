import { Category, TransactionType } from "@prisma/client"

export interface ICreateCategoryDTO {
  name: string
  type: TransactionType
  userId: string
}

export interface ICategoryRepository {
  create(data: ICreateCategoryDTO): Promise<Category>
  findById(id: string): Promise<Category | null>
  findByNameAndUserId(name: string, userId: string): Promise<Category | null>
}