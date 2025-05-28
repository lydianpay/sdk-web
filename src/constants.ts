import { QRCodeToDataURLOptions } from 'qrcode';

export const QRCodeDefaults: QRCodeToDataURLOptions = {
  width: 200,
  color: {
    dark: '#000000',
    light: '#ffffff',
  },
  errorCorrectionLevel: 'H',
};

export const CryptoTransactionStatusPending = 0;
export const CryptoTransactionStatusSuccess = 1;

// export const BaseUrlSandbox = 'https://fence.dev.tetherpayments.group';
export const BaseUrlSandbox = 'http://localhost:8004';
export const BaseUrlProduction = 'https://fence.tetherpayments.group';

export const CryptoPaymentChainEthereum = 'ethereum';
export const CryptoPaymentChainTron = 'tron';
export const CryptoPaymentChainSolana = 'solana';
export const CryptoPaymentChainTon = 'ton';
export const CryptoPaymentChainAvalanche = 'avalanche';
export const CryptoPaymentChainAptos = 'aptos';

export const AllowedAssetBitcoin = 'BTC';
export const AllowedAssetEthereum = 'ETH';
export const AllowedAssetUSDT = 'USDT';
export const AllowedAssetUSDC = 'USDC';
