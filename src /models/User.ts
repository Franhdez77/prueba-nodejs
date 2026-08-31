import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { BaseAttributes, Role } from './types';
export interface UserAttributes extends BaseAttributes {
  name: string;
  email: string;
  password: string;
  role: Role;
}
export class User
  extends Model<UserAttributes, Optional<UserAttributes, 'id' | 'active'>>
  implements UserAttributes
{
  declare id: number;
  declare name: string;
  declare email: string;
  declare password: string;
  declare role: Role;
  declare active: boolean;
}
User.init(
  {
    id: { 
      type: DataTypes.INTEGER, 
      autoIncrement: true, 
      primaryKey: true 
    },
    name: { 
      type: DataTypes.STRING,
      allowNull: false 
    },
    email: { 
      type: DataTypes.STRING, 
      allowNull: false, 
      unique: true 
    },
    password: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    role: { 
      type: DataTypes.ENUM('ADMIN', 'MANAGER'), 
      allowNull: false 
    },
    active: { 
      type: DataTypes.BOOLEAN, 
      defaultValue: true 
    },
  },
  { sequelize, tableName: 'users' },
);
