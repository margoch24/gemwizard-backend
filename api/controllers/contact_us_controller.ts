import { Response, Request } from 'express';
import ContactUsService from '../services/contact_us_services';

const postContactUs = async (req: Request, res: Response) => {
  const { name, email, phoneNumber, message } = req.body;
  const { code, response } = await ContactUsService.postContactUs({ name, email, phoneNumber, message });

  return res.status(code).json(response);
};

export { postContactUs };
