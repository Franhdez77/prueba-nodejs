import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { BaseAttributes } from './types';
/** Persistent attributes of a medicine catalog entry. */
export interface MedicineAttributes extends BaseAttributes {
  name: string;
  sku: string;
  description: string;
}
/** Sequelize model mapped to the `medicines` table. */
export class Medicine
  extends Model<MedicineAttributes, Optional<MedicineAttributes, 'id' | 'active'>>
  implements MedicineAttributes
{
  declare id: number;
  declare name: string;
  declare sku: string;
  declare description: string;
  declare active: boolean;
}
Medicine.init(
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
    sku: { 
      type: DataTypes.STRING, 
      allowNull: false, 
      unique: true 
    },
    description: { 
      type: DataTypes.TEXT, 
      allowNull: false, 
      defaultValue: '' 
    },
    active: { 
      type: DataTypes.BOOLEAN, 
      defaultValue: true 
    },
  },
  { sequelize, tableName: 'medicines' },
);
