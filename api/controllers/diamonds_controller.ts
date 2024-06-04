import { Response, Request } from 'express';
import DiamondService from '../services/diamond_service';
import multer from 'multer';
import { GetDiamondsRequestQuery } from 'types/diamond_types';

const getDiamonds = async (req: Request<{}, {}, {}, GetDiamondsRequestQuery>, res: Response) => {
  const {
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
  } = req.query;
  const { code, response } = await DiamondService.getDiamonds({
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

  return res.status(code).json(response);
};

const getDiamond = async (req: Request, res: Response) => {
  const { diamondId } = req.query;
  const { code, response } = await DiamondService.getDiamond({ diamondId: diamondId as string });

  return res.status(code).json(response);
};

const searchDiamond = async (req: Request, res: Response) => {
  const { reportNumber } = req.query;
  const { code, response } = await DiamondService.getDiamond({ reportNumber: reportNumber as string });

  return res.status(code).json(response);
};

const fetchDiamonds = async (req: Request, res: Response) => {
  if (req.headers?.fetch_diamonds !== process.env.FETCH_DIAMONDS_SECRET_KEY) {
    return res.status(403).json({ error: 1, data: { message: 'Insufficient permissions' } });
  }

  const { code, response } = await DiamondService.fetchDiamonds(req?.file);

  return res.status(code).json(response);
};

const getTotalDiamondsCount = async (req: Request, res: Response) => {
  const { code, response } = await DiamondService.getTotalDiamondsCount();

  return res.status(code).json(response);
};

const upload = multer({ storage: multer.memoryStorage() });

export { getDiamonds, getDiamond, fetchDiamonds, searchDiamond, upload, getTotalDiamondsCount };
