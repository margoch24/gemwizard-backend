import { FILTER_PROPS_TYPES_ENUM } from '../api/types/diamond_types';
import { formatDate, removeNonNumbers } from './helpers/diamond_helper';

export const DEFAULT_LIMIT = 50;

export const FETCHED_DIAMOND_PROPERTIES: { [key: string]: any } = {
  'Diamond ID': {
    key: 'certificateId'
  },
  'Diamond Type': {
    key: 'type',
    editedValue: (value: string) => {
      return value
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, '')
        .replace(/\s+$/, '');
    }
  },
  'Diamond URL': {
    key: 'diamondURL'
  },
  'Affiliate Link': {
    key: 'affiliateLink'
  },
  Price: {
    key: 'price',
    section: 'price',
    editedValue: (value: number | string) => (typeof value === 'string' ? null : value)
  },
  'Estimate Range': {
    key: 'estimateRange',
    editedValue: (value: string) => {
      const estimateRange = value?.split(' - ');
      const [min, max] = estimateRange;
      return {
        min: removeNonNumbers(min),
        max: removeNonNumbers(max)
      };
    },
    section: 'price'
  },
  'Fair Price': {
    key: 'fairPrice',
    section: 'price'
  },
  'Cert Lab': {
    key: 'certLaboratory'
  },
  'L/W Ratio': {
    key: 'lengthWidthRatio',
    section: 'dimensions'
  },
  'Cut Score': {
    key: 'cutScore',
    section: 'characteristics'
  },
  'Visual Carat': {
    key: 'visualCarat',
    section: 'dimensions',
    editedValue: (value: string) => Number(value?.split(' ')[0])
  },
  Shape: {
    key: 'shape',
    section: 'characteristics',
    editedValue: (value: string) => value?.toLowerCase()
  },
  Carat: {
    key: 'carat',
    section: 'dimensions',
    editedValue: (value: string) => Number(value?.split(' ')[0])
  },
  Color: {
    key: 'color',
    section: 'characteristics'
  },
  Clarity: {
    key: 'clarity',
    section: 'characteristics'
  },
  Fluorescence: {
    key: 'fluorescence',
    section: 'characteristics',
    editedValue: (value: string) => value?.toLowerCase()
  },
  Symmetry: {
    key: 'symmetry',
    section: 'characteristics',
    editedValue: (value: string) => value?.toLowerCase()
  },
  Polish: {
    key: 'polish',
    section: 'characteristics',
    editedValue: (value: string) => value?.toLowerCase()
  },
  'Image URL': {
    key: 'imageURL'
  },
  'Price Details': {
    key: 'priceDetails',
    section: 'price'
  },
  'Sertificate Data': {
    key: 'certificateDate',
    editedValue: (value: number) => formatDate(value)
  },
  'Report Number': {
    key: 'reportNumber'
  },
  Measurements: {
    key: 'measurements',
    section: 'dimensions',
    editedValue: (value: string) => {
      const [length, _, width, __, depth, unit] = value.split(' ');
      return {
        length: Number(length),
        width: Number(width),
        depth: Number(depth),
        unit
      };
    }
  },
  'Cut Grade': {
    key: 'cutGrade',
    section: 'characteristics',
    editedValue: (value: string) => value?.toLowerCase()
  },
  'Clarity Characteristics': {
    key: 'clarityCharacteristics',
    section: 'characteristics',
    editedValue: (value: string) => value?.toLowerCase()?.split(', ')
  },
  Inscriptions: {
    key: 'inscription'
  },
  Comments: {
    key: 'comments'
  },
  'Table %': {
    key: 'tablePercentage',
    section: 'dimensions'
  },
  'Depth %': {
    key: 'depthPercentage',
    section: 'dimensions'
  },
  Culet: {
    key: 'culet',
    section: 'dimensions',
    editedValue: (value: string) => value?.toLowerCase()
  },
  'Pavilion Depth': {
    key: 'pavilionDepthPercentage',
    section: 'dimensions'
  },
  'Pavilion Angle': {
    key: 'pavilionAngle',
    section: 'dimensions',
    editedValue: (value: string) => removeNonNumbers(value)
  },
  'Crown Height': {
    key: 'crownHeightPercentage',
    section: 'dimensions'
  },
  'Crown Angle': {
    key: 'crownAngle',
    section: 'dimensions',
    editedValue: (value: string) => removeNonNumbers(value)
  },
  'Lower Half %': {
    key: 'lowerHalfPercentage',
    section: 'dimensions'
  },
  'Star Lenght %': {
    key: 'starLengthPercentage',
    section: 'dimensions'
  },
  'Girdle %': {
    key: 'girdlePercentage',
    section: 'dimensions'
  }
};

export const FILTER_PROPS_CONFIG: { [key: string]: any } = {
  limit: {
    type: FILTER_PROPS_TYPES_ENUM.Number
  },
  lastRecordId: {
    type: FILTER_PROPS_TYPES_ENUM.ObjectId,
    property: '_id',
    operator: '$lt'
  },
  type: {
    type: FILTER_PROPS_TYPES_ENUM.String,
    property: 'type'
  },
  shape: {
    type: FILTER_PROPS_TYPES_ENUM.String,
    property: 'characteristics.shape'
  },
  price: {
    type: FILTER_PROPS_TYPES_ENUM.NumericRange,
    property: 'price'
  },
  carat: {
    type: FILTER_PROPS_TYPES_ENUM.NumericRange,
    property: 'dimensions.carat'
  },
  color: {
    type: FILTER_PROPS_TYPES_ENUM.StringRange,
    property: 'characteristics.color'
  },
  clarity: {
    type: FILTER_PROPS_TYPES_ENUM.StringRange,
    property: 'characteristics.clarity'
  },
  symmetry: {
    type: FILTER_PROPS_TYPES_ENUM.StringRange,
    property: 'characteristics.symmetry'
  },
  cutGrade: {
    type: FILTER_PROPS_TYPES_ENUM.StringRange,
    property: 'characteristics.cutGrade'
  },
  polish: {
    type: FILTER_PROPS_TYPES_ENUM.StringRange,
    property: 'characteristics.polish'
  },
  fluorescence: {
    type: FILTER_PROPS_TYPES_ENUM.StringRange,
    property: 'characteristics.fluorescence'
  },
  certLaboratory: {
    type: FILTER_PROPS_TYPES_ENUM.StringRange,
    property: 'certLaboratory'
  },
  tablePercentage: {
    type: FILTER_PROPS_TYPES_ENUM.PercentageRange,
    property: 'dimensions.tablePercentage'
  },
  depthPercentage: {
    type: FILTER_PROPS_TYPES_ENUM.PercentageRange,
    property: 'dimensions.depthPercentage'
  },
  lengthWidthRatio: {
    type: FILTER_PROPS_TYPES_ENUM.PercentageRange,
    property: 'dimensions.lengthWidthRatio'
  }
};
