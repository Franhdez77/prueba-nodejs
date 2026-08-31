import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { BaseAttributes } from './types';

export interface ClinicAttributes extends BaseAttributes {
  name: string;
  nit: string;
  address: string;
  responsibleName: string;
  responsiblePhone: string;
}

export class Clinic
  extends Model<ClinicAttributes, Optional<ClinicAttributes, 'id' | 'active'>>
  implements ClinicAttributes
{
  declare id: number;
  declare name: string;
  declare nit: string;
  declare address: string;
  declare responsibleName: string;
  declare responsiblePhone: string;
  declare active: boolean;
  declare createdAt?: Date;
  declare updatedAt?: Date;
}

Clinic.init(
  {
    id: { 
      type: DataTypes.INTEGER, 
      autoIncrement: true, 
      primaryKey: true 
    },

    name: { 
      type: DataTypes.STRING
      , allowNull: false },
    nit: { 
      type: DataTypes.STRING, 
      allowNull: false, 
      unique: true 
    },
    address: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    responsibleName: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    responsiblePhone: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    active: { 
      type: DataTypes.BOOLEAN, 
      defaultValue: true 
    },
    createdAt: { 
      type: DataTypes.DATE, 
      defaultValue: DataTypes.NOW 
    },
    updatedAt: { 
      type: DataTypes.DATE, 
      defaultValue: DataTypes.NOW 
    },
  },
  { sequelize, tableName: 'clinics' },
);
