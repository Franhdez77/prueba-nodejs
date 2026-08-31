import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';
import { LoginDto } from '../dtos/auth/LoginDto';
import { RegisterDto } from '../dtos/auth/RegisterDto';
import { AppError } from '../errors/AppError';
import { UserRepository } from '../repositories/UserRepository';


export class AuthService {
  constructor(private readonly users = new UserRepository()) {}
  async register(data: RegisterDto) {
    if (await this.users.findByEmail(data.email))
      throw new AppError(409, 'Email already registered');
    const user = await this.users.create({
      ...data,
      password: await bcrypt.hash(data.password, 12),
    });
    return { id: user.id, name: user.name, email: user.email, role: user.role };
  }
  async login(data: LoginDto) {
    const user = await this.users.findActiveByEmail(data.email);
    if (!user || !(await bcrypt.compare(data.password, user.password)))
      throw new AppError(401, 'Invalid credentials');
    const options: SignOptions = { expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'] };
    const token = jwt.sign({ id: user.id, role: user.role }, env.jwtSecret, options);
    return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  }
}
