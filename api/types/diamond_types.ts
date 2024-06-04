import { ObjectId } from 'mongoose';

export type FetchedDiamondType = {
  'Diamond ID': string;
  'Diamond Type': string;
  'Diamond URL'?: string;
  'Affiliate Link'?: string;
  Price: number;
  'Estimate Range': string;
  'Fair Price': number;
  'Cert Lab': string;
  'L/W Ratio': string | number;
  'Cut Score': string | number;
  'Visual Carat': string;
  Shape: string;
  Carat: string;
  Color: string;
  Clarity: string;
  Fluorescence: string;
  Symmetry: string;
  Polish: string;
  'Image URL': string;
  'Price Details': string;
  'Sertificate Data': number;
  'Report Number': number | string;
  Measurements: string;
  'Cut Grade': string;
  'Clarity Characteristics': string;
  Inscriptions: string;
  Comments: string;
  'Table %': number | string;
  'Depth %': number | string;
  Culet: string;
  'Pavilion Depth': number | string;
  'Pavilion Angle': string;
  'Crown Height': number | string;
  'Crown Angle': string;
  'Lower Half %': number | string;
  'Star Lenght %': number | string;
  'Girdle %': number | string;
};

export type GetDiamondType = {
  diamondId?: string;
  reportNumber?: string;
};
export interface GetDiamondsInterface {
  limit?: string | number;
  lastRecordId?: string;
  type?: string;
  shape?: string;
  price?: string;
  carat?: string;
  color?: string;
  clarity?: string;
  symmetry?: string;
  polish?: string;
  fluorescence?: string;
  tablePercentage?: string;
  depthPercentage?: string;
  lengthWidthRatio?: string;
  certLaboratory?: string;
  count?: string;
  cutGrade?: string;
}

export interface GetDiamondsRequestQuery extends GetDiamondsInterface {}
export type MatchType = {
  type?: string;
  'characteristics.shape'?: string;
  _id?: { $gte?: number; $lte?: number };
  'dimensions.carat'?: { $gte?: number; $lte?: number };
  price?: { $gte?: number; $lte?: number };
  'characteristics.color'?: { $in?: string[] };
  'characteristics.clarity'?: { $in?: string[] };
  'characteristics.symmetry'?: { $in?: string[] };
  'characteristics.polish'?: { $in?: string[] };
  certLaboratory?: { $in?: string[] };
  'characteristics.fluorescence'?: { $in?: string[] };
  'dimensions.tablePercentage'?: { $gte?: number; $lte?: number };
  'dimensions.depthPercentage'?: { $gte?: number; $lte?: number };
  'dimensions.lengthWidthRatio'?: { $gte?: number; $lte?: number };
};

export type FormattedFilterPropsType = {
  limit?: number;
  lastRecordId?: { $gt: ObjectId };
  $match: MatchType;
};

export enum DIAMOND_TYPES_ENUM {
  NaturalDiamond = 'natural diamond',
  LabGrownDiamond = 'lab grown'
}

export enum FILTER_PROPS_TYPES_ENUM {
  Number = 'number',
  ObjectId = 'objectId',
  String = 'string',
  NumericRange = 'numeric_range',
  StringRange = 'string_range',
  PercentageRange = 'percentage_range'
}
