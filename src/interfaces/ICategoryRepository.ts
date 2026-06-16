import { Category, TransactionType } from "@prisma/client"

export interface ICreateCategoryDTO {
  name: string
  type: TransactionType
  userId: string
}

export interface IUpdateCategory {
  name: string
  type: TransactionType
}

export interface ICategoryRepository {
  create(data: ICreateCategoryDTO): Promise<Category>
  findById(id: string): Promise<Category | null>
  findByNameAndUserId(name: string, userId: string): Promise<Category | null>
  delete(id: string): Promise<Category>;
  update(id: string, data: IUpdateCategory): Promise<Category>
  readAll(userId: string): Promise<Category[]>
}