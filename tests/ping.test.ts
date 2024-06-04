import { app, request, expect } from './initializer';

describe('GET /ping', async () => {
  it('Gets a ping', async () => {
    const resp = await request(app).get('/ping');
    expect(resp.body).to.eq('pong');
  });
});
