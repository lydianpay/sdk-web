import { describe, it, expect } from 'vitest';
import { BaseUrlDev, BaseUrlSandbox, BaseUrlProduction } from './constants';

describe('base URLs point at the gateway, not fence', () => {
  it('uses api.lydian.* hosts', () => {
    expect(BaseUrlDev).toBe('https://api.lydian.dev');
    expect(BaseUrlSandbox).toBe('https://api.sandbox.lydian.com');
    expect(BaseUrlProduction).toBe('https://api.lydian.com');
  });

  it('contains no legacy gateway.lydian (fence) host', () => {
    for (const url of [BaseUrlDev, BaseUrlSandbox, BaseUrlProduction]) {
      expect(url).not.toContain('gateway.lydian');
    }
  });
});
