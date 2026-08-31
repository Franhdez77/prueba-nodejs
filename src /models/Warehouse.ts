import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { BaseAttributes } from './types';
export interface WarehouseAttributes extends BaseAttributes {
  name: string;
  location: string;
}
export class Warehouse
  extends Model<WarehouseAttributes, Optional<WarehouseAttributes, 'id' | 'active'>>
  implements WarehouseAttributes
{
  declare id: number;
  declare name: string;
  declare location: string;
  declare active: boolean;
}
Warehouse.init(
  {
    id: { 
      type: DataTypes.INTEGER, 
      autoIncrement: true, primaryKey: true 
    },
    name: { 
      type: DataTypes.STRING, 
      allowNull: false, 
      unique: true 
    },
    location: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    active: { 
      type: DataTypes.BOOLEAN, 
      defaultValue: true 
    },
  },
  { sequelize, tableName: 'warehouses' },
);
