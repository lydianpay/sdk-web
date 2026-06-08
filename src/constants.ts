import { Asset } from './types';


export const CryptoTransactionStatusPending = 0;
export const CryptoTransactionStatusSuccess = 1;
export const CryptoTransactionStatusPendingKYCVerification = -3;

// Transaction (order) status — negative values are terminal (cancelled/fraud/timeout)
export const TransactionStatusPending = 0;
export const TransactionStatusSuccess = 1;

// PaymentStatus — collection progress
export const PaymentStatusUnpaid = 0;
export const PaymentStatusPartiallyPaid = 1;
export const PaymentStatusPaid = 2;
export const PaymentStatusOverpaid = 3;

// PaymentRequestStatus — per deposit attempt
export const PaymentRequestStatusExpired = -1;
export const PaymentRequestStatusPending = 0;
export const PaymentRequestStatusConfirmed = 1;

export const BaseUrlDev = 'https://api.lydian.dev';
export const BaseUrlSandbox = 'https://api.sandbox.lydian.com';
export const BaseUrlProduction = 'https://api.lydian.com';


export const AllowedAssetArbitrum = 'ARB';
export const AllowedAssetBase = 'BASE';
export const AllowedAssetBitcoin = 'BTC';
export const AllowedAssetCelo = 'CELO';
export const AllowedAssetDai = 'DAI';
export const AllowedAssetEthereum = 'ETH';
export const AllowedAssetLinea = 'LINEA';
export const AllowedAssetOPMainnet = 'OPMAINNET';
export const AllowedAssetPolygon = 'POLY';
export const AllowedAssetPYUSD = 'PYUSD';
export const AllowedAssetRLUSD = 'RLUSD';
export const AllowedAssetSolana = 'SOL';
export const AllowedAssetSonic = 'SONIC';
export const AllowedAssetUnichain = 'UNICHAIN';
export const AllowedAssetUSDC = 'USDC';
export const AllowedAssetUSDe = 'USDe';
export const AllowedAssetUSDP = 'USDP';
export const AllowedAssetUSDS = 'USDS';
export const AllowedAssetUSDT = 'USDT';
export const AllowedAssetZKsync = 'ZKSYNC';

export const AssetUSDT: Asset = {
  'code': 'USDT',
  'title': 'USDT (Tether)',
  'img': 'https://tetherpay.com/images/7065960c-8ebd-4d80-f352-8027ff2bb600/public',
  'type': 'token',
  'networks': [],
};

export const AssetUSDC: Asset = {
  'code': 'USDC',
  'title': 'USDC',
  'img': 'https://tetherpay.com/images/1a664446-0855-4d6d-256e-ad886acba300/public',
  'type': 'token',
  'networks': [],
};

export const AssetEthereum: Asset = {
  'code': 'ETH',
  'title': 'Ethereum',
  'img': 'https://tetherpay.com/images/327ef8ac-bc72-46ea-2362-878e91c49300/public',
  'type': 'coin',
  'networks': [],
};

export const AssetSolana: Asset = {
  'code': 'SOL',
  'title': 'Solana',
  'img': 'https://tetherpay.com/images/5850fc57-4451-4f45-b053-3857b1d54e00/public',
  'type': 'coin',
  'networks': [],
};

export const AssetBitcoin: Asset = {
  'code': 'BTC',
  'title': 'Bitcoin',
  'img': 'https://tetherpay.com/images/7f89f493-190a-41da-2410-a19b46a68900/public',
  'type': 'coin',
  'networks': [],
};

export const AssetArbitrum: Asset = {
  'code': 'ARB',
  'title': 'Arbitrum',
  'img': 'https://imagedelivery.net/PC9Gitw-w-Qpo5uwdjlmgw/64d896c2-6ac6-4837-e6bf-e05c53a5f500/public',
  'type': 'coin',
  'networks': [],
};

export const AssetBase: Asset = {
  'code': 'BASE',
  'title': 'Base',
  'img': 'https://imagedelivery.net/PC9Gitw-w-Qpo5uwdjlmgw/3fc7c8ef-6863-43e6-967d-de68e14d4600/public',
  'type': 'coin',
  'networks': [],
};

export const AssetCelo: Asset = {
  'code': 'CELO',
  'title': 'Celo ',
  'img': 'https://imagedelivery.net/PC9Gitw-w-Qpo5uwdjlmgw/7373a7f6-b5dd-4d16-0b98-cbaf9e666300/public',
  'type': 'coin',
  'networks': [],
};

export const AssetLinea: Asset = {
  'code': 'linea',
  'title': 'Linea',
  'img': 'https://imagedelivery.net/PC9Gitw-w-Qpo5uwdjlmgw/410a3ea8-d59b-4e88-1c1a-ffa77c157600/public',
  'type': 'coin',
  'networks': [],
};

export const AssetOPMainnet: Asset = {
  'code': 'opmainnet',
  'title': 'OP Mainnet',
  'img': 'https://imagedelivery.net/PC9Gitw-w-Qpo5uwdjlmgw/cd28b090-e932-478e-2a40-7b7d61672d00/public',
  'type': 'coin',
  'networks': [],
};

export const AssetPolygon: Asset = {
  'code': 'polygon',
  'title': 'Polygon',
  'img': 'https://imagedelivery.net/PC9Gitw-w-Qpo5uwdjlmgw/386bebc7-3782-4358-978d-ae2b2d4fbf00/public',
  'type': 'coin',
  'networks': [],
};

export const AssetSonic: Asset = {
  'code': 'sonic',
  'title': 'Sonic',
  'img': 'https://imagedelivery.net/PC9Gitw-w-Qpo5uwdjlmgw/e9eaf9b0-3093-4239-d20b-a0c5934ec200/public',
  'type': 'coin',
  'networks': [],
};

export const AssetUnichain: Asset = {
  'code': 'unichain',
  'title': 'Unichain',
  'img': 'https://imagedelivery.net/PC9Gitw-w-Qpo5uwdjlmgw/f4c4d2e6-d9a4-4910-febc-ed6de61bd400/public',
  'type': 'coin',
  'networks': [],
};

export const AssetZKsync: Asset = {
  'code': 'zksync',
  'title': 'ZKsync',
  'img': 'https://imagedelivery.net/PC9Gitw-w-Qpo5uwdjlmgw/540fbd94-e1d0-4dda-c6d1-426181f37e00/public',
  'type': 'coin',
  'networks': [],
};

export const AssetRLUSD: Asset = {
  'code': 'RLUSD',
  'title': 'RLUSD (Ripple USD)',
  'img': 'https://imagedelivery.net/PC9Gitw-w-Qpo5uwdjlmgw/b71545a6-eab8-4fa2-5888-f26c22ce7f00/public',
  'type': 'token',
  'networks': [],
};

export const AssetPYUSD: Asset = {
  'code': 'PYUSD',
  'title': 'PYUSD (PayPal USD)',
  'img': 'https://imagedelivery.net/PC9Gitw-w-Qpo5uwdjlmgw/3897aafa-0fd9-4914-ef54-e6312aea9a00/public',
  'type': 'token',
  'networks': [],
};

export const AssetUSDe: Asset = {
  'code': 'USDe',
  'title': 'USDe (Ethena USDe)',
  'img': 'https://imagedelivery.net/PC9Gitw-w-Qpo5uwdjlmgw/76760e01-ce5a-482b-88e0-842f18370d00/public',
  'type': 'token',
  'networks': [],
};

export const AssetUSDS: Asset = {
  'code': 'USDS',
  'title': 'USDS (Sky Dollar)',
  'img': 'https://imagedelivery.net/PC9Gitw-w-Qpo5uwdjlmgw/ee62374d-99a1-46c7-9fc6-eb5907a32600/public',
  'type': 'token',
  'networks': [],
};

export const AssetDAI: Asset = {
  'code': 'DAI',
  'title': 'DAI',
  'img': 'https://imagedelivery.net/PC9Gitw-w-Qpo5uwdjlmgw/970875a7-3ae3-4171-4afe-cc1340bf9500/public',
  'type': 'token',
  'networks': [],
};

export const AssetUSDP: Asset = {
  'code': 'USDP',
  'title': 'USDP (Pax Dollar)',
  'img': 'https://imagedelivery.net/PC9Gitw-w-Qpo5uwdjlmgw/970875a7-3ae3-4171-4afe-cc1340bf9500/public',
  'type': 'token',
  'networks': [],
};
