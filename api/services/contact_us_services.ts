import { ContactUs } from '../models';
import { IContactUs } from 'models/contact_us';
import { PostContactUsType } from 'types/contact_us_types';

const ContactUsService = {
  postContactUs: async ({ name, email, phoneNumber, message }: PostContactUsType) => {
    return await postContactUs({ name, email, phoneNumber, message });
  }
};

export default ContactUsService;

const postContactUs = async ({ name, email, phoneNumber, message }: PostContactUsType) => {
  let newContact: IContactUs | null = null;
  try {
    const contactParams = {
      name,
      email,
      phoneNumber,
      message
    };

    newContact = await ContactUs.create(contactParams);
  } catch (err) {
    console.log(err);
  }

  if (!newContact) {
    const response = { error: 1, data: { message: 'Internal server error' } };
    return { code: 500, response };
  }

  const response = { error: 0, data: { contactId: newContact._id } };
  return { code: 200, response };
};
