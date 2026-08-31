export { Clinic } from './Clinic';
export { Inventory } from './Inventory';
export { Medicine } from './Medicine';
export { SupplyRequest } from './SupplyRequest';
export { User } from './User';
export { Warehouse } from './Warehouse';
export type { BaseAttributes, RequestStatus, Role } from './types';

import { Clinic } from './Clinic';
import { Inventory } from './Inventory';
import { Medicine } from './Medicine';
import { SupplyRequest } from './SupplyRequest';
import { User } from './User';
import { Warehouse } from './Warehouse';

Warehouse.hasMany(Inventory, { foreignKey: 'warehouseId' });
Inventory.belongsTo(Warehouse, { foreignKey: 'warehouseId' });
Medicine.hasMany(Inventory, { foreignKey: 'medicineId' });
Inventory.belongsTo(Medicine, { foreignKey: 'medicineId' });

Clinic.hasMany(SupplyRequest, { foreignKey: 'clinicId' });
SupplyRequest.belongsTo(Clinic, { foreignKey: 'clinicId' });
Warehouse.hasMany(SupplyRequest, { foreignKey: 'warehouseId' });
SupplyRequest.belongsTo(Warehouse, { foreignKey: 'warehouseId' });
Medicine.hasMany(SupplyRequest, { foreignKey: 'medicineId' });
SupplyRequest.belongsTo(Medicine, { foreignKey: 'medicineId' });
User.hasMany(SupplyRequest, { foreignKey: 'requestedBy' });
SupplyRequest.belongsTo(User, { foreignKey: 'requestedBy' });
