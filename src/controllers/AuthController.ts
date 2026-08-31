import type { Request, Response } from 'express';
import { validateLogin } from '../dtos/auth/LoginDto';
import { validateRegister } from '../dtos/auth/RegisterDto';
import { AuthService } from '../services/AuthService';

/** Traduce las solicitudes HTTP de autenticación a casos de uso. */
export class AuthController {
  constructor(private readonly service = new AuthService()) {}

  register = async (req: Request, res: Response): Promise<void> => {
    const user = await this.service.register(validateRegister(req.body));
    res.status(201).json(user);
  };

  login = async (req: Request, res: Response): Promise<void> => {
    const result = await this.service.login(validateLogin(req.body));
    res.json(result);
  };
}
