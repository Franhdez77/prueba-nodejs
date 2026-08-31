import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
/** Stock quantity for one medicine in one warehouse. */
export interface InventoryAttributes {
  id: number;
  warehouseId: number;
  medicineId: number;
  quantity: number;
}
/** Sequelize model mapped to the `inventories` table. */
export class Inventory
  extends Model<InventoryAttributes, Optional<InventoryAttributes, 'id'>>
  implements InventoryAttributes
{
  declare id: number;
  declare warehouseId: number;
  declare medicineId: number;
  declare quantity: number;
}
Inventory.init(
  {
    id: { 
      type: DataTypes.INTEGER, 
      autoIncrement: true, 
      primaryKey: true 
    },
    warehouseId: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },
    medicineId: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },
    quantity: { 
      type: DataTypes.INTEGER, 
      allowNull: false, 
      validate: { min: 0 } 
    },
  },
  {
    sequelize,
    tableName: 'inventories',
    indexes: [{ unique: true, fields: ['warehouseId', 'medicineId'] }],
  },
);
