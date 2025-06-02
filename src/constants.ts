import { QRCodeToDataURLOptions } from 'qrcode';
import { Asset, Network } from './types';

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

export const BaseUrlSandbox = 'https://fence.dev.tetherpayments.group';
// export const BaseUrlSandbox = 'http://localhost:8004';
// export const BaseUrlProduction = 'https://fence.tetherpayments.group';
export const BaseUrlProduction = 'https://fence.dev.tetherpayments.group'

export const AllowedNetworkBitcoin = 'bitcoin';
export const AllowedNetworkEthereum = 'ethereum';
export const AllowedNetworkTron = 'tron';
export const AllowedNetworkSolana = 'solana';
export const AllowedNetworkTon = 'ton';
export const AllowedNetworkAvalanche = 'avalanche';
export const AllowedNetworkAptos = 'aptos';

export const AllowedAssetBitcoin = 'BTC';
export const AllowedAssetEthereum = 'ETH';
export const AllowedAssetUSDT = 'USDT';
export const AllowedAssetUSDC = 'USDC';

export const AssetUSDT : Asset = {
  'code': "USDT",
  'title': "USDT (Tether)",
  'img': 'https://tetherpay.com/images/7065960c-8ebd-4d80-f352-8027ff2bb600/public',
  'type': 'token',
  'networks': [],
}

export const AssetUSDC : Asset = {
  'code': "USDC",
  'title': "USDC",
  'img': 'https://tetherpay.com/images/1a664446-0855-4d6d-256e-ad886acba300/public',
  'type': 'token',
  'networks': [],
}

export const AssetEthereum : Asset = {
  'code': "ETH",
  'title': "Ethereum",
  'img': 'https://tetherpay.com/images/327ef8ac-bc72-46ea-2362-878e91c49300/public',
  'type': 'coin',
  'networks': [],
}

export const AssetBitcoin : Asset = {
  'code': "BTC",
  'title': "Bitcoin",
  'img': 'https://tetherpay.com/images/7f89f493-190a-41da-2410-a19b46a68900/public',
  'type': 'coin',
  'networks': [],
}

export const NetworkBitcoin: Network = {
  'code': 'bitcoin',
  'name': 'Bitcoin',
  'img': 'https://tetherpay.com/images/7f89f493-190a-41da-2410-a19b46a68900/public'
}

export const NetworkEthereum: Network = {
  'code': 'ethereum',
  'name': 'Ethereum',
  'img': 'https://tetherpay.com/images/327ef8ac-bc72-46ea-2362-878e91c49300/public'
}

export const NetworkTron: Network = {
  'code': 'tron',
  'name': 'Tron',
  'img': 'https://tetherpay.com/images/b51f79ea-c12b-4c01-246d-592c51214000/public'
}

export const NetworkSolana: Network = {
  'code': 'solana',
  'name': 'Solana',
  'img': 'https://tetherpay.com/images/5850fc57-4451-4f45-b053-3857b1d54e00/public'
}

export const NetworkTon: Network = {
  'code': 'ton',
  'name': 'Ton',
  'img': 'https://tetherpay.com/images/a741a20b-6124-4c69-e678-4578b81a5f00/public'
}

export const NetworkAvalanche: Network = {
  'code': 'avalanche',
  'name': 'Avalanche',
  'img': 'https://tetherpay.com/images/ebd47494-9bae-4687-7762-19a4184e5400/public'
}

export const NetworkAptos: Network = {
  'code': 'aptos',
  'name': 'Aptos',
  'img': 'https://tetherpay.com/images/f2b2a145-2c37-4082-5f18-6271081d1500/public'
}

