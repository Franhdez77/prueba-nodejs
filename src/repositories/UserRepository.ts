import { User, UserAttributes } from '../models/User';
export class UserRepository {
  findActiveByEmail(email: string): Promise<User | null> {
    return User.findOne({ where: { email, active: true } });
  }
  findByEmail(email: string): Promise<User | null> {
    return User.findOne({ where: { email } });
  }
  create(data: Omit<UserAttributes, 'id' | 'active'>): Promise<User> {
    return User.create(data);
  }
}
