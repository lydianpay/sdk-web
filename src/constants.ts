import {QRCodeToDataURLOptions} from 'qrcode';

export const QRCodeDefaults: QRCodeToDataURLOptions = {
    width: 200,
    color: {
        dark: '#000000',
        light: '#ffffff',
    },
    errorCorrectionLevel: 'H',
};

export const WalletTransactionStatusPending = 0;
export const WalletTransactionStatusSuccess = 1;