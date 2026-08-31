import type { Request, Response } from 'express';
import { validateLogin } from '../dtos/auth/LoginDto';
import { validateRegister } from '../dtos/auth/RegisterDto';
import { AuthService } from '../services/AuthService';

/** Translates authentication HTTP requests into validated service calls. */
export class AuthController {
  constructor(private readonly service = new AuthService()) {}

  /**
   * Registers a user from a validated request body.
   *
   * @param req Request containing the registration fields in its body.
   * @param res HTTP response used to return the public user data.
   * @returns A promise that resolves after the response is sent.
   */
  register = async (req: Request, res: Response): Promise<void> => {
    const user = await this.service.register(validateRegister(req.body));
    res.status(201).json(user);
  };

  /**
   * Authenticates a user and returns a signed access token.
   *
   * @param req Request containing the email and password in its body.
   * @param res HTTP response used to return the token and public user data.
   * @returns A promise that resolves after the response is sent.
   */
  login = async (req: Request, res: Response): Promise<void> => {
    const result = await this.service.login(validateLogin(req.body));
    res.json(result);
  };
}
