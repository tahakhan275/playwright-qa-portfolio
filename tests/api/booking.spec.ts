import { test, expect, APIRequestContext } from '@playwright/test';

/**
 * REST API tests for Restful Booker (public practice API).
 * Covers auth, full CRUD, schema-style checks and negative cases.
 * Runs serially because later steps use the booking created earlier.
 */
test.describe.configure({ mode: 'serial' });

const newBooking = {
  firstname: 'Taha',
  lastname: 'Khan',
  totalprice: 150,
  depositpaid: true,
  bookingdates: { checkin: '2027-01-10', checkout: '2027-01-15' },
  additionalneeds: 'Breakfast',
};

let token: string;
let bookingId: number;

async function getToken(request: APIRequestContext): Promise<string> {
  const res = await request.post('/auth', { data: { username: 'admin', password: 'password123' } });
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.token, 'auth should return a token').toBeTruthy();
  return body.token;
}

test('health check responds', async ({ request }) => {
  const res = await request.get('/ping');
  expect(res.status()).toBe(201);
});

test('auth returns a token for valid credentials', async ({ request }) => {
  token = await getToken(request);
});

test('auth rejects invalid credentials', async ({ request }) => {
  const res = await request.post('/auth', { data: { username: 'admin', password: 'wrong' } });
  const body = await res.json();
  expect(body.reason).toBe('Bad credentials');
});

test('create booking', async ({ request }) => {
  const res = await request.post('/booking', { data: newBooking });
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(typeof body.bookingid).toBe('number');
  expect(body.booking).toMatchObject(newBooking);
  bookingId = body.bookingid;
});

test('read booking returns the same data', async ({ request }) => {
  const res = await request.get(`/booking/${bookingId}`);
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('application/json');
  expect(await res.json()).toMatchObject(newBooking);
});

test('update booking requires auth', async ({ request }) => {
  const res = await request.put(`/booking/${bookingId}`, { data: { ...newBooking, totalprice: 200 } });
  expect(res.status()).toBe(403);
});

test('update booking with token', async ({ request }) => {
  const res = await request.put(`/booking/${bookingId}`, {
    data: { ...newBooking, totalprice: 200 },
    headers: { Cookie: `token=${token}` },
  });
  expect(res.status()).toBe(200);
  expect((await res.json()).totalprice).toBe(200);
});

test('partial update (PATCH)', async ({ request }) => {
  const res = await request.patch(`/booking/${bookingId}`, {
    data: { additionalneeds: 'Late checkout' },
    headers: { Cookie: `token=${token}` },
  });
  expect(res.status()).toBe(200);
  expect((await res.json()).additionalneeds).toBe('Late checkout');
});

test('search by name finds the booking', async ({ request }) => {
  const res = await request.get('/booking', { params: { firstname: 'Taha', lastname: 'Khan' } });
  expect(res.status()).toBe(200);
  const ids = (await res.json()).map((b: { bookingid: number }) => b.bookingid);
  expect(ids).toContain(bookingId);
});

test('delete booking and confirm it is gone', async ({ request }) => {
  const del = await request.delete(`/booking/${bookingId}`, { headers: { Cookie: `token=${token}` } });
  expect(del.status()).toBe(201);
  const get = await request.get(`/booking/${bookingId}`);
  expect(get.status()).toBe(404);
});
