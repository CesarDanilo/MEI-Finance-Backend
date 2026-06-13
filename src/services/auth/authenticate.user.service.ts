import { compare, compareSync, hash } from "bcryptjs";
import { IUserRepository } from "../../interfaces/IUserRepository";
import { loginSchema } from "../../schemas/auth/auth.schema";
import jwt from "jsonwebtoken";

export class AuthenticateUserService {
    constructor(private userRepository: IUserRepository) { }

    async execute(email: string, passwordHash: string) {
        try {
            const result = loginSchema.safeParse({ email, passwordHash });
            if (result.error) throw new Error(result.error.message);

            const user = await this.userRepository.findByEmail(result.data.email);
            if (!user) throw new Error('User not found');

            const passwordMatch = await compare(result.data.passwordHash, user.passwordHash);
            if (!passwordMatch) throw new Error('Invalid credentials');

            const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET as string, { expiresIn: "1d" });
            
            return {
                user: {
                    "id": user.id,
                    "name": user.name,
                    "email": user.email
                },
                token: token
            }

        } catch (erro: any) {
            throw new Error('Invalid credentials');
        }
    }
}