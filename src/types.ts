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

export type TetherPayOptions = {
    enableTetherPayAppPayment: boolean;
    baseUri: string;
    publishableKey: string;
    initialTransaction: Transaction;
    paymentFailedListener: (failureMessage: string) => void;
    paymentSuccessListener: () => void;
};

export type CreateWalletTransactionRequest = {
    publishableKey: string;
    descriptor?: string;
    referenceNumber?: string;
    amount: number;
    currency: string;
    chain: string;
};

export type CreateWalletTransactionResponse = {
    txnID: string;
    qrData: string;
    usdtAmount: number;
};

export type GetWalletTransactionResponse = {
    expiration: string;
    status: number;
}