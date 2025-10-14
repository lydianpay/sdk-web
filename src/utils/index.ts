import { Address } from 'viem';

export type QrCodeParams = {
  address: Address;
  uint256: string;
  amount: string;
}

export function parseQrCodeData(uri: string) {
  return uri.split('?')
    .pop()
    ?.split('&')
    .reduce<Record<string, string>>((col, str) => {
      const [key, val] = str.split('=');
      col[key] = val;
      return col;
    }, {}) as QrCodeParams;
}

export function capitalizeFirstLetter(str: string): string {
  if (str.length === 0) {
    return str; // Handle empty strings or non-string inputs
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}