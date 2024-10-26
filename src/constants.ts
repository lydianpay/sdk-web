import { QRCodeToDataURLOptions } from 'qrcode';

export const pollingIntervalInMilliseconds = 5000;

export const TransactionResponseStatus = {
    CONFIRMED: 'CONFIRMED',
    REJECTED: 'REJECTED',
}

export const QRCodeTextProtocol = 'tpg://';

export const QRCodeDefaults: QRCodeToDataURLOptions = {
  width: 250,
  color: {
    dark: '#009393',
    light: '#ffffff',
  },
  errorCorrectionLevel: 'H',
};
