import { app, request, expect, getHeaders } from '../initializer';
const validationError = 'must be a valid string';

describe('POST /contact', async () => {
  it('Create contact us successfully', async () => {
    const headers = await getHeaders();

    const params = {
      name: 'Margo',
      email: 'test@gmail.com',
      phoneNumber: '+370 649 88 450',
      message: 'Description'
    };

    const res = await request(app).post('/contact').set(headers).send(params);

    const { error, data } = res.body;
    expect(error).eq(0);

    const { contactId } = data;
    expect(typeof contactId).eq('string');
  });

  it('Create with empty params', async () => {
    const headers = await getHeaders();

    const res = await request(app).post('/contact').set(headers);

    const { error, data } = res.body;
    expect(error).eq(1);
    expect(res.statusCode).eq(400);

    data.forEach(({ path, msg }: { path: string; msg: string }) => {
      expect(msg).eq(`${path} ${validationError}`);
    });
  });

  it('Create with wrong params', async () => {
    const headers = await getHeaders();

    const params = {
      name: 123,
      email: true,
      phoneNumber: [1, 3, 5],
      message: null
    };

    const res = await request(app).post('/contact').set(headers).send(params);

    const { error, data } = res.body;

    expect(error).eq(1);
    expect(res.statusCode).eq(400);

    data.forEach(({ path, msg }: { path: string; msg: string }) => {
      expect(msg).eq(`${path} ${validationError}`);
    });
  });
});
