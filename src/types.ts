export const currencies = ['USD', 'TRY'] as const;
export type Currency = typeof currencies[number];

export function isCurrency(value: any): value is Currency {
  return currencies.includes(value);
}

export type Transaction = {
  amount: number;
  currency: Currency;
  descriptor?: string;
  referenceNumber?: string;
}

export type InitOptions = {
  sandbox: boolean;
  publishableKey: string;
  transaction: Transaction;
  paymentFailedListener: (failureMessage: string) => void;
  paymentSuccessListener: () => void;
};

export type CreateTransactionRequest = {
  descriptor?: string;
  referenceNumber?: string;
  amount: number;
  amountCurrency: string;
  asset: string;
  network: string;
};

export type CreateTransactionResponse = {
  transactionId: string;
  qrData: string;
  assetAmount: number;
};

export type GetTransactionResponse = {
  expiration: string;
  status: number;
}

export type Asset = {
  code: string;
  type: string;
  title: string;
  img: string;
  networks: string[];
}

export type Network = {
  code: string;
  name: string;
  img: string;
}

export type WalletConnectWallet = {
  id: string;
  name: string;
  img: string;
}

export type GetSDKConfigResponse = {
  appPayEnabled: boolean;
  cryptoPayEnabled: boolean;
  tetherPayCluster: string;
  allowedAssets: Asset[];
}
