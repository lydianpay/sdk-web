import { QRCodeToDataURLOptions } from 'qrcode';
import { Asset, Network } from './types';


export const walletConnectProjectId = 'cbc90b58aec5c9ab2085a2d691461868';

export const CryptoTransactionStatusPending = 0;
export const CryptoTransactionStatusSuccess = 1;
export const CryptoTransactionStatusPendingKYCVerification = -3;

export const BaseUrlDev = 'https://gateway.lydian.dev';
export const BaseUrlSandbox = 'https://gateway.sandbox.lydian.com';
export const BaseUrlProduction = 'https://gateway.lydian.com'

export const AllowedNetworkAptos = 'aptos';
export const AllowedNetworkArbitrum = 'arbitrum';
export const AllowedNetworkAvalanche = 'avalanche';
export const AllowedNetworkBase = 'base';
export const AllowedNetworkBitcoin = 'bitcoin';
export const AllowedNetworkCelo = 'celo';
export const AllowedNetworkEos = 'eos';
export const AllowedNetworkEthereum = 'ethereum';
export const AllowedNetworkHedara = 'hedara';
export const AllowedNetworkKaia = 'kaia';
export const AllowedNetworkLinea = 'linea';
export const AllowedNetworkNear = 'near';
export const AllowedNetworkOPMainnet = 'opmainnet';
export const AllowedNetworkPolygon = 'polygon';
export const AllowedNetworkSolana = 'solana';
export const AllowedNetworkSonic = 'sonic';
export const AllowedNetworkSui = 'sui';
export const AllowedNetworkTezos = 'tezos';
export const AllowedNetworkTon = 'ton';
export const AllowedNetworkTron = 'tron';
export const AllowedNetworkUnichain = 'unichain';
export const AllowedNetworkUniswap = 'uniswap';
export const AllowedNetworkZKsync = 'zksync';



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
export const AllowedAssetSolana = 'SOL'
export const AllowedAssetSonic = 'SONIC';
export const AllowedAssetUnichain = 'UNICHAIN';
export const AllowedAssetUSDC = 'USDC';
export const AllowedAssetUSDe = 'USDe';
export const AllowedAssetUSDP = 'USDP';
export const AllowedAssetUSDS = 'USDS';
export const AllowedAssetUSDT = 'USDT';
export const AllowedAssetZKsync = 'ZKSYNC';

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

export const AssetSolana : Asset = {
  'code': "SOL",
  'title': "Solana",
  'img': 'https://tetherpay.com/images/5850fc57-4451-4f45-b053-3857b1d54e00/public',
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

export const AssetArbitrum : Asset = {
  'code': "ARB",
  'title': "Arbitrum",
  'img': 'https://imagedelivery.net/PC9Gitw-w-Qpo5uwdjlmgw/64d896c2-6ac6-4837-e6bf-e05c53a5f500/public',
  'type': 'coin',
  'networks': [],
}

export const AssetBase : Asset = {
  'code': "BASE",
  'title': "Base",
  'img': 'https://imagedelivery.net/PC9Gitw-w-Qpo5uwdjlmgw/3fc7c8ef-6863-43e6-967d-de68e14d4600/public',
  'type': 'coin',
  'networks': [],
}

export const AssetCelo : Asset = {
  'code': "CELO",
  'title': "Celo ",
  'img': 'https://imagedelivery.net/PC9Gitw-w-Qpo5uwdjlmgw/7373a7f6-b5dd-4d16-0b98-cbaf9e666300/public',
  'type': 'coin',
  'networks': [],
}

export const AssetLinea : Asset = {
  'code': "linea",
  'title': "Linea",
  'img': 'https://imagedelivery.net/PC9Gitw-w-Qpo5uwdjlmgw/410a3ea8-d59b-4e88-1c1a-ffa77c157600/public',
  'type': 'coin',
  'networks': [],
}

export const AssetOPMainnet : Asset = {
  'code': "opmainnet",
  'title': "OP Mainnet",
  'img': 'https://imagedelivery.net/PC9Gitw-w-Qpo5uwdjlmgw/cd28b090-e932-478e-2a40-7b7d61672d00/public',
  'type': 'coin',
  'networks': [],
}

export const AssetPolygon : Asset = {
  'code': "polygon",
  'title': "Polygon",
  'img': 'https://imagedelivery.net/PC9Gitw-w-Qpo5uwdjlmgw/386bebc7-3782-4358-978d-ae2b2d4fbf00/public',
  'type': 'coin',
  'networks': [],
}

export const AssetSonic : Asset = {
  'code': "sonic",
  'title': "Sonic",
  'img': 'https://imagedelivery.net/PC9Gitw-w-Qpo5uwdjlmgw/e9eaf9b0-3093-4239-d20b-a0c5934ec200/public',
  'type': 'coin',
  'networks': [],
}

export const AssetUnichain : Asset = {
  'code': "unichain",
  'title': "Unichain",
  'img': 'https://imagedelivery.net/PC9Gitw-w-Qpo5uwdjlmgw/f4c4d2e6-d9a4-4910-febc-ed6de61bd400/public',
  'type': 'coin',
  'networks': [],
}

export const AssetZKsync : Asset = {
  'code': "zksync",
  'title': "ZKsync",
  'img': 'https://imagedelivery.net/PC9Gitw-w-Qpo5uwdjlmgw/540fbd94-e1d0-4dda-c6d1-426181f37e00/public',
  'type': 'coin',
  'networks': [],
}

export const AssetRLUSD : Asset = {
  'code': "RLUSD",
  'title': "RLUSD (Ripple USD)",
  'img': 'https://imagedelivery.net/PC9Gitw-w-Qpo5uwdjlmgw/b71545a6-eab8-4fa2-5888-f26c22ce7f00/public',
  'type': 'token',
  'networks': [],
}

export const AssetPYUSD : Asset = {
  'code': "PYUSD",
  'title': "PYUSD (PayPal USD)",
  'img': 'https://imagedelivery.net/PC9Gitw-w-Qpo5uwdjlmgw/3897aafa-0fd9-4914-ef54-e6312aea9a00/public',
  'type': 'token',
  'networks': [],
}

export const AssetUSDe : Asset = {
  'code': "USDe",
  'title': "USDe (Ethena USDe)",
  'img': 'https://imagedelivery.net/PC9Gitw-w-Qpo5uwdjlmgw/76760e01-ce5a-482b-88e0-842f18370d00/public',
  'type': 'token',
  'networks': [],
}

export const AssetUSDS : Asset = {
  'code': "USDS",
  'title': "USDS (Sky Dollar)",
  'img': 'https://imagedelivery.net/PC9Gitw-w-Qpo5uwdjlmgw/ee62374d-99a1-46c7-9fc6-eb5907a32600/public',
  'type': 'token',
  'networks': [],
}

export const AssetDAI : Asset = {
  'code': "DAI",
  'title': "DAI",
  'img': 'https://imagedelivery.net/PC9Gitw-w-Qpo5uwdjlmgw/970875a7-3ae3-4171-4afe-cc1340bf9500/public',
  'type': 'token',
  'networks': [],
}

export const AssetUSDP : Asset = {
  'code': "USDP",
  'title': "USDP (Pax Dollar)",
  'img': 'https://imagedelivery.net/PC9Gitw-w-Qpo5uwdjlmgw/970875a7-3ae3-4171-4afe-cc1340bf9500/public',
  'type': 'token',
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

export const NetworkArbitrum: Network = {
  'code': 'arbitrum',
  'name': 'Arbitrum',
  'img': 'https://imagedelivery.net/PC9Gitw-w-Qpo5uwdjlmgw/64d896c2-6ac6-4837-e6bf-e05c53a5f500/public'
}

export const NetworkBase: Network = {
  'code': 'base',
  'name': 'Base',
  'img': 'https://imagedelivery.net/PC9Gitw-w-Qpo5uwdjlmgw/3fc7c8ef-6863-43e6-967d-de68e14d4600/public'
}

export const NetworkCelo: Network = {
  'code': 'celo',
  'name': 'Celo',
  'img': 'https://imagedelivery.net/PC9Gitw-w-Qpo5uwdjlmgw/7373a7f6-b5dd-4d16-0b98-cbaf9e666300/public'
}

export const NetworkLinea: Network = {
  'code': 'linea',
  'name': 'Linea',
  'img': 'https://imagedelivery.net/PC9Gitw-w-Qpo5uwdjlmgw/410a3ea8-d59b-4e88-1c1a-ffa77c157600/public'
}
export const NetworkOPMainnet: Network = {
  'code': 'opmainnet',
  'name': 'OP Mainnet',
  'img': 'https://imagedelivery.net/PC9Gitw-w-Qpo5uwdjlmgw/cd28b090-e932-478e-2a40-7b7d61672d00/public'
}

export const NetworkPolygon: Network = {
  'code': 'polygon',
  'name': 'Polygon',
  'img': 'https://imagedelivery.net/PC9Gitw-w-Qpo5uwdjlmgw/386bebc7-3782-4358-978d-ae2b2d4fbf00/public'
}

export const NetworkSonic: Network = {
  'code': 'sonic',
  'name': 'Sonic',
  'img': 'https://imagedelivery.net/PC9Gitw-w-Qpo5uwdjlmgw/e9eaf9b0-3093-4239-d20b-a0c5934ec200/public'
}

export const NetworkUnichain: Network = {
  'code': 'unichain',
  'name': 'Unichain',
  'img': 'https://imagedelivery.net/PC9Gitw-w-Qpo5uwdjlmgw/f4c4d2e6-d9a4-4910-febc-ed6de61bd400/public'
}

export const NetworkZKsync: Network = {
  'code': 'zksync',
  'name': 'ZKSync',
  'img': 'https://imagedelivery.net/PC9Gitw-w-Qpo5uwdjlmgw/540fbd94-e1d0-4dda-c6d1-426181f37e00/public'
}

export const NetworkSui: Network = {
  'code': 'sui',
  'name': 'Sui',
  'img': 'https://imagedelivery.net/PC9Gitw-w-Qpo5uwdjlmgw/b9ea70f3-4850-49de-ea4b-e1c4b1ae8700/public'
}
export const NetworkTezos: Network = {
  'code': 'tezos',
  'name': 'Tezos',
  'img': 'https://imagedelivery.net/PC9Gitw-w-Qpo5uwdjlmgw/77878400-8af3-45c2-d1e9-2f159c206b00/public'
}
export const NetworkKaia: Network = {
  'code': 'kaia',
  'name': 'Kaia',
  'img': 'https://imagedelivery.net/PC9Gitw-w-Qpo5uwdjlmgw/ab53d357-f47b-4285-7ef7-dd9a912cf500/public'
}
export const NetworkEos: Network = {
  'code': 'eos',
  'name': 'Eos',
  'img': 'https://imagedelivery.net/PC9Gitw-w-Qpo5uwdjlmgw/49e27a4b-2bd4-4911-5c24-f1f99cd41700/public'
}
export const NetworkUniswap: Network = {
  'code': 'uniswap',
  'name': 'Uniswap',
  'img': 'https://imagedelivery.net/PC9Gitw-w-Qpo5uwdjlmgw/b88526db-ae1a-4b67-e6f5-7d7e74c8ed00/public'
}
export const NetworkHedara: Network = {
  'code': 'hedara',
  'name': 'Hedara',
  'img': 'https://imagedelivery.net/PC9Gitw-w-Qpo5uwdjlmgw/f6195004-ce8e-4a19-9fbc-46394952a200/public'
}
export const NetworkNear: Network = {
  'code': 'near',
  'name': 'Near',
  'img': 'https://imagedelivery.net/PC9Gitw-w-Qpo5uwdjlmgw/4f35d901-0541-440a-7e55-2f06c0dd4300/public'
}
