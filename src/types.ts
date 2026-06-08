export const currencies = ['USD', 'TRY'] as const;
export type Currency = typeof currencies[number];

export function isCurrency(value: unknown): value is Currency {
  return typeof value === 'string' && (currencies as readonly string[]).includes(value);
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
  walletConnectProjectId: string;
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
  paymentRequestId: string;
  qrData: string;
  assetAmount: string; // decimal string for crypto precision, e.g. "0.02397188"
  additionalCustomerFee: number;
  address: string;
  status: number;
  requiredFields: string[];
  supportedDocumentTypes: string[];
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
  documentType: string | undefined;
  documentFiles: File[];
}

export type CreatePaymentRequest = {
  asset: string;
  network: string;
};

export type CancelTransactionRequest = {
  reason: string;
  forfeit?: boolean;
};

export type Amounts = {
  currency: string;
  fxRateToUSD: number;
  totalLocal: number;
  totalUSD: number;
  customerFeeUSD: number;
  receivedUSD: number;
};

// A single deposit attempt. `status` is a PaymentRequestStatus
// (-1 expired / 0 pending / 1 confirmed).
export type PaymentRequest = {
  paymentRequestID: string;
  transactionID: string;
  cryptoAsset: string;
  cryptoNetwork: string;
  cryptoRatePerUSD: number;
  expectedUSD: number;
  expectedCrypto: number;
  address: string;
  qrData: string;
  walletName: string;
  expiration: string;
  status: number;
  receivedCrypto: number;
  receivedUSD: number;
  txnHash: string;
  fromAddress: string;
  confirmationCount: number;
  completedAt: string;
  gasFee: number;
  gasFeeUnits: string;
};

// GET /transaction/{id}: the transaction (top-level fields) + derived remaining
// balances + joined payment requests. `status` = transaction status;
// `paymentStatus` = PaymentStatus (0 unpaid / 1 partial / 2 paid / 3 overpaid).
export type GetTransactionResponse = {
  transactionID: string;
  merchantID: string;
  accountID: string;
  referenceNumber: string;
  descriptor: string;
  status: number;
  paymentStatus: number;
  expiration: string;
  cancellationReason?: string;
  amounts: Amounts;
  remainingUSD: number;
  remainingLocal: number;
  payments: PaymentRequest[];
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
  allowedAssets: Asset[];
  cancelTransactionEnabled: boolean;
  support: Support;
}
