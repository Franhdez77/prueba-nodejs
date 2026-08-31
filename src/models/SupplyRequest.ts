import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { BaseAttributes, RequestStatus } from './types';
export interface SupplyRequestAttributes extends BaseAttributes {
  clinicId: number;
  medicineId: number;
  warehouseId: number;
  requestedBy: number;
  quantity: number;
  status: RequestStatus;
}
export class SupplyRequest
  extends Model<
    SupplyRequestAttributes,
    Optional<SupplyRequestAttributes, 'id' | 'active' | 'status'>
  >
  implements SupplyRequestAttributes
{
  declare id: number;
  declare clinicId: number;
  declare medicineId: number;
  declare warehouseId: number;
  declare requestedBy: number;
  declare quantity: number;
  declare status: RequestStatus;
  declare active: boolean;
}
SupplyRequest.init(
  {
    id: { 
      type: DataTypes.INTEGER, 
      autoIncrement: true, 
      primaryKey: true 
    },
    clinicId: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },
    medicineId: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },
    warehouseId: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },
    requestedBy: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },
    quantity: { 
      type: DataTypes.INTEGER, 
      allowNull: false, 
      validate: { min: 1 } 
    },
    status: {
      type: DataTypes.ENUM(
        'PENDING',
        'APPROVED',
        'DISPATCHED',
        'DELIVERED',
        'REJECTED',
        'CANCELLED',
      ),
      defaultValue: 'PENDING',
    },
    active: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  { sequelize, tableName: 'supply_requests' },
);
