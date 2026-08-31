jest.mock('bcryptjs', () => ({
  __esModule: true,
  default: {
    hash: jest.fn(),
    compare: jest.fn(),
  },
}));

jest.mock('jsonwebtoken', () => ({
  __esModule: true,
  default: {
    sign: jest.fn(),
  },
}));

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import type { User } from '../models/User';
import type { UserRepository } from '../repositories/UserRepository';
import { AuthService } from './AuthService';

const mock = (fn: unknown): jest.Mock => fn as jest.Mock;

describe('auth service', () => {
  const repository = {
    findActiveByEmail: jest.fn(),
    findByEmail: jest.fn(),
    create: jest.fn(),
  };
  const service = new AuthService(repository as unknown as UserRepository);

  beforeEach(() => jest.clearAllMocks());

  test('registers a user with a hashed password', async () => {
    repository.findByEmail.mockResolvedValue(null);
    mock(bcrypt.hash).mockResolvedValue('hashed-password');
    repository.create.mockResolvedValue({
      id: 1,
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'hashed-password',
      role: 'ADMIN',
    } as User);

    await expect(
      service.register({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'Secret123',
        role: 'ADMIN',
      }),
    ).resolves.toEqual({
      id: 1,
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'ADMIN',
    });

    expect(bcrypt.hash).toHaveBeenCalledWith('Secret123', 12);
    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({ password: 'hashed-password' }),
    );
  });

  test('rejects registration when the email already exists', async () => {
    repository.findByEmail.mockResolvedValue({ id: 1 } as User);

    await expect(
      service.register({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'Secret123',
        role: 'ADMIN',
      }),
    ).rejects.toMatchObject({ statusCode: 409, message: 'Email already registered' });

    expect(bcrypt.hash).not.toHaveBeenCalled();
    expect(repository.create).not.toHaveBeenCalled();
  });

  test('logs in an active user and signs a token', async () => {
    const user = {
      id: 2,
      name: 'Manager User',
      email: 'manager@example.com',
      password: 'stored-hash',
      role: 'MANAGER',
    } as User;
    repository.findActiveByEmail.mockResolvedValue(user);
    mock(bcrypt.compare).mockResolvedValue(true);
    mock(jwt.sign).mockReturnValue('signed-token');

    await expect(
      service.login({ email: 'manager@example.com', password: 'Secret123' }),
    ).resolves.toEqual({
      token: 'signed-token',
      user: {
        id: 2,
        name: 'Manager User',
        email: 'manager@example.com',
        role: 'MANAGER',
      },
    });

    expect(bcrypt.compare).toHaveBeenCalledWith('Secret123', 'stored-hash');
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: 2, role: 'MANAGER' },
      env.jwtSecret,
      { expiresIn: env.jwtExpiresIn },
    );
  });

  test('rejects login when the active user does not exist', async () => {
    repository.findActiveByEmail.mockResolvedValue(null);

    await expect(
      service.login({ email: 'missing@example.com', password: 'Secret123' }),
    ).rejects.toMatchObject({ statusCode: 401, message: 'Invalid credentials' });

    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(jwt.sign).not.toHaveBeenCalled();
  });

  test('rejects login when the password is incorrect', async () => {
    repository.findActiveByEmail.mockResolvedValue({ password: 'stored-hash' } as User);
    mock(bcrypt.compare).mockResolvedValue(false);

    await expect(
      service.login({ email: 'admin@example.com', password: 'WrongPassword' }),
    ).rejects.toMatchObject({ statusCode: 401, message: 'Invalid credentials' });

    expect(jwt.sign).not.toHaveBeenCalled();
  });
});
