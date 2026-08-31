import { AppError } from '../../errors/AppError';
import { InputRecord, readObject, readString } from '../validation';

export type ResourceValidator = (input: unknown, partial?: boolean) => InputRecord;

function optionalString(
  data: InputRecord,
  output: InputRecord,
  field: string,
  minimum: number,
  partial: boolean,
): void {
  if (partial && data[field] === undefined) return;
  output[field] = readString(data, field, minimum);
}

export const validateClinic: ResourceValidator = (input, partial = false) => {
  const data = readObject(input);
  const output: InputRecord = {};
  optionalString(data, output, 'name', 2, partial);
  optionalString(data, output, 'nit', 3, partial);
  optionalString(data, output, 'address', 2, partial);
  optionalString(data, output, 'responsibleName', 2, partial);
  optionalString(data, output, 'responsiblePhone', 5, partial);
  if (partial && Object.keys(output).length === 0)
    throw new AppError(400, 'No valid fields provided');
  return output;
};

export const validateWarehouse: ResourceValidator = (input, partial = false) => {
  const data = readObject(input);
  const output: InputRecord = {};
  optionalString(data, output, 'name', 2, partial);
  optionalString(data, output, 'location', 2, partial);
  if (partial && Object.keys(output).length === 0)
    throw new AppError(400, 'No valid fields provided');
  return output;
};

export const validateMedicine: ResourceValidator = (input, partial = false) => {
  const data = readObject(input);
  const output: InputRecord = {};
  optionalString(data, output, 'name', 2, partial);
  optionalString(data, output, 'sku', 2, partial);
  if (!partial || data.description !== undefined) {
    if (typeof data.description !== 'string')
      throw new AppError(400, 'description must be a string');
    output.description = data.description.trim();
  }
  if (partial && Object.keys(output).length === 0)
    throw new AppError(400, 'No valid fields provided');
  return output;
};
