import { FileType } from 'types/global';
import { DEFAULT_LIMIT, FETCHED_DIAMOND_PROPERTIES, FILTER_PROPS_CONFIG } from '../constants';
import {
  FetchedDiamondType,
  FormattedFilterPropsType,
  GetDiamondType,
  GetDiamondsInterface
} from 'types/diamond_types';
import xlsx from 'xlsx';
import { Diamond, Photo, Price } from '../models';
import { IDiamond } from 'models/diamonds';
import { IPrice } from 'models/prices';
import { formatFiterProps } from '../helpers/diamond_helper';
import { IPhoto } from 'models/photos';

const DiamondService = {
  getDiamonds: async ({
    limit,
    lastRecordId,
    type,
    shape,
    price,
    carat,
    color,
    clarity,
    symmetry,
    polish,
    fluorescence,
    tablePercentage,
    depthPercentage,
    lengthWidthRatio,
    certLaboratory,
    count,
    cutGrade
  }: GetDiamondsInterface) => {
    return await getDiamonds({
      limit,
      lastRecordId,
      type,
      shape,
      price,
      carat,
      color,
      clarity,
      symmetry,
      polish,
      fluorescence,
      tablePercentage,
      depthPercentage,
      lengthWidthRatio,
      certLaboratory,
      count,
      cutGrade
    });
  },

  getDiamond: async ({ diamondId, reportNumber }: GetDiamondType) => {
    return await getDiamond({ diamondId, reportNumber });
  },

  fetchDiamonds: async (file?: FileType) => {
    return await fetchDiamonds(file);
  },

  getTotalDiamondsCount: async () => {
    return await getTotalDiamondsCount();
  }
};

export default DiamondService;

const getDiamonds = async ({
  limit,
  lastRecordId,
  type,
  shape,
  price,
  carat,
  color,
  clarity,
  symmetry,
  polish,
  fluorescence,
  tablePercentage,
  depthPercentage,
  lengthWidthRatio,
  certLaboratory,
  count,
  cutGrade
}: GetDiamondsInterface) => {
  let diamonds: IDiamond[] = [];
  let totalAmount: { count: number } | null = null;

  try {
    const { limit: limitNumber = DEFAULT_LIMIT, $match }: FormattedFilterPropsType = Object.entries({
      limit,
      lastRecordId,
      type,
      shape,
      price,
      carat,
      color,
      clarity,
      symmetry,
      polish,
      fluorescence,
      tablePercentage,
      depthPercentage,
      lengthWidthRatio,
      certLaboratory,
      cutGrade
    })
      .filter(([_, value]): string | number | undefined => value)
      .reduce(
        (acc, [key, value]) => {
          const propertyConfig = FILTER_PROPS_CONFIG[key];
          if (!propertyConfig) {
            return acc;
          }
          const formattedValue = formatFiterProps(propertyConfig, value);
          const matchProperties = { ...acc.$match, [propertyConfig.property]: formattedValue };
          return {
            ...acc,
            [key]: formattedValue,
            ...(propertyConfig.property && { $match: matchProperties })
          };
        },
        { $match: {} }
      );

    const priceFilters = $match?.price;
    const foundedDiamonds = await Diamond.find({ ...$match, isDeleted: false }).sort({ _id: -1, createdAt: -1 });

    const diamondsWithPrices = await Promise.all(
      foundedDiamonds.map(async (diamond) => {
        const toFind = { diamondId: diamond?._id, ...(priceFilters && { price: priceFilters }) };
        const prices = await Price.find(toFind).sort({ date: -1 }).limit(1);
        return { ...diamond.toObject(), prices };
      })
    );

    const allDiamonds = diamondsWithPrices.filter(({ prices }) => (priceFilters && !prices.length ? false : true));
    diamonds = allDiamonds.slice(0, limitNumber);

    if (count) {
      totalAmount = { count: allDiamonds.length };
    }
  } catch (err) {
    console.log(err);
    const response = { error: 1, data: { message: 'Internal server error' } };
    return { code: 500, response };
  }

  const response = {
    error: 0,
    data: diamonds.map((diamond) => mapDiamondObjectToResponseObject(diamond)),
    ...(count && { totalAmount })
  };

  return { code: 200, response };
};

const getDiamond = async ({ diamondId, reportNumber }: GetDiamondType) => {
  let diamond = null;
  let prices = null;
  let photo = null;

  try {
    const searchParams = diamondId ? { _id: diamondId } : { reportNumber: { $regex: reportNumber } };
    diamond = await Diamond.findOne({ ...searchParams, isDeleted: false });
    prices = await Price.find({ diamondId: diamond?._id }).sort({ date: -1 });
    photo = await Photo.findOne({ diamondId: diamond?._id });
  } catch (err) {
    console.log(err);
    const response = { error: 1, data: { message: 'Internal server error' } };
    return { code: 500, response };
  }

  if (!diamond) {
    const response = {
      error: 0,
      data: diamond
    };
    return { code: 200, response };
  }

  const finalDiamond = {
    ...diamond.toObject(),
    prices,
    photo
  };

  const response = {
    error: 0,
    data: mapDiamondObjectToResponseObject(finalDiamond)
  };
  return { code: 200, response };
};

const fetchDiamonds = async (file?: FileType) => {
  if (!file) {
    const response = { error: 1, data: { message: 'No file uploaded' } };
    return { code: 400, response };
  }

  try {
    const workbook = xlsx.read(file?.buffer, { type: 'buffer' });
    const sheetNameList = workbook.SheetNames;

    await Promise.all(
      sheetNameList.map(async (sheetName) => {
        const diamonds: FetchedDiamondType[] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
        if (diamonds.length > 0) {
          await addDiamondsToDb(diamonds);
        }
      })
    );
  } catch (err) {
    console.log(err);
    const response = { error: 1, data: { message: 'Internal server error' } };
    return { code: 500, response };
  }

  const response = { error: 0, data: { message: 'The data has been saved to database successfully' } };
  return { code: 200, response };
};

const addDiamondsToDb = async (diamonds: FetchedDiamondType[]) => {
  try {
    await Promise.all(
      diamonds.map(async (diamond) => {
        const filteredDiamond = Object.entries(diamond)
          .filter(
            ([_, value]) =>
              value && (typeof value === 'string' ? !['-', 'none', 'n/a'].includes(value.toLowerCase()) : true)
          )
          .reduce(
            (acc: { [key: string]: any }, [key, value]) => {
              const diamondProp = FETCHED_DIAMOND_PROPERTIES[key];
              const editedProp = {
                [diamondProp.key]: diamondProp.editedValue ? diamondProp.editedValue(value) : value
              };

              return {
                ...acc,
                ...(diamondProp?.section
                  ? { [diamondProp?.section]: { ...acc[diamondProp?.section], ...editedProp } }
                  : editedProp)
              };
            },
            { dimensions: {}, characteristics: {}, price: {} }
          );

        const createdDiamond = await Diamond.create(filteredDiamond);

        let createdPrice = null;
        if (filteredDiamond?.price) {
          createdPrice = await Price.create({ diamondId: createdDiamond._id, ...filteredDiamond?.price });
        }

        if (process.env.NODE_ENV !== 'test') {
          console.log('New diamond is added ', createdDiamond);
          console.log('New price is added ', createdPrice);
        }
      })
    );
  } catch (err) {
    console.log(err);
    throw new Error();
  }
};

const getTotalDiamondsCount = async () => {
  let totalDiamondsCount = 0;
  try {
    totalDiamondsCount = await Diamond.find({}).countDocuments();
  } catch (err) {
    console.log(err);
    const response = { error: 1, data: { message: 'Internal server error' } };
    return { code: 500, response };
  }

  const response = { error: 0, data: { totalDiamondsCount } };
  return { code: 200, response };
};

const mapDiamondObjectToResponseObject = ({
  _id,
  certificateId,
  diamondURL,
  certLaboratory,
  certificateDate,
  type,
  imageURL,
  affiliateLink,
  reportNumber,
  inscription,
  comments,
  isDeleted,
  createdAt,
  updatedAt,
  dimensions,
  characteristics,
  prices,
  seller,
  photo
}: IDiamond & { prices?: IPrice[]; photo?: IPhoto | null }) => ({
  _id,
  certificateId,
  diamondURL,
  certLaboratory,
  certificateDate,
  type,
  imageURL,
  affiliateLink,
  reportNumber,
  inscription,
  comments,
  isDeleted,
  dimensions,
  characteristics,
  prices,
  ...((prices ?? []).length > 0 && { priceProperties: (prices ?? [])[0] }),
  createdAt,
  updatedAt,
  seller,
  photos: photo?.photos
});
