export const currencies = ['USD', 'TRY'] as const;
export type Currency = typeof currencies[number];

export function isCurrency(value: any): value is Currency {
  return currencies.includes(value);
}

export type Transaction = {
  amount: number;
  currency: Currency;
  descriptor?: string;
  referenceNumber: string;
}

export type InitOptions = {
  dev: boolean;
  sandbox: boolean;
  publishableKey: string;
  transaction: Transaction;
  paymentFailedListener: (failureMessage: string) => void;
  paymentSuccessListener: () => void;
  paymentCanceledListener: () => void;
  isEmbedded?: boolean;
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
  additionalCustomerFee: number;
  address: string;
  status: number;
  requiredFields: string[];
  supportedDocumentsTypes: string[];
};

export type KYCVerificationRequest = {
  asset: string;
  network: string;
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  documentType: string;
  documentFiles: File[];
}

export type CollectTransactionRequest = {
  asset: string;
  network: string;
};

export type CancelTransactionRequest = {
  reason: string;
};

export type GetTransactionResponse = {
  expiration: string;
  status: number;
  transactionID: string;
  amount: number;
  amountCurrency: string;
  remainingBalance: number;
  cryptoTransactions: Record<string, CryptoTransaction>;
}

// TODO: If total gas fee is later added into the transaction modal,
// TODO: we don't need to calculate gasFees from the cryptoTransactions.
export type CryptoTransaction = {
  amount: number;
  gasFee: number;
  cryptoAsset: string;
  cryptoNetwork: string;
  createdAt: string;
  status: number;
  expiration: string;
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
  wcPeerName?: string;
}

export type Support = {
  email: string;
  link: string;
}

export type GetSDKConfigResponse = {
  appPayEnabled: boolean;
  cryptoPayEnabled: boolean;
  lydianPayCluster: string;
  allowedAssets: Asset[];
  walletConnectEnabled: boolean;
  cancelTransactionEnabled: boolean;
  support: Support;
}
