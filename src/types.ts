export const currencies = ['USD', 'TRY'] as const;
export type Currency = typeof currencies[number];

export function isCurrency(value: any): value is Currency {
  return currencies.includes(value);
}

export type CryptoTransaction = {
  amount: number;
  currency: Currency;
  descriptor?: string;
  referenceNumber?: string;
}

export type TetherPayOptions = {
  sandbox: boolean;
  publishableKey: string;
  initialTransaction: CryptoTransaction;
  paymentFailedListener: (failureMessage: string) => void;
  paymentSuccessListener: () => void;
};

export type CreateCryptoTransactionRequest = {
  descriptor?: string;
  referenceNumber?: string;
  amount: number;
  currency: string;
};

export type CreateCryptoTransactionResponse = {
  transactionId: string;
  chains: string[];
};

export type UpdateCryptoTransactionRequest = {
  chain: string;
};

export type UpdateCryptoTransactionResponse = {
  qrData: string;
  usdtAmount: number;
}

export type GetCryptoTransactionResponse = {
  expiration: string;
  status: number;
}

export type GetSDKConfigResponse = {
  tetherPayEnabled: boolean;
  cryptoPayEnabled: boolean;
  tetherPayCluster: string;
}