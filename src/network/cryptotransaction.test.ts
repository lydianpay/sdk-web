import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CryptoTransactions } from './cryptotransaction';

const BASE = 'https://api.lydian.dev';
const PK = 'pk_test_123';

function lastCall(): [string, RequestInit] {
  const mock = global.fetch as unknown as ReturnType<typeof vi.fn>;
  return mock.mock.calls[mock.mock.calls.length - 1] as [string, RequestInit];
}

describe('CryptoTransactions client', () => {
  let api: CryptoTransactions;

  beforeEach(() => {
    global.fetch = vi.fn(async () => new Response('{}', { status: 200 })) as never;
    api = new CryptoTransactions(BASE, PK);
  });

  it('createCryptoTransaction POSTs /transaction with the publishable-key header', async () => {
    await api.createCryptoTransaction({
      amount: '10', amountCurrency: 'USD', asset: 'USDT', network: 'ETH',
    } as never);
    const [url, cfg] = lastCall();
    expect(url).toBe(`${BASE}/transaction`);
    expect(cfg.method).toBe('POST');
    expect((cfg.headers as Record<string, string>)['X-Publishable-Key']).toBe(PK);
  });

  it('getCryptoTransaction GETs /transaction/{id}', async () => {
    await api.getCryptoTransaction('abc');
    const [url, cfg] = lastCall();
    expect(url).toBe(`${BASE}/transaction/abc`);
    expect(cfg.method).toBeUndefined(); // default GET
  });

  it('collect and cancel hit the right sub-routes and methods', async () => {
    await api.collectCryptoTransaction('abc', { asset: 'USDT', network: 'ETH' } as never);
    expect(lastCall()[0]).toBe(`${BASE}/transaction/abc/collect`);
    expect(lastCall()[1].method).toBe('POST');

    await api.cancelCryptoTransaction('abc', { reason: 'x' } as never);
    expect(lastCall()[0]).toBe(`${BASE}/transaction/abc/cancel`);
    expect(lastCall()[1].method).toBe('PATCH');
  });

  it('kycVerification sends documentFiles as an array of files (matches swagger)', async () => {
    const front = new File(['front'], 'front.png', { type: 'image/png' });
    const back = new File(['back'], 'back.png', { type: 'image/png' });
    await api.kycVerification('abc', {
      asset: 'USDT', network: 'ETH', firstName: 'A', lastName: 'B', email: 'a@b.com',
      street: 's', city: 'c', region: 'r', postalCode: 'p', country: 'US',
      documentType: 'ID_CARD', documentFiles: [front, back],
    });
    const [url, cfg] = lastCall();
    expect(url).toBe(`${BASE}/transaction/abc/verification`);
    const body = cfg.body as FormData;
    expect(body.getAll('documentFiles')).toHaveLength(2);
    expect(body.get('firstName')).toBe('A');
    // multipart upload must NOT set a JSON content-type (browser sets the boundary)
    expect((cfg.headers as Record<string, string>)['Content-Type']).toBeUndefined();
  });
});
