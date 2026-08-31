import { User, UserAttributes } from '../models/User';
/** Encapsulates user lookup and creation operations. */
export class UserRepository {
  /**
   * @param email Normalized email address to search for.
   * @returns The active user or `null` when no match exists.
   */
  findActiveByEmail(email: string): Promise<User | null> {
    return User.findOne({ where: { email, active: true } });
  }
  /**
   * @param email Normalized email address to search for, regardless of user status.
   * @returns The user or `null` when no match exists.
   */
  findByEmail(email: string): Promise<User | null> {
    return User.findOne({ where: { email } });
  }
  /**
   * @param data User attributes including an already hashed password.
   * @returns The created user entity.
   */
  create(data: Omit<UserAttributes, 'id' | 'active'>): Promise<User> {
    return User.create(data);
  }
}
