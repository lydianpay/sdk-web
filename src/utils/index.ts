import { Address } from 'viem';

interface CurrencyConfig {
  locale: string;
  currency: string;
  symbol: string;
}

const CURRENCY_CONFIGS: Record<string, CurrencyConfig> = {
  USD: {
    locale: 'en-US',
    currency: 'USD',
    symbol: '$',
  },
  TRY: {
    locale: 'tr-TR',
    currency: 'TRY',
    symbol: 'TRY',
  },
};

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

/**
 * Formats a number as currency using Intl.NumberFormat
 * @param amount - The numeric amount to format
 * @param currency - The currency code (USD or TRY)
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  currency?: string | null,
): string {
  if (!currency) {
    return amount.toString();
  }

  const config = CURRENCY_CONFIGS[currency];

  if (!config) {
    throw new Error(
      `Unsupported currency: ${currency}. Supported currencies: ${Object.keys(CURRENCY_CONFIGS).join(', ')}`,
    );
  }

  return config.symbol + new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.currency,
  }).format(amount);
}

export function formatDateForTransactionDetails(isoDateString: string): string {
  // Create a new Date object from the ISO string
  const date = new Date(isoDateString);

  // Create a formatter for US English locale
  const formatter = new Intl.DateTimeFormat('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: '2-digit',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true, // Use 12-hour clock with 'am'/'pm'
  });

  // Format the date
  return formatter.format(date);
}

export function formatToTwoDecimals(num: number): string {
  return formatToNDecimals(num, 2);
}

export function formatToNDecimals(num: number, precision: number): string {
  return num.toFixed(precision);
}