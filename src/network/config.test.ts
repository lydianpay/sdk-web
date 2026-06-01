import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Config } from './config';

const BASE = 'https://api.lydian.dev';
const PK = 'pk_test_123';

function lastCall(): [string, RequestInit] {
  const mock = global.fetch as unknown as ReturnType<typeof vi.fn>;
  return mock.mock.calls[mock.mock.calls.length - 1] as [string, RequestInit];
}

describe('Config client', () => {
  let api: Config;

  beforeEach(() => {
    global.fetch = vi.fn(async () => new Response('{}', { status: 200 })) as never;
    api = new Config(BASE, PK);
  });

  it('getSDKConfig GETs /merchant/config with the publishable-key header', async () => {
    await api.getSDKConfig();
    const [url, cfg] = lastCall();
    expect(url).toBe(`${BASE}/merchant/config`);
    expect(cfg.method).toBeUndefined(); // default GET
    expect((cfg.headers as Record<string, string>)['X-Publishable-Key']).toBe(PK);
  });
});
