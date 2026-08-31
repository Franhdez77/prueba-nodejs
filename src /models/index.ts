import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export type Role = 'ADMIN' | 'MANAGER';
export type RequestStatus =
  'PENDING' | 'APPROVED' | 'DISPATCHED' | 'DELIVERED' | 'REJECTED' | 'CANCELLED';
  
interface Base {
  id: number;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserAttributes extends Base {
  name: string;
  email: string;
  password: string;
  role: Role;
}
