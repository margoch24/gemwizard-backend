import { ObjectId } from 'mongodb';
import { FILTER_PROPS_TYPES_ENUM } from '../types/diamond_types';

export const removeNonNumbers = (value: string) => {
  return Number(value.replace(/[^\d.]/g, ''));
};

export const formatDate = (excelDate: number) => {
  const formattedDate = new Date(Date.UTC(0, 0, excelDate - 1)).toString();
  return formattedDate;
};

export const formatFiterProps = (
  { type, property, operator }: { type: string; property: string; operator?: string },
  value?: string | number
) => {
  const nullableValues = ['', null, undefined];

  if (type === FILTER_PROPS_TYPES_ENUM.ObjectId) {
    return { [operator ? operator : '$gt']: new ObjectId(value) };
  }

  if (type === FILTER_PROPS_TYPES_ENUM.String) {
    return { $regex: value, $options: 'i' };
  }

  if (type === FILTER_PROPS_TYPES_ENUM.Number) {
    const numberValue = Number(value);
    return numberValue === 0 || numberValue ? numberValue : null;
  }

  if (type === FILTER_PROPS_TYPES_ENUM.NumericRange) {
    const [min, max] = (value as string)?.split(',') ?? [];
    const numberMin = Number(min);
    const numberMax = Number(max);
    return {
      ...(numberMin === 0 || numberMin ? { $gte: numberMin } : {}),
      ...(numberMax === 0 || numberMax ? { $lte: numberMax } : {})
    };
  }

  if (type === FILTER_PROPS_TYPES_ENUM.PercentageRange) {
    const [min, max] = (value as string)?.split(',') ?? [];
    const numberMin = Number(min) / 100;
    const numberMax = Number(max) / 100;
    return {
      ...(numberMin === 0 || numberMin ? { $gte: numberMin } : {}),
      ...(numberMax === 0 || numberMax ? { $lte: numberMax } : {})
    };
  }

  if (type === FILTER_PROPS_TYPES_ENUM.StringRange) {
    let valuesArray: (string | null | undefined)[] = (value as string)?.split(',');
    if (valuesArray.includes('none')) {
      valuesArray = [...valuesArray, ...nullableValues];
    }
    return { $in: valuesArray };
  }

  return value;
};
